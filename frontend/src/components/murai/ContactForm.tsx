"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return <p>Thank you! We&apos;ll get back to you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Your Name</label>
        <input id="name" className="form-control" type="text" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input id="email" className="form-control" type="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input id="subject" className="form-control" type="text" required />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" className="form-control" rows={5} required />
      </div>
      <button type="submit" className="btn btn-primary">
        Send Message
      </button>
    </form>
  );
}
