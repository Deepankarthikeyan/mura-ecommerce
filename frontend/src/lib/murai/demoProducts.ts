import { shopProductPathSegment } from "@/lib/productSlug";
import type { StoreProduct } from "./types";

const IMG = "/murai/images/sarees";

/** Fallback catalog when MongoDB is unavailable — matches Murai reference UI. */
export const DEMO_SAREE_PRODUCTS: StoreProduct[] = [
  { _id: "demo-1", productId: "MURA-BAN-001", title: "Banarasi Silk Saree", category: "Silk Sarees", price: "3599", mrp: "5999", discountPercentage: 40, image: `${IMG}/banarasi.webp`, bannerImg: [`${IMG}/banarasi.webp`, `${IMG}/kanjivaram.webp`], stock: 12, ratings: 5, reviews: 48, description: "<p>Luxurious Banarasi silk saree with rich zari work. Perfect for weddings and festive occasions.</p>" },
  { _id: "demo-2", productId: "MURA-KAN-001", title: "Kanjivaram Silk Saree", category: "Kanjivaram", price: "4999", mrp: "7999", discountPercentage: 38, image: `${IMG}/kanjivaram.webp`, bannerImg: [`${IMG}/kanjivaram.webp`], stock: 8, ratings: 5, reviews: 36, description: "<p>Authentic Kanjivaram weave with temple border and vibrant silk body.</p>" },
  { _id: "demo-3", productId: "MURA-COT-001", title: "Cotton Block Print Saree", category: "Cotton Sarees", price: "899", mrp: "1499", discountPercentage: 40, image: `${IMG}/cotton-block.webp`, stock: 25, ratings: 4, reviews: 22, description: "<p>Lightweight cotton saree with hand block prints — ideal for daily wear.</p>" },
  { _id: "demo-4", productId: "MURA-GEO-001", title: "Georgette Party Saree", category: "Designer Sarees", price: "1299", mrp: "2199", discountPercentage: 41, image: `${IMG}/georgette-party.webp`, stock: 15, ratings: 5, reviews: 19, description: "<p>Elegant georgette saree with sequin work for parties and receptions.</p>" },
  { _id: "demo-5", productId: "MURA-PAI-001", title: "Paithani Silk Saree", category: "Silk Sarees", price: "4299", mrp: "6999", discountPercentage: 39, image: `${IMG}/paithani.webp`, stock: 6, ratings: 5, reviews: 14, description: "<p>Traditional Paithani with peacock motifs and pure silk drape.</p>" },
  { _id: "demo-6", productId: "MURA-BAN-002", title: "Banarasi Brocade Saree", category: "Silk Sarees", price: "3899", mrp: "6499", discountPercentage: 40, image: `${IMG}/banarasi.webp`, stock: 10, ratings: 5, reviews: 31, description: "<p>Heavy brocade Banarasi saree with gold zari patterns.</p>" },
  { _id: "demo-7", productId: "MURA-COT-002", title: "Linen Cotton Saree", category: "Cotton Sarees", price: "1099", mrp: "1799", discountPercentage: 39, image: `${IMG}/cotton-block.webp`, stock: 18, ratings: 4, reviews: 11, description: "<p>Breathable linen-cotton blend for summer comfort.</p>" },
  { _id: "demo-8", productId: "MURA-DES-001", title: "Organza Designer Saree", category: "Designer Sarees", price: "1899", mrp: "2999", discountPercentage: 37, image: `${IMG}/georgette-party.webp`, stock: 9, ratings: 5, reviews: 17, description: "<p>Sheer organza saree with contemporary designer embroidery.</p>" },
].map((p) => ({ ...p, urlSlug: shopProductPathSegment(p) }));

