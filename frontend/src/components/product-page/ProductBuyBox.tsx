"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import {
  parseMoneyAmount,
  resolveProductListingImage,
  shouldShowMrpStrike,
} from "@/lib/shopProductDisplay";
import "./ProductBuyBox.css";

type ProductBuyBoxProduct = {
  _id?: string;
  productId?: string;
  title?: string;
  category?: string;
  quantity?: string;
  price?: string | number;
  mrp?: string | number;
  image?: string | null;
  bannerImg?: string | string[] | null;
  stock?: number;
  tags?: string[];
};

type ProductBuyBoxProps = {
  product: ProductBuyBoxProduct | null;
};

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// function isDeliveryPincodeValid(zip: string): boolean {
//   const normalized = zip.trim();
//   return /^\d{6}$/.test(normalized) && normalized.startsWith("6");
// }

// function deliveryEstimate(from = new Date()): string {
//   const date = new Date(from);
//   date.setDate(date.getDate() + 5);
//   return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
// }

function numericCartId(product: ProductBuyBoxProduct | null): number {
  const fromKey = Number(product?.productId);
  if (Number.isFinite(fromKey) && fromKey > 0) return fromKey;
  const raw = String(product?._id ?? "");
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || Date.now();
}

export default function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();
  const [qty, setQty] = useState(1);
  // const [pincode, setPincode] = useState("");
  // const [pincodeChecked, setPincodeChecked] = useState("");

  const sale = parseMoneyAmount(product?.price) ?? 0;
  const showMrp = shouldShowMrpStrike(product?.price, product?.mrp);
  const sku = String(product?.productId ?? "").trim() || "—";
  // const sizeRaw = String(product?.quantity ?? "").trim();
  // const sizeLabel = !sizeRaw || /^\d+(\.\d+)?$/.test(sizeRaw) ? "Free Size" : sizeRaw;
  const stock = typeof product?.stock === "number" && Number.isFinite(product.stock) ? product.stock : null;
  const outOfStock = stock !== null && stock <= 0;
  const image = resolveProductListingImage(product);
  const cartId = numericCartId(product);
  const wished = wishlistItems.some((item) => item.id === cartId);
  // const checkedValid = pincodeChecked ? isDeliveryPincodeValid(pincodeChecked) : null;

  // const eta = useMemo(() => deliveryEstimate(), []);

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart({
      id: cartId,
      image,
      title: product?.title ?? "Product",
      price: sale,
      quantity: qty,
      active: true,
    });
    toast.success("Successfully Added To Cart!");
  };

  const handleWishlist = () => {
    addToWishlist({
      id: cartId,
      image,
      title: product?.title ?? "Product",
      price: sale,
      quantity: 1,
    });
    toast.success("Successfully Added To Wishlist!");
  };

  // const checkPincode = () => {
  //   setPincodeChecked(pincode.trim());
  // };

  return (
    <div className="product-buybox">
      <h1 className="product-buybox__title">{product?.title}</h1>
      <p className="product-buybox__sku">SKU : {sku}</p>

      <div className="product-buybox__price-block">
        <p className="product-buybox__price">
          <span className="product-buybox__price-label">M.R.P.</span>
          <span className="product-buybox__price-current">{formatInr(sale)}</span>
          {showMrp ? <span className="product-buybox__price-old">{formatInr(parseMoneyAmount(product?.mrp) ?? 0)}</span> : null}
        </p>
        <p className="product-buybox__tax">(Incl. of all taxes)</p>
      </div>

      {image ? (
        <div className="product-buybox__field">
          <span className="product-buybox__label">Color</span>
          <div className="product-buybox__swatches">
            <button type="button" className="product-buybox__swatch is-selected" aria-label="Selected colour">
              <img src={image} alt="" />
            </button>
          </div>
        </div>
      ) : null}

      {/*
      <div className="product-buybox__field">
        <span className="product-buybox__label">Select size</span>
        <button type="button" className="product-buybox__size is-selected">
          Free Size
        </button>
      </div>
      */}
      {stock !== null ? (
        <p className={`product-buybox__stock${outOfStock ? " is-out" : ""}`}>
          {outOfStock ? "Out of stock" : `${stock} left`}
        </p>
      ) : null}

      <div className="product-buybox__field">
        <span className="product-buybox__label">Quantity</span>
        <div className="product-buybox__qty" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease quantity">
            −
          </button>
          <span>{qty}</span>
          <button
            type="button"
            onClick={() => setQty((n) => n + 1)}
            aria-label="Increase quantity"
            disabled={stock !== null && qty >= stock}
          >
            +
          </button>
        </div>
      </div>

      <div className="product-buybox__actions">
        <button type="button" className="product-buybox__cart" onClick={handleAdd} disabled={outOfStock}>
          <i className="fa-regular fa-cart-shopping" aria-hidden="true" />
          Add To Cart
        </button>
        <button
          type="button"
          className={`product-buybox__wish${wished ? " is-added" : ""}`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >
          <i className={wished ? "fa-solid fa-heart" : "fa-regular fa-heart"} aria-hidden="true" />
        </button>
      </div>

      <ul className="product-buybox__meta">
        {/*
        <li>
          <i className="fa-regular fa-location-dot" aria-hidden="true" />
          <span>
            Deliver to{" "}
            <label className="product-buybox__pin">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setPincodeChecked("");
                }}
                onBlur={checkPincode}
                aria-label="Delivery pincode"
              />
            </label>
            {checkedValid === true ? ` . Get it by ${eta}` : null}
            {checkedValid === false ? " . Delivery not available for this pincode" : null}
          </span>
        </li>
        */}
        <li className="is-alert">
          <i className="fa-regular fa-wallet" aria-hidden="true" />
          <span>Cash on Delivery is not available</span>
        </li>
        <li>
          <i className="fa-regular fa-truck" aria-hidden="true" />
          <span>Shipping calculated at checkout</span>
        </li>
        <li>
          <i className="fa-regular fa-box" aria-hidden="true" />
          <span>
            Returns as per store policy.{" "}
            <Link href="/return-refund-replacement-policy">Read More</Link>
          </span>
        </li>
      </ul>
    </div>
  );
}
