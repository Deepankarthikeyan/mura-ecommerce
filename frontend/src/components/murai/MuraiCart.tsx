"use client";

import Link from "next/link";
import { useCart } from "@/components/header/CartContext";
import { useUser } from "@/components/header/UserContext";
import { useRouter } from "next/navigation";
import { parseMoneyAmount } from "@/lib/shopProductDisplay";

function unit(price: unknown) {
  return parseMoneyAmount(price as string | number) ?? 0;
}

export default function MuraiCart() {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const subtotal = cartItems.reduce((sum, item) => sum + unit(item.price) * (item.quantity || 1), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!isAuthenticated) {
      localStorage.setItem("returnUrl", "/checkout");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="murai-cart">
      {cartItems.length === 0 ? (
        <div className="murai-cart-empty">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="murai-cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="murai-cart-item">
                <img src={item.image} alt={item.title} className="murai-cart-item-img" />
                <div className="murai-cart-item-info">
                  <h4>{item.title}</h4>
                  <p className="murai-cart-item-price">₹{unit(item.price).toLocaleString("en-IN")}</p>
                  <div className="murai-cart-qty">
                    <button type="button" onClick={() => item.quantity > 1 && updateItemQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="murai-cart-item-total">
                  <p>₹{(unit(item.price) * item.quantity).toLocaleString("en-IN")}</p>
                  <button type="button" className="murai-cart-remove" onClick={() => removeFromCart(item.id)} aria-label="Remove">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="murai-cart-summary">
            <div className="murai-cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <button type="button" className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
      <style jsx>{`
        .murai-cart-empty { text-align: center; padding: 48px 20px; }
        .murai-cart-items { display: flex; flex-direction: column; gap: 16px; }
        .murai-cart-item {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 16px;
          border: 1px solid #ededed;
          border-radius: 8px;
          background: #fff;
        }
        .murai-cart-item-img { width: 80px; height: 80px; object-fit: cover; border-radius: 6px; }
        .murai-cart-item-info h4 { margin: 0 0 6px; font-size: 15px; color: #2b2a29; }
        .murai-cart-item-price { color: #cf0653; font-weight: 600; margin: 0 0 8px; }
        .murai-cart-qty { display: flex; align-items: center; gap: 10px; }
        .murai-cart-qty button {
          width: 28px; height: 28px; border: 1px solid #ededed; background: #fffde9;
          border-radius: 4px; cursor: pointer; font-size: 16px;
        }
        .murai-cart-item-total { text-align: right; }
        .murai-cart-remove { background: none; border: none; color: #999; cursor: pointer; margin-top: 8px; }
        .murai-cart-summary {
          margin-top: 24px; padding: 20px; border: 1px solid #ededed;
          border-radius: 8px; background: #fffde9;
        }
        .murai-cart-summary-row { display: flex; justify-content: space-between; font-weight: 600; font-size: 18px; }
      `}</style>
    </div>
  );
}
