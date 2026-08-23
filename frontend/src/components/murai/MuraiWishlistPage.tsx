"use client";

import Link from "next/link";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { parseMoneyAmount } from "@/lib/shopProductDisplay";
import MuraiLayout from "./MuraiLayout";
import { useMuraiNotify } from "./MuraiNotification";

export default function MuraiWishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const notify = useMuraiNotify();

  const moveToCart = (item: (typeof wishlistItems)[0]) => {
    addToCart({
      id: item.id,
      slug: item.slug,
      image: item.image,
      title: item.title,
      price: parseMoneyAmount(item.price) ?? 0,
      quantity: 1,
      active: true,
    });
    removeFromWishlist(item.id);
    notify(`${item.title} moved to cart!`);
  };

  return (
    <MuraiLayout activePage="shop">
      <div className="murai-wishlist-page container">
        <h1 style={{ fontFamily: "var(--font-heading)", marginBottom: 32 }}>My Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <p>Your wishlist is empty.</p>
            <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16, display: "inline-block" }}>Browse Sarees</Link>
          </div>
        ) : (
          <div className="suruchi-products-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="suruchi-product">
                <div className="suruchi-product-img">
                  <Link href={item.slug ? `/shop/${item.slug}` : "/shop"}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                </div>
                <div className="suruchi-product-info">
                  <h3 className="suruchi-product-name">
                    <Link href={item.slug ? `/shop/${item.slug}` : "/shop"}>{item.title}</Link>
                  </h3>
                  <div className="suruchi-product-price">
                    <span className="current">₹{(parseMoneyAmount(item.price) ?? 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="suruchi-product-actions" style={{ opacity: 1, transform: "none" }}>
                    <button className="suruchi-action-btn primary" type="button" onClick={() => moveToCart(item)}>Add to Cart</button>
                    <button className="suruchi-action-btn" type="button" onClick={() => removeFromWishlist(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MuraiLayout>
  );
}
