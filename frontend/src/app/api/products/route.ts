import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  getProductsListing,
  getProductCategories,
  getProductByMongoId,
  getStoreProductByLookup,
  updateProductFields,
} from "../../../functions/mongodbOperations";
import {
  isMongoConfigured,
  localCreateProduct,
  localGetProductByMongoId,
  localGetProductCategories,
  localGetProductsListing,
  localGetStoreProductByLookup,
  localUpdateProductFields,
} from "@/lib/localDataStore";
import {
  isLegacyLocalProductImagePath,
  normalizeProductImagePath,
} from "@/lib/shopProductDisplay";

const UPDATABLE_KEYS = new Set([
  "productId",
  "slug",
  "urlSlug",
  "title",
  "category",
  "quantity",
  "mrp",
  "price",
  "discountPercentage",
  "description",
  "image",
  "bannerImg",
  "productAdMediaUrl",
  "stock",
  "reviews",
  "ratings",
  "tags",
  "author",
  "publishedDate",
]);

function isValidProductId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function sanitizeProductUpdates(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of UPDATABLE_KEYS) {
    if (!(key in raw)) continue;
    const v = raw[key];
    if (key === "stock" || key === "reviews" || key === "ratings") {
      if (v === "" || v === null || v === undefined) continue;
      const n = typeof v === "number" ? v : parseInt(String(v), 10);
      if (Number.isFinite(n)) out[key] = n;
      continue;
    }
    if (key === "tags") {
      if (Array.isArray(v)) {
        const arr = v.map(String).map((s) => s.trim()).filter(Boolean);
        if (arr.length) out[key] = arr;
      } else if (typeof v === "string") {
        const arr = v.split(",").map((s) => s.trim()).filter(Boolean);
        if (arr.length) out[key] = arr;
      }
      continue;
    }
    if (key === "bannerImg") {
      const clean = (entries: string[]) =>
        entries
          .map((s) => s.trim())
          .filter((s) => s && !isLegacyLocalProductImagePath(s))
          .map((s) => normalizeProductImagePath(s) || s)
          .filter(Boolean)
          .slice(0, 4);
      if (Array.isArray(v)) {
        out[key] = clean(v.map(String));
      } else if (typeof v === "string") {
        out[key] = clean(v.split(/[\n,]+/));
      }
      continue;
    }
    if (v === undefined || v === null) continue;
    if (typeof v === "string") {
      if (key === "description") {
        out[key] = v;
        continue;
      }
      const s = v.trim();
      if (key === "productAdMediaUrl") {
        if (!s || isLegacyLocalProductImagePath(s)) {
          out[key] = "";
        } else {
          out[key] = normalizeProductImagePath(s) || s;
        }
        continue;
      }
      if (s.length === 0) continue;
      if (key === "image" && isLegacyLocalProductImagePath(s)) continue;
      out[key] = key === "image" ? normalizeProductImagePath(s) || s : s;
    } else if (typeof v === "number") {
      out[key] = v;
    }
  }
  return out;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw =
      body?.product != null && typeof body.product === "object" && !Array.isArray(body.product)
        ? (body.product as Record<string, unknown>)
        : (body as Record<string, unknown>);
    const sanitized = sanitizeProductUpdates(raw);

    if (!sanitized.title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }
    if (!sanitized.productId && !sanitized.slug) {
      return NextResponse.json(
        { success: false, message: "Product ID or slug is required" },
        { status: 400 }
      );
    }

    if (!isMongoConfigured()) {
      const { mongoId } = await localCreateProduct(sanitized);
      return NextResponse.json({ success: true, id: mongoId, storage: "local" });
    }

    const { createProduct } = await import("../../../functions/mongodbOperations");
    const { mongoId } = await createProduct(sanitized);
    return NextResponse.json({ success: true, id: mongoId, storage: "mongodb" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Create failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";

    if (!id || !isValidProductId(id)) {
      return NextResponse.json({ success: false, message: "Valid product id is required" }, { status: 400 });
    }

    if (body.updates != null && typeof body.updates === "object" && !Array.isArray(body.updates)) {
      const sanitized = sanitizeProductUpdates(body.updates as Record<string, unknown>);
      if (Object.keys(sanitized).length === 0) {
        return NextResponse.json(
          { success: false, message: "No valid fields in updates" },
          { status: 400 }
        );
      }

      if (!isMongoConfigured()) {
        const result = await localUpdateProductFields(id, sanitized);
        if (result.matchedCount === 0) {
          return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, modifiedCount: result.modifiedCount, storage: "local" });
      }

      const result = await updateProductFields(id, sanitized);
      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
      }
      if (typeof sanitized.title === "string" && !("urlSlug" in sanitized)) {
        const { assignUrlSlugForProduct } = await import("../../../functions/mongodbOperations");
        await assignUrlSlugForProduct(id, sanitized.title);
      }
      return NextResponse.json({ success: true, modifiedCount: result.modifiedCount, storage: "mongodb" });
    }

    if (typeof body?.isDeleted === "boolean") {
      if (!isMongoConfigured()) {
        const result = await localUpdateProductFields(id, { isDeleted: body.isDeleted });
        if (result.matchedCount === 0) {
          return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, modifiedCount: result.modifiedCount, storage: "local" });
      }

      const result = await updateProductFields(id, { isDeleted: body.isDeleted });
      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, modifiedCount: result.modifiedCount, storage: "mongodb" });
    }

    return NextResponse.json(
      { success: false, message: "Provide updates object or isDeleted boolean" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Update failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDisabled =
      searchParams.get("includeDisabled") === "true" ||
      searchParams.get("includeDisabled") === "1";
    const categoriesOnly =
      searchParams.get("categories") === "true" ||
      searchParams.get("categories") === "1";
    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";
    const mongoId = searchParams.get("mongoId")?.trim() ?? "";
    const lookup = searchParams.get("lookup")?.trim() ?? searchParams.get("id")?.trim() ?? "";

    if (!isMongoConfigured()) {
      if (mongoId) {
        if (!isValidProductId(mongoId)) {
          return NextResponse.json({ success: false, message: "Valid mongoId is required" }, { status: 400 });
        }
        const product = await localGetProductByMongoId(mongoId);
        if (!product) {
          return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, body: product, storage: "local" });
      }

      if (lookup && (searchParams.has("lookup") || searchParams.has("id"))) {
        const product = await localGetStoreProductByLookup(lookup);
        if (!product) {
          return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, body: product, storage: "local" });
      }

      if (categoriesOnly) {
        const categories = await localGetProductCategories(includeDisabled);
        return NextResponse.json({ success: true, body: categories, storage: "local" });
      }

      const products = await localGetProductsListing(includeDisabled, { search, category });
      return NextResponse.json({ success: true, body: products, storage: "local" });
    }

    if (mongoId) {
      if (!ObjectId.isValid(mongoId)) {
        return NextResponse.json({ success: false, message: "Valid mongoId is required" }, { status: 400 });
      }
      const product = await getProductByMongoId(mongoId);
      if (!product) {
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, body: product });
    }

    if (lookup && (searchParams.has("lookup") || searchParams.has("id"))) {
      const product = await getStoreProductByLookup(lookup);
      if (!product) {
        return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, body: product });
    }

    if (categoriesOnly) {
      const categories = await getProductCategories(includeDisabled);
      return NextResponse.json({ success: true, body: categories });
    }

    const products = await getProductsListing(includeDisabled, { search, category });
    return NextResponse.json({ success: true, body: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
