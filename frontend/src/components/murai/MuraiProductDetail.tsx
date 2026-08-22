"use client";

import Link from "next/link";
import { useCart } from "@/components/header/CartContext";
import { parseMoneyAmount } from "@/lib/shopProductDisplay";
import { sanitizeProductDescriptionHtml } from "@/lib/sanitizeProductHtml";

type Props = {
  title: string;
  category?: string;
  images: string[];
  activeImage: string;
  onSelectImage: (src: string) => void;
  price?: string | number;
  mrp?: string | number;
  discountPercentage?: string | number;
  description?: string;
  loading?: boolean;
};

function formatInr(value?: string | number) {
  const n = parseMoneyAmount(value);
  return n != null ? `₹${n.toLocaleString("en-IN")}` : "";
}

export default function MuraiProductDetail({
  title,
  category,
  images,
  activeImage,
  onSelectImage,
  price,
  mrp,
  discountPercentage,
  description,
  loading,
}: Props) {
  const { addToCart } = useCart();

  if (loading) {
    return <div className="section"><div className="container"><p>Loading product...</p></div></div>;
  }

  const badge = discountPercentage && Number(discountPercentage) > 0
    ? `${Math.round(Number(discountPercentage))}% Off`
    : "Sale";

  return (
    <section className="section product-detail-murai">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-detail-gallery">
            <div className="product-detail-main-img">
              <img src={activeImage} alt={title} />
            </div>
            {images.length > 1 ? (
              <div className="product-detail-thumbs">
                {images.map((src) => (
                  <button key={src} type="button" className={src === activeImage ? "active" : ""} onClick={() => onSelectImage(src)}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="product-detail-info">
            {category ? <span className="suruchi-product-cat">{category}</span> : null}
            <h1 className="product-detail-title">{title}</h1>
            <div className="suruchi-stars">★★★★★</div>
            <span className="suruchi-product-badge" style={{ display: "inline-block", margin: "12px 0" }}>{badge}</span>
            <div className="suruchi-product-price" style={{ marginBottom: 20 }}>
              <span className="current" style={{ fontSize: 28 }}>{formatInr(price)}</span>
              {mrp && parseMoneyAmount(mrp)! > (parseMoneyAmount(price) ?? 0) ? (
                <span className="old">{formatInr(mrp)}</span>
              ) : null}
            </div>
            {description ? (
              <div
                className="rich-product-html rich-product-html--compact"
                dangerouslySetInnerHTML={{ __html: sanitizeProductDescriptionHtml(description) }}
              />
            ) : null}
            <div className="product-detail-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addToCart({
                    id: Date.now(),
                    image: activeImage,
                    title,
                    price: parseMoneyAmount(price) ?? 0,
                    quantity: 1,
                    active: true,
                  })
                }
              >
                Add to Cart
              </button>
              <Link href="/checkout" className="btn btn-secondary">Buy Now</Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .product-detail-main-img img {
          width: 100%;
          border-radius: 8px;
          border: 1px solid var(--suruchi-border, #ededed);
        }
        .product-detail-thumbs {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .product-detail-thumbs button {
          border: 2px solid transparent;
          border-radius: 6px;
          padding: 0;
          overflow: hidden;
          width: 72px;
          height: 72px;
          cursor: pointer;
          background: none;
        }
        .product-detail-thumbs button.active {
          border-color: #cf0653;
        }
        .product-detail-thumbs img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-detail-title {
          font-family: var(--font-heading), 'Playfair Display', serif;
          font-size: 32px;
          margin: 8px 0 12px;
          color: #2b2a29;
        }
        .product-detail-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>
    </section>
  );
}
