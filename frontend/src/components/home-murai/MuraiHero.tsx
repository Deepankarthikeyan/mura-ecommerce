"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const SLIDES = [1, 4, 6, 7] as const;

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "next" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MuraiHero() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const changeSlide = (direction: "prev" | "next") => {
    if (!swiper || swiper.destroyed) return;
    swiper.autoplay.stop();
    if (direction === "next") swiper.slideNext();
    else swiper.slidePrev();
    swiper.autoplay.start();
  };

  return (
    <section className="hero-slider">
      <Swiper
        className="hero-swiper"
        modules={[Autoplay, EffectFade]}
        onSwiper={setSwiper}
        rewind
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {SLIDES.map((n) => (
          <SwiperSlide key={n}>
            <div className={`hero-slide slide-${n}`}>
              <div className="hero-slide-content">
                <p className="hero-slide-tag">Saree Sale</p>
                <h2>
                  Handcrafted Silk
                  <br />
                  Sarees On Sale
                </h2>
                <p>Silk, Cotton & Designer Collection!</p>
                <Link href="/shop" className="btn btn-primary">
                  Shop Sale Sarees →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        type="button"
        className="hero-nav hero-nav-prev"
        aria-label="Previous slide"
        onClick={() => changeSlide("prev")}
      >
        <Chevron dir="prev" />
      </button>
      <button
        type="button"
        className="hero-nav hero-nav-next"
        aria-label="Next slide"
        onClick={() => changeSlide("next")}
      >
        <Chevron dir="next" />
      </button>
    </section>
  );
}
