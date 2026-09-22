"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { MURAI_TESTIMONIALS } from "./murai-data";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "next" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MuraiTestimonials() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <section className="testimonial-section">
      <div className="testimonial-deco" aria-hidden="true">
        <span className="testimonial-deco-item testimonial-deco-item--1">✦</span>
        <span className="testimonial-deco-item testimonial-deco-item--2">★</span>
        <span className="testimonial-deco-item testimonial-deco-item--3">✦</span>
        <span className="testimonial-deco-item testimonial-deco-item--4">★</span>
      </div>
      <div className="testimonial-section-inner">
        <div className="section-heading testimonial-heading">
          <span className="testimonial-tag">✦ Client Love ✦</span>
          <h2>Our Clients Say</h2>
        </div>
        <div className="testimonial-slider-wrap">
          <Swiper
            className="testimonial-swiper"
            modules={[Autoplay, EffectFade, Pagination]}
            loop
            speed={700}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            onSwiper={setSwiper}
            slidesPerView={1}
          >
            {MURAI_TESTIMONIALS.map((item) => (
              <SwiperSlide key={item.id} data-client={item.id}>
                <div className="testimonial-showcase">
                  <div className="testimonial-showcase-visual">
                    <div className="testimonial-avatar-frame">
                      <span className="testimonial-avatar-ring" aria-hidden="true" />
                      <span className="testimonial-avatar-glow" aria-hidden="true" />
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="testimonial-avatar-img"
                        width={180}
                        height={198}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="testimonial-client-badge">Verified Client</div>
                    <p className="testimonial-showcase-name">{item.name}</p>
                    <p className="testimonial-showcase-role">{item.role}</p>
                  </div>
                  <div className="testimonial-showcase-content">
                    <div className="testimonial-bubble">
                      <div className="testimonial-bubble-quote" aria-hidden="true">
                        &quot;
                      </div>
                      <div className="testimonial-stars" aria-label="5 stars">
                        ★★★★★
                      </div>
                      <p className="testimonial-text">{item.text}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            type="button"
            className="testimonial-nav testimonial-nav-prev"
            aria-label="Previous testimonial"
            onClick={() => swiper?.slidePrev()}
          >
            <Chevron dir="prev" />
          </button>
          <button
            type="button"
            className="testimonial-nav testimonial-nav-next"
            aria-label="Next testimonial"
            onClick={() => swiper?.slideNext()}
          >
            <Chevron dir="next" />
          </button>
        </div>
      </div>
    </section>
  );
}
