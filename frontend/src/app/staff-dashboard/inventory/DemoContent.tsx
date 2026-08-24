"use client";

import React, {
  useState,
  useCallback,
  useRef,
  ChangeEvent,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import ProductDescriptionRichEditor from "@/components/staff/ProductDescriptionRichEditor";
import {
  isLegacyLocalProductImagePath,
  normalizeProductImagePath,
  resolveProductListingImage,
} from "@/lib/shopProductDisplay";

function UploadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

const MONGO_ID_HEX = /^[0-9a-fA-F]{24}$/;
const CREATE_ID = "__new__";
const MAX_PRODUCT_IMAGES = 4;

interface DbProduct {
  _id?: { toString(): string } | string;
  productId?: string;
  slug?: string;
  title?: string;
  category?: string;
  price?: string | number;
  mrp?: string | number;
  stock?: number;
  quantity?: string | number;
  image?: string;
  bannerImg?: string | string[];
  productAdMediaUrl?: string;
  isDeleted?: boolean;
  discountPercentage?: string | number;
  description?: string;
  reviews?: number;
  ratings?: number;
  tags?: string[];
  author?: string;
  publishedDate?: string;
}

interface ProductRow {
  id: string;
  title: string;
  productKey: string;
  category: string;
  price: string;
  stock: string;
  imageSrc: string;
  isDeleted: boolean;
}

/** Form fields editable in staff dialog — aligned with DB / Product.json */
interface ProductEditForm {
  productId: string;
  slug: string;
  title: string;
  category: string;
  quantity: string;
  mrp: string;
  price: string;
  discountPercentage: string;
  description: string;
  /** Up to 4 gallery image URLs (Image 1 is the primary listing image). */
  images: string[];
  /** Sidebar promo ad media URL on the storefront product page. */
  productAdMediaUrl: string;
  stock: string;
  reviews: string;
  ratings: string;
  tags: string;
  author: string;
  publishedDate: string;
}

function collectProductImageUrls(doc: Record<string, unknown>): string[] {
  // Prefer ordered bannerImg (exactly what staff saved as Image 1–4).
  // Legacy /assets/images/products/ paths are ignored.
  if (Array.isArray(doc.bannerImg)) {
    const fromBanner = doc.bannerImg
      .map((entry) => normalizeProductImagePath(entry))
      .filter(Boolean)
      .slice(0, MAX_PRODUCT_IMAGES);
    if (fromBanner.length > 0) return fromBanner;
  } else if (doc.bannerImg != null) {
    const single = normalizeProductImagePath(doc.bannerImg);
    if (single) return [single];
  }

  const main = normalizeProductImagePath(doc.image);
  return main ? [main] : [""];
}

function docToForm(doc: Record<string, unknown>): ProductEditForm {
  const tags = Array.isArray(doc.tags) ? doc.tags.map(String).join(", ") : "";

  return {
    productId: String(doc.productId ?? ""),
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    category: String(doc.category ?? ""),
    quantity: String(doc.quantity ?? ""),
    mrp: String(doc.mrp ?? ""),
    price: String(doc.price ?? ""),
    discountPercentage:
      doc.discountPercentage !== undefined && doc.discountPercentage !== null
        ? String(doc.discountPercentage)
        : "",
    description: String(doc.description ?? ""),
    images: collectProductImageUrls(doc),
    productAdMediaUrl: String(doc.productAdMediaUrl ?? ""),
    stock: doc.stock !== undefined && doc.stock !== null ? String(doc.stock) : "",
    reviews: doc.reviews !== undefined && doc.reviews !== null ? String(doc.reviews) : "",
    ratings: doc.ratings !== undefined && doc.ratings !== null ? String(doc.ratings) : "",
    tags,
    author: String(doc.author ?? ""),
    publishedDate: String(doc.publishedDate ?? ""),
  };
}

function emptyProductForm(): ProductEditForm {
  return {
    productId: "",
    slug: "",
    title: "",
    category: "",
    quantity: "",
    mrp: "",
    price: "",
    discountPercentage: "",
    description: "",
    images: [""],
    productAdMediaUrl: "",
    stock: "250",
    reviews: "10",
    ratings: "5",
    tags: "saree",
    author: "",
    publishedDate: "",
  };
}

function formToUpdates(form: ProductEditForm): Record<string, unknown> {
  const stock = parseInt(form.stock, 10);
  const reviews = parseInt(form.reviews, 10);
  const ratings = parseInt(form.ratings, 10);
  const updates: Record<string, unknown> = {
    productId: form.productId.trim(),
    slug: form.slug.trim(),
    title: form.title.trim(),
    category: form.category.trim(),
    quantity: form.quantity.trim(),
    mrp: form.mrp.trim(),
    price: form.price.trim(),
    discountPercentage: (() => {
      const computed = computeDiscountOffMrp(form.mrp, form.price);
      return computed !== "" ? computed : form.discountPercentage.trim();
    })(),
    description: form.description,
    tags: form.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    author: form.author.trim(),
    publishedDate: form.publishedDate.trim(),
  };
  const imageUrls = form.images
    .map((s) => s.trim())
    .filter((s) => s && !isLegacyLocalProductImagePath(s))
    .map((s) => normalizeProductImagePath(s) || s)
    .filter(Boolean)
    .slice(0, MAX_PRODUCT_IMAGES);
  updates.image = imageUrls[0] || "";
  updates.bannerImg = imageUrls;
  const adMedia = form.productAdMediaUrl.trim();
  updates.productAdMediaUrl =
    adMedia && !isLegacyLocalProductImagePath(adMedia)
      ? normalizeProductImagePath(adMedia) || adMedia
      : "";
  if (Number.isFinite(stock)) updates.stock = stock;
  if (Number.isFinite(reviews)) updates.reviews = reviews;
  if (Number.isFinite(ratings)) updates.ratings = ratings;
  return updates;
}

function formatPrice(raw: string | number | undefined): string {
  if (raw === undefined || raw === null || raw === "") return "—";
  const n = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/[^0-9.]/g, ""));
  if (Number.isFinite(n)) return `₹${n.toFixed(2)}`;
  return String(raw);
}

function parseAmountForCalc(raw: string): number | null {
  const n = parseFloat(String(raw).replace(/,/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Discount off MRP: (MRP − sale price) / MRP × 100, rounded to nearest integer */
function computeDiscountOffMrp(mrpStr: string, priceStr: string): string {
  const mrp = parseAmountForCalc(mrpStr.trim());
  const price = parseAmountForCalc(priceStr.trim());
  if (mrp === null || price === null || mrp <= 0) return "";
  const pct = ((mrp - price) / mrp) * 100;
  if (!Number.isFinite(pct)) return "";
  return String(Math.round(pct));
}

function rowId(p: DbProduct, index: number): string {
  if (p._id) return typeof p._id === "string" ? p._id : p._id.toString();
  if (p.productId) return String(p.productId);
  if (p.slug) return String(p.slug);
  return `idx-${index}`;
}

function buildInventoryProductsQuery(search: string, category: string): string {
  const params = new URLSearchParams({ includeDisabled: "true" });
  if (search) {
    params.set("search", search);
  }
  if (category) {
    params.set("category", category);
  }
  return `/api/products?${params.toString()}`;
}

function mapApiProductsToRows(raw: unknown): ProductRow[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const list: DbProduct[] = raw;
  return list.map((p, index) => {
    const stockVal =
      p.stock !== undefined && p.stock !== null
        ? String(p.stock)
        : p.quantity !== undefined && p.quantity !== null
          ? String(p.quantity)
          : "—";

    return {
      id: rowId(p, index),
      title: p.title?.trim() || "Untitled",
      productKey: p.productId || p.slug || "—",
      category: p.category?.trim() || "—",
      price: formatPrice(p.price),
      stock: stockVal,
      imageSrc: resolveProductListingImage(p),
      isDeleted: p.isDeleted === true,
    };
  });
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#374151" };

const menuItemBase: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "10px 14px",
  border: "none",
  background: "#fff",
  cursor: "pointer",
  fontSize: 14,
  color: "#1f2937",
};

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) {
    pages.push("ellipsis");
  } else {
    for (let i = 2; i < left; i++) pages.push(i);
  }

  for (let i = left; i <= right; i++) pages.push(i);

  if (right < total - 1) {
    pages.push("ellipsis");
  } else {
    for (let i = right + 1; i < total; i++) pages.push(i);
  }

  if (total > 1) pages.push(total);

  return pages;
}

interface ProductCardProps {
  row: ProductRow;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDisable: () => void;
  onEnable: () => void;
}

const skeletonPulse = "inventory-card-pulse 1.5s ease-in-out infinite";

const ProductCardSkeleton: React.FC = () => (
  <article className="order-card-item" aria-hidden="true">
    <div className="order-card-item__inner">
      <div className="order-card-item__product-header">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            backgroundColor: "#e0e0e0",
            animation: skeletonPulse,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              width: "90%",
              height: 16,
              backgroundColor: "#e0e0e0",
              borderRadius: 4,
              animation: skeletonPulse,
            }}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div
              style={{
                width: "50%",
                height: 12,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
                marginBottom: 6,
                animation: skeletonPulse,
              }}
            />
            <div
              style={{
                width: "75%",
                height: 14,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
                animation: skeletonPulse,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  </article>
);

const ProductCard: React.FC<ProductCardProps> = ({
  row,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDisable,
  onEnable,
}) => (
  <article className={`order-card-item${row.isDeleted ? " order-card-item--disabled" : ""}`}>
    <div className="order-card-item__inner">
      <div className="order-card-item__product-header">
        <div className="order-card-item__image">
          <Image src={row.imageSrc} alt="" fill sizes="64px" style={{ objectFit: "cover" }} unoptimized />
        </div>
        <div className="order-card-item__title-block">
          <p className="order-card-item__product-title">
            {row.title}
            {row.isDeleted ? <span className="order-card-item__disabled-tag">(disabled)</span> : null}
          </p>
        </div>
      </div>
      <dl className="order-card-item__fields order-card-item__fields--product">
        <div className="order-card-item__field">
          <dt>SKU / Slug</dt>
          <dd>{row.productKey}</dd>
        </div>
        <div className="order-card-item__field">
          <dt>Category</dt>
          <dd>{row.category}</dd>
        </div>
        <div className="order-card-item__field">
          <dt>Price</dt>
          <dd>{row.price}</dd>
        </div>
        <div className="order-card-item__field">
          <dt>Stock / Qty</dt>
          <dd>
            <div className="order-card-item__stock-row stock-action-menu" style={{ position: "relative" }}>
              <span>{row.stock}</span>
              <button
                type="button"
                className="stock-action-menu-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMenu();
                }}
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                aria-label="Product actions"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", lineHeight: 0 }}
              >
                <i className="fa-solid fa-ellipsis" style={{ fontSize: 18, color: "#525252" }} aria-hidden="true" />
              </button>
              {isMenuOpen && (
                <div
                  className="stock-action-menu-panel"
                  role="menu"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: 6,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    minWidth: 128,
                    overflow: "hidden",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button type="button" role="menuitem" onClick={onEdit} style={menuItemBase} onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                    Edit
                  </button>
                  {!row.isDeleted ? (
                    <button type="button" role="menuitem" onClick={onDisable} style={{ ...menuItemBase, borderTop: "1px solid #f3f4f6", color: "#b45309" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff7ed"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                      Disable
                    </button>
                  ) : (
                    <button type="button" role="menuitem" onClick={onEnable} style={{ ...menuItemBase, borderTop: "1px solid #f3f4f6", color: "#15803d" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                      Enable
                    </button>
                  )}
                </div>
              )}
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </article>
);

const OverviewTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMenuRowId, setActionMenuRowId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<
    null | { type: "disable" | "enable"; row: ProductRow }
  >(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const [editMongoId, setEditMongoId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProductEditForm | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const imageUploadIndexRef = useRef<number | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionMenuRowId === null) return;
    const close = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest(".stock-action-menu")) return;
      setActionMenuRowId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [actionMenuRowId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const { data } = await axios.get("/api/products?categories=true&includeDisabled=true");
        if (cancelled || data?.success === false) {
          return;
        }
        const list = data?.body;
        setCategories(Array.isArray(list) ? list.map(String) : []);
      } catch (err) {
        console.error("Error fetching product categories:", err);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const closeEditDialog = useCallback(() => {
    if (editSaving) return;
    setEditMongoId(null);
    setEditForm(null);
    setEditLoading(false);
  }, [editSaving]);

  const openEditProduct = useCallback(async (row: ProductRow) => {
    setActionMenuRowId(null);
    if (!MONGO_ID_HEX.test(row.id)) {
      toast.error("Cannot edit this row: no MongoDB id.");
      return;
    }
    setEditMongoId(row.id);
    setEditForm(null);
    setEditLoading(true);
    try {
      // Use top-level /api/products (nested /api/products/mongo is not routing correctly).
      const { data } = await axios.get(
        `/api/products?mongoId=${encodeURIComponent(row.id)}`
      );
      if (data?.success && data.body) {
        setEditForm(docToForm(data.body as Record<string, unknown>));
      } else {
        toast.error(data?.message || "Could not load product.");
        setEditMongoId(null);
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Could not load product.";
      toast.error(msg);
      setEditMongoId(null);
    } finally {
      setEditLoading(false);
    }
  }, []);

  const openAddProduct = useCallback(() => {
    setActionMenuRowId(null);
    setEditMongoId(CREATE_ID);
    setEditForm(emptyProductForm());
    setEditLoading(false);
  }, []);

  const isCreateMode = editMongoId === CREATE_ID;

  useEffect(() => {
    if (!editMongoId || !editForm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !editSaving && !editLoading) closeEditDialog();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editMongoId, editForm, editSaving, editLoading, closeEditDialog]);

  const saveEditedProduct = useCallback(async () => {
    if (!editMongoId || !editForm) return;

    if (!editForm.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!editForm.productId.trim() && !editForm.slug.trim()) {
      toast.error("Product ID or slug is required.");
      return;
    }

    setEditSaving(true);
    try {
      const updates = formToUpdates(editForm);

      if (isCreateMode) {
        const { data } = await axios.post("/api/products", { product: updates });
        if (data?.success && typeof data.id === "string") {
          const newId = data.id;
          const newRow: ProductRow = {
            id: newId,
            title: editForm.title.trim(),
            productKey: editForm.productId.trim() || editForm.slug.trim(),
            category: editForm.category.trim() || "—",
            price: formatPrice(editForm.price),
            stock:
              typeof updates.stock === "number"
                ? String(updates.stock)
                : editForm.stock || "—",
            imageSrc: resolveProductListingImage({
              image: editForm.images.map((s) => s.trim()).find(Boolean) || "",
            }),
            isDeleted: false,
          };
          setProducts((prev) => [newRow, ...prev]);
          toast.success("Product created.");
          closeEditDialog();
        } else {
          toast.error(data?.message || "Create failed.");
        }
        return;
      }

      const { data } = await axios.patch("/api/products", { id: editMongoId, updates });
      if (data?.success) {
        toast.success("Product updated.");
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== editMongoId) return p;
            const stockDisp =
              typeof updates.stock === "number"
                ? String(updates.stock)
                : editForm.stock || "—";
            return {
                ...p,
                title: editForm.title.trim() || p.title,
                productKey: editForm.productId?.trim() || editForm.slug?.trim() || p.productKey,
                category: editForm.category.trim() || p.category,
                price: formatPrice(editForm.price),
                stock: stockDisp,
                imageSrc: resolveProductListingImage({
                  image: editForm.images.map((s) => s.trim()).find(Boolean) || "",
                }),
              };
          })
        );
        closeEditDialog();
      } else {
        toast.error(data?.message || "Update failed.");
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : isCreateMode
            ? "Create failed."
            : "Update failed.";
      toast.error(msg);
    } finally {
      setEditSaving(false);
    }
  }, [editMongoId, editForm, isCreateMode, closeEditDialog]);

  useEffect(() => {
    if (!confirmDialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirmBusy) setConfirmDialog(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmDialog, confirmBusy]);

  const requestDisableProduct = useCallback((row: ProductRow) => {
    setActionMenuRowId(null);
    if (!MONGO_ID_HEX.test(row.id)) {
      toast.error("Cannot disable this row: no MongoDB id.");
      return;
    }
    setConfirmDialog({ type: "disable", row });
  }, []);

  const requestEnableProduct = useCallback((row: ProductRow) => {
    setActionMenuRowId(null);
    if (!MONGO_ID_HEX.test(row.id)) {
      toast.error("Cannot enable this row: no MongoDB id.");
      return;
    }
    setConfirmDialog({ type: "enable", row });
  }, []);

  const runConfirmedToggle = useCallback(async () => {
    if (!confirmDialog) return;
    const { type, row } = confirmDialog;
    const isDeleted = type === "disable";
    setConfirmBusy(true);
    try {
      const response = await axios.patch("/api/products", { id: row.id, isDeleted });
      if (response.data?.success) {
        setProducts((prev) => prev.map((p) => (p.id === row.id ? { ...p, isDeleted } : p)));
        toast.success(isDeleted ? "Product disabled." : "Product enabled.");
        setConfirmDialog(null);
      } else {
        toast.error(response.data?.message || "Update failed.");
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Update failed.";
      toast.error(msg);
    } finally {
      setConfirmBusy(false);
    }
  }, [confirmDialog]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await axios.get(buildInventoryProductsQuery(debouncedSearch, selectedCategory));
        if (cancelled) return;

        const raw = response.data?.body;
        if (!response.data?.success || !Array.isArray(raw)) {
          setProducts([]);
          if (response.data?.message) setError(String(response.data.message));
          return;
        }

        setProducts(mapApiProductsToRows(raw));
      } catch (err: unknown) {
        if (cancelled) return;
        console.error("Error fetching products:", err);
        const msg =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "Failed to load products";
        setError(msg);
        setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    setCurrentPage(1);
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedCategory]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const totalPages = Math.max(1, Math.ceil(products.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = products.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;
  const pageEnd = Math.min(safePage * rowsPerPage, products.length);
  const paginatedItems = products.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const visiblePages = useMemo(
    () => getPageNumbers(safePage, totalPages),
    [safePage, totalPages],
  );

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const updateEditField = (
    field: Exclude<keyof ProductEditForm, "images">,
    value: string
  ) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateImageField = (index: number, value: string) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const addImageField = () => {
    setEditForm((prev) => {
      if (!prev || prev.images.length >= MAX_PRODUCT_IMAGES) return prev;
      return { ...prev, images: [...prev.images, ""] };
    });
  };

  const removeImageField = (index: number) => {
    setEditForm((prev) => {
      if (!prev) return prev;
      if (prev.images.length <= 1) {
        return { ...prev, images: [""] };
      }
      return { ...prev, images: prev.images.filter((_, i) => i !== index) };
    });
  };

  const openImageUpload = (index: number) => {
    if (editSaving || editLoading || uploadingImageIndex !== null) return;
    imageUploadIndexRef.current = index;
    imageFileInputRef.current?.click();
  };

  const handleImageFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = imageUploadIndexRef.current;
    e.target.value = "";
    imageUploadIndexRef.current = null;
    if (!file || index == null) return;

    const mime = file.type || "";
    if (!mime.startsWith("image/") && !mime.startsWith("video/")) {
      toast.error("Please choose an image or video file.");
      return;
    }

    setUploadingImageIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post<{
        success?: boolean;
        message?: string;
        data?: { url?: string };
      }>("/api/cloudinary/upload", formData);

      const url = data?.data?.url?.trim();
      if (!data?.success || !url) {
        toast.error(data?.message || "Upload failed.");
        return;
      }

      updateImageField(index, url);
      toast.success("Media uploaded.");
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : err instanceof Error
            ? err.message
            : "Upload failed.";
      toast.error(msg);
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const editDiscountPctDisplay = useMemo(() => {
    if (!editForm) return "";
    return computeDiscountOffMrp(editForm.mrp, editForm.price);
  }, [editForm]);

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="title-right-actioin-btn-wrapper-product-list">
          <h3 className="title">Inventory — products</h3>
          <div className="button-wrapper">
            <button type="button" className="rts-btn btn-primary" onClick={openAddProduct}>
              + Add product
            </button>
          </div>
        </div>

        <div className="vendor-list-main-wrapper product-wrapper">
          <div className="order-cards-panel">
            <div className="order-cards-toolbar inventory-products-toolbar">
              <label htmlFor="inventory-cards-length">
                Show{" "}
                <select
                  id="inventory-cards-length"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  {[5, 10, 15, 20, 50].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>{" "}
                entries
              </label>
              <div className="inventory-products-filters">
                <div className="inventory-products-search">
                  <input
                    id="inventory-cards-search"
                    type="search"
                    className="inventory-products-search-input"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search products"
                  />
                  <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
                </div>
                <select
                  className="inventory-products-category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <style>{`
              @keyframes inventory-card-pulse {
                0% { opacity: 1; }
                50% { opacity: 0.4; }
                100% { opacity: 1; }
              }
              .inventory-products-toolbar {
                background: transparent !important;
              }
              .inventory-products-filters {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: nowrap;
              }
              .inventory-products-search {
                position: relative;
                width: 220px;
              }
              .inventory-products-search-input {
                width: 100%;
                height: 38px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 0 40px 0 14px;
                font-size: 14px;
                color: #374151;
                background: #fff;
                outline: none;
              }
              .inventory-products-search-input:focus {
                border-color: var(--color-primary, #629d23);
              }
              .inventory-products-search i {
                position: absolute;
                right: 14px;
                top: 50%;
                transform: translateY(-50%);
                color: #374151;
                pointer-events: none;
              }
              .inventory-products-category-select {
                width: 180px;
                height: 38px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 0 36px 0 14px;
                font-size: 14px;
                color: #374151;
                background: #fff;
                cursor: pointer;
                outline: none;
              }
              .inventory-products-category-select:focus {
                border-color: var(--color-primary, #629d23);
              }
            `}</style>

            {isLoading ? (
              <div className="order-cards-grid">
                {Array.from({ length: rowsPerPage }, (_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>
                <p>{error}</p>
              </div>
            ) : paginatedItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>
                  {debouncedSearch || selectedCategory
                    ? "No products match your filters."
                    : "No products found in the database."}
                </p>
              </div>
            ) : (
              <div className="order-cards-grid">
                {paginatedItems.map((row) => (
                  <ProductCard
                    key={row.id}
                    row={row}
                    isMenuOpen={actionMenuRowId === row.id}
                    onToggleMenu={() => setActionMenuRowId((id) => (id === row.id ? null : row.id))}
                    onEdit={() => void openEditProduct(row)}
                    onDisable={() => requestDisableProduct(row)}
                    onEnable={() => requestEnableProduct(row)}
                  />
                ))}
              </div>
            )}

            {!isLoading && !error && products.length > 0 && (
              <div className="order-cards-pagination">
                <p className="order-cards-pagination__info">
                  Showing {pageStart} to {pageEnd} of {products.length} entries
                </p>
                <div className="order-cards-pagination__controls">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  {visiblePages.map((page, index) =>
                    page === "ellipsis" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="order-cards-pagination__ellipsis"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        className={page === safePage ? "is-active" : undefined}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="left">
          <p>Copyright © 2026 All Right Reserved.</p>
        </div>
      </div>

      {confirmDialog ? (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 10050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !confirmBusy) setConfirmDialog(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-confirm-title"
            style={{
              background: "#fff",
              borderRadius: 12,
              maxWidth: 420,
              width: "100%",
              padding: "24px 28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h4
              id="inventory-confirm-title"
              style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600, color: "#111827" }}
            >
              {confirmDialog.type === "disable" ? "Disable product?" : "Enable product?"}
            </h4>
            <p style={{ margin: "0 0 8px", fontSize: 15, color: "#4b5563", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: "#111827" }}>{confirmDialog.row.title}</span>
            </p>
            <p style={{ margin: 0, fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
              {confirmDialog.type === "disable"
                ? "Shoppers will no longer see this product in the store until you enable it again."
                : "Shoppers will be able to see and buy this product again."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
              <button
                type="button"
                disabled={confirmBusy}
                onClick={() => !confirmBusy && setConfirmDialog(null)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: confirmBusy ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmBusy}
                onClick={() => void runConfirmedToggle()}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: confirmDialog.type === "disable" ? "#c2410c" : "#15803d",
                  cursor: confirmBusy ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {confirmBusy ? "Working…" : confirmDialog.type === "disable" ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editMongoId ? (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 10060,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !editSaving && !editLoading) closeEditDialog();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-edit-title"
            style={{
              background: "#fff",
              borderRadius: 12,
              maxWidth: 720,
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <h4 id="product-edit-title" style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" }}>
                {isCreateMode ? "Add product" : "Edit product"}
              </h4>
              <button
                type="button"
                aria-label="Close"
                disabled={editSaving}
                onClick={closeEditDialog}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: 22,
                  lineHeight: 1,
                  cursor: editSaving ? "not-allowed" : "pointer",
                  color: "#6b7280",
                  padding: 4,
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
              {editLoading && !isCreateMode ? (
                <p style={{ textAlign: "center", color: "#6b7280", padding: 24 }}>Loading product…</p>
              ) : !editForm ? (
                <p style={{ textAlign: "center", color: "#6b7280", padding: 24 }}>Loading product…</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Product ID (SKU)</label>
                    <input
                      style={inputStyle}
                      value={editForm.productId}
                      onChange={(e) => updateEditField("productId", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Slug (URL key)</label>
                    <input
                      style={inputStyle}
                      value={editForm.slug}
                      onChange={(e) => updateEditField("slug", e.target.value)}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Title</label>
                    <input
                      style={inputStyle}
                      value={editForm.title}
                      onChange={(e) => updateEditField("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <input
                      style={inputStyle}
                      value={editForm.category}
                      onChange={(e) => updateEditField("category", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Quantity label (e.g. 500ML)</label>
                    <input
                      style={inputStyle}
                      value={editForm.quantity}
                      onChange={(e) => updateEditField("quantity", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>MRP</label>
                    <input
                      style={inputStyle}
                      value={editForm.mrp}
                      onChange={(e) => updateEditField("mrp", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Price</label>
                    <input
                      style={inputStyle}
                      value={editForm.price}
                      onChange={(e) => updateEditField("price", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Discount %{" "}
                      <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 12 }}>
                        (MRP − Price) ÷ MRP, rounded
                      </span>
                    </label>
                    <input
                      style={{ ...inputStyle, backgroundColor: "#f3f4f6", cursor: "default" }}
                      value={editDiscountPctDisplay !== "" ? editDiscountPctDisplay : "—"}
                      readOnly
                      title="(MRP − Price) ÷ MRP × 100, rounded to the nearest whole percent"
                      aria-readonly="true"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Stock (units)</label>
                    <input
                      type="number"
                      style={inputStyle}
                      value={editForm.stock}
                      onChange={(e) => updateEditField("stock", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Reviews count</label>
                    <input
                      type="number"
                      style={inputStyle}
                      value={editForm.reviews}
                      onChange={(e) => updateEditField("reviews", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Rating (e.g. 1–5)</label>
                    <input
                      type="number"
                      style={inputStyle}
                      value={editForm.ratings}
                      onChange={(e) => updateEditField("ratings", e.target.value)}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Tags (comma-separated)</label>
                    <input
                      style={inputStyle}
                      value={editForm.tags}
                      onChange={(e) => updateEditField("tags", e.target.value)}
                      placeholder="e.g. bestseller, deal-of-day, silk"
                    />
                    <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0" }}>
                      Use <code>deal-of-day</code> for Deals of the Day and <code>bestseller</code> for Best Selling section on the homepage.
                    </p>
                  </div>
                  <div>
                    <label style={labelStyle}>Author</label>
                    <input
                      style={inputStyle}
                      value={editForm.author}
                      onChange={(e) => updateEditField("author", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Published date</label>
                    <input
                      style={inputStyle}
                      value={editForm.publishedDate}
                      onChange={(e) => updateEditField("publishedDate", e.target.value)}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Product images</label>
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      style={{ display: "none" }}
                      onChange={handleImageFileSelected}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {editForm.images.map((url, index) => {
                        const isUploading = uploadingImageIndex === index;
                        const busy =
                          editSaving || editLoading || uploadingImageIndex !== null;
                        const canAdd =
                          editForm.images.length < MAX_PRODUCT_IMAGES && !busy;
                        const canRemove = editForm.images.length > 1 && !busy;
                        const canUpload = !busy;
                        const iconBtnStyle = (enabled: boolean): React.CSSProperties => ({
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                          borderRadius: 6,
                          border: "1px solid #d1d5db",
                          background: enabled ? "#fff" : "#f3f4f6",
                          color: enabled ? "#111827" : "#9ca3af",
                          cursor: enabled ? "pointer" : "not-allowed",
                          fontSize: 20,
                          fontWeight: 600,
                          lineHeight: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        });

                        return (
                          <div key={`image-${index}`}>
                            <label style={{ ...labelStyle, marginBottom: 6 }}>
                              Image {index + 1}
                              {index === 0 ? " (primary)" : ""}
                              {isUploading ? " — uploading…" : ""}
                            </label>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <button
                                type="button"
                                onClick={addImageField}
                                disabled={!canAdd}
                                aria-label="Add image field"
                                style={iconBtnStyle(canAdd)}
                              >
                                +
                              </button>
                              <input
                                style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                                value={url}
                                onChange={(e) => updateImageField(index, e.target.value)}
                                placeholder="https://…"
                                disabled={busy}
                              />
                              <button
                                type="button"
                                onClick={() => openImageUpload(index)}
                                disabled={!canUpload}
                                aria-label={`Upload media for image ${index + 1}`}
                                title="Upload image or video to Cloudinary"
                                style={iconBtnStyle(canUpload)}
                              >
                                <UploadIcon />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImageField(index)}
                                disabled={!canRemove}
                                aria-label="Remove image field"
                                style={iconBtnStyle(canRemove)}
                              >
                                −
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Product ad media url</label>
                    <input
                      style={inputStyle}
                      value={editForm.productAdMediaUrl}
                      onChange={(e) => updateEditField("productAdMediaUrl", e.target.value)}
                      placeholder="https://… (sidebar promo on product page)"
                      disabled={editSaving || editLoading}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Description (rich text)</label>
                    <ProductDescriptionRichEditor
                      key={editMongoId ?? "desc"}
                      value={editForm.description}
                      onChange={(html) => updateEditField("description", html)}
                      disabled={editSaving || editLoading}
                    />
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                disabled={editSaving || editLoading || !editForm}
                onClick={closeEditDialog}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: editSaving || editLoading ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={editSaving || editLoading || !editForm}
                onClick={() => void saveEditedProduct()}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: "#1f72b0",
                  cursor: editSaving || editLoading || !editForm ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {editSaving ? "Saving…" : isCreateMode ? "Create product" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OverviewTable;
