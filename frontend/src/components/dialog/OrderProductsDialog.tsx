'use client';

import React, { useEffect } from 'react';

export interface OrderProductItem {
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderProductsDialogProps {
  isOpen: boolean;
  orderNo: string;
  items: OrderProductItem[];
  onClose: () => void;
}

function formatMoney(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export default function OrderProductsDialog({
  isOpen,
  orderNo,
  items,
  onClose,
}: OrderProductsDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="order-products-dialog"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="order-products-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-products-dialog-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="order-products-dialog__header">
          <div>
            <h4 id="order-products-dialog-title" className="order-products-dialog__title">
              Order products
            </h4>
            <p className="order-products-dialog__subtitle">{orderNo}</p>
          </div>
          <button
            type="button"
            className="order-products-dialog__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="order-products-dialog__body">
          {items.length === 0 ? (
            <p className="order-products-dialog__empty">No products in this order.</p>
          ) : (
            <div className="order-products-dialog__grid">
              {items.map((item, index) => (
                <article key={index} className="order-products-dialog__card">
                  <div className="order-products-dialog__card-image">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <span className="order-products-dialog__card-placeholder">No image</span>
                    )}
                  </div>
                  <div className="order-products-dialog__card-body">
                    <h5 className="order-products-dialog__card-title">{item.title}</h5>
                    <dl className="order-products-dialog__card-meta">
                      <div>
                        <dt>Qty</dt>
                        <dd>{item.quantity}</dd>
                      </div>
                      <div>
                        <dt>Price</dt>
                        <dd>{formatMoney(item.price)}</dd>
                      </div>
                      <div>
                        <dt>Total</dt>
                        <dd>{formatMoney(item.price * item.quantity)}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="order-products-dialog__footer">
          <button type="button" className="order-products-dialog__footer-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
