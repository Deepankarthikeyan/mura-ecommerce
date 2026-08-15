'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BillingInfo {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  orderNotes: string;
}

interface ValidationErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

interface BillingEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  billingInfo: BillingInfo;
  onSave: (updatedBilling: BillingInfo) => void;
  userEmail?: string;
}

export default function BillingEditDialog({ 
  isOpen, 
  onClose, 
  billingInfo: initialBilling, 
  onSave,
  userEmail 
}: BillingEditDialogProps) {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>(initialBilling);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setBillingInfo(initialBilling);
      setErrors({});
      setMessage('');
    }
  }, [isOpen, initialBilling]);

  // Close dialog on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when dialog is open
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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!billingInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(billingInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!billingInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (billingInfo.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!billingInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (billingInfo.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!billingInfo.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!billingInfo.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!billingInfo.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!billingInfo.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!billingInfo.zip.trim()) {
      newErrors.zip = "Zip code is required";
    }

    if (!billingInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(billingInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Save to database via API
      const response = await axios.put(`/api/users`, {
        email: userEmail || billingInfo.email,
        billingInfo: {
          firstName: billingInfo.firstName,
          lastName: billingInfo.lastName,
          company: billingInfo.company,
          country: billingInfo.country,
          street: billingInfo.street,
          city: billingInfo.city,
          state: billingInfo.state,
          zip: billingInfo.zip,
          phone: billingInfo.phone,
          orderNotes: billingInfo.orderNotes,
        }
      });

      if (response.data?.success) {
        setMessage('Billing information updated successfully!');
        onSave(billingInfo);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setMessage('Failed to update billing information. Please try again.');
      }
    } catch (error: any) {
      console.error('Error saving billing info:', error);
      setMessage(error.response?.data?.message || 'Error updating billing information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="billing-dialog-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="billing-dialog-content"
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 16px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'nowrap',
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}>
              Edit Billing Details
            </h2>
            <button
              onClick={onClose}
              style={{
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                width: '28px',
                height: '28px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e5e7eb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p style={{
            margin: '8px 0 0 0',
            color: '#6b7280',
            fontSize: '14px',
          }}>
            Update your billing information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px' }}>
          {/* Success/Error Message */}
          {message && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '20px',
              borderRadius: '8px',
              backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
              color: message.includes('success') ? '#065f46' : '#dc2626',
              fontSize: '14px',
            }}>
              {message}
            </div>
          )}

          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                First Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={billingInfo.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.firstName ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
              {errors.firstName && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.firstName}
                </span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                Last Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={billingInfo.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.lastName ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.lastName && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Email & Phone Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                Email Address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={billingInfo.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.email && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                Phone Number <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={billingInfo.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.phone ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.phone && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {/* Company */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}>
              Company (Optional)
            </label>
            <input
              type="text"
              name="company"
              value={billingInfo.company}
              onChange={handleInputChange}
              placeholder="Company Name"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}>
              Street Address <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="street"
              value={billingInfo.street}
              onChange={handleInputChange}
              placeholder="Street Address"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.street ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {errors.street && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.street}
              </span>
            )}
          </div>

          {/* City, State, ZIP Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                City <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={billingInfo.city}
                onChange={handleInputChange}
                placeholder="City"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.city ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.city && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.city}
                </span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                State <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="state"
                value={billingInfo.state}
                onChange={handleInputChange}
                placeholder="State"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.state ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.state && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.state}
                </span>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                ZIP Code <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                name="zip"
                value={billingInfo.zip}
                onChange={handleInputChange}
                placeholder="ZIP Code"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: errors.zip ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.zip && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.zip}
                </span>
              )}
            </div>
          </div>

          {/* Country */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}>
              Country <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              name="country"
              value={billingInfo.country}
              onChange={handleInputChange}
              placeholder="Country"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: errors.country ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            {errors.country && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.country}
              </span>
            )}
          </div>

          {/* Order Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}>
              Order Notes (Optional)
            </label>
            <textarea
              name="orderNotes"
              value={billingInfo.orderNotes}
              onChange={handleInputChange}
              placeholder="Any special instructions for your order..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e7eb',
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: '#fff',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '6px',
                background: '#629D23',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.background = '#557d1f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#629D23';
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
