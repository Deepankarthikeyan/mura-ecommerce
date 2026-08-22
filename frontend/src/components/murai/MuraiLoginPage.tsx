"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import HeaderOne from "@/components/header/Header";
import FooterOne from "@/components/Footer";
import MuraiBreadcrumb from "@/components/murai/MuraiBreadcrumb";
import MuraiPageAttrs from "@/components/murai/MuraiPageAttrs";
import { useUser } from "@/components/header/UserContext";

export default function MuraiLoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("/api/users", {
        action: "login",
        body: { email, password },
      });
      if (response.data?.success) {
        login(response.data.body);
        const returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          localStorage.removeItem("returnUrl");
          window.location.href = returnUrl;
        } else {
          router.push("/");
        }
      } else {
        setError(response.data?.message || "Login failed. Check your credentials.");
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="murai-home">
      <MuraiPageAttrs page="login" />
      <HeaderOne />
      <main>
        <MuraiBreadcrumb
          title="Login"
          bannerImage="/assets/images/murai/banners/banner-login.jpg"
          crumbs={[{ label: "Home", href: "/" }, { label: "Login" }]}
        />
        <section className="auth-section">
          <div className="auth-card">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to shop and track your orders</p>
            {error ? <p style={{ color: "#cf0653", marginBottom: 16, fontSize: 14 }}>{error}</p> : null}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-check">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <p className="auth-footer">
              Don&apos;t have an account? <Link href="/register">Create Account</Link>
            </p>
          </div>
        </section>
      </main>
      <FooterOne />
    </div>
  );
}
