"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

function Diya({ size = "" }: { size?: "sm" | "xs" | "" }) {
  const extra = size ? ` dsb-diya--${size}` : "";
  return (
    <div className={`dsb-diya${extra}`}>
      <span className="dsb-diya-glow" />
      <span className="dsb-diya-flame" />
      <span className="dsb-diya-body" />
    </div>
  );
}

export default function MuraiDiwaliBanner() {
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reducedMotion) {
      banner.classList.add("dsb-reduced-motion", "dsb-loaded");
      return;
    }

    if (!finePointer) banner.classList.add("dsb-no-parallax");

    let scrollTimer: number | null = null;
    const pauseDuringScroll = () => {
      banner.classList.add("dsb-is-scrolling");
      if (scrollTimer) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        banner.classList.remove("dsb-is-scrolling");
        scrollTimer = null;
      }, 180);
    };

    window.addEventListener("scroll", pauseDuringScroll, { passive: true });
    window.addEventListener("touchmove", pauseDuringScroll, { passive: true });

    banner.querySelectorAll<HTMLElement>(".dsb-saree-particles span").forEach((el) => {
      el.style.animationDuration = `${4 + Math.random() * 3}s`;
      el.style.animationDelay = `${3 + Math.random() * 2}s`;
    });

    const panelSweep = banner.querySelector<HTMLElement>(".dsb-panel-sweep");
    if (panelSweep) panelSweep.style.animationDuration = `${6 + Math.random() * 2}s`;

    const bannerSweep = banner.querySelector<HTMLElement>(".dsb-banner-sweep");
    if (bannerSweep) bannerSweep.style.animationDuration = `${6 + Math.random() * 2}s`;

    banner.querySelectorAll<HTMLElement>(".dsb-sparkles span").forEach((el) => {
      el.style.animationDuration = `${3.5 + Math.random() * 2.5}s`;
      el.style.animationDelay = `${3 + Math.random() * 3}s`;
    });

    const fireworksEl = banner.querySelector("#dsb-fireworks");
    const bursts = [
      { x: 35, y: 20, colors: ["#ffc107", "#ff7043", "#ffffff", "#f48fb1"] },
      { x: 65, y: 35, colors: ["#ff5722", "#ffe082", "#fff9c4", "#ff8a65"] },
      { x: 45, y: 52, colors: ["#ffc107", "#e91e63", "#ffffff", "#ff9800"] },
      { x: 75, y: 18, colors: ["#ffd54f", "#ff7043", "#ffffff"] },
      { x: 25, y: 42, colors: ["#ff8f00", "#ffc107", "#f48fb1", "#ffffff"] },
      { x: 58, y: 62, colors: ["#ff5722", "#ffc107", "#ffffff"] },
    ];

    if (fireworksEl) {
      bursts.forEach((burst, index) => {
        const el = document.createElement("div");
        el.className = "dsb-fw-burst";
        el.style.left = `${burst.x}%`;
        el.style.top = `${burst.y}%`;
        el.style.setProperty("--delay", `${2.7 + index * 0.55}s`);
        el.style.setProperty("--cycle", `${3 + Math.random() * 1.5}s`);
        const particleCount = 10 + Math.floor(Math.random() * 4);
        for (let i = 0; i < particleCount; i += 1) {
          const particle = document.createElement("span");
          const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.3;
          const dist = 36 + Math.random() * 40;
          particle.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
          particle.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
          particle.style.setProperty("--color", burst.colors[i % burst.colors.length]);
          particle.style.setProperty("--size", `${2 + Math.random() * 3}px`);
          particle.style.setProperty("--pdelay", `${Math.random() * 0.2}s`);
          el.appendChild(particle);
        }
        fireworksEl.appendChild(el);
      });
    }

    let parallaxRaf: number | null = null;
    const resetParallax = () => {
      banner.style.setProperty("--parallax-x", "0px");
      banner.style.setProperty("--parallax-y", "0px");
    };
    const handlePointerMove = (event: MouseEvent) => {
      if (!finePointer || banner.classList.contains("dsb-is-scrolling")) return;
      if (parallaxRaf) return;
      parallaxRaf = requestAnimationFrame(() => {
        const rect = banner.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        banner.style.setProperty("--parallax-x", `${x * 10}px`);
        banner.style.setProperty("--parallax-y", `${y * 7}px`);
        parallaxRaf = null;
      });
    };

    if (finePointer) {
      banner.addEventListener("mousemove", handlePointerMove);
      banner.addEventListener("mouseleave", resetParallax);
    } else {
      resetParallax();
    }

    const loadId = requestAnimationFrame(() => banner.classList.add("dsb-loaded"));

    return () => {
      window.removeEventListener("scroll", pauseDuringScroll);
      window.removeEventListener("touchmove", pauseDuringScroll);
      banner.removeEventListener("mousemove", handlePointerMove);
      banner.removeEventListener("mouseleave", resetParallax);
      cancelAnimationFrame(loadId);
      if (scrollTimer) window.clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <section className="diwali-sale-banner" id="diwali-sale-banner" aria-labelledby="diwali-sale-heading" ref={bannerRef}>
      <div className="dsb-bg" aria-hidden="true">
        <div className="dsb-bg-gradient" />
        <div className="dsb-bg-pattern" />
        <div className="dsb-bg-glow" />
        <div className="dsb-banner-sweep" />
      </div>

      <div className="dsb-rangoli dsb-rangoli--bl" aria-hidden="true" />
      <div className="dsb-rangoli dsb-rangoli--br" aria-hidden="true" />

      <div className="dsb-sparkles" aria-hidden="true">
        <span>✦</span><span>✧</span><span>⋆</span><span>✹</span><span>✺</span>
        <span>✦</span><span>✧</span><span>⋆</span><span>✹</span><span>✺</span>
        <span>✦</span><span>✧</span>
      </div>

      <div className="dsb-hangings" aria-hidden="true">
        <div className="dsb-hang dsb-hang--1">
          <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bell" />
          <Diya />
        </div>
        <div className="dsb-hang dsb-hang--2">
          <span className="dsb-bead-string" /><span className="dsb-flower" /><span className="dsb-bead" />
          <Diya />
        </div>
        <div className="dsb-hang dsb-hang--3">
          <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bead" />
          <Diya />
        </div>
        <div className="dsb-hang dsb-hang--4">
          <span className="dsb-bead-string" /><span className="dsb-bell" />
          <Diya />
        </div>
        <div className="dsb-hang dsb-hang--5">
          <span className="dsb-bead-string" /><span className="dsb-flower" /><span className="dsb-bead" />
          <Diya />
        </div>
        <div className="dsb-hang dsb-hang--6">
          <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bell" />
          <Diya />
        </div>
        <div className="dsb-hang dsb-hang--7">
          <span className="dsb-bead-string" /><span className="dsb-bead" />
          <Diya />
        </div>
        <div className="dsb-hang dsb-hang--8">
          <span className="dsb-bead-string" /><span className="dsb-flower" />
          <Diya />
        </div>
      </div>

      <div className="dsb-corner-diyas" aria-hidden="true">
        <div className="dsb-corner-diya dsb-corner-diya--tl"><Diya size="sm" /></div>
        <div className="dsb-corner-diya dsb-corner-diya--tr"><Diya size="sm" /></div>
        <div className="dsb-corner-diya dsb-corner-diya--bl"><Diya size="sm" /></div>
        <div className="dsb-corner-diya dsb-corner-diya--br"><Diya size="sm" /></div>
      </div>

      <div className="dsb-layout">
        <div className="dsb-sarees" aria-hidden="true">
          <div className="dsb-saree dsb-saree--back dsb-saree--2">
            <img src="/murai/sarees/banarasi.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="dsb-saree dsb-saree--back dsb-saree--3">
            <img src="/murai/sarees/paithani.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="dsb-saree dsb-saree--hero">
            <div className="dsb-saree-mannequin" aria-hidden="true" />
            <div className="dsb-saree-shimmer" aria-hidden="true" />
            <img src="/murai/sarees/kanjivaram.webp" alt="Kanjivaram silk saree" loading="lazy" decoding="async" />
            <div className="dsb-saree-glints" aria-hidden="true">
              <span /><span /><span />
            </div>
          </div>
          <div className="dsb-saree-particles" aria-hidden="true">
            <span /><span /><span /><span /><span /><span />
          </div>
        </div>

        <div className="dsb-center">
          <div className="dsb-panel-cluster">
            <div className="dsb-panel-diyas" aria-hidden="true">
              <Diya size="xs" />
              <Diya size="xs" />
            </div>
            <div className="dsb-panel-stars" aria-hidden="true">
              <span /><span /><span /><span /><span />
              <span /><span /><span /><span /><span />
            </div>
            <div className="dsb-panel dsb-panel--round">
              <div className="dsb-panel-orbit" aria-hidden="true" />
              <div className="dsb-panel-ring" aria-hidden="true">
                <div className="dsb-panel-inner">
                  <span className="dsb-panel-sweep" aria-hidden="true" />
                  <div className="dsb-panel-copy">
                    <p className="dsb-text-happy">HAPPY</p>
                    <h2 className="dsb-text-diwali" id="diwali-sale-heading">
                      DIWALI
                    </h2>
                    <p className="dsb-text-subtitle">FESTIVE SAREE SALE</p>
                  </div>
                  <div className="dsb-panel-action">
                    <Link href="/shop" className="dsb-cta" aria-label="Shop Diwali festive saree sale">
                      SHOP NOW
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dsb-fireworks" id="dsb-fireworks" aria-hidden="true" />
      </div>
    </section>
  );
}
