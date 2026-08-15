"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AddressInfo {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  /** When set with `signupPassword`, completes new signup (creates user + address) — no user row until saved. */
  registrationToken?: string;
  signupPassword?: string;
  onSwitchToLogin: () => void;
}

export default function AddressDialog({
  isOpen,
  onClose,
  userEmail,
  registrationToken,
  signupPassword,
  onSwitchToLogin,
}: AddressDialogProps) {
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setAddressInfo({
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      });
      setErrors({});
      setMessage("");
    }
  }, [isOpen]);

  // Close dialog on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!addressInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (addressInfo.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!addressInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (addressInfo.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!addressInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(addressInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!addressInfo.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!addressInfo.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!addressInfo.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!addressInfo.zip.trim()) {
      newErrors.zip = "Zip code is required";
    }

    if (!addressInfo.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    if (
      typeof registrationToken === "string" &&
      registrationToken.length > 0 &&
      (!signupPassword || signupPassword.length === 0)
    ) {
      setMessage(
        "Registration session incomplete. Close this dialog and verify your email again."
      );
      return;
    }

    const isSignupFinalize =
      typeof registrationToken === "string" &&
      registrationToken.length > 0 &&
      typeof signupPassword === "string" &&
      signupPassword.length > 0;

    if (!isSignupFinalize && !userEmail.trim()) {
      setMessage("Missing account email. Close this dialog and register again.");
      return;
    }

    setIsLoading(true);

    try {
      const billingInfoPayload = {
        firstName: addressInfo.firstName,
        lastName: addressInfo.lastName,
        phone: addressInfo.phone,
        street: addressInfo.street,
        city: addressInfo.city,
        state: addressInfo.state,
        zip: addressInfo.zip,
        country: addressInfo.country,
        company: "",
        orderNotes: "",
      };

      const response = isSignupFinalize
        ? await axios.post(`/api/users/register/complete`, {
            registrationToken,
            password: signupPassword,
            billingInfo: billingInfoPayload,
          })
        : await axios.put(`/api/users`, {
            email: userEmail,
            billingInfo: billingInfoPayload,
          });

      if (response.data?.success) {
        // Show success toast
        toast.success(
          isSignupFinalize
            ? "Registration complete. You can log in now."
            : "Address saved successfully! Redirecting to login..."
        );
        // Wait 2 seconds then close this dialog and open login
        setTimeout(() => {
          onClose();
          onSwitchToLogin();
        }, 100);
      } else {
        setMessage("Failed to save address. Please try again.");
      }
    } catch (error: any) {
      console.error("Error saving address:", error);
      setMessage(
        error.response?.data?.message ||
          "Error saving address. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="address-dialog-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="address-dialog-content"
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            color: "#666",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label="Close dialog"
        >
          <i className="fa-light fa-xmark" />
        </button>

        <div
          className="address-wrapper"
          style={{
            padding: "40px",
          }}
        >
          <h3
            className="title"
            style={{
              textAlign: "center",
              marginBottom: "8px",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            Add Your Address
          </h3>
          <p
            style={{
              textAlign: "center",
              marginBottom: "24px",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Please provide your address details to complete registration
          </p>

          <form onSubmit={handleSubmit}>
            {/* Success/Error Message */}
            {message && (
              <div
                style={{
                  padding: "12px 16px",
                  marginBottom: "20px",
                  borderRadius: "4px",
                  backgroundColor: message.includes("success")
                    ? "#d1fae5"
                    : "#fee2e2",
                  color: message.includes("success") ? "#065f46" : "#dc2626",
                  fontSize: "14px",
                }}
              >
                {message}
              </div>
            )}

            {/* Name Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  First Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={addressInfo.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: errors.firstName
                      ? "2px solid red"
                      : "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
                {errors.firstName && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors.firstName}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={addressInfo.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: errors.lastName
                      ? "2px solid red"
                      : "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
                {errors.lastName && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Phone Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={addressInfo.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: errors.phone ? "2px solid red" : "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              {errors.phone && (
                <span
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Street Address */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Street Address <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="street"
                value={addressInfo.street}
                onChange={handleInputChange}
                placeholder="Street Address"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: errors.street ? "2px solid red" : "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              {errors.street && (
                <span
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.street}
                </span>
              )}
            </div>

            {/* City, State, ZIP Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  City <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={addressInfo.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: errors.city ? "2px solid red" : "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
                {errors.city && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors.city}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  State <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={addressInfo.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: errors.state ? "2px solid red" : "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
                {errors.state && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors.state}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  ZIP Code <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="zip"
                  value={addressInfo.zip}
                  onChange={handleInputChange}
                  placeholder="ZIP"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: errors.zip ? "2px solid red" : "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
                {errors.zip && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {errors.zip}
                  </span>
                )}
              </div>
            </div>

            {/* Country */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Country <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="country"
                value={addressInfo.country}
                onChange={handleInputChange}
                placeholder="Country"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: errors.country
                    ? "2px solid red"
                    : "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              {errors.country && (
                <span
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {errors.country}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="rts-btn btn-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: 500,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Saving..." : "Save & Continue to Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
