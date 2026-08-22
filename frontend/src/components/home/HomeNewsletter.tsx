"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function HomeNewsletter() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-inner">
        <h2>Join Our Newsletter</h2>
        <p>Enter your email address to subscribe our notification of our new post &amp; features by email.</p>
        {submitted ? (
          <p>Thank you for subscribing!</p>
        ) : (
          <form className="newsletter-form-large newsletter-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}
