"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    bgClass: "banner-bg_4",
    pre: "Get offers and discounts on your purchase",
    title: (
      <>
        Buy all Different Kinds <br />
        of Ayurvedhic medicines
      </>
    ),
    description: "Don't miss these opportunities...",
    showPerson: true,
  },
  {
    bgClass: "banner-bg_4 banner-bg_4-two",
    pre: "Natural care for everyday wellness",
    title: (
      <>
        Discover Trusted <br />
        Ayurvedic Products
      </>
    ),
    description: "Shop quality herbal medicines and wellness essentials...",
    showPerson: false,
  },
];

function BannerFour() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="banner-four-swiper-main-wrapper">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={700}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        onSwiper={setSwiper}
        className="banner-four-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className={`rts-banner-area rts-section-gap ${slide.bgClass} bg_image d-flex align-items-center`}
            >
              {slide.showPerson ? (
                <div className="transparent-person">
                  <img
                    src="/assets/images/banner/transparent/01.png"
                    alt="banner"
                  />
                </div>
              ) : null}
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="banner-area-start-4">
                      <span className="pre">{slide.pre}</span>
                      <h1 className="title">{slide.title}</h1>
                      <p>{slide.description}</p>
                      <div className="rts-btn-banner-area">
                        <Link
                          href="/shop"
                          className="rts-btn btn-primary radious-sm with-icon"
                        >
                          <div className="btn-text">Shop Now</div>
                          <div className="arrow-icon">
                            <i className="fa-light fa-arrow-right" />
                          </div>
                          <div className="arrow-icon">
                            <i className="fa-light fa-arrow-right" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="banner-four-nav">
        <button
          type="button"
          className="banner-four-nav__btn banner-four-prev"
          aria-label="Previous slide"
          onClick={() => swiper?.slidePrev()}
        >
          <i className="fa-regular fa-arrow-left" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="banner-four-nav__btn banner-four-next"
          aria-label="Next slide"
          onClick={() => swiper?.slideNext()}
        >
          <i className="fa-regular fa-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default BannerFour;
