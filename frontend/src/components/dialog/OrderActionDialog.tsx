'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent, useRef } from 'react';
import { OrderProductItem } from '@/components/dialog/OrderProductsDialog';

export type OrderActionType = 'cancel' | 'return' | 'refund';

export interface OrderActionSelectedProduct {
  title: string;
  quantity: number;
  price: number;
}

const ACTION_LABELS: Record<OrderActionType, string> = {
  cancel: 'Cancellation',
  return: 'Return',
  refund: 'Refund',
};

interface OrderActionDialogProps {
  isOpen: boolean;
  action: OrderActionType | null;
  orderNo: string;
  items: OrderProductItem[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    reason: string;
    file?: File;
    selectedProducts?: OrderActionSelectedProduct[];
  }) => void;
}

function formatMoney(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export default function OrderActionDialog({
  isOpen,
  action,
  orderNo,
  items,
  isSubmitting,
  onClose,
  onSubmit,
}: OrderActionDialogProps) {
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{ reason?: string; file?: string; products?: string }>({});

  const productSelectRef = useRef<HTMLDivElement>(null);

  const needsProductSelection = false; // return/refund product picker hidden for now
  const needsSupportingDocument = action === 'return';
  const availableProductIndexes = items
    .map((_, index) => index)
    .filter((index) => !selectedIndexes.includes(index));

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setFile(null);
      setSelectedIndexes([]);
      setProductDropdownOpen(false);
      setErrors({});
    }
  }, [isOpen, action, orderNo]);

  useEffect(() => {
    if (!productDropdownOpen) return;
    const closeDropdown = (e: MouseEvent) => {
      if (!productSelectRef.current?.contains(e.target as Node)) {
        setProductDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, [productDropdownOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isSubmitting, onClose]);

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

  if (!isOpen || !action) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) {
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
  };

  const addProduct = (index: number) => {
    setSelectedIndexes((prev) => (prev.includes(index) ? prev : [...prev, index]));
    setProductDropdownOpen(false);
    setErrors((prev) => ({ ...prev, products: undefined }));
  };

  const removeProduct = (index: number) => {
    setSelectedIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: { reason?: string; file?: string; products?: string } = {};

    if (!reason.trim()) {
      nextErrors.reason = 'Please provide a reason for your request.';
    }
    if (needsSupportingDocument && !file) {
      nextErrors.file = 'Please upload a supporting document.';
    }
    if (needsProductSelection) {
      if (items.length === 0) {
        nextErrors.products = 'This order has no products to select.';
      } else if (selectedIndexes.length === 0) {
        nextErrors.products = 'Please select at least one product.';
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const selectedProducts = needsProductSelection
      ? selectedIndexes.map((index) => ({
          title: items[index].title,
          quantity: items[index].quantity,
          price: items[index].price,
        }))
      : undefined;

    onSubmit({
      reason: reason.trim(),
      file: file ?? undefined,
      selectedProducts,
    });
  };

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 10050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-action-dialog-title"
        className="order-action-dialog__panel"
        style={{ maxWidth: needsProductSelection ? 520 : 480 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="order-action-dialog__header">
          <h4
            id="order-action-dialog-title"
            className="order-action-dialog__title"
          >
            {ACTION_LABELS[action]} request
          </h4>
          <p className="order-action-dialog__subtitle">
            Order <strong>{orderNo}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="order-action-dialog__form">
          <div className="order-action-dialog__body">
          {needsProductSelection && (
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="order-action-products-trigger"
                style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}
              >
                Products <span style={{ color: '#dc2626' }}>*</span>
              </label>
              {items.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>No products found for this order.</p>
              ) : (
                <>
                  <div
                    ref={productSelectRef}
                    className={`order-action-product-select${errors.products ? ' order-action-product-select--error' : ''}`}
                  >
                    <button
                      id="order-action-products-trigger"
                      type="button"
                      className="order-action-product-select__trigger"
                      onClick={() => setProductDropdownOpen((open) => !open)}
                      disabled={isSubmitting || availableProductIndexes.length === 0}
                      aria-expanded={productDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      {availableProductIndexes.length === 0
                        ? 'All products added'
                        : 'Select a product'}
                      <span className="order-action-product-select__chevron" aria-hidden="true">
                        ▾
                      </span>
                    </button>
                    {productDropdownOpen && availableProductIndexes.length > 0 && (
                      <ul className="order-action-product-select__menu" role="listbox">
                        {availableProductIndexes.map((index) => {
                          const item = items[index];
                          return (
                            <li key={index} role="option">
                              <button
                                type="button"
                                className="order-action-product-select__option"
                                onClick={() => addProduct(index)}
                              >
                                <span className="order-action-product-select__option-title">{item.title}</span>
                                <span className="order-action-product-select__option-meta">
                                  Qty: {item.quantity} · {formatMoney(item.price * item.quantity)}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {selectedIndexes.length > 0 && (
                    <div className="order-action-product-select__selected">
                      {selectedIndexes.map((index) => {
                        const item = items[index];
                        return (
                          <div key={index} className="order-action-product-select__chip">
                            <div className="order-action-product-select__chip-text">
                              <span className="order-action-product-select__chip-title">{item.title}</span>
                              <span className="order-action-product-select__chip-meta">
                                Qty: {item.quantity} · {formatMoney(item.price * item.quantity)}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="order-action-product-select__chip-remove"
                              onClick={() => removeProduct(index)}
                              disabled={isSubmitting}
                              aria-label={`Remove ${item.title}`}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
              {errors.products && (
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#dc2626' }}>{errors.products}</p>
              )}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="order-action-reason"
              style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}
            >
              Reason <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              id="order-action-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, reason: undefined }));
                }
              }}
              rows={4}
              placeholder="Describe why you are requesting this action..."
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.reason ? '#dc2626' : '#d1d5db'}`,
                borderRadius: 8,
                fontSize: 14,
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            {errors.reason && (
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#dc2626' }}>{errors.reason}</p>
            )}
          </div>

          {needsSupportingDocument && (
            <div style={{ marginBottom: 24 }}>
              <label
                htmlFor="order-action-file"
                style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#374151' }}
              >
                Supporting document <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="order-action-file"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  fontSize: 14,
                  padding: '8px 0',
                }}
              />
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#9ca3af' }}>
                Accepted: images, PDF, Word (max 5 MB)
              </p>
              {errors.file && (
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#dc2626' }}>{errors.file}</p>
              )}
            </div>
          )}
          </div>

          <div className="order-action-dialog__footer">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="order-action-dialog__btn order-action-dialog__btn--secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="order-action-dialog__btn order-action-dialog__btn--primary"
            >
              {isSubmitting ? 'Submitting…' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
