import type { Metadata } from "next";
import Link from "next/link";
import HeaderOne from "@/components/header/Header";
import FooterOne from "@/components/Footer";
import MuraiBreadcrumb from "@/components/murai/MuraiBreadcrumb";
import ShortService from "@/components/service/ShortService";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/about");

export default function AboutPage() {
  return (
    <div className="murai-home">
      <HeaderOne />
      <main>
        <MuraiBreadcrumb
          title="About Us"
          bannerImage="/assets/images/murai/banners/banner-about.jpg"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "About Us" },
          ]}
        />

        <section className="section">
          <div className="container">
            <div className="about-grid">
              <div className="about-image">
                <img
                  src="/assets/images/murai/sarees/kanjivaram.webp"
                  alt="Kanjivaram saree weaving"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="about-content">
                <h2>Our Story</h2>
                <p>
                  Founded in 2010, MuRa@23 began with a passion for India&apos;s finest sarees. We source handwoven silk,
                  cotton, Banarasi, and Kanjivaram sarees directly from artisans across Varanasi, Kanchipuram, and
                  Jaipur — offering them at unbeatable sale prices.
                </p>
                <p>
                  Every saree in our collection celebrates centuries-old weaving traditions — from intricate zari work
                  in Banarasi silk to the vibrant patterns of Patola and Bandhani.
                </p>
                <p>We believe every woman deserves a beautiful saree at an affordable price.</p>
                <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>
                  Shop Sale Sarees
                </Link>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Artisans</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15+</div>
                <div className="stat-label">Years</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">200+</div>
                <div className="stat-label">Stores</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <h2>Our Mission</h2>
                <p>
                  To create sustainable livelihoods for artisans while offering customers products that are beautiful,
                  ethical, and rooted in tradition. We work directly with craft communities, ensuring fair wages and
                  preserving techniques passed down through generations.
                </p>
                <p>
                  From organic cotton farming to natural dyeing, from hand-spinning to hand-weaving — every step of our
                  process honors both the environment and the artisan.
                </p>
              </div>
              <div className="about-image">
                <img
                  src="/assets/images/murai/sarees/banarasi.webp"
                  alt="Banarasi silk saree"
                  loading="lazy"
                  decoding="async"
                />
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
