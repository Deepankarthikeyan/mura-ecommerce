"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useCart } from "@/components/header/CartContext";
import type { DealsOfTheDayConfig } from "@/lib/homepageSections";
import { shopProductPathSegment } from "@/lib/productSlug";
import {
  badgeDiscountPercent,
  parseMoneyAmount,
  resolveProductListingImage,
  shouldShowMrpStrike,
} from "@/lib/shopProductDisplay";
import "./DealsOfTheDay.css";

type ProductRow = {
  _id?: string;
  productId?: string;
  slug?: string;
  urlSlug?: string;
  title?: string;
  price?: string | number;
  mrp?: string | number;
  discountPercentage?: string | number;
  image?: string;
  bannerImg?: string | string[];
};

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function pad2(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}

function remainingUntil(iso: string): Remaining {
  const end = new Date(iso).getTime();
  const diff = Number.isFinite(end) ? Math.max(0, end - Date.now()) : 0;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatInr(raw: string | number | undefined): string {
  const amount = parseMoneyAmount(raw);
  if (amount === null) return "";
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

type DealsOfTheDayProps = {
  config: DealsOfTheDayConfig;
  preview?: boolean;
};

export default function DealsOfTheDay({ config, preview = false }: DealsOfTheDayProps) {
  const { addToCart } = useCart();
  const [nowTick, setNowTick] = useState(0);
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [loading, setLoading] = useState(Boolean(config.productLookup));
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNowTick((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const lookup = config.productLookup.trim();
    if (!lookup) {
      setProduct(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<{ success?: boolean; body?: ProductRow }>(
          `/api/products?lookup=${encodeURIComponent(lookup)}`,
        );
        if (cancelled) return;
        setProduct(data?.success !== false && data?.body ? data.body : null);
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [config.productLookup]);

  const remaining = useMemo(() => remainingUntil(config.endsAt), [config.endsAt, nowTick]);
  const imageUrl = config.imageUrl.trim() || (product ? resolveProductListingImage(product) : "");
  const title = product?.title?.trim() || config.productTitle || "Featured product";
  const sale = formatInr(product?.price);
  const mrp = shouldShowMrpStrike(product?.price, product?.mrp) ? formatInr(product?.mrp) : "";
  const badge =
    config.discountBadge.trim() ||
    (product
      ? (() => {
          const pct = badgeDiscountPercent(product.discountPercentage, product.mrp, product.price);
          return pct ? `${pct}% OFF` : "";
        })()
      : "");
  const productHref = product && !preview ? `/shop/${shopProductPathSegment(product)}` : "";

  const handleAddToCart = () => {
    if (preview || !product) return;
    addToCart({
      id: Date.now(),
      image: imageUrl,
      title,
      price: parseMoneyAmount(product.price) ?? 0,
      quantity: 1,
      active: true,
    });
    setAdded(true);
    toast.success("Successfully Add To Cart !");
    window.setTimeout(() => setAdded(false), 4000);
  };

  return (
    <section className={`deals-of-the-day${preview ? " is-preview" : ""}`}>
      <div className={preview ? undefined : "container"}>
        <div className="deals-of-the-day__layout">
          <div>
            {config.eyebrow.trim() ? <p className="deals-of-the-day__eyebrow">{config.eyebrow}</p> : null}
            <h2 className="deals-of-the-day__title">{config.title || "Deals Of The Day"}</h2>
            {config.description.trim() ? <p className="deals-of-the-day__copy">{config.description}</p> : null}
            <div className="deals-of-the-day__timer" aria-label="Deal countdown">
              {(
                [
                  ["DAYS", remaining.days],
                  ["HOURS", remaining.hours],
                  ["MINS", remaining.minutes],
                  ["SECS", remaining.seconds],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="deals-of-the-day__unit">
                  <span className="deals-of-the-day__value">{pad2(value)}</span>
                  <span className="deals-of-the-day__label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="deals-of-the-day__card">
            {loading ? (
              <p className="deals-of-the-day__empty" style={{ gridColumn: "1 / -1" }}>
                Loading deal…
              </p>
            ) : !config.productLookup.trim() ? (
              <p className="deals-of-the-day__empty" style={{ gridColumn: "1 / -1" }}>
                Select a product in the section editor to feature this deal.
              </p>
            ) : (
              <>
                <div className="deals-of-the-day__media">
                  {imageUrl ? (
                    productHref ? (
                      <Link href={productHref}>
                        <img src={imageUrl} alt={title} />
                      </Link>
                    ) : (
                      <img src={imageUrl} alt={title} />
                    )
                  ) : null}
                </div>
                <div className="deals-of-the-day__details">
                  {badge ? <span className="deals-of-the-day__badge">{badge}</span> : null}
                  {productHref ? (
                    <Link href={productHref} className="deals-of-the-day__product-title">
                      {title}
                    </Link>
                  ) : (
                    <h3 className="deals-of-the-day__product-title">{title}</h3>
                  )}
                  <div className="deals-of-the-day__price">
                    {sale ? <span className="deals-of-the-day__sale">{sale}</span> : null}
                    {mrp ? <span className="deals-of-the-day__mrp">{mrp}</span> : null}
                  </div>
                  <div className="deals-of-the-day__stars" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <i key={index} className="fa-solid fa-star" />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="deals-of-the-day__cta"
                    disabled={preview}
                    onClick={handleAddToCart}
                  >
                    {added ? "ADDED" : "ADD TO CART"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
