"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useUser } from "@/components/header/UserContext";
import RegisterDialog from "@/components/auth/RegisterDialog";
import MuraiLayout from "./MuraiLayout";
import { dashboardLandingPath, isStaffLike } from "@/lib/dashboardPaths";
import { toast } from "react-toastify";

type View = "login" | "forgot-email" | "forgot-otp" | "forgot-password";

interface ValidationErrors {
  email?: string;
  password?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const strongPassword = (value: string): boolean => {
  const minLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
  return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

export default function MuraiLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useUser();

  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resendSecs, setResendSecs] = useState(0);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (resendSecs <= 0) return undefined;
    const t = window.setInterval(() => setResendSecs((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [resendSecs]);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: ValidationErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await axios.post(`/api/users`, {
        action: "login",
        body: { email, password },
      });

      if (response.data?.success) {
        const userData = response.data?.body;
        login(userData);
        toast.success(`Welcome back, ${userData.username || userData.email}!`);

        const returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          localStorage.removeItem("returnUrl");
          window.location.href = returnUrl;
        } else if (isStaffLike(userData.userType)) {
          router.push(dashboardLandingPath(userData.userType));
        } else {
          router.push("/");
        }
      } else {
        setSubmitError(response.data?.message || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setSubmitError("Invalid email or password. Please try again.");
      } else if (error.response?.status === 404) {
        setSubmitError("User not found. Please check your email or register.");
      } else {
        setSubmitError(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (e?: FormEvent) => {
    e?.preventDefault();
    const newErrors: ValidationErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await axios.post("/api/users/forgot-password/send-otp", {
        email: email.trim(),
      });
      toast.success("Verification code sent to your email.");
      setView("forgot-otp");
      setOtpCode("");
      setResendSecs(60);
      setErrors((prev) => ({ ...prev, otp: undefined }));
    } catch (error: any) {
      setSubmitError(
        error.response?.data?.message || "Failed to send verification code. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
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
      const response = await axios.post("/api/users/forgot-password/verify", {
        email: email.trim(),
        otp: digits,
      });
      setResetToken(response.data?.resetToken || "");
      toast.success("Code verified. Set your new password.");
      setView("forgot-password");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: ValidationErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (!strongPassword(newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await axios.post("/api/users/forgot-password/reset", {
        resetToken,
        password: newPassword,
      });
      toast.success("Password updated successfully. Please log in.");
      setView("login");
      setPassword("");
      setOtpCode("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setSubmitError("");
      setErrors({});
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const authTitle =
    view === "login"
      ? "Welcome Back"
      : view === "forgot-email"
        ? "Forgot Password"
        : view === "forgot-otp"
          ? "Verify OTP"
          : "Reset Password";

  const authSubtitle =
    view === "login"
      ? "Sign in to shop sale sarees and track your orders"
      : view === "forgot-email"
        ? "Enter your email to receive a one-time password"
        : view === "forgot-otp"
          ? "Enter the OTP sent to your email"
          : "Choose a new password for your account";

  return (
    <MuraiLayout activePage="login">
      <section className="breadcrumb__section">
        <div className="breadcrumb__bg">
          <img
            className="breadcrumb__bg-image"
            src="/murai/images/banners/banner-login.jpg"
            alt=""
            width={1600}
            height={334}
          />
          <div className="container">
            <div className="breadcrumb__content">
              <h1 className="breadcrumb__content--title">Login</h1>
              <ul className="breadcrumb__content--menu">
                <li className="breadcrumb__content--menu__items">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb__content--menu__items">
                  <span>Login</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-section">
        <div className="auth-card">
          <h2 className="auth-title">{authTitle}</h2>
          <p className="auth-subtitle">{authSubtitle}</p>

          {submitError ? (
            <p style={{ color: "#cf0653", fontSize: 14, marginBottom: 16, textAlign: "center" }}>
              {submitError}
            </p>
          ) : null}

          {view === "login" ? (
            <form id="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  required
                />
                {errors.email ? (
                  <span style={{ color: "#cf0653", fontSize: 13, marginTop: 4, display: "block" }}>
                    {errors.email}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  required
                />
                {errors.password ? (
                  <span style={{ color: "#cf0653", fontSize: 13, marginTop: 4, display: "block" }}>
                    {errors.password}
                  </span>
                ) : null}
              </div>
              <div className="form-check">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : null}

          {view === "forgot-email" ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label htmlFor="forgot-email">Email Address</label>
                <input
                  type="email"
                  id="forgot-email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email ? (
                  <span style={{ color: "#cf0653", fontSize: 13, marginTop: 4, display: "block" }}>
                    {errors.email}
                  </span>
                ) : null}
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send OTP"}
              </button>
              <p className="auth-footer" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-link"
                  style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer" }}
                  onClick={() => {
                    setView("login");
                    setSubmitError("");
                    setErrors({});
                  }}
                >
                  ← Back to login
                </button>
              </p>
            </form>
          ) : null}

          {view === "forgot-otp" ? (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label htmlFor="otp">OTP Code</label>
                <input
                  type="text"
                  id="otp"
                  className="form-control"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                />
                {errors.otp ? (
                  <span style={{ color: "#cf0653", fontSize: 13, marginTop: 4, display: "block" }}>
                    {errors.otp}
                  </span>
                ) : null}
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
              <p className="auth-footer" style={{ marginTop: 16 }}>
                {resendSecs > 0 ? (
                  <span>Resend OTP in {resendSecs}s</span>
                ) : (
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer" }}
                    onClick={() => handleSendOtp()}
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </form>
          ) : null}

          {view === "forgot-password" ? (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                {errors.newPassword ? (
                  <span style={{ color: "#cf0653", fontSize: 13, marginTop: 4, display: "block" }}>
                    {errors.newPassword}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {errors.confirmPassword ? (
                  <span style={{ color: "#cf0653", fontSize: 13, marginTop: 4, display: "block" }}>
                    {errors.confirmPassword}
                  </span>
                ) : null}
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Reset Password"}
              </button>
            </form>
          ) : null}

          {view === "login" ? (
            <>
              <div className="auth-divider">or continue with</div>
              <div className="social-login">
                <button className="social-btn" type="button" aria-label="Sign in with Google">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button className="social-btn" type="button" aria-label="Sign in with Facebook">
                  <svg width="18" height="18" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              <p className="auth-footer">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--color-primary)", fontWeight: 600, cursor: "pointer", padding: 0 }}
                  onClick={() => setRegisterOpen(true)}
                >
                  Create Account
                </button>
              </p>
              <p className="auth-footer" style={{ marginTop: 8 }}>
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", padding: 0 }}
                  onClick={() => {
                    setView("forgot-email");
                    setSubmitError("");
                    setErrors({});
                  }}
                >
                  Forgot your password?
                </button>
              </p>
            </>
          ) : null}
        </div>
      </section>

      <RegisterDialog
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => setRegisterOpen(false)}
      />
    </MuraiLayout>
  );
}
