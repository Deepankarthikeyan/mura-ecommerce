import type { Metadata } from "next";
import HeaderOne from "@/components/header/Header";
import ShortService from "@/components/service/ShortService";
import FooterOne from "@/components/Footer";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/privacy-policy");

export default function PrivacyPolicyPage() {
  return (
    <div className="demo-one">
      <HeaderOne />

      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <a href="/">Home</a>
                <i className="fa-regular fa-chevron-right" />
                <a className="current" href="/privacy-policy">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-seperator bg_light-1">
        <div className="container">
          <hr className="section-seperator" />
        </div>
      </div>

      <div className="rts-pricavy-policy-area rts-section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="container-privacy-policy">
                <h1 className="title mb--20">Privacy Policy</h1>
                <p className="disc mb--40" style={{ color: "#616164" }}>
                  Last Updated: June 8, 2026
                </p>

                <p className="disc">
                  Welcome to Aathithya Herbal. We value your trust and are committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, store, and protect your personal information
                  when you visit our website or purchase our herbal food supplements and wellness products.
                </p>
                <p className="disc mb--15">
                  By using our website, you agree to the practices described in this Privacy Policy.
                </p>

                <div className="section-list mt--40">
                  <h2 className="title">1. Information We Collect</h2>
                  <p className="disc">
                    When you interact with our website, we may collect the following information:
                  </p>
                  <h3 className="title" style={{ fontSize: "18px", marginTop: "20px", marginBottom: "12px" }}>
                    Personal Information
                  </h3>
                  <ul>
                    <li><p>Name</p></li>
                    <li><p>Email Address</p></li>
                    <li><p>Mobile Number</p></li>
                    <li><p>Billing and Shipping Address</p></li>
                    <li><p>Payment Information (processed through secure payment gateways)</p></li>
                  </ul>
                  <h3 className="title" style={{ fontSize: "18px", marginTop: "20px", marginBottom: "12px" }}>
                    Website Usage Information
                  </h3>
                  <ul>
                    <li><p>IP Address</p></li>
                    <li><p>Browser Type</p></li>
                    <li><p>Device Information</p></li>
                    <li><p>Pages Visited</p></li>
                    <li><p>Time Spent on the Website</p></li>
                    <li><p>Cookies and Similar Technologies</p></li>
                  </ul>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">2. How We Use Your Information</h2>
                  <p className="disc">We use your information to:</p>
                  <ul>
                    <li><p>Process and deliver your orders</p></li>
                    <li><p>Communicate order updates and confirmations</p></li>
                    <li><p>Respond to customer inquiries and support requests</p></li>
                    <li><p>Improve our products, services, and website experience</p></li>
                    <li><p>Send promotional offers, newsletters, and wellness updates (where permitted)</p></li>
                    <li><p>Maintain business records and comply with legal requirements</p></li>
                    <li><p>Prevent fraud and ensure website security</p></li>
                  </ul>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">3. Product Information Disclaimer</h2>
                  <p className="disc">
                    Aathithya Herbal provides herbal food supplements and wellness products intended to support
                    general well-being.
                  </p>
                  <p className="disc">
                    The information provided on this website is for educational and informational purposes only
                    and is not intended to diagnose, treat, cure, or prevent any disease. Customers are advised to
                    consult qualified healthcare professionals regarding specific health concerns.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">4. Payment Security</h2>
                  <p className="disc">
                    We do not store your credit card, debit card, or banking information on our servers.
                  </p>
                  <p className="disc">
                    All payments are processed through trusted and secure third-party payment gateways that employ
                    industry-standard encryption and security protocols.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">5. Sharing of Information</h2>
                  <p className="disc">
                    Aathithya Herbal respects your privacy and does not sell, rent, or trade your personal information.
                  </p>
                  <p className="disc">Your information may be shared only with:</p>
                  <ul>
                    <li><p>Payment service providers</p></li>
                    <li><p>Courier and delivery partners</p></li>
                    <li><p>Website hosting and technical support providers</p></li>
                    <li><p>Government or regulatory authorities when legally required</p></li>
                  </ul>
                  <p className="disc">
                    All such parties are expected to maintain the confidentiality of your information.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">6. Cookies</h2>
                  <p className="disc">Our website may use cookies to:</p>
                  <ul>
                    <li><p>Improve website functionality</p></li>
                    <li><p>Remember your preferences</p></li>
                    <li><p>Analyze website traffic</p></li>
                    <li><p>Enhance your shopping experience</p></li>
                  </ul>
                  <p className="disc">
                    You may disable cookies through your browser settings, though some features of the website may
                    not function properly.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">7. Data Protection</h2>
                  <p className="disc">
                    We take reasonable administrative, technical, and physical measures to safeguard your personal
                    information from unauthorized access, disclosure, alteration, or misuse.
                  </p>
                  <p className="disc">
                    However, while we strive to protect your information, no online transmission or storage system
                    can be guaranteed to be 100% secure.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">8. Your Rights</h2>
                  <p className="disc">You may have the right to:</p>
                  <ul>
                    <li><p>Access your personal information</p></li>
                    <li><p>Request corrections to inaccurate information</p></li>
                    <li><p>Request deletion of your information where applicable</p></li>
                    <li><p>Opt out of promotional communications at any time</p></li>
                  </ul>
                  <p className="disc">
                    For such requests, please contact us using the details provided below.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">9. Third-Party Links</h2>
                  <p className="disc">
                    Our website may contain links to third-party websites. Aathithya Herbal is not responsible for
                    the privacy practices or content of those websites. Users are encouraged to review the privacy
                    policies of external sites before providing personal information.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">10. Children&apos;s Privacy</h2>
                  <p className="disc">
                    Our products and services are intended for adults. We do not knowingly collect personal
                    information from individuals under the age of 18.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">11. Changes to This Privacy Policy</h2>
                  <p className="disc">
                    Aathithya Herbal reserves the right to modify this Privacy Policy at any time. Updates will be
                    posted on this page with the revised effective date.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">12. Contact Us</h2>
                  <p className="disc">
                    If you have any questions regarding this Privacy Policy or the handling of your personal
                    information, please contact us:
                  </p>
                  <p className="disc">
                    <strong>Aathithya Herbal</strong>
                    <br />
                    Email:{" "}
                    <a href="mailto:aathithyaherbalsoffice@gmail.com" style={{ color: "#1f72b0" }}>
                      aathithyaherbalsoffice@gmail.com
                    </a>
                    <br />
                    Phone:{" "}
                    <a href="tel:+919585515051" style={{ color: "#1f72b0" }}>
                      +91 95855 15051
                    </a>
                    <br />
                    Address: 5/611, KNG Pudur Rd, K.N.Palayam, KNG Pudur Pirivu, Coimbatore, Tamil Nadu 641108, India
                  </p>
                  <p className="disc">
                    We are committed to addressing your concerns promptly and responsibly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShortService />
      <FooterOne />
    </div>
  );
}
