"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCart } from "@/components/header/CartContext";
import { useUser } from "@/components/header/UserContext";
import { parseMoneyAmount } from "@/lib/shopProductDisplay";
import MuraiLayout from "./MuraiLayout";

export default function MuraiCartPage() {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const items = useMemo(() => cartItems.filter((i) => i.active), [cartItems]);
  const subtotal = items.reduce((sum, i) => sum + (parseMoneyAmount(i.price) ?? 0) * i.quantity, 0);

  const checkout = () => {
    if (!items.length) return;
    if (!isAuthenticated) {
      localStorage.setItem("returnUrl", "/checkout");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <MuraiLayout activePage="shop">
      <div className="murai-cart-page container">
        <h1 style={{ fontFamily: "var(--font-heading)", marginBottom: 32 }}>Shopping Cart</h1>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <p>Your cart is empty.</p>
            <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16, display: "inline-block" }}>Shop Sarees</Link>
          </div>
        ) : (
          <>
            <table className="murai-cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="murai-cart-product">
                        <Link href={item.slug ? `/shop/${item.slug}` : "/shop"}>
                          <img src={item.image} alt={item.title} />
                        </Link>
                        <Link href={item.slug ? `/shop/${item.slug}` : "/shop"}>{item.title}</Link>
                      </div>
                    </td>
                    <td>₹{(parseMoneyAmount(item.price) ?? 0).toLocaleString("en-IN")}</td>
                    <td>
                      <div className="murai-pdp-qty">
                        <button type="button" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>−</button>
                        <input type="number" value={item.quantity} readOnly />
                        <button type="button" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td>₹{((parseMoneyAmount(item.price) ?? 0) * item.quantity).toLocaleString("en-IN")}</td>
                    <td>
                      <button type="button" onClick={() => removeFromCart(item.id)} style={{ color: "#cf0653" }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <Link href="/shop" className="btn">Continue Shopping</Link>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Subtotal: ₹{subtotal.toLocaleString("en-IN")}</p>
                <button type="button" className="btn btn-primary" onClick={checkout}>Proceed to Checkout</button>
              </div>
            </div>
          </>
        )}
      </div>
    </MuraiLayout>
  );
}
