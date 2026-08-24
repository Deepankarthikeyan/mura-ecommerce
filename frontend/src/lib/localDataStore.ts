import { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import { productTitleToUrlSlug } from "./productSlug";
import { mergeStorefrontSettings } from "./storefront/defaultStorefrontSettings";
import type { StorefrontSettings } from "./storefront/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "local-db.json");

export type LocalProduct = Record<string, unknown> & {
  _id: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type LocalDb = {
  storefront: string | null;
  products: LocalProduct[];
};

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

function newObjectId(): string {
  return randomBytes(12).toString("hex");
}

async function readDb(): Promise<LocalDb> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as LocalDb;
    return {
      storefront: parsed.storefront ?? null,
      products: Array.isArray(parsed.products) ? parsed.products : [],
    };
  } catch {
    return { storefront: null, products: [] };
  }
}

async function writeDb(db: LocalDb): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
}

function parseStorefront(raw: string | null): StorefrontSettings {
  if (!raw?.trim()) {
    return mergeStorefrontSettings(null);
  }
  try {
    return mergeStorefrontSettings(JSON.parse(raw) as Partial<StorefrontSettings>);
  } catch {
    return mergeStorefrontSettings(null);
  }
}

export async function localGetStorefrontSettings(): Promise<StorefrontSettings> {
  const db = await readDb();
  return parseStorefront(db.storefront);
}

export async function localSaveStorefrontSettings(settings: StorefrontSettings): Promise<StorefrontSettings> {
  const merged = mergeStorefrontSettings(settings);
  const db = await readDb();
  db.storefront = JSON.stringify(merged, null, 2);
  await writeDb(db);
  return merged;
}

function productMatchesListing(product: LocalProduct, includeDisabled: boolean): boolean {
  if (includeDisabled) return true;
  return product.isDeleted !== true;
}

function productMatchesSearch(product: LocalProduct, search: string): boolean {
  if (!search) return true;
  const hay = `${product.title ?? ""} ${product.category ?? ""}`.toLowerCase();
  return hay.includes(search.toLowerCase());
}

export async function localGetProductsListing(
  includeDisabled: boolean,
  options?: { search?: string; category?: string }
): Promise<LocalProduct[]> {
  const db = await readDb();
  const search = options?.search?.trim() ?? "";
  const category = options?.category?.trim() ?? "";

  return db.products.filter((product) => {
    if (!productMatchesListing(product, includeDisabled)) return false;
    if (category && String(product.category ?? "").trim() !== category) return false;
    if (!productMatchesSearch(product, search)) return false;
    return true;
  });
}

export async function localGetProductCategories(includeDisabled: boolean): Promise<string[]> {
  const products = await localGetProductsListing(includeDisabled);
  const set = new Set<string>();
  for (const product of products) {
    const category = String(product.category ?? "").trim();
    if (category) set.add(category);
  }
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

export async function localGetProductByMongoId(mongoId: string): Promise<LocalProduct | null> {
  const db = await readDb();
  return db.products.find((product) => product._id === mongoId) ?? null;
}

export async function localGetStoreProductByLookup(productKey: string): Promise<LocalProduct | null> {
  const key = productKey.trim();
  if (!key) return null;
  const normLower = key.toLowerCase();
  const products = await localGetProductsListing(false);
  return (
    products.find((product) => {
      const productId = String(product.productId ?? "").toLowerCase();
      const slug = String(product.slug ?? "").toLowerCase();
      const urlSlug = String(product.urlSlug ?? "").toLowerCase();
      return productId === normLower || slug === normLower || urlSlug === normLower;
    }) ?? null
  );
}

export async function localCreateProduct(fields: Record<string, unknown>): Promise<{ mongoId: string }> {
  const db = await readDb();
  const productId = typeof fields.productId === "string" ? fields.productId.trim() : "";
  if (productId && db.products.some((p) => String(p.productId ?? "") === productId)) {
    throw new Error(`Product ID "${productId}" already exists`);
  }

  const maxId = db.products.reduce((max, product) => {
    const id = typeof product.id === "number" ? product.id : 0;
    return Math.max(max, id);
  }, 0);

  const slug = (typeof fields.slug === "string" ? fields.slug.trim() : "") || productId;
  const title = typeof fields.title === "string" ? fields.title.trim() : "";
  const mongoId = newObjectId();
  const urlSlug = title ? productTitleToUrlSlug(title) : slug;

  const doc: LocalProduct = {
    ...fields,
    _id: mongoId,
    id: maxId + 1,
    slug,
    urlSlug,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(doc);
  await writeDb(db);
  return { mongoId };
}

export async function localUpdateProductFields(
  productId: string,
  fields: Record<string, unknown>
): Promise<{ matchedCount: number; modifiedCount: number }> {
  const db = await readDb();
  const index = db.products.findIndex((product) => product._id === productId);
  if (index < 0) {
    return { matchedCount: 0, modifiedCount: 0 };
  }

  const current = db.products[index];
  const next: LocalProduct = {
    ...current,
    ...fields,
    _id: current._id,
    updatedAt: new Date().toISOString(),
  };

  if (typeof fields.title === "string" && fields.title.trim() && !("urlSlug" in fields)) {
    next.urlSlug = productTitleToUrlSlug(fields.title.trim());
  }

  db.products[index] = next;
  await writeDb(db);
  return { matchedCount: 1, modifiedCount: 1 };
}
