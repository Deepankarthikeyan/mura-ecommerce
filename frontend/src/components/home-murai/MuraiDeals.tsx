"use client";

import { useEffect, useState } from "react";
import { DEAL_PRODUCT, formatInr } from "./murai-data";
import { useDealActions } from "./MuraiProductCard";

function pad2(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

export default function MuraiDeals() {
  const addDeal = useDealActions();
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 3);
    end.setHours(23, 59, 59, 0);

    const tick = () => {
      const diff = Math.max(0, end.getTime() - Date.now());
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="deals-section">
      <div className="deals-inner">
        <div className="deals-content">
          <h2>Deals Of The Day</h2>
          <p>Don&apos;t miss out on our exclusive daily saree deals. Limited stock on handwoven silk and cotton sarees.</p>
          <div className="countdown">
            <div className="countdown-item">
              <span className="num">{pad2(remaining.days)}</span>
              <span className="label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="num">{pad2(remaining.hours)}</span>
              <span className="label">Hours</span>
            </div>
            <div className="countdown-item">
              <span className="num">{pad2(remaining.minutes)}</span>
              <span className="label">Mins</span>
            </div>
            <div className="countdown-item">
              <span className="num">{pad2(remaining.seconds)}</span>
              <span className="label">Secs</span>
            </div>
          </div>
        </div>
        <div className="deals-product">
          <div className="deals-product-img">
            <img src={DEAL_PRODUCT.img} alt={DEAL_PRODUCT.name} loading="lazy" decoding="async" />
          </div>
          <div className="deals-product-info">
            <h3 className="suruchi-product-name" style={{ fontSize: 22 }}>
              {DEAL_PRODUCT.name}
            </h3>
            <div className="suruchi-product-price" style={{ margin: "12px 0" }}>
              <span className="current" style={{ fontSize: 24 }}>
                {formatInr(DEAL_PRODUCT.price)}
              </span>
            </div>
            <div className="suruchi-stars" style={{ marginBottom: 20 }}>
              ★★★★★
            </div>
            <button className="btn btn-primary add-to-cart" type="button" onClick={addDeal}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
