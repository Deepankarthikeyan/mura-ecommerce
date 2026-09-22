"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { ALL_SAREES, formatInr, type MuraiSaree } from "./murai-data";

type MuraiProductCardProps = {
  product: MuraiSaree;
  variant?: "home" | "bestseller";
  href?: string;
};

export function MuraiProductCard({ product, variant = "home", href = "/shop" }: MuraiProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const productHref = product.href || href;
  const showOldPrice = product.old > product.price;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      image: product.img,
      title: product.name,
      price: product.price,
      quantity: 1,
      active: true,
    });
    toast.success("Successfully Added To Cart!");
  };

  const handleWishlist = () => {
    addToWishlist({
      id: product.id,
      image: product.img,
      title: product.name,
      price: product.price,
      quantity: 1,
    });
    toast.success("Successfully Added To Wishlist!");
  };

  return (
    <div className="suruchi-product">
      <Link href={productHref} className="suruchi-product-link">
        <span className="sr-only">{product.name}</span>
      </Link>
      <div className="suruchi-product-img">
        <img src={product.img} alt="" loading="lazy" />
        {product.badge ? <span className="suruchi-product-badge">{product.badge}</span> : null}
      </div>
      <div className="suruchi-product-info">
        <span className="suruchi-product-cat">{product.cat}</span>
        <h3 className="suruchi-product-name">{product.name}</h3>
        <div className="suruchi-product-price">
          <span className="current">{formatInr(product.price)}</span>
          {showOldPrice ? <span className="old">{formatInr(product.old)}</span> : null}
        </div>
        <div className="suruchi-stars">★★★★★</div>
        {variant === "home" ? (
          <div className="suruchi-product-actions">
            <button className="suruchi-action-btn primary add-to-cart" type="button" onClick={handleAdd}>
              + Add to cart
            </button>
            <button className="suruchi-action-btn wishlist-btn" type="button" onClick={handleWishlist}>
              ♡
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function useDealActions() {
  const { addToCart } = useCart();
  const product = ALL_SAREES[0];
  return () => {
    addToCart({
      id: product.id,
      image: product.img,
      title: product.name,
      price: product.price,
      quantity: 1,
      active: true,
    });
    toast.success("Successfully Added To Cart!");
  };
}
