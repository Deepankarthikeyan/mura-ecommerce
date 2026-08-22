'use client';

import React from 'react';
import { MURAI_THEME } from "@/data/theme";
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';






const CartDropdown: React.FC = () => {
  const { cartItems, removeFromCart } = useCart();

  const router = useRouter();

  const activeItems = cartItems.filter((item) => item.active);
  const totalQty = activeItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const total = activeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 125;
  const remaining = freeShippingThreshold - total;

  return (
    <div
      className="btn-border-only cart category-hover-header"
      style={{
        paddingLeft: '16px',
        paddingRight: '16px',
        minWidth: 'fit-content',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        borderRadius: '4px',
        padding: '8px 16px',
        border: `2px solid ${MURAI_THEME.primary}`,
        color: MURAI_THEME.primary
      }}
      onClick={() => router.push('/cart')}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = MURAI_THEME.primary;
        e.currentTarget.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = MURAI_THEME.primary;
      }}
    >
      <i className="fa-sharp fa-regular fa-cart-shopping" />
      <span className="text">Cart</span>
      {totalQty > 0 && (
        <span className="number" style={{
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '50%',
          minWidth: '22px',
          height: '22px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          marginLeft: '6px',
          padding: '0 6px',
          aspectRatio: '1 / 1'
        }}>
          {totalQty}
        </span>
      )}
      {/* <span className="number">{activeItems.length}</span>

      <div className="category-sub-menu card-number-show">
        <h5 className="shopping-cart-number">
          Shopping Cart ({activeItems.length.toString().padStart(2, '0')})
        </h5>

        {activeItems.map((item) => (
          <div key={item.id} className="cart-item-1 border-top">
            <div className="img-name">
              <div className="close section-activation" onClick={() => removeFromCart(item.id)}>
                <i className="fa-regular fa-trash-can" />
              </div>
              <div className="thumbanil">
                <Image src={item.image} alt={item.title} width={60} height={60} />
              </div>
              <div className="details">
                <Link href='/shop/details-profitable-business-makes-your-profit'>
                  <h5 className="title">{item.title}</h5>
                </Link>
                <div className="number">
                  <span className='p-1 border-1 border-rounded-lg text-black'>Quantity : {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="sub-total-cart-balance">
          <div className="bottom-content-deals mt--10">
            <div className="top">
              <span>Sub Total:</span>
              <span className="number-c">₹{total.toFixed(2)}</span>
            </div>
            <div className="single-progress-area-incard">
              <div className="progress">
                <div
                  className="progress-bar wow fadeInLeft"
                  role="progressbar"
                  style={{
                    width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            {total < freeShippingThreshold && (
              <p>
                Spend More <span>₹{remaining.toFixed(2)}</span> to reach{' '}
                <span>Free Shipping</span>
              </p>
            )}
          </div>

          <div className="button-wrapper d-flex align-items-center justify-content-between">
            <Link href="/cart" className="rts-btn btn-primary">
              View Cart
            </Link>
            <Link href="/checkout" className="rts-btn btn-primary border-only">
              CheckOut
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CartDropdown;
