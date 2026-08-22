"use client";

import Link from "next/link";
import Script from "next/script";

export default function MuraiDiwaliBanner() {
  return (
    <>
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
          <span>✦</span><span>✧</span><span>⋆</span><span>✹</span><span>✺</span>
          <span>✦</span><span>✧</span><span>⋆</span><span>✹</span><span>✺</span>
          <span>✦</span><span>✧</span>
        </div>

        <div className="dsb-hangings" aria-hidden="true">
          <div className="dsb-hang dsb-hang--1">
            <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bell" />
            <div className="dsb-diya"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
          </div>
          <div className="dsb-hang dsb-hang--2">
            <span className="dsb-bead-string" /><span className="dsb-flower" /><span className="dsb-bead" />
            <div className="dsb-diya"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
          </div>
          <div className="dsb-hang dsb-hang--3">
            <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bead" />
            <div className="dsb-diya"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
          </div>
          <div className="dsb-hang dsb-hang--4">
            <span className="dsb-bead-string" /><span className="dsb-bell" />
            <div className="dsb-diya"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
          </div>
          <div className="dsb-hang dsb-hang--5">
            <span className="dsb-bead-string" /><span className="dsb-flower" /><span className="dsb-bead" />
            <div className="dsb-diya"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
          </div>
          <div className="dsb-hang dsb-hang--6">
            <span className="dsb-bead-string" /><span className="dsb-bead" /><span className="dsb-bell" />
            <div className="dsb-diya"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
          </div>
          <div className="dsb-hang dsb-hang--7">
            <span className="dsb-bead-string" /><span className="dsb-bead" />
            <div className="dsb-diya"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
          </div>
          <div className="dsb-hang dsb-hang--8">
            <span className="dsb-bead-string" /><span className="dsb-flower" />
            <div className="dsb-diya"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
          </div>
        </div>

        <div className="dsb-corner-diyas" aria-hidden="true">
          <div className="dsb-corner-diya dsb-corner-diya--tl"><div className="dsb-diya dsb-diya--sm"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div></div>
          <div className="dsb-corner-diya dsb-corner-diya--tr"><div className="dsb-diya dsb-diya--sm"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div></div>
          <div className="dsb-corner-diya dsb-corner-diya--bl"><div className="dsb-diya dsb-diya--sm"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div></div>
          <div className="dsb-corner-diya dsb-corner-diya--br"><div className="dsb-diya dsb-diya--sm"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div></div>
        </div>

        <div className="dsb-layout">
          <div className="dsb-sarees" aria-hidden="true">
            <div className="dsb-saree dsb-saree--back dsb-saree--2">
              <img src="/assets/images/murai/sarees/banarasi.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="dsb-saree dsb-saree--back dsb-saree--3">
              <img src="/assets/images/murai/sarees/paithani.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="dsb-saree dsb-saree--hero">
              <div className="dsb-saree-mannequin" aria-hidden="true" />
              <div className="dsb-saree-shimmer" aria-hidden="true" />
              <img src="/assets/images/murai/sarees/kanjivaram.webp" alt="Kanjivaram silk saree" loading="lazy" decoding="async" />
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
                <div className="dsb-diya dsb-diya--xs"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
                <div className="dsb-diya dsb-diya--xs"><span className="dsb-diya-glow" /><span className="dsb-diya-flame" /><span className="dsb-diya-body" /></div>
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
                      <h2 className="dsb-text-diwali" id="diwali-sale-heading">DIWALI</h2>
                      <p className="dsb-text-subtitle">FESTIVE SAREE SALE</p>
                    </div>
                    <div className="dsb-panel-action">
                      <p className="dsb-text-offer">UP TO 70% OFF</p>
                      <Link href="/shop" className="dsb-cta" aria-label="Shop Diwali festive saree sale">SHOP NOW</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dsb-fireworks" id="dsb-fireworks" aria-hidden="true" />
        </div>
      </section>
      <Script src="/assets/js/murai/diwali-banner.js" strategy="afterInteractive" />
    </>
  );
}
