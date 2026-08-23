"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { parseMoneyAmount, resolveProductGalleryImages } from "@/lib/shopProductDisplay";
import { sanitizeProductDescriptionHtml } from "@/lib/sanitizeProductHtml";
import {
  formatInr,
  getProductSlug,
  getStableProductId,
  productCardImage,
  productPricing,
} from "@/lib/murai/productUtils";
import { fetchProductBySlug } from "@/lib/murai/useProducts";
import type { StoreProduct } from "@/lib/murai/types";
import MuraiLayout from "./MuraiLayout";
import MuraiProductCard from "./MuraiProductCard";
import { useMuraiNotify } from "./MuraiNotification";
import { useProducts } from "@/lib/murai/useProducts";

export default function MuraiProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const notify = useMuraiNotify();
  const { products: allProducts } = useProducts();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const p = await fetchProductBySlug(slug);
      if (!cancelled) {
        setProduct(p);
        setActiveImage(0);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <MuraiLayout activePage="shop">
        <div className="murai-pdp container" style={{ padding: 80, textAlign: "center" }}>Loading product...</div>
      </MuraiLayout>
    );
  }

  if (!product) {
    return (
      <MuraiLayout activePage="shop">
        <div className="murai-pdp container" style={{ padding: 80, textAlign: "center" }}>
          <h1>Product not found</h1>
          <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16, display: "inline-block" }}>Back to Shop</Link>
        </div>
      </MuraiLayout>
    );
  }

  const id = getStableProductId(product);
  const productSlug = getProductSlug(product);
  const gallery = resolveProductGalleryImages(product, { count: 4 }).map((src) =>
    src.startsWith("/murai/") || src.startsWith("http") ? src : productCardImage(product)
  );
  const { showMrp, badge } = productPricing(product);
  const inWishlist = wishlistItems.some((w) => w.id === id);
  const related = allProducts.filter((p) => getStableProductId(p) !== id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      id,
      slug: productSlug,
      image: productCardImage(product),
      title: product.title ?? "Saree",
      price: parseMoneyAmount(product.price) ?? 0,
      quantity: qty,
      active: true,
    });
    notify(`${product.title} added to cart!`);
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(id);
      notify("Removed from wishlist.");
      return;
    }
    addToWishlist({
      id,
      slug: productSlug,
      image: productCardImage(product),
      title: product.title ?? "Saree",
      price: parseMoneyAmount(product.price) ?? 0,
      quantity: 1,
    });
    notify("Added to wishlist!");
  };

  return (
    <MuraiLayout activePage="shop">
      <section className="breadcrumb__section">
        <div className="breadcrumb__bg">
          <div className="container">
            <div className="breadcrumb__content">
              <ul className="breadcrumb__content--menu">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/shop">Shop</Link></li>
                <li><span>{product.title}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="murai-pdp">
        <div className="murai-pdp-grid">
          <div>
            <div className="murai-pdp-gallery-main">
              <img src={gallery[activeImage] ?? productCardImage(product)} alt={product.title ?? ""} />
            </div>
            <div className="murai-pdp-thumbs">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={`murai-pdp-thumb ${activeImage === i ? "active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="murai-pdp-info">
            <span className="murai-pdp-cat">{product.category}</span>
            {badge ? <span className="murai-pdp-badge">{badge}% OFF</span> : null}
            <h1>{product.title}</h1>
            <div className="suruchi-stars" style={{ marginBottom: 16 }}>★★★★★ <span style={{ fontSize: 14, color: "#666" }}>({product.reviews ?? 0} reviews)</span></div>
            <div className="murai-pdp-price">
              <span className="current">{formatInr(product.price)}</span>
              {showMrp ? <span className="old">{formatInr(product.mrp)}</span> : null}
            </div>
            <p style={{ marginTop: 16, color: "#4a4a4a" }}>
              {product.stock != null ? (product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock") : "In stock"}
            </p>

            <div className="murai-pdp-actions">
              <div className="murai-pdp-qty">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <input type="number" min={1} value={qty} readOnly />
                <button type="button" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button className="btn btn-primary add-to-cart" type="button" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn wishlist-btn" type="button" onClick={toggleWishlist} style={{ border: "2px solid #cf0653", color: "#cf0653", padding: "12px 24px", borderRadius: 8 }}>
                {inWishlist ? "♥ In Wishlist" : "♡ Add to Wishlist"}
              </button>
            </div>

            <div className="murai-pdp-desc">
              <h3>Product Description</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeProductDescriptionHtml(product.description ?? "<p>Premium handpicked saree from MuRa@23 collection.</p>") }} />
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="murai-pdp-related">
            <div className="section-heading"><h2>Related Sarees</h2></div>
            <div className="suruchi-products-grid">
              {related.map((p) => (
                <MuraiProductCard key={getStableProductId(p)} product={p} style="shop" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </MuraiLayout>
  );
}
