"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MuraiLayout from "./MuraiLayout";
import MuraiDiwaliBanner from "./MuraiDiwaliBanner";
import MuraiDealsProduct from "./MuraiDealsProduct";
import MuraiProductCard from "./MuraiProductCard";
import { productCardImage } from "@/lib/murai/productUtils";
import { useProducts } from "@/lib/murai/useProducts";
import { useStorefrontSettings } from "@/lib/storefront/useStorefrontSettings";
import { filterHomeTabByConfig, pickBestSellers, pickDealProduct } from "@/lib/storefront/productSections";
import { SERVICE_BAR_ICONS } from "@/lib/storefront/serviceBarIcons";
import { renderMultiline } from "@/lib/storefront/renderMultiline";
import type { HomeTab } from "@/lib/storefront/types";

export default function MuraiHomePage() {
  const { products, loading } = useProducts();
  const { settings } = useStorefrontSettings();
  const homeTabs = settings.homeTabs;
  const [activeTab, setActiveTab] = useState(homeTabs[0]?.id ?? "featured");
  const [countdown, setCountdown] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [arrowState, setArrowState] = useState({ prevDisabled: true, nextDisabled: false });

  const tabProducts = useMemo(
    () =>
      homeTabs.reduce(
        (acc, tab) => {
          acc[tab.id] = filterHomeTabByConfig(products, tab);
          return acc;
        },
        {} as Record<string, typeof products>
      ),
    [products, homeTabs]
  );

  const updateArrowState = useCallback(() => {
    const list = tabsListRef.current;
    if (!list) return;
    const maxScroll = list.scrollWidth - list.clientWidth;
    setArrowState({
      prevDisabled: list.scrollLeft <= 4,
      nextDisabled: list.scrollLeft >= maxScroll - 4,
    });
  }, []);

  const scrollTabs = (direction: -1 | 1) => {
    const list = tabsListRef.current;
    if (!list) return;
    const step = Math.max(120, Math.round(list.clientWidth * 0.65));
    list.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const selectTab = (tabId: string, button?: HTMLButtonElement | null) => {
    setActiveTab(tabId);
    if (button && tabsListRef.current) {
      const listRect = tabsListRef.current.getBoundingClientRect();
      const tabRect = button.getBoundingClientRect();
      const offset = tabRect.left - listRect.left - (listRect.width - tabRect.width) / 2;
      tabsListRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const configured = settings.homeSections.dealsEndDate?.trim();
    const end = configured ? new Date(configured) : new Date();
    if (!configured) end.setDate(end.getDate() + 3);

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
  }, [settings.homeSections.dealsEndDate]);

  useEffect(() => {
    const list = tabsListRef.current;
    if (!list) return;
    updateArrowState();
    list.addEventListener("scroll", updateArrowState, { passive: true });
    window.addEventListener("resize", updateArrowState);
    return () => {
      list.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
    };
  }, [updateArrowState]);

  const dealProduct = pickDealProduct(products, settings.homeSections.dealsProductTag);
  const bestSellers = pickBestSellers(products, settings.homeSections.bestSellerTag);

  const tallBanner = settings.promoBanners.find((b) => b.layout === "tall");
  const smallBanners = settings.promoBanners.filter((b) => b.layout === "small");
  const wideBanner = settings.promoBanners.find((b) => b.layout === "wide");

  const renderBanner = (banner: (typeof settings.promoBanners)[number], className: string) => (
    <Link href={banner.href} className={className}>
      <img src={banner.image} alt={banner.subtitle} loading="lazy" />
      <div className="banner-card-content">
        <span className="banner-card-subtitle">{banner.subtitle}</span>
        <h3>{renderMultiline(banner.title)}</h3>
        <span className="banner-card-link">{banner.linkLabel}</span>
      </div>
    </Link>
  );

  return (
    <MuraiLayout activePage="home">
      {settings.heroSlides.length > 0 ? (
      <section className="hero-slider">
        <Swiper
          modules={[Autoplay, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          navigation
          className="hero-swiper"
        >
          {settings.heroSlides.map((slide, n) => (
            <SwiperSlide key={`${slide.slideClass}-${n}`}>
              <div className={`hero-slide ${slide.slideClass}`}>
                <div className="hero-slide-content">
                  <p className="hero-slide-tag">{slide.tag}</p>
                  <h2>{renderMultiline(slide.title)}</h2>
                  <p>{renderMultiline(slide.subtitle)}</p>
                  <Link href={slide.ctaLink} className="btn btn-primary">{slide.ctaLabel}</Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      ) : (
        <section className="hero-slider" aria-hidden />
      )}

      <section className="banner-section">
        {settings.promoBanners.length > 0 ? (
        <div className="banner-grid">
          {tallBanner ? renderBanner(tallBanner, "banner-card tall") : null}
          <div className="banner-right">
            <div className="banner-right-top">
              {smallBanners.map((banner) => (
                <span key={banner.href + banner.title}>{renderBanner(banner, "banner-card")}</span>
              ))}
            </div>
            {wideBanner ? renderBanner(wideBanner, "banner-card") : null}
          </div>
        </div>
        ) : null}
      </section>

      <section className="products-section">
        <div className="products-section-inner">
          <div className="section-heading"><h2>{settings.homeSections.saleTitle}</h2></div>
          <div className="product-tabs-wrap">
            <button
              className="product-tabs-arrow product-tabs-arrow--prev"
              type="button"
              aria-label="Previous saree category"
              disabled={arrowState.prevDisabled}
              onClick={() => scrollTabs(-1)}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <div className="product-tabs" role="tablist" aria-label="Saree categories" ref={tabsListRef}>
              {homeTabs.map((tab: HomeTab) => (
                <button
                  key={tab.id}
                  className={`product-tab ${activeTab === tab.id ? "active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={(e) => selectTab(tab.id, e.currentTarget)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              className="product-tabs-arrow product-tabs-arrow--next"
              type="button"
              aria-label="Next saree category"
              disabled={arrowState.nextDisabled}
              onClick={() => scrollTabs(1)}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {homeTabs.map((tab) => {
            const items = tabProducts[tab.id] ?? [];
            return (
              <div
                key={tab.id}
                id={`tab-${tab.id}`}
                className={`tab-pane ${activeTab === tab.id ? "active" : ""}`}
              >
                <div className="suruchi-products-grid" id={`sarees-${tab.id}`}>
                  {items.length ? (
                    items.map((p) => (
                      <MuraiProductCard key={`${tab.id}-${p._id ?? p.productId}`} product={p} style="home" />
                    ))
                  ) : loading ? (
                    <p style={{ padding: 24 }}>Loading products...</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="deals-section">
        <div className="deals-inner">
          <div className="deals-content">
            <p className="deals-tag">{settings.homeSections.dealsTag}</p>
            <h2>{settings.homeSections.dealsTitle}</h2>
            <p>{settings.homeSections.dealsDescription}</p>
            <div className="countdown">
              <div className="countdown-item"><span className="num">{countdown.days}</span><span className="label">Days</span></div>
              <div className="countdown-item"><span className="num">{countdown.hours}</span><span className="label">Hours</span></div>
              <div className="countdown-item"><span className="num">{countdown.mins}</span><span className="label">Mins</span></div>
              <div className="countdown-item"><span className="num">{countdown.secs}</span><span className="label">Secs</span></div>
            </div>
          </div>
          {dealProduct ? <MuraiDealsProduct product={dealProduct} /> : null}
        </div>
      </section>

      <section className="bestseller-section">
        <div className="section-heading"><h2>{settings.homeSections.bestSellerTitle}</h2></div>
        <div className="bestseller-grid" id="sarees-bestseller">
          {bestSellers.length > 0
            ? bestSellers.map((p) => (
                <MuraiProductCard key={`best-${p._id ?? p.productId}`} product={p} style="bestseller" />
              ))
            : null}
        </div>
      </section>

      <section className="promo-banners">
        {settings.promoBlocks.map((block) => (
          <div key={block.bgClass + block.title} className={`promo-banner ${block.bgClass}`}>
            <div>
              <h3>{renderMultiline(block.title)}</h3>
              <p>{block.subtitle}</p>
              <Link href={block.ctaLink} className="btn">{block.ctaLabel}</Link>
            </div>
          </div>
        ))}
      </section>

      <section className="testimonial-section">
        <div className="testimonial-deco" aria-hidden="true">
          <span className="testimonial-deco-item testimonial-deco-item--1">✦</span>
          <span className="testimonial-deco-item testimonial-deco-item--2">★</span>
          <span className="testimonial-deco-item testimonial-deco-item--3">✦</span>
          <span className="testimonial-deco-item testimonial-deco-item--4">★</span>
        </div>
        <div className="testimonial-section-inner">
          <div className="section-heading testimonial-heading">
            <span className="testimonial-tag">{settings.homeSections.testimonialTag}</span>
            <h2>{settings.homeSections.testimonialTitle}</h2>
          </div>
          {settings.testimonials.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            navigation
            pagination
            loop
            autoplay={{ delay: 5500 }}
            className="testimonial-swiper"
          >
            {settings.testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <div className="testimonial-showcase">
                  <div className="testimonial-showcase-visual">
                    <div className="testimonial-avatar-frame">
                      <span className="testimonial-avatar-ring" aria-hidden="true" />
                      <span className="testimonial-avatar-glow" aria-hidden="true" />
                      <img src={t.img} alt={t.name} className="testimonial-avatar-img" width={180} height={198} loading="lazy" />
                    </div>
                    <div className="testimonial-client-badge">Verified Client</div>
                    <p className="testimonial-showcase-name">{t.name}</p>
                    <p className="testimonial-showcase-role">{t.role}</p>
                  </div>
                  <div className="testimonial-showcase-content">
                    <div className="testimonial-bubble">
                      <div className="testimonial-bubble-quote" aria-hidden="true">&quot;</div>
                      <div className="testimonial-stars" aria-label="5 stars">★★★★★</div>
                      <p className="testimonial-text">{t.text}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          ) : null}
        </div>
      </section>

      <MuraiDiwaliBanner
        heroImage={productCardImage(products[1] ?? products[0] ?? {}) || "/murai/images/sarees/kanjivaram.webp"}
        backImage1={productCardImage(products[0] ?? {}) || "/murai/images/sarees/banarasi.webp"}
        backImage2={productCardImage(products[2] ?? products[0] ?? {}) || "/murai/images/sarees/paithani.webp"}
      />

      <section className="blog-section">
        <div className="section-heading"><h2>{settings.homeSections.blogTitle}</h2></div>
        {settings.blogPosts.length > 0 ? (
        <div className="blog-grid">
          {settings.blogPosts.map((b) => (
            <article key={b.title} className="blog-card">
              <div className="blog-card-img"><img src={b.img} alt="" loading="lazy" /></div>
              <div className="blog-card-body">
                <p className="blog-date">{b.date}</p>
                <h3><Link href={b.href}>{b.title}</Link></h3>
              </div>
            </article>
          ))}
        </div>
        ) : null}
      </section>

      <section className="newsletter-section">
        <div className="newsletter-inner">
          <h2>{settings.homeSections.newsletterTitle}</h2>
          <p>{settings.homeSections.newsletterDescription}</p>
          <form className="newsletter-form-large newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      <section className="service-bar">
        <div className="service-bar-grid">
          {settings.serviceBar.map((s, i) => (
            <div key={`${s.title}-${i}`} className="service-item">
              <div className="service-icon">{SERVICE_BAR_ICONS[i % SERVICE_BAR_ICONS.length]}</div>
              <div><h4>{s.title}</h4><p>{s.text}</p></div>
            </div>
          ))}
        </div>
      </section>
    </MuraiLayout>
  );
}
