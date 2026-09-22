"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { NewsletterConfig } from "@/lib/homepageSections";
import "./NewsletterBanner.css";

type NewsletterBannerProps = {
  config: NewsletterConfig;
  preview?: boolean;
};

export default function NewsletterBanner({ config, preview = false }: NewsletterBannerProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (preview) return;
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
    <section className={`newsletter-banner${preview ? " is-preview" : ""}`}>
      <div className="newsletter-banner__inner">
        <h2 className="newsletter-banner__title">{config.title || "Join Our Newsletter"}</h2>
        {config.description.trim() ? <p className="newsletter-banner__copy">{config.description}</p> : null}
        <form className="newsletter-banner__form" onSubmit={handleSubmit}>
          <input
            className="newsletter-banner__input"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={config.placeholder || "Enter your email address"}
            disabled={preview || submitting}
            aria-label="Email address"
          />
          <button className="newsletter-banner__submit" type="submit" disabled={preview || submitting}>
            {submitting ? "…" : config.buttonLabel || "SUBSCRIBE"}
          </button>
        </form>
      </div>
    </section>
  );
}
