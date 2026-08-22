"use client";

import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const slides = [
  {
    bgClass: "slide-1",
    tag: "Saree Sale",
    title: (
      <>
        Handcrafted Silk
        <br />
        Sarees On Sale
      </>
    ),
    description: (
      <>
        Up To 70% Off On Premium Sarees.
        <br />
        Silk, Cotton &amp; Designer Collection!
      </>
    ),
  },
  {
    bgClass: "slide-2",
    tag: "Saree Sale",
    title: (
      <>
        Handcrafted Silk
        <br />
        Sarees On Sale
      </>
    ),
    description: (
      <>
        Up To 70% Off On Premium Sarees.
        <br />
        Silk, Cotton &amp; Designer Collection!
      </>
    ),
  },
  {
    bgClass: "slide-3",
    tag: "Saree Sale",
    title: (
      <>
        Handcrafted Silk
        <br />
        Sarees On Sale
      </>
    ),
    description: (
      <>
        Up To 70% Off On Premium Sarees.
        <br />
        Silk, Cotton &amp; Designer Collection!
      </>
    ),
  },
];

function BannerFour() {
  const [, setSwiper] = useState<SwiperType | null>(null);

  return (
    <section className="hero-slider">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        speed={700}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        onSwiper={setSwiper}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={`hero-slide ${slide.bgClass}`}>
              <div className="hero-slide-content">
                <p className="hero-slide-tag">{slide.tag}</p>
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <Link href="/shop" className="btn btn-primary">
                  Shop Sale Sarees →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default BannerFour;
