import Link from "next/link";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";
import { SITE_NAME } from "@/lib/brand";

export default function MuraiPrivacyPolicyPage() {
  return (
    <div className="murai-home" data-page="policy">
      <MuraiHeader />
      <main>
        <section className="breadcrumb__section">
          <div className="breadcrumb__bg">
            <img
              className="breadcrumb__bg-image"
              src="/murai/banners/banner-shop.jpg"
              alt=""
              width={1600}
              height={334}
              decoding="async"
            />
            <div className="container">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title">Privacy Policy</h1>
                <ul className="breadcrumb__content--menu">
                  <li className="breadcrumb__content--menu__items">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span>Privacy Policy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section policy-section">
          <article className="policy-card">
            <p>
              At {SITE_NAME}, a brand of Thugil Garments, we are committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your personal information
              when you visit our website www.mura23.com, use our services, or interact with us. By using our
              website, you agree to the terms of this Privacy Policy.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <p><strong>Personal Information:</strong> Name, phone number, shipping and billing address, payment
              details (processed securely through third-party gateways).</p>
            <p><strong>Non-Personal Information:</strong> IP address, browser type and version, device
              information, pages visited and time spent on the site, referring website/source.</p>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Send order and shipping updates</li>
              <li>Improve our website and customer experience</li>
              <li>Respond to customer support requests</li>
              <li>Send promotional messages (if you have opted in)</li>
              <li>Prevent fraud or misuse</li>
            </ul>

            <h2>3. How We Share Your Information</h2>
            <ul>
              <li>Trusted service providers (e.g., logistics partners, payment gateways) for order processing</li>
              <li>Legal authorities, as required by law</li>
              <li>In the event of a business transfer (e.g., merger or acquisition)</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information. While we follow industry
              standards, no method of transmission over the internet or electronic storage is completely secure.
            </p>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>
              We may use cookies and similar technologies to save your preferences, analyze website traffic, and
              enhance user experience. You can disable cookies through your browser settings, but some site
              features may not work properly.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              You may request to access, update, or correct your personal data, withdraw consent (for promotional
              content), or delete your information as permitted by law. All such requests must be submitted
              through the appropriate form or option available on the website.
            </p>

            <h2>7. Children&apos;s Privacy</h2>
            <p>
              We do not knowingly collect personal information from children under 13 years of age. If we
              discover that we have collected such data, it will be deleted immediately.
            </p>

            <h2>8. Third-Party Links</h2>
            <p>
              Our site may contain links to third-party websites. We are not responsible for their content or
              privacy practices.
            </p>

            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The revised version will be posted on this
              page with the updated effective date. Continued use of the site after changes indicates your
              acceptance of the updated policy.
            </p>

            <h2>10. Contact and Support</h2>
            <p>
              For queries regarding this Privacy Policy, please use the{" "}
              <Link href="/contact">contact or support feature</Link> available on our website.
            </p>
          </article>
        </section>
      </main>
      <MuraiShopBenefits />
      <MuraiShopFooter />
    </div>
  );
}
