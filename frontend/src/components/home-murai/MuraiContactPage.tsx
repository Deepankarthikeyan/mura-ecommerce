"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";

const HOURS = [
  { day: "Monday – Friday", time: "10:00 AM – 8:00 PM" },
  { day: "Saturday", time: "10:00 AM – 9:00 PM" },
  { day: "Sunday", time: "11:00 AM – 7:00 PM" },
];

export default function MuraiContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    toast.success("Thank you. We'll get back to you shortly.");
    event.currentTarget.reset();
    setSubmitting(false);
  };

  return (
    <div className="murai-home" data-page="contact">
      <MuraiHeader />
      <main>
        <section className="breadcrumb__section">
          <div className="breadcrumb__bg">
            <img
              className="breadcrumb__bg-image"
              src="/murai/banners/banner-contact.jpg"
              alt=""
              width={1600}
              height={334}
              decoding="async"
            />
            <div className="container">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title">Contact Us</h1>
                <ul className="breadcrumb__content--menu">
                  <li className="breadcrumb__content--menu__items">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span>Contact Us</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="contact-grid">
              <div>
                <div className="contact-info-card">
                  <h3>Get In Touch</h3>
                  <p className="contact-lead">
                    Questions about a saree, sizing, or your order? We&apos;re here to help with all
                    sale saree inquiries.
                  </p>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4>Visit Our Store</h4>
                      <p>
                        Podanur
                        <br />
                        Coimbatore, Tamil Nadu 641023, India
                      </p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h4>Call Us</h4>
                      <p>
                        <a href="tel:02123333444">02 123 333 444</a>
                        <br />
                        Mon–Sat, 9 AM – 6 PM IST
                      </p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h4>Email Us</h4>
                      <p>
                        <a href="mailto:murapodanur@gmail.com">murapodanur@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="contact-info-card">
                  <h3>Store Hours</h3>
                  <div className="hours-list">
                    {HOURS.map((row) => (
                      <p key={row.day} className="hours-row">
                        <span>{row.day}</span>
                        <span>{row.time}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="contact-form-card">
                <h2>Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first-name">First Name</label>
                      <input
                        type="text"
                        id="first-name"
                        name="firstName"
                        className="form-control"
                        placeholder="Your first name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="last-name">Last Name</label>
                      <input
                        type="text"
                        id="last-name"
                        name="lastName"
                        className="form-control"
                        placeholder="Your last name"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      className="form-control"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select id="subject" name="subject" className="form-control" defaultValue="General Inquiry">
                      <option>General Inquiry</option>
                      <option>Order Support</option>
                      <option>Returns &amp; Exchanges</option>
                      <option>Wholesale / Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows={5}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div className="map-container">
              <iframe
                src="https://maps.google.com/maps?q=Podanur%20Coimbatore%20Tamil%20Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MuRa@23 Store Location"
              />
            </div>
          </div>
        </section>
      </main>
      <MuraiShopBenefits />
      <MuraiShopFooter />
    </div>
  );
}
