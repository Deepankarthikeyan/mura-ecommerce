"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MuraiLayout from "./MuraiLayout";
import MuraiProductCard from "./MuraiProductCard";
import { filterProducts, productCategoryKey } from "@/lib/murai/productUtils";
import { useProducts } from "@/lib/murai/useProducts";

const TABS = [
  { id: "silk", label: "Silk Sarees" },
  { id: "cotton", label: "Cotton Sarees" },
  { id: "party", label: "Designer Sarees" },
];

export default function MuraiHomePage() {
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState("silk");
  const [countdown, setCountdown] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });

  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 3);
    const tick = () => {
      const diff = Math.max(0, end.getTime() - Date.now());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const tabProducts = useMemo(() => {
    return filterProducts(products, { category: activeTab });
  }, [products, activeTab]);

  const dealProduct = products[0];
  const bestSellers = products.slice(0, 4);

  return (
    <MuraiLayout activePage="home">
      <section className="hero-slider">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          navigation
          className="hero-swiper"
        >
          {[1, 2, 3].map((n) => (
            <SwiperSlide key={n}>
              <div className={`hero-slide slide-${n}`}>
                <div className="hero-slide-content">
                  <p className="hero-slide-tag">Saree Sale</p>
                  <h2>Handcrafted Silk<br />Sarees On Sale</h2>
                  <p>Up To 70% Off On Premium Sarees.<br />Silk, Cotton &amp; Designer Collection!</p>
                  <Link href="/shop" className="btn btn-primary">Shop Sale Sarees →</Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="banner-section">
        <div className="banner-grid">
          <Link href="/shop?category=silk" className="banner-card tall">
            <img src="/murai/images/sarees/banarasi.webp" alt="Silk Saree Sale" loading="lazy" />
            <div className="banner-card-content">
              <span className="banner-card-subtitle">40% Off</span>
              <h3>Silk Saree<br />Sale</h3>
              <span className="banner-card-link">View Discounts →</span>
            </div>
          </Link>
          <div className="banner-right">
            <div className="banner-right-top">
              <Link href="/shop?category=kanjivaram" className="banner-card">
                <img src="/murai/images/sarees/paithani.webp" alt="Banarasi Sarees" loading="lazy" />
                <div className="banner-card-content">
                  <span className="banner-card-subtitle">Banarasi</span>
                  <h3>Up to 50% Off<br />Banarasi Sarees</h3>
                  <span className="banner-card-link">View Discounts →</span>
                </div>
              </Link>
              <Link href="/shop?category=cotton" className="banner-card">
                <img src="/murai/images/sarees/cotton-block.webp" alt="Cotton Sarees" loading="lazy" />
                <div className="banner-card-content">
                  <span className="banner-card-subtitle">Cotton Sarees</span>
                  <h3>Free Shipping Over<br />Order ₹999</h3>
                  <span className="banner-card-link">View Discounts →</span>
                </div>
              </Link>
            </div>
            <Link href="/shop?category=kanjivaram" className="banner-card">
              <img src="/murai/images/sarees/kanjivaram.webp" alt="Kanjivaram Sarees" loading="lazy" />
              <div className="banner-card-content">
                <span className="banner-card-subtitle">35% Off</span>
                <h3>Kanjivaram Silk<br />Saree Sale</h3>
                <span className="banner-card-link">View Discounts →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="products-section-inner">
          <div className="section-heading"><h2>Sale Sarees</h2></div>
          <div className="product-tabs-wrap">
            <div className="product-tabs" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`product-tab ${activeTab === tab.id ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="suruchi-products-grid">
            {loading ? (
              <p style={{ padding: 24 }}>Loading sarees...</p>
            ) : tabProducts.length ? (
              tabProducts.slice(0, 8).map((p) => (
                <MuraiProductCard key={p._id ?? p.productId} product={p} style="home" />
              ))
            ) : (
              <p style={{ padding: 24 }}>No sarees in this category.</p>
            )}
          </div>
        </div>
      </section>

      <section className="deals-section">
        <div className="deals-inner">
          <div className="deals-content">
            <p className="deals-tag">Hurry up and Get 25% Discount</p>
            <h2>Deals Of The Day</h2>
            <p>Don&apos;t miss out on our exclusive daily saree deals. Limited stock on handwoven silk and cotton sarees.</p>
            <div className="countdown">
              <div className="countdown-item"><span className="num">{countdown.days}</span><span className="label">Days</span></div>
              <div className="countdown-item"><span className="num">{countdown.hours}</span><span className="label">Hours</span></div>
              <div className="countdown-item"><span className="num">{countdown.mins}</span><span className="label">Mins</span></div>
              <div className="countdown-item"><span className="num">{countdown.secs}</span><span className="label">Secs</span></div>
            </div>
          </div>
          {dealProduct ? (
            <div className="deals-product">
              <div className="deals-product-img">
                <img src={dealProduct.image ?? "/murai/images/sarees/banarasi.webp"} alt={dealProduct.title ?? ""} />
              </div>
              <div className="deals-product-info">
                <span className="suruchi-product-badge" style={{ position: "static", display: "inline-block", marginBottom: 12 }}>25% Off</span>
                <h3 className="suruchi-product-name" style={{ fontSize: 22 }}>{dealProduct.title}</h3>
                <div className="suruchi-product-price" style={{ margin: "12px 0" }}>
                  <span className="current" style={{ fontSize: 24 }}>₹{Number(dealProduct.price).toLocaleString("en-IN")}</span>
                  {dealProduct.mrp ? <span className="old">₹{Number(dealProduct.mrp).toLocaleString("en-IN")}</span> : null}
                </div>
                <div className="suruchi-stars" style={{ marginBottom: 20 }}>★★★★★</div>
                <Link href={`/shop/${dealProduct.urlSlug ?? ""}`} className="btn btn-primary">View &amp; Add to Cart</Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bestseller-section">
        <div className="section-heading"><h2>Best Selling Sarees</h2></div>
        <div className="bestseller-grid suruchi-products-grid">
          {bestSellers.map((p) => (
            <MuraiProductCard key={`best-${p._id ?? p.productId}`} product={p} style="bestseller" />
          ))}
        </div>
      </section>

      <section className="promo-banners">
        <div className="promo-banner bg-1">
          <div>
            <h3>Up to 50% Off<br />Sarees</h3>
            <p>Shop Silk &amp; Cotton</p>
            <Link href="/shop" className="btn">Shop Now</Link>
          </div>
        </div>
        <div className="promo-banner bg-2">
          <div>
            <h3>Up to 70% Off<br />Sarees</h3>
            <p>Limited time sale</p>
            <Link href="/shop" className="btn">Discover Now</Link>
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="testimonial-section-inner">
          <div className="section-heading testimonial-heading">
            <span className="testimonial-tag">✦ Client Love ✦</span>
            <h2>Our Clients Say</h2>
          </div>
          <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination loop autoplay={{ delay: 5000 }} className="testimonial-swiper">
            {[
              { name: "Priya Sharma", img: "/murai/images/avatars/priya-sharma.svg", text: "The Banarasi silk saree I bought on sale is absolutely stunning! Rich zari work and exceptional fabric quality." },
              { name: "Laura Johnson", img: "/murai/images/avatars/laura-johnson.svg", text: "MuRa@23 has the best saree sale online! Got a beautiful Kanjivaram at 40% off. Highly recommended!" },
              { name: "Richard Smith", img: "/murai/images/avatars/richard-smith.svg", text: "The silk saree exceeded my expectations. Gorgeous colors and elegant packaging. Perfect for gifting." },
            ].map((t) => (
              <SwiperSlide key={t.name}>
                <div className="testimonial-showcase">
                  <div className="testimonial-showcase-visual">
                    <img src={t.img} alt={t.name} className="testimonial-avatar-img" width={180} height={198} />
                    <div className="testimonial-client-badge">Verified Client</div>
                    <p className="testimonial-showcase-name">{t.name}</p>
                    <p className="testimonial-showcase-role">Saree Lover</p>
                  </div>
                  <div className="testimonial-showcase-content">
                    <div className="testimonial-bubble">
                      <div className="testimonial-stars">★★★★★</div>
                      <p className="testimonial-text">{t.text}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="blog-section">
        <div className="section-heading"><h2>From The Blog</h2></div>
        <div className="blog-grid">
          {[
            { title: "How to Choose the Perfect Silk Saree", img: "/murai/images/sarees/banarasi.webp" },
            { title: "Banarasi vs Kanjivaram: A Complete Guide", img: "/murai/images/sarees/kanjivaram.webp" },
            { title: "5 Ways to Style Your Saree for Modern Occasions", img: "/murai/images/sarees/georgette-party.webp" },
          ].map((b) => (
            <article key={b.title} className="blog-card">
              <div className="blog-card-img"><img src={b.img} alt="" loading="lazy" /></div>
              <div className="blog-card-body">
                <p className="blog-date">February 03, 2026</p>
                <h3><a href="#">{b.title}</a></h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-section">
        <div className="newsletter-inner">
          <h2>Join Our Newsletter</h2>
          <p>Enter your email address to subscribe our notification of our new post &amp; features by email.</p>
          <form className="newsletter-form-large newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      <section className="service-bar">
        <div className="service-bar-grid">
          {[
            { title: "Shipping", text: "From handpicked sellers" },
            { title: "Payment", text: "Secure checkout" },
            { title: "Return", text: "30-day easy returns" },
            { title: "Support", text: "Dedicated help team" },
          ].map((s) => (
            <div key={s.title} className="service-item">
              <div><h4>{s.title}</h4><p>{s.text}</p></div>
            </div>
          ))}
        </div>
      </section>
    </MuraiLayout>
  );
}
