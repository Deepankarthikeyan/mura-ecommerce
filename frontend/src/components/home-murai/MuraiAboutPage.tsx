import Link from "next/link";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";

const STATS = [
  { number: "50K+", label: "Artisans" },
  { number: "15+", label: "Years" },
  { number: "200+", label: "Stores" },
  { number: "1M+", label: "Happy Customers" },
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
                <h1 className="breadcrumb__content--title">About Us</h1>
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
                  alt="Kanjivaram saree weaving"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-content">
                <h2>Our Story</h2>
                <p>
                  Founded in 2010, MuRa@23 began with a passion for India&apos;s finest sarees. We source
                  handwoven silk, cotton, Banarasi, and Kanjivaram sarees directly from artisans across
                  Varanasi, Kanchipuram, and Jaipur — offering them at unbeatable sale prices.
                </p>
                <p>
                  Every saree in our collection celebrates centuries-old weaving traditions — from
                  intricate zari work in Banarasi silk to the vibrant patterns of Patola and Bandhani.
                </p>
                <p>
                  We believe every woman deserves a beautiful saree at an affordable price. That&apos;s why
                  our entire store is dedicated to sale sarees only.
                </p>
                <Link href="/shop" className="btn btn-primary about-cta">
                  Shop Sale Sarees
                </Link>
              </div>
            </div>

            <div className="stats-grid">
              {STATS.map((item) => (
                <div key={item.label} className="stat-item">
                  <div className="stat-number">{item.number}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section about-section--mission">
          <div className="about-container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Our Mission</h2>
                <p>
                  To create sustainable livelihoods for artisans while offering customers products that
                  are beautiful, ethical, and rooted in tradition. We work directly with craft
                  communities, ensuring fair wages and preserving techniques passed down through
                  generations.
                </p>
                <p>
                  From organic cotton farming to natural dyeing, from hand-spinning to hand-weaving —
                  every step of our process honors both the environment and the artisan.
                </p>
              </div>
              <div className="about-image">
                <img
                  src="/murai/sarees/banarasi.webp"
                  alt="Banarasi silk saree"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <MuraiShopBenefits />
      <MuraiShopFooter />
    </div>
  );
}
