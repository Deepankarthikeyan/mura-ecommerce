"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import "./ProductImage.css";

type ProductImageProps = {
  image: string;
  alt?: string;
  fallback?: string;
};

const DEFAULT_FALLBACK = "/assets/images/logo/logo-1-jpg.jpeg";
const ZOOM = 2.4;

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

const ProductImage = ({ image, alt, fallback = DEFAULT_FALLBACK }: ProductImageProps) => {
  const [src, setSrc] = useState(image);
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSrc(image);
    setZooming(false);
    setOrigin({ x: 50, y: 50 });
  }, [image]);

  const setFromPoint = (clientX: number, clientY: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    setOrigin({
      x: clamp(((clientX - rect.left) / rect.width) * 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100),
    });
  };

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setZooming(true);
      setFromPoint(event.clientX, event.clientY);
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!zooming && event.pointerType === "mouse") setZooming(true);
    if (zooming || event.pointerType === "mouse") {
      setFromPoint(event.clientX, event.clientY);
    }
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setZooming(false);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    event.preventDefault();
    setZooming(true);
    setFromPoint(event.clientX, event.clientY);
    frameRef.current?.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") setZooming(false);
  };

  if (!src) return null;

  return (
    <div className="thumb-wrapper one filterd-items figure">
      <div
        ref={frameRef}
        className={`product-thumb product-zoom${zooming ? " is-zoomed" : ""}`}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setZooming(false)}
        role="img"
        aria-label={alt ? `${alt} (hover or press to zoom)` : "Product image, hover or press to zoom"}
      >
        <img
          src={src}
          alt={alt || "Product"}
          draggable={false}
          onError={() => {
            if (src !== fallback) setSrc(fallback);
          }}
          style={{
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transform: zooming ? `scale(${ZOOM})` : "scale(1)",
          }}
        />
        <span className="product-zoom-hint" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default ProductImage;
