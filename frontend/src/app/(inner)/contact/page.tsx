import type { Metadata } from "next";
import HeaderOne from "@/components/header/Header";
import FooterOne from "@/components/Footer";
import MuraiBreadcrumb from "@/components/murai/MuraiBreadcrumb";
import ContactForm from "@/components/murai/ContactForm";
import ShortService from "@/components/service/ShortService";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/contact");

export default function ContactPage() {
  return (
    <div className="murai-home">
      <HeaderOne />
      <main>
        <MuraiBreadcrumb
          title="Contact Us"
          bannerImage="/assets/images/murai/banners/banner-contact.jpg"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Contact Us" },
          ]}
        />

        <section className="section">
          <div className="container">
            <div className="contact-grid">
              <div>
                <div className="contact-info-card">
                  <h3>Get In Touch</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 24 }}>
                    Questions about a saree, sizing, or your order? We&apos;re here to help.
                  </p>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
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
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
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
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
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
              </div>

              <div className="contact-form-card">
                <h3>Send a Message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <ShortService />
      </main>
      <FooterOne />
    </div>
  );
}
