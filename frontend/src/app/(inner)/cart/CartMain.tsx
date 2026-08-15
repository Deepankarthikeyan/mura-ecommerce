'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/header/CartContext';
import { useUser } from '@/components/header/UserContext';
import { useRouter } from 'next/navigation';
import LoginDialog from '@/components/auth/LoginDialog';
import RegisterDialog, {
  type RegistrationReadyPayload,
} from "@/components/auth/RegisterDialog";
import AddressDialog from '@/components/auth/AddressDialog';
import { parseMoneyAmount } from '@/lib/shopProductDisplay';

function cartUnitRupee(price: unknown): number {
  return parseMoneyAmount(price as string | number | null | undefined) ?? 0;
}

const CartMain = () => {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [signupContinue, setSignupContinue] =
    useState<RegistrationReadyPayload | null>(null);

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = cartUnitRupee(item.price);
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon === '12345') {
      setDiscount(0.25);
      setCouponMessage('Coupon applied -25% successfully');
      localStorage.setItem('coupon', coupon);
      localStorage.setItem('discount', '0.25');
    } else {
      setDiscount(0);
      setCouponMessage('Coupon code is incorrect');
      localStorage.removeItem('coupon');
      localStorage.removeItem('discount');
    }
  };

  const clearCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartItems');
      localStorage.removeItem('coupon');
      localStorage.removeItem('discount');
    }
    setCoupon('');
    setDiscount(0);
    setCouponMessage('');
    cartItems.forEach(item => removeFromCart(item.id));
  };

  const finalTotal = subtotal - subtotal * discount;

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty. Please add products before proceeding to checkout.');
      return;
    }

    if (!isAuthenticated) {
      // Store return URL for after login
      localStorage.setItem('returnUrl', '/checkout');
      setIsLoginDialogOpen(true);
      return;
    }

    router.push('/checkout');
  };

  return (
    <div className="rts-cart-area rts-section-gap bg_light-1">
      <div className="container">
        <div className="row g-5">
          {/* Cart Items */}
          <div className="col-xl-9 col-12 order-1">
            <div className="rts-cart-list-area">
              <div className="single-cart-area-list head d-none d-lg-flex align-items-center">
                <div className="product-main"><p>Products</p></div>
                <div className="price"><p>Price</p></div>
                <div className="quantity"><p>Quantity</p></div>
                <div className="subtotal"><p>SubTotal</p></div>
              </div>

              {cartItems.length === 0 && (
                <div className="empty-cart-message" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <i className="fa-light fa-cart-shopping" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px', display: 'block' }} />
                  <h4 style={{ color: '#555', marginBottom: '10px' }}>Your cart is empty!</h4>
                  <p style={{ color: '#888' }}>Add some products to get started</p>
                </div>
              )}

              {cartItems.map(item => (
                <div className="single-cart-area-list main item-parent" key={item.id}>
                  <div className="product-main-cart">
                    <div
                      className="close section-activation"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          removeFromCart(item.id);
                        }
                      }}
                      aria-label="Remove from cart"
                    >
                      <i
                        className="fa-regular fa-x"
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#6b7280',
                          color: '#fff',
                          fontSize: 14,
                        }}
                      />
                    </div>
                    <div className="thumbnail">
                      <img src={item.image} alt="shop" />
                    </div>
                    <div className="information">
                      <h6 className="title">{item.title}</h6>
                      {/* <span>SKU:SKUZNFER</span> */}
                    </div>
                  </div>
                  <div className="price"><p>₹{cartUnitRupee(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                  <div className="quantity">
                    <div className="quantity-edit">
                      <input type="text" className="input" value={item.quantity} readOnly />
                      <div className="button-wrapper-action">
                        <button
                          className="button minus"
                          onClick={() =>
                            item.quantity > 1 && updateItemQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <i className="fa-regular fa-chevron-down" />
                        </button>
                        <button
                          className="button plus"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <i className="fa-regular fa-chevron-up" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="subtotal"><p>₹{(cartUnitRupee(item.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                </div>
              ))}

              {/* Coupon + Clear */}
              {cartItems.length > 0 && (
                <div className="bottom-cupon-code-cart-area">
                  {/*
                  <form onSubmit={applyCoupon}>
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={coupon}
                      onChange={e => {
                        setCoupon(e.target.value);
                        setCouponMessage('');
                      }}
                    />
                    <button type="submit" className="rts-btn btn-primary">Apply Coupon</button>
                    {couponMessage && (
                      <p style={{ color: coupon === '12345' ? 'green' : 'red', marginTop: '8px' }}>{couponMessage}</p>
                    )}
                  </form>
                  */}
                  <button onClick={clearCart} className="rts-btn btn-primary mr--50">Clear All</button>
                </div>
              )}
            </div>

            {/* Free Shipping Note */}
            {/*
            <div className="cart-top-area-note mt-4">
              <p>Add <span>₹59.69</span> to cart and get free shipping</p>
              <div className="bottom-content-deals mt--10">
                <div className="single-progress-area-incard">
                  <div className="progress">
                    <div className="progress-bar wow fadeInLeft" role="progressbar" style={{ width: '80%' }} />
                  </div>
                </div>
              </div>
            </div>
            */}
          </div>

          {/* Summary Area */}
          <div className="col-xl-3 col-12 order-2">
            <div className="cart-total-area-start-right">
              <h5 className="title">Cart Totals</h5>
              <div className="bottom">
                <div className="wrapper">
                  <span>Total</span>
                  <h6 className="price">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h6>
                </div>
                <div className="button-area">
                  {checkoutError && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "10px",
                        padding: "10px",
                        backgroundColor: "#fee2e2",
                        borderRadius: "4px",
                        border: "1px solid #ef4444"
                      }}
                    >
                      {checkoutError}
                    </div>
                  )}
                  <button
                    className="rts-btn btn-primary"
                    onClick={handleCheckout}
                    style={{ width: "100%" }}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSwitchToRegister={() => setIsRegisterDialogOpen(true)}
      />
      <RegisterDialog
        isOpen={isRegisterDialogOpen}
        onClose={() => setIsRegisterDialogOpen(false)}
        onSwitchToLogin={() => setIsLoginDialogOpen(true)}
        onRegisterSuccess={(p) => {
          setSignupContinue(p);
          setIsRegisterDialogOpen(false);
          setIsAddressDialogOpen(true);
        }}
      />
      <AddressDialog
        isOpen={isAddressDialogOpen}
        onClose={() => {
          setIsAddressDialogOpen(false);
          setSignupContinue(null);
        }}
        userEmail={signupContinue?.email ?? ""}
        registrationToken={signupContinue?.registrationToken}
        signupPassword={signupContinue?.password}
        onSwitchToLogin={() => {
          setSignupContinue(null);
          setIsAddressDialogOpen(false);
          setIsLoginDialogOpen(true);
        }}
      />
    </div>
  );
};

export default CartMain;
