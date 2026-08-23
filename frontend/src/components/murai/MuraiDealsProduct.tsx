"use client";

import { useCart } from "@/components/header/CartContext";
import { parseMoneyAmount } from "@/lib/shopProductDisplay";
import {
  formatInr,
  getProductSlug,
  getStableProductId,
  productCardImage,
  productPricing,
} from "@/lib/murai/productUtils";
import type { StoreProduct } from "@/lib/murai/types";
import { useMuraiNotify } from "./MuraiNotification";

type MuraiDealsProductProps = {
  product: StoreProduct;
};

export default function MuraiDealsProduct({ product }: MuraiDealsProductProps) {
  const { addToCart } = useCart();
  const notify = useMuraiNotify();
  const pricing = productPricing(product);

  const handleAddToCart = () => {
    addToCart({
      id: getStableProductId(product),
      slug: getProductSlug(product),
      image: productCardImage(product),
      title: product.title ?? "Saree",
      price: parseMoneyAmount(product.price) ?? 0,
      quantity: 1,
      active: true,
    });
    notify(`${product.title ?? "Saree"} added to cart!`);
  };

  return (
    <div className="deals-product">
      <div className="deals-product-img">
        <img src={productCardImage(product)} alt={product.title ?? ""} />
      </div>
      <div className="deals-product-info">
        <span className="suruchi-product-badge" style={{ position: "static", display: "inline-block", marginBottom: 12 }}>
          {pricing.badge ? `${pricing.badge}% Off` : "25% Off"}
        </span>
        <h3 className="suruchi-product-name" style={{ fontSize: 22 }}>{product.title}</h3>
        <div className="suruchi-product-price" style={{ margin: "12px 0" }}>
          <span className="current" style={{ fontSize: 24 }}>{formatInr(product.price)}</span>
          {pricing.showMrp ? <span className="old">{formatInr(product.mrp)}</span> : null}
        </div>
        <div className="suruchi-stars" style={{ marginBottom: 20 }}>★★★★★</div>
        <button className="btn btn-primary add-to-cart" type="button" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
