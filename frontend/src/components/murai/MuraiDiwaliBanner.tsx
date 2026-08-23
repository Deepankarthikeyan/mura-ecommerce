"use client";

import Link from "next/link";
import { type ReactNode, useEffect } from "react";

type MuraiDiwaliBannerProps = {
  heroImage?: string;
  backImage1?: string;
  backImage2?: string;
};

function Diya({ size }: { size?: "xs" | "sm" }) {
  return (
    <div className={`dsb-diya ${size ? `dsb-diya--${size}` : ""}`}>
      <span className="dsb-diya-glow" />
      <span className="dsb-diya-flame" />
      <span className="dsb-diya-body" />
    </div>
  );
}

function Hanging({ className, children }: { className: string; children: ReactNode }) {
  return <div className={`dsb-hang ${className}`}>{children}</div>;
}

export default function MuraiDiwaliBanner({
  heroImage = "/murai/images/sarees/kanjivaram.webp",
  backImage1 = "/murai/images/sarees/banarasi.webp",
  backImage2 = "/murai/images/sarees/paithani.webp",
}: MuraiDiwaliBannerProps) {
  useEffect(() => {
    const existing = document.querySelector('script[data-murai-diwali="1"]');
    if (existing) return;

    const script = document.createElement("script");
    script.src = "/murai/js/diwali-banner.js";
    script.async = true;
    script.dataset.muraiDiwali = "1";
    document.body.appendChild(script);
  }, []);

  return (
    <section className="diwali-sale-banner" id="diwali-sale-banner" aria-labelledby="diwali-sale-heading">
      <div className="dsb-bg" aria-hidden="true">
        <div className="dsb-bg-gradient" />
        <div className="dsb-bg-pattern" />
        <div className="dsb-bg-glow" />
        <div className="dsb-banner-sweep" />
      </div>

      <div className="dsb-rangoli dsb-rangoli--bl" aria-hidden="true" />
      <div className="dsb-rangoli dsb-rangoli--br" aria-hidden="true" />

      <div className="dsb-sparkles" aria-hidden="true">
        {["✦", "✧", "⋆", "✹", "✺", "✦", "✧", "⋆", "✹", "✺", "✦", "✧"].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      <div className="dsb-hangings" aria-hidden="true">
        <Hanging className="dsb-hang--1">
          <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bell" />
          <Diya />
        </Hanging>
        <Hanging className="dsb-hang--2">
          <span className="dsb-bead-string" /><span className="dsb-flower" /><span className="dsb-bead" />
          <Diya />
        </Hanging>
        <Hanging className="dsb-hang--3">
          <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bead" />
          <Diya />
        </Hanging>
        <Hanging className="dsb-hang--4">
          <span className="dsb-bead-string" /><span className="dsb-bell" />
          <Diya />
        </Hanging>
        <Hanging className="dsb-hang--5">
          <span className="dsb-bead-string" /><span className="dsb-flower" /><span className="dsb-bead" />
          <Diya />
        </Hanging>
        <Hanging className="dsb-hang--6">
          <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bell" />
          <Diya />
        </Hanging>
        <Hanging className="dsb-hang--7">
          <span className="dsb-bead-string" /><span className="dsb-bead" />
          <Diya />
        </Hanging>
        <Hanging className="dsb-hang--8">
          <span className="dsb-bead-string" /><span className="dsb-flower" />
          <Diya />
        </Hanging>
      </div>

      <div className="dsb-corner-diyas" aria-hidden="true">
        {["tl", "tr", "bl", "br"].map((pos) => (
          <div key={pos} className={`dsb-corner-diya dsb-corner-diya--${pos}`}>
            <Diya size="sm" />
          </div>
        ))}
      </div>

      <div className="dsb-layout">
        <div className="dsb-sarees" aria-hidden="true">
          <div className="dsb-saree dsb-saree--back dsb-saree--2">
            <img src={backImage1} alt="" loading="lazy" />
          </div>
          <div className="dsb-saree dsb-saree--back dsb-saree--3">
            <img src={backImage2} alt="" loading="lazy" />
          </div>
          <div className="dsb-saree dsb-saree--hero">
            <div className="dsb-saree-mannequin" aria-hidden="true" />
            <div className="dsb-saree-shimmer" aria-hidden="true" />
            <img src={heroImage} alt="Kanjivaram silk saree" loading="lazy" />
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
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>
            <div className="dsb-panel dsb-panel--round">
              <div className="dsb-panel-orbit" aria-hidden="true" />
              <div className="dsb-panel-ring" aria-hidden="true">
                <div className="dsb-panel-inner">
                  <span className="dsb-panel-sweep" aria-hidden="true" />
                  <div className="dsb-panel-copy">
                    <p className="dsb-text-happy">HAPPY</p>
                    <h2 className="dsb-text-diwali" id="diwali-sale-heading">DIWALI</h2>
                    <p className="dsb-text-subtitle">FESTIVE SAREE SALE</p>
                  </div>
                  <div className="dsb-panel-action">
                    <p className="dsb-text-offer">UP TO 70% OFF</p>
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
