"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Saree Lover",
    avatar: "/assets/images/murai/avatars/priya-sharma.svg",
    text: "The Banarasi silk saree I bought on sale is absolutely stunning! Rich zari work and the fabric quality is exceptional. Best saree purchase ever!",
  },
  {
    name: "Laura Johnson",
    role: "Saree Lover",
    avatar: "/assets/images/murai/avatars/laura-johnson.svg",
    text: "MuRa@23 has the best saree sale online! Got a beautiful Kanjivaram at 40% off. Fast delivery and elegant packaging. Highly recommended!",
  },
  {
    name: "Richard Smith",
    role: "Saree Lover",
    avatar: "/assets/images/murai/avatars/richard-smith.svg",
    text: "The silk saree I purchased exceeded my expectations. Gorgeous colors and the packaging was elegant. Perfect for gifting too.",
  },
];

export default function MuraiTestimonials() {
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
        <Swiper
          className="testimonial-swiper"
          modules={[Navigation, Pagination, Autoplay]}
          loop
          autoplay={{ delay: 6000 }}
          navigation
          pagination={{ clickable: true }}
        >
          {TESTIMONIALS.map((item) => (
            <SwiperSlide key={item.name}>
              <div className="testimonial-showcase">
                <div className="testimonial-showcase-visual">
                  <div className="testimonial-avatar-frame">
                    <span className="testimonial-avatar-ring" aria-hidden="true" />
                    <span className="testimonial-avatar-glow" aria-hidden="true" />
                    <img src={item.avatar} alt={item.name} className="testimonial-avatar-img" width={180} height={198} loading="lazy" />
                  </div>
                  <div className="testimonial-client-badge">Verified Client</div>
                  <p className="testimonial-showcase-name">{item.name}</p>
                  <p className="testimonial-showcase-role">{item.role}</p>
                </div>
                <div className="testimonial-showcase-content">
                  <div className="testimonial-bubble">
                    <div className="testimonial-bubble-quote" aria-hidden="true">&quot;</div>
                    <div className="testimonial-stars" aria-label="5 stars">★★★★★</div>
                    <p className="testimonial-text">{item.text}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
