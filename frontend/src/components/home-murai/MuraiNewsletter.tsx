"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function MuraiNewsletter() {
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
    <section className="newsletter-section">
      <div className="newsletter-inner">
        <h2>Join Our Newsletter</h2>
        <p>Enter your email address to subscribe our notification of our new post & features by email.</p>
        <form className="newsletter-form-large" onSubmit={handleSubmit}>
          <input
            className="newsletter-input"
            type="email"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <button className="newsletter-submit" type="submit" disabled={submitting}>
            {submitting ? "…" : "SUBSCRIBE"}
          </button>
        </form>
      </div>
    </section>
  );
}
