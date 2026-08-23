"use client";

import Link from "next/link";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { parseMoneyAmount } from "@/lib/shopProductDisplay";
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
import { useMuraiNotify } from "./MuraiNotification";

type MuraiProductCardProps = {
  product: StoreProduct;
  style?: "home" | "shop" | "bestseller";
};

export default function MuraiProductCard({ product, style = "shop" }: MuraiProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const notify = useMuraiNotify();

  const slug = getProductSlug(product);
  const id = getStableProductId(product);
  const { showMrp } = productPricing(product);
  const inWishlist = wishlistItems.some((w) => w.id === id);
  const dataAttrs = style === "shop";

  const handleAddToCart = () => {
    addToCart({
      id,
      slug,
      image: productCardImage(product),
      title: product.title ?? "Saree",
      price: parseMoneyAmount(product.price) ?? 0,
      quantity: 1,
      active: true,
    });
    notify(`${product.title ?? "Saree"} added to cart!`);
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(id);
      notify("Removed from wishlist.");
      return;
    }
    addToWishlist({
      id,
      slug,
      image: productCardImage(product),
      title: product.title ?? "Saree",
      price: parseMoneyAmount(product.price) ?? 0,
      quantity: 1,
    });
    notify("Added to wishlist!");
  };

  return (
    <div
      className="suruchi-product"
      {...(dataAttrs
        ? {
            "data-category": productCategoryKey(product.category),
            "data-price": parseMoneyAmount(product.price) ?? 0,
            "data-name": product.title ?? "",
          }
        : {})}
    >
      <div className="suruchi-product-img">
        <Link href={`/shop/${slug}`}>
          <img src={productCardImage(product)} alt={product.title ?? "Saree"} loading="lazy" />
        </Link>
        <span className="suruchi-product-badge">Sale</span>
      </div>
      <div className="suruchi-product-info">
        <span className="suruchi-product-cat">{productCategoryLabel(product.category)}</span>
        <h3 className="suruchi-product-name">
          <Link href={`/shop/${slug}`}>{product.title}</Link>
        </h3>
        <div className="suruchi-product-price">
          <span className="current">{formatInr(product.price)}</span>
          {showMrp ? <span className="old">{formatInr(product.mrp)}</span> : null}
        </div>
        <div className="suruchi-stars">★★★★★</div>
        <div className="suruchi-product-actions">
          <button className="suruchi-action-btn primary add-to-cart" type="button" onClick={handleAddToCart}>
            + Add to cart
          </button>
          <button
            className={`suruchi-action-btn wishlist-btn ${inWishlist ? "active" : ""}`}
            type="button"
            onClick={toggleWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {inWishlist ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
