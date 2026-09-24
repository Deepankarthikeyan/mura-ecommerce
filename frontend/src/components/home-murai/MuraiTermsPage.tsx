import Link from "next/link";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";
import { SITE_NAME } from "@/lib/brand";

export default function MuraiTermsPage() {
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
                <h1 className="breadcrumb__content--title">Terms &amp; Conditions</h1>
                <ul className="breadcrumb__content--menu">
                  <li className="breadcrumb__content--menu__items">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span>Terms &amp; Conditions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section policy-section">
          <article className="policy-card">
            <div className="policy-callout">
              PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING THIS WEBSITE. BY ACCESSING OR USING
              THE SITE, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, PLEASE DO NOT USE THE SITE.
            </div>

            <h2>1. Application</h2>
            <p>
              These Terms and Conditions apply to the website www.mura23.com, including any associated mobile
              applications, platforms, services, or tools offered through or related to it. The website is
              operated by {SITE_NAME}, a brand of Thugil Garments, along with third-party service providers and
              developers involved in its operation (collectively referred to as &apos;Operators&apos;).
            </p>

            <h2>2. Products, Content, and Specifications</h2>
            <p>
              All product features, specifications, content, and prices listed on the site are subject to change
              at any time without notice. Product descriptions such as dimensions, weights, or colors are
              provided for convenience and may be approximate. We strive to display product colors accurately,
              but the actual color displayed may vary depending on your device settings. The presence of any
              product or service on the site does not guarantee its availability or price with our retail
              partners.
            </p>

            <h2>3. Accuracy of Information</h2>
            <p>
              We aim to ensure that all information on the website is accurate and up to date. However, errors
              may occasionally occur. We do not guarantee the accuracy, completeness, or timeliness of any
              information on the site, including product availability or pricing.
            </p>

            <h2>4. Use of the Website</h2>
            <p>
              Use of the website is for personal, non-commercial purposes only. You agree not to use any
              automated systems (e.g., bots, crawlers, or scrapers) to access or extract information from the
              site. All content—including text, graphics, logos, images, and designs—is protected by copyright,
              trademark, and other intellectual property laws and may not be used without express permission.
            </p>

            <h2>5. Trademarks</h2>
            <p>
              All trademarks, logos, and service marks displayed on the site are the property of {SITE_NAME}, its
              affiliates, or their respective owners. No content on the site grants any license or right to use
              these marks without written permission from the rightful owner.
            </p>

            <h2>6. Linking to the Website</h2>
            <p>
              Creating or maintaining a link to any part of this website from another website or platform
              without prior written permission is strictly prohibited. Additionally, you may not display any part
              of this site within a frame or similar setup without our consent.
            </p>

            <h2>7. Third-Party Links</h2>
            <p>
              This website may contain links to external websites not operated by us. These links are provided
              for your convenience only. We are not responsible for the content or practices of any third-party
              websites and do not endorse or guarantee them. Visiting such sites is at your own risk.
            </p>

            <h2>8. Inappropriate Content</h2>
            <p>
              You may not post or transmit any unlawful, threatening, defamatory, obscene, or otherwise
              inappropriate material on the site. We reserve the right to remove such content and cooperate fully
              with law enforcement agencies in case of any violations.
            </p>

            <h2>9. User Submissions</h2>
            <p>
              Any material or communication you submit to the site—excluding personal data protected by our{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>—will be treated as non-confidential and
              non-proprietary. We may use, reproduce, modify, and distribute these submissions for any purpose,
              commercial or otherwise, without obligation to you.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              We are not liable for any damages to your computer, mobile device, or other property resulting
              from your use of the website, including any viruses, bugs, or malware that may be transmitted
              through the site.
            </p>

            <h2>11. Age Requirement</h2>
            <p>
              To use this site, you must be at least 18 years old, or 13 years or older with parental or
              guardian consent. If you are under 13, you may not register or use this site. Parents or guardians
              are fully responsible for the use of the site by minors under their supervision.
            </p>

            <h2>12. Modifications to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms and Conditions at any time. Continued use of
              the site following any such changes constitutes your acceptance of the revised terms. Please review
              this page periodically for the most current version.
            </p>

            <h2>13. Termination</h2>
            <p>
              We may suspend or terminate your access to the website at our sole discretion, with or without
              cause or notice. We also reserve the right to modify or discontinue any part of the site without
              prior notice.
            </p>

            <h2>14. Contact and Support</h2>
            <p>
              If you have questions, concerns, or need clarification regarding these Terms and Conditions, feel
              free to chat with us via the WhatsApp icon located at the bottom-right corner of our website, or{" "}
              <Link href="/contact">contact us</Link> through the support options on the site.
            </p>
          </article>
        </section>
      </main>
      <MuraiShopBenefits />
      <MuraiShopFooter />
    </div>
  );
}
