"use client";

import { useEffect, useState } from "react";
import { useMuraiProducts } from "@/hooks/useMuraiProducts";
import { useCart } from "@/components/header/CartContext";
import { parseMoneyAmount, resolveProductListingImage } from "@/lib/shopProductDisplay";

const STATIC_DEAL = {
  title: "Banarasi Silk Saree",
  price: 3599,
  mrp: 5999,
  discountPercentage: 25,
  image: "/assets/images/murai/sarees/banarasi.webp",
};

function formatInr(value?: string | number) {
  const n = parseMoneyAmount(value);
  return n != null ? `₹${n.toLocaleString("en-IN")}` : "";
}

export default function MuraiDealsSection() {
  const { grouped } = useMuraiProducts();
  const { addToCart } = useCart();
  const deal = grouped.deal ?? STATIC_DEAL;
  const [countdown, setCountdown] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });

  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 3);
    end.setHours(23, 59, 59, 0);

    const tick = () => {
      const diff = Math.max(0, end.getTime() - Date.now());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(mins).padStart(2, "0"),
        secs: String(secs).padStart(2, "0"),
      });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const image = resolveProductListingImage(deal);
  const discount = deal.discountPercentage
    ? `${Math.round(Number(deal.discountPercentage))}% Off`
    : "25% Off";

  return (
    <section className="deals-section">
      <div className="deals-inner">
        <div className="deals-content">
          <p className="deals-tag">Hurry up and Get 25% Discount</p>
          <h2>Deals Of The Day</h2>
          <p>Don&apos;t miss out on our exclusive daily saree deals. Limited stock on handwoven silk and cotton sarees.</p>
          <div className="countdown">
            <div className="countdown-item"><span className="num">{countdown.days}</span><span className="label">Days</span></div>
            <div className="countdown-item"><span className="num">{countdown.hours}</span><span className="label">Hours</span></div>
            <div className="countdown-item"><span className="num">{countdown.mins}</span><span className="label">Mins</span></div>
            <div className="countdown-item"><span className="num">{countdown.secs}</span><span className="label">Secs</span></div>
          </div>
        </div>
        <div className="deals-product">
          <div className="deals-product-img">
            <img src={image} alt={deal.title ?? "Deal product"} loading="lazy" decoding="async" />
          </div>
          <div className="deals-product-info">
            <span className="suruchi-product-badge" style={{ position: "static", display: "inline-block", marginBottom: 12 }}>
              {discount}
            </span>
            <h3 className="suruchi-product-name" style={{ fontSize: 22 }}>{deal.title}</h3>
            <div className="suruchi-product-price" style={{ margin: "12px 0" }}>
              <span className="current" style={{ fontSize: 24 }}>{formatInr(deal.price)}</span>
              {deal.mrp ? <span className="old">{formatInr(deal.mrp)}</span> : null}
            </div>
            <div className="suruchi-stars" style={{ marginBottom: 20 }}>★★★★★</div>
            <button
              className="btn btn-primary add-to-cart"
              type="button"
              onClick={() =>
                addToCart({
                  id: Date.now(),
                  image,
                  title: deal.title ?? "Product",
                  price: parseMoneyAmount(deal.price) ?? 0,
                  quantity: 1,
                  active: true,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
