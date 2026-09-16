"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export type BannerFourSlide = {
  id?: string;
  imageUrl?: string;
  altText?: string;
  ctaEnabled?: boolean;
  ctaLink?: string;
  ctaName?: string;
  pre?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  showPerson?: boolean;
  bgClass?: string;
};

const DEFAULT_SLIDES: BannerFourSlide[] = [
  {
    id: "default-1",
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
    ctaEnabled: true,
    ctaLink: "/shop",
    ctaName: "Shop Now",
  },
  {
    id: "default-2",
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
    ctaEnabled: true,
    ctaLink: "/shop",
    ctaName: "Shop Now",
  },
];

type BannerFourProps = {
  slides?: BannerFourSlide[];
  preview?: boolean;
};

function BannerFour({ slides, preview = false }: BannerFourProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const custom = slides !== undefined;
  const resolvedSlides = custom ? slides : DEFAULT_SLIDES;
  const canLoop = resolvedSlides.length > 1;

  if (custom && resolvedSlides.length === 0) {
    return null;
  }

  return (
    <div className="banner-four-swiper-main-wrapper">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        loop={canLoop && !preview}
        speed={700}
        effect="fade"
        observer
        observeParents
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        onSwiper={setSwiper}
        className="banner-four-swiper"
      >
        {resolvedSlides.map((slide, index) => {
          const bgClass = slide.bgClass || "banner-bg_4";
          const imageUrl = slide.imageUrl?.trim();
          const showCta = slide.ctaEnabled !== false;
          const ctaHref = slide.ctaLink?.trim() || "/shop";
          const ctaName = slide.ctaName?.trim() || "Shop Now";
          const customMode = slides !== undefined;

          return (
            <SwiperSlide key={slide.id || `banner-slide-${index}`}>
              <div
                className={`rts-banner-area rts-section-gap ${bgClass} bg_image d-flex align-items-center`}
                style={{
                  ...(imageUrl
                    ? {
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : preview || customMode
                      ? { backgroundImage: "none", backgroundColor: "#e5e7eb" }
                      : undefined),
                  ...(preview ? { height: 380 } : undefined),
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={slide.altText || ""}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      pointerEvents: "none",
                    }}
                  />
                ) : null}
                {slide.showPerson ? (
                  <div className="transparent-person">
                    <img src="/assets/images/banner/transparent/01.png" alt="banner" />
                  </div>
                ) : null}
                <div className="container" style={{ position: "relative", zIndex: 1 }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="banner-area-start-4">
                        {slide.pre ? <span className="pre">{slide.pre}</span> : null}
                        {slide.title ? <h1 className="title">{slide.title}</h1> : null}
                        {slide.description ? <p>{slide.description}</p> : null}
                        {showCta ? (
                          <div className="rts-btn-banner-area">
                            <Link
                              href={ctaHref}
                              className="rts-btn btn-primary radious-sm with-icon"
                              onClick={preview ? (e) => e.preventDefault() : undefined}
                            >
                              <div className="btn-text">{ctaName}</div>
                              <div className="arrow-icon">
                                <i className="fa-light fa-arrow-right" />
                              </div>
                              <div className="arrow-icon">
                                <i className="fa-light fa-arrow-right" />
                              </div>
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {canLoop ? (
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
      ) : null}
    </div>
  );
}

export default BannerFour;
