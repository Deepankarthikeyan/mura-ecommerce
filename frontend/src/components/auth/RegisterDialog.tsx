"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Step = "details" | "otp";

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  otp?: string;
}

export type RegistrationReadyPayload = {
  email: string;
  registrationToken: string;
  password: string;
};

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess?: (payload: RegistrationReadyPayload) => void;
}

export default function RegisterDialog({ isOpen, onClose, onSwitchToLogin, onRegisterSuccess }: RegisterDialogProps) {
  const [step, setStep] = useState<Step>("details");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resendSecs, setResendSecs] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setUsername("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setOtpCode("");
      setErrors({});
      setSubmitError("");
      setIsSubmitting(false);
      setStep("details");
      setResendSecs(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendSecs <= 0) return undefined;
    const t = window.setInterval(() => setResendSecs((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [resendSecs]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

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

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    const minLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  };

  const validateUsername = (value: string): boolean => {
    return value.trim().length >= 3;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (!validateUsername(username)) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await axios.post("/api/users/register/send-otp", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      toast.success("We sent a 6-digit code to your email.");
      setStep("otp");
      setOtpCode("");
      setErrors((prev) => ({ ...prev, otp: undefined }));
      setResendSecs(60);
    } catch (error: any) {
      if (error.response) {
        const serverMessage = error.response.data?.message;
        if (error.response.status === 409) {
          setSubmitError(serverMessage || "User with this email already exists.");
        } else if (error.response.status === 400 || error.response.status === 503) {
          setSubmitError(serverMessage || "Could not send the code. Check your email settings or try again.");
        } else {
          setSubmitError(serverMessage || "Could not send verification code.");
        }
      } else if (error.request) {
        setSubmitError("Network error. Please check your connection and try again.");
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const digits = otpCode.replace(/\D/g, "").slice(0, 6);
    if (digits.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "Enter the 6-digit code from your email" }));
      return;
    }
    setErrors((prev) => ({ ...prev, otp: undefined }));
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await axios.post("/api/users/register/verify", {
        email: email.trim(),
        otp: digits,
      });

      const token = response.data?.registrationToken as string | undefined;
      if (response.data?.success && token) {
        toast.success(response.data?.message || "Email verified! Add your address next.");
        const normalized = email.trim().toLowerCase();
        if (onRegisterSuccess) {
          onRegisterSuccess({
            email: normalized,
            registrationToken: token,
            password,
          });
        } else {
          onClose();
          onSwitchToLogin();
        }
      } else {
        setSubmitError(
          response.data?.message || "Verification succeeded but setup was incomplete — try again."
        );
      }
    } catch (error: any) {
      if (error.response) {
        setSubmitError(error.response.data?.message || "Invalid or expired code.");
      } else if (error.request) {
        setSubmitError("Network error. Please check your connection.");
      } else {
        setSubmitError("Verification failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendSecs > 0 || !validateForm()) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await axios.post("/api/users/register/send-otp", {
        username: username.trim(),
        email: email.trim(),
        password,
      });
      toast.info("A new verification code was sent.");
      setResendSecs(60);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Could not resend code.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const title =
    step === "details"
      ? "Register Into Your Account"
      : "Verify your email";

  return (
    <div
      className="register-dialog-overlay"
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
        className="register-dialog-content"
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
          className="registration-wrapper-1"
          style={{
            padding: "40px",
          }}
        >
          <h3
            className="title"
            style={{
              textAlign: "center",
              marginBottom: "24px",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            {title}
          </h3>

          {step === "details" ? (
          <form action="#" className="registration-form" onSubmit={handleSendOtp}>
            <div className="input-wrapper" style={{ marginBottom: "16px" }}>
              <label htmlFor="username" style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Username<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
                }}
                style={{
                  border: errors.username ? "2px solid red" : "1px solid #ccc",
                  transition: "border-color 0.3s ease",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              {errors.username && (
                <span
                  className="error-message"
                  style={{ color: "red", fontSize: "14px", marginTop: "5px", display: "block" }}
                >
                  {errors.username}
                </span>
              )}
            </div>
            <div className="input-wrapper" style={{ marginBottom: "16px" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Email<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                style={{
                  border: errors.email ? "2px solid red" : "1px solid #ccc",
                  transition: "border-color 0.3s ease",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              {errors.email && (
                <span
                  className="error-message"
                  style={{ color: "red", fontSize: "14px", marginTop: "5px", display: "block" }}
                >
                  {errors.email}
                </span>
              )}
            </div>
            <div className="input-wrapper" style={{ marginBottom: "16px" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Password<span style={{ color: "red" }}>*</span>
              </label>
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  style={{
                    border: errors.password ? "2px solid red" : "1px solid #ccc",
                    transition: "border-color 0.3s ease",
                    width: "100%",
                    padding: "12px 44px 12px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "12px",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    color: "#666",
                    fontSize: "16px",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "24px",
                    height: "24px",
                    minWidth: "24px",
                    zIndex: 1,
                  }}
                >
                  <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
                </button>
              </div>
              {!errors.password && (
                <span
                  className="password-hint"
                  style={{ color: "#666", fontSize: "12px", marginTop: "5px", display: "block" }}
                >
                  Must be at least 8 characters with uppercase, lowercase, number, and special character
                </span>
              )}
              {errors.password && (
                <span
                  className="error-message"
                  style={{ color: "red", fontSize: "14px", marginTop: "5px", display: "block" }}
                >
                  {errors.password}
                </span>
              )}
            </div>
            {submitError && (
              <div
                className="submit-error-message"
                style={{
                  color: "red",
                  fontSize: "14px",
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#fee2e2",
                  borderRadius: "4px",
                  border: "1px solid #ef4444",
                }}
              >
                {submitError}
              </div>
            )}
            <button
              type="submit"
              className="rts-btn btn-primary"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                marginTop: "8px",
              }}
            >
              {isSubmitting ? "Sending code..." : "Register Account"}
            </button>
            <div
              className="another-way-to-registration"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #eee",
                whiteSpace: "nowrap",
              }}
            >
              <span>Already Have Account?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToLogin();
                }}
                style={{
                  color: "#007bff",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "inherit",
                  marginLeft: "8px",
                }}
              >
                Login
              </button>
            </div>
          </form>
          ) : (
          <form action="#" className="registration-form" onSubmit={handleVerifyOtp}>
            <p style={{ color: "#555", fontSize: "14px", marginBottom: "16px", textAlign: "center" }}>
              Enter the code we sent to <strong>{email.trim()}</strong>. It expires in 10 minutes.
            </p>
            <div className="input-wrapper" style={{ marginBottom: "16px" }}>
              <label htmlFor="otp" style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                Verification code<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtpCode(v);
                  if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
                }}
                placeholder="000000"
                style={{
                  border: errors.otp ? "2px solid red" : "1px solid #ccc",
                  letterSpacing: "0.4em",
                  textAlign: "center",
                  fontSize: "20px",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "4px",
                }}
              />
              {errors.otp && (
                <span
                  className="error-message"
                  style={{ color: "red", fontSize: "14px", marginTop: "5px", display: "block" }}
                >
                  {errors.otp}
                </span>
              )}
            </div>
            {submitError && (
              <div
                className="submit-error-message"
                style={{
                  color: "red",
                  fontSize: "14px",
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#fee2e2",
                  borderRadius: "4px",
                  border: "1px solid #ef4444",
                }}
              >
                {submitError}
              </div>
            )}
            <button
              type="submit"
              className="rts-btn btn-primary"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                marginTop: "8px",
              }}
            >
              {isSubmitting ? "Verifying..." : "Verify & continue"}
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                disabled={resendSecs > 0 || isSubmitting}
                onClick={handleResendCode}
                style={{
                  background: "none",
                  border: "none",
                  color: resendSecs > 0 ? "#999" : "#007bff",
                  cursor: resendSecs > 0 ? "default" : "pointer",
                  textDecoration: "underline",
                  fontSize: "14px",
                }}
              >
                {resendSecs > 0 ? `Resend code (${resendSecs}s)` : "Resend code"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setSubmitError("");
                  setOtpCode("");
                  setErrors((prev) => ({ ...prev, otp: undefined }));
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ← Back to edit details
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
