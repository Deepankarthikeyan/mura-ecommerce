"use client";

import { useEffect, useState } from "react";

type ProductImageProps = {
  image: string;
  alt?: string;
  fallback?: string;
};

const DEFAULT_FALLBACK = "/assets/images/logo/logo-1-jpg.jpeg";

const ProductImage = ({ image, alt, fallback = DEFAULT_FALLBACK }: ProductImageProps) => {
  const [src, setSrc] = useState(image);

  useEffect(() => {
    setSrc(image);
  }, [image]);

  if (!src) return null;

  return (
    <div className="thumb-wrapper one filterd-items figure">
      <div className="product-thumb">
        <img
          src={src}
          alt={alt || "Product"}
          onError={() => {
            if (src !== fallback) setSrc(fallback);
          }}
          style={{
            width: "100%",
            height: "auto",
            minHeight: 280,
            maxHeight: 520,
            objectFit: "contain",
            display: "block",
            background: "#fff",
          }}
        />
      </div>
    </div>
  );
};

export default ProductImage;
