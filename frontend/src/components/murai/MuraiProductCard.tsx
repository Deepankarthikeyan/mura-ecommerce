"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { parseMoneyAmount } from "@/lib/shopProductDisplay";

type MuraiProductCardProps = {
  slug: string;
  title: string;
  category?: string;
  image: string;
  price?: string | number;
  mrp?: string | number;
  discountPercentage?: string | number;
  showActions?: boolean;
};

function showMrpVersusSale(price?: string | number, mrp?: string | number): boolean {
  const saleNum = parseMoneyAmount(price);
  const mrpNum = parseMoneyAmount(mrp);
  return saleNum != null && mrpNum != null && mrpNum > saleNum;
}

function formatInr(value?: string | number): string {
  const num = parseMoneyAmount(value);
  if (num == null) return "";
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function MuraiProductCard({
  slug,
  title,
  category,
  image,
  price,
  mrp,
  discountPercentage,
  showActions = true,
}: MuraiProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const badge =
    discountPercentage && Number(discountPercentage) > 0
      ? `${Math.round(Number(discountPercentage))}% Off`
      : "Sale";

  const handleAddToCart = () => {
    addToCart({
      id: Date.now(),
      image,
      title,
      price: parseMoneyAmount(price) ?? 0,
      quantity: 1,
      active: true,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    addToWishlist({
      id: Date.now(),
      image,
      title,
      price: parseMoneyAmount(price) ?? 0,
      quantity: 1,
    });
  };

  return (
    <div className="suruchi-product">
      <div className="suruchi-product-img">
        <Link href={`/shop/${slug}`}>
          <img src={image} alt={title} loading="lazy" />
        </Link>
        <span className="suruchi-product-badge">{badge}</span>
      </div>
      <div className="suruchi-product-info">
        {category ? <span className="suruchi-product-cat">{category}</span> : null}
        <h3 className="suruchi-product-name">
          <Link href={`/shop/${slug}`}>{title}</Link>
        </h3>
        <div className="suruchi-product-price">
          <span className="current">{formatInr(price)}</span>
          {showMrpVersusSale(price, mrp) ? <span className="old">{formatInr(mrp)}</span> : null}
        </div>
        <div className="suruchi-stars">★★★★★</div>
        {showActions ? (
          <div className="suruchi-product-actions">
            <button className="suruchi-action-btn primary add-to-cart" type="button" onClick={handleAddToCart}>
              {added ? "Added!" : "+ Add to cart"}
            </button>
            <button className="suruchi-action-btn wishlist-btn" type="button" onClick={handleWishlist} aria-label="Add to wishlist">
              ♡
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
