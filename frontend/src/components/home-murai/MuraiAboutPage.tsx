import Link from "next/link";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";
import { SITE_NAME } from "@/lib/brand";

const WHY_CHOOSE_US = [
  {
    title: "Designed for Comfort & Style",
    text:
      "We source finest quality natural fabrics and every piece in our collection prioritises your comfort without compromising on style. Our styles blend function with fashion, ensuring you feel confident throughout the day.",
  },
  {
    title: "Every Stitch Tells a Story",
    text:
      "Each garment is infused with love and attention to detail. From fabric selection to final embellishments, we ensure every piece is made with care.",
  },
  {
    title: "Fast & Reliable Shipping",
    text:
      "We understand that you're excited to wear your new outfit. That's why we prioritise quick and safe delivery options to get your orders to you safely.",
  },
  {
    title: "Socially Responsible",
    text:
      "Supporting local talent and fostering sustainable practices is at the heart of our business. Every purchase supports the livelihood of skilled people and the environment.",
  },
  {
    title: "Eco-Conscious Choices",
    text:
      "We believe fashion should care for the planet. That's why we use eco-friendly fabrics, minimize waste, and focus on responsible production methods, so you can feel good about what you wear.",
  },
  {
    title: "Personalized Experience",
    text:
      "Your style is unique and so is our service. From size guidance to styling tips, we're here to make your shopping experience smooth, enjoyable, and tailored just for you.",
  },
];

export default function MuraiAboutPage() {
  return (
    <div className="murai-home" data-page="about">
      <MuraiHeader />
      <main>
        <section className="breadcrumb__section">
          <div className="breadcrumb__bg">
            <img
              className="breadcrumb__bg-image"
              src="/murai/banners/banner-about.jpg"
              alt=""
              width={1600}
              height={334}
              decoding="async"
            />
            <div className="container">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title">Our Roots</h1>
                <ul className="breadcrumb__content--menu">
                  <li className="breadcrumb__content--menu__items">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span>About Us</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-container">
            <div className="about-grid">
              <div className="about-image">
                <img
                  src="/murai/sarees/kanjivaram.webp"
                  alt="MuRa@23 saree collection"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-content">
                <h2>{SITE_NAME}</h2>
                <p>
                  At {SITE_NAME}, we bring you clothing that is comfortable yet stylish. Inspired by
                  entrepreneurial dreams that is driving India, this venture celebrates the artistry of
                  India&apos;s rich textile traditions, while focusing on comfort and elegance.
                </p>
                <Link href="/shop" className="btn btn-primary about-cta">
                  Shop Sarees
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section about-section--mission">
          <div className="about-container">
            <div className="about-grid">
              <div className="about-content">
                <h2>The Story Behind {SITE_NAME}</h2>
                <p>The name MuRa carries deep familial significance:</p>
                <ul className="about-story-list">
                  <li><strong>Mu</strong> stands for Muthu Krishnan.</li>
                  <li><strong>Ra</strong> stands for Rathinammal,</li>
                </ul>
                <p>
                  who are the beloved parents of our founder, Kanni Priya. They have been the wings beneath her
                  dreams, empowering her to build this brand that embodies love, tradition, and ambition. The
                  &quot;@23&quot; symbolises the PIN code of Podanur 641023, an industrious neighbourhood in
                  Coimbatore where our story began and where {SITE_NAME} continues to thrive. From here, we
                  curate and deliver meticulously crafted ensembles to customers far and wide.
                </p>
              </div>
              <div className="about-image">
                <img
                  src="/murai/sarees/banarasi.webp"
                  alt="Handcrafted saree from MuRa@23"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-container">
            <div className="about-grid">
              <div className="about-image">
                <img
                  src="/murai/sarees/patola.webp"
                  alt="MuRa@23 vision"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-content">
                <h2>Our Vision</h2>
                <p className="about-tagline">Trust Woven Into Every Thread</p>
                <p>
                  Our long-term aim is to become a trusted name in clothing that stands for quality and service,
                  while empowering talented women in the neighbourhood.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section about-section--mission">
          <div className="about-container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Our Mission</h2>
                <p className="about-tagline">Classy, Timeless Style with Comfort and Care</p>
                <p>
                  To craft and deliver elegant, timeless everyday wear with a personal touch in every product,
                  ensuring each piece reflects attention to detail and the unique needs of our customers. Made
                  from eco-friendly fabrics, our clothing combines perfect fit, lasting quality, skin-friendly
                  comfort, and versatile style—while providing reliable, customer-focused service.
                </p>
              </div>
              <div className="about-image">
                <img
                  src="/murai/sarees/tussar.webp"
                  alt="MuRa@23 mission"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="about-section about-section--trust">
          <div className="about-container about-trust">
            <h2 className="about-section-title">Numbers That Reflect Your Trust</h2>
            <p className="about-section-subtitle">We reached here with our hard work and dedication</p>
          </div>
        </section>

        <section className="about-section about-section--why">
          <div className="about-container">
            <h2 className="about-section-title">Why Choose Us?</h2>
            <p className="about-section-subtitle">Where Comfort Meets Style</p>
            <div className="about-why-grid">
              {WHY_CHOOSE_US.map((item) => (
                <div key={item.title} className="about-why-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section about-section--founder">
          <div className="about-container">
            <blockquote className="about-founder-quote">
              <p>
                &ldquo;I&apos;ve worn many hats — dancer, teacher, social worker, linguist. But through it all,
                fashion has been my language. With {SITE_NAME}, I&apos;ve woven together my love for fabrics,
                entrepreneurship, and personal expression. Each outfit is crafted with care — from my heart to
                your wardrobe.&rdquo;
              </p>
              <footer>— M Kanni Priya, Founder</footer>
            </blockquote>
          </div>
        </section>
      </main>
      <MuraiShopBenefits />
      <MuraiShopFooter />
    </div>
  );
}
