"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { parseMoneyAmount, resolveProductGalleryImages } from "@/lib/shopProductDisplay";
import { sanitizeProductDescriptionHtml } from "@/lib/sanitizeProductHtml";
import { fetchProductBySlug, useProducts } from "@/lib/murai/useProducts";
import {
  formatInr,
  getProductSlug,
  getStableProductId,
  productCardImage,
  productCategoryKey,
  productCategoryLabel,
  productPricing,
} from "@/lib/murai/productUtils";
import type { StoreProduct } from "@/lib/murai/types";
import MuraiFeaturesBar from "./MuraiFeaturesBar";
import MuraiLayout from "./MuraiLayout";
import MuraiProductCard from "./MuraiProductCard";
import { useMuraiNotify } from "./MuraiNotification";

function ProductSpecs({ product }: { product: StoreProduct }) {
  const pricing = productPricing(product);
  const rows = [
    ["Category", productCategoryLabel(product.category)],
    ["Product ID", product.productId ?? "—"],
    ["Fabric", productCategoryLabel(product.category)],
    ["Availability", product.stock != null && product.stock <= 0 ? "Out of stock" : "In stock"],
    ["Rating", `${product.ratings ?? 5} / 5`],
    ["Reviews", String(product.reviews ?? 0)],
  ];

  if (pricing.badge) {
    rows.unshift(["Discount", `${pricing.badge}% OFF`]);
  }

  return (
    <div className="murai-pdp-specs">
      <h3>Product Details</h3>
      <table>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th>{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductDetailBody({ product }: { product: StoreProduct }) {
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const notify = useMuraiNotify();
  const { products: allProducts } = useProducts();

  const id = getStableProductId(product);
  const productSlug = getProductSlug(product);
  const gallery = useMemo(() => {
    const images = resolveProductGalleryImages(product, { count: 4 });
    const mapped = images.map((src) =>
      src.includes("logo-1-jpg") || src.includes("aathithya") ? productCardImage(product) : src
    );
    const primary = productCardImage(product);
    const unique = [primary, ...mapped].filter((src, i, arr) => src && arr.indexOf(src) === i);
    return unique.length ? unique : [primary];
  }, [product]);

  const { showMrp, badge, sale, mrp } = productPricing(product);
  const inWishlist = wishlistItems.some((w) => w.id === id);
  const related = allProducts
    .filter((p) => {
      if (getStableProductId(p) === id) return false;
      return productCategoryKey(p.category) === productCategoryKey(product.category);
    })
    .slice(0, 4);
  const fallbackRelated = related.length
    ? related
    : allProducts.filter((p) => getStableProductId(p) !== id).slice(0, 4);

  const savings =
    showMrp && sale != null && mrp != null ? Math.max(0, mrp - sale) : 0;

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

  const descriptionHtml =
    product.description?.trim() ||
    `<p>Premium handpicked saree from the MuRa@23 collection. Elegant drape, rich fabric, and perfect for festive occasions, weddings, and celebrations.</p>
     <ul>
       <li>Authentic weave with premium finish</li>
       <li>Comfortable drape for all-day wear</li>
       <li>Ideal for weddings, festivals &amp; parties</li>
       <li>Carefully packed for safe delivery</li>
     </ul>`;

  return (
    <>
      <section className="breadcrumb__section">
        <div className="breadcrumb__bg">
          <img className="breadcrumb__bg-image" src="/murai/images/banners/banner-shop.jpg" alt="" width={1600} height={334} />
          <div className="container">
            <div className="breadcrumb__content">
              <h1 className="breadcrumb__content--title">{product.title}</h1>
              <ul className="breadcrumb__content--menu">
                <li className="breadcrumb__content--menu__items"><Link href="/">Home</Link></li>
                <li className="breadcrumb__content--menu__items"><Link href="/shop">Shop</Link></li>
                <li className="breadcrumb__content--menu__items"><span>{product.title}</span></li>
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
              {badge ? <span className="murai-pdp-sale-badge">{badge}% OFF</span> : null}
            </div>
            <div className="murai-pdp-thumbs">
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
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
            <span className="murai-pdp-cat">{productCategoryLabel(product.category)}</span>
            <h1>{product.title}</h1>
            <div className="suruchi-stars" style={{ marginBottom: 12 }}>
              {"★".repeat(Math.round(Number(product.ratings) || 5)).padEnd(5, "☆")}{" "}
              <span style={{ fontSize: 14, color: "#666" }}>({product.reviews ?? 0} reviews)</span>
            </div>

            <div className="murai-pdp-price">
              <span className="current">{formatInr(product.price)}</span>
              {showMrp ? <span className="old">{formatInr(product.mrp)}</span> : null}
            </div>

            {savings > 0 ? (
              <p className="murai-pdp-savings">You save {formatInr(savings)}</p>
            ) : null}

            <p className="murai-pdp-stock">
              {product.stock != null
                ? product.stock > 0
                  ? `✓ In stock (${product.stock} available)`
                  : "Out of stock"
                : "✓ In stock"}
            </p>

            {product.productId ? <p className="murai-pdp-sku">SKU: {product.productId}</p> : null}

            {product.tags?.length ? (
              <div className="murai-pdp-tags">
                {product.tags.map((tag) => (
                  <span key={tag} className="murai-pdp-tag">{tag}</span>
                ))}
              </div>
            ) : null}

            <div className="murai-pdp-actions">
              <div className="murai-pdp-qty">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <input type="number" min={1} value={qty} readOnly />
                <button type="button" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button className="btn btn-primary add-to-cart" type="button" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn murai-pdp-wishlist-btn" type="button" onClick={toggleWishlist}>
                {inWishlist ? "♥ In Wishlist" : "♡ Add to Wishlist"}
              </button>
            </div>

            <div className="murai-pdp-highlights">
              <div><strong>Free shipping</strong> on orders over ₹999</div>
              <div><strong>Easy returns</strong> within 30 days</div>
              <div><strong>Secure checkout</strong> with trusted payment</div>
            </div>

            <div className="murai-pdp-desc">
              <h3>Product Description</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeProductDescriptionHtml(descriptionHtml) }} />
            </div>

            <ProductSpecs product={product} />
          </div>
        </div>

        {product.productAdMediaUrl ? (
          <div className="murai-pdp-promo">
            <img src={product.productAdMediaUrl} alt="Special offer" loading="lazy" />
          </div>
        ) : null}

        {fallbackRelated.length > 0 ? (
          <div className="murai-pdp-related">
            <div className="section-heading"><h2>Related Sarees</h2></div>
            <div className="suruchi-products-grid">
              {fallbackRelated.map((p) => (
                <MuraiProductCard key={getStableProductId(p)} product={p} style="shop" />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <MuraiFeaturesBar />
    </>
  );
}

export default function MuraiProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) {
        setProduct(null);
        setLoading(false);
        return;
      }
      const p = await fetchProductBySlug(slug);
      if (!cancelled) {
        setProduct(p);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading && !product) {
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
          <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16, display: "inline-block" }}>
            Back to Shop
          </Link>
        </div>
      </MuraiLayout>
    );
  }

  return (
    <MuraiLayout activePage="shop">
      <ProductDetailBody product={product} />
    </MuraiLayout>
  );
}
