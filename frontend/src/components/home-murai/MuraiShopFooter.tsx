"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

export default function MuraiShopFooter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error("Please enter your email address.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post<{ success?: boolean; message?: string }>("/api/newsletter", {
        email: value,
      });
      if (!data?.success) {
        toast.error(data?.message || "Could not subscribe.");
        return;
      }
      toast.success(data.message || "Subscribed successfully.");
      setEmail("");
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : "Could not subscribe.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="shop-footer">
      <div className="shop-footer-grid">
        <div className="shop-footer-brand">
          <Link href="/" className="shop-footer-logo" aria-label="MuRa@23">
            <img src="/murai/mura-newlogo.png" alt="MuRa@23" width={108} height={67} loading="lazy" decoding="async" />
          </Link>
          <p>India&apos;s finest sale sarees — silk, cotton, Banarasi, Kanjivaram and designer sarees.</p>
          <div className="shop-footer-social">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1z" /></svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M14.7 10.3 22 2h-2.2l-6 6.9L9.2 2H2l7.7 11.2L2 22h2.2l6.5-7.4L14.7 22H22l-7.3-11.7z" /></svg>
            </a>
          </div>
        </div>
        <div className="shop-footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-condition">Terms &amp; Conditions</Link></li>
            <li><Link href="/shipping-policy">Shipping &amp; Returns</Link></li>
          </ul>
        </div>
        <div className="shop-footer-col">
          <h4>Saree Types</h4>
          <ul>
            <li><Link href="/shop?category=Silk+Sarees">Silk Sarees</Link></li>
            <li><Link href="/shop?category=Cotton+Sarees">Cotton Sarees</Link></li>
            <li><Link href="/shop?category=Banarasi">Banarasi</Link></li>
            <li><Link href="/shop?category=Kanjivaram">Kanjivaram</Link></li>
          </ul>
        </div>
        <div className="shop-footer-col">
          <h4>Newsletter</h4>
          <p>Subscribe for exclusive offers.</p>
          <form className="shop-footer-join" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
            <button type="submit" disabled={submitting}>
              JOIN
            </button>
          </form>
        </div>
      </div>
      <div className="shop-footer-bottom">
        <p>&copy; 2026 MuRa@23. All rights reserved.</p>
        <p>Handcrafted with love in India</p>
      </div>
    </footer>
  );
}
