"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { DealsOfTheDayConfig } from "@/lib/homepageSections";
import { resolveProductListingImage } from "@/lib/shopProductDisplay";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: "#374151",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

type ProductHit = {
  productId?: string;
  slug?: string;
  urlSlug?: string;
  title?: string;
  price?: string | number;
  image?: string;
  bannerImg?: string | string[];
};

function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function productLookupValue(product: ProductHit): string {
  return String(product.urlSlug || product.productId || product.slug || "").trim();
}

type DealsOfTheDaySectionEditorProps = {
  config: DealsOfTheDayConfig;
  onChange: (config: DealsOfTheDayConfig) => void;
};

export default function DealsOfTheDaySectionEditor({ config, onChange }: DealsOfTheDaySectionEditorProps) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ProductHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patch = useCallback(
    (partial: Partial<DealsOfTheDayConfig>) => {
      onChange({ ...config, ...partial });
    },
    [config, onChange],
  );

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await axios.get<{ success?: boolean; body?: ProductHit[] }>(
          `/api/products?search=${encodeURIComponent(term)}&limit=8`,
        );
        if (cancelled) return;
        setHits(Array.isArray(data?.body) ? data.body : []);
      } catch {
        if (!cancelled) setHits([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const handleImageFileSelected = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      if (!(file.type || "").startsWith("image/")) {
        toast.error("Please choose an image file.");
        return;
      }
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await axios.post<{
          success?: boolean;
          message?: string;
          data?: { url?: string };
        }>("/api/cloudinary/upload", formData);
        const url = data?.data?.url?.trim();
        if (!data?.success || !url) {
          toast.error(data?.message || "Upload failed.");
          return;
        }
        patch({ imageUrl: url });
        toast.success("Image uploaded.");
      } catch (err: unknown) {
        const msg =
          axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : "Upload failed.";
        toast.error(msg);
      } finally {
        setUploading(false);
      }
    },
    [patch],
  );

  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        Selected section
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>Deals of the day</p>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>
        Promotional copy, countdown, and one featured product.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="deals-eyebrow">
            Eyebrow
          </label>
          <input
            id="deals-eyebrow"
            type="text"
            value={config.eyebrow}
            onChange={(e) => patch({ eyebrow: e.target.value })}
            placeholder="HURRY UP AND GET 25% DISCOUNT"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="deals-title">
            Title
          </label>
          <input
            id="deals-title"
            type="text"
            value={config.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Deals Of The Day"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="deals-description">
            Description
          </label>
          <textarea
            id="deals-description"
            value={config.description}
            onChange={(e) => patch({ description: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="deals-ends">
            Countdown ends
          </label>
          <input
            id="deals-ends"
            type="datetime-local"
            value={toDatetimeLocal(config.endsAt)}
            onChange={(e) => {
              const next = e.target.value ? new Date(e.target.value) : null;
              patch({ endsAt: next && !Number.isNaN(next.getTime()) ? next.toISOString() : "" });
            }}
            style={{ ...inputStyle, maxWidth: 280 }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="deals-badge">
            Discount badge
          </label>
          <input
            id="deals-badge"
            type="text"
            value={config.discountBadge}
            onChange={(e) => patch({ discountBadge: e.target.value })}
            placeholder="25% OFF"
            style={{ ...inputStyle, maxWidth: 200 }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="deals-product-search">
            Featured product
          </label>
          {config.productLookup ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#fafafa",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                {config.productTitle || config.productLookup}
              </span>
              <button
                type="button"
                onClick={() => patch({ productLookup: "", productTitle: "" })}
                style={{
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  borderRadius: 6,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Change
              </button>
            </div>
          ) : null}
          <input
            id="deals-product-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog by product name"
            style={inputStyle}
          />
          {searching ? <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>Searching…</p> : null}
          {hits.length > 0 ? (
            <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, border: "1px solid #e5e7eb", borderRadius: 8 }}>
              {hits.map((hit) => {
                const lookup = productLookupValue(hit);
                const image = resolveProductListingImage(hit);
                return (
                  <li key={lookup || hit.title}>
                    <button
                      type="button"
                      onClick={() => {
                        patch({ productLookup: lookup, productTitle: String(hit.title || "").trim() });
                        setQuery("");
                        setHits([]);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 10px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={image}
                        alt=""
                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, background: "#f3f4f6" }}
                      />
                      <span>
                        <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                          {hit.title || lookup}
                        </span>
                        {hit.price != null ? (
                          <span style={{ display: "block", fontSize: 12, color: "#6b7280" }}>₹{String(hit.price)}</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="deals-image">
            Card image override{uploading ? " — uploading…" : ""}
          </label>
          <input
            ref={fileInputRef}
            id="deals-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageFileSelected}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {config.imageUrl ? (
              <img
                src={config.imageUrl}
                alt=""
                style={{
                  width: 120,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 80,
                  borderRadius: 8,
                  border: "1px dashed #d1d5db",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  fontSize: 12,
                }}
              >
                Product image
              </div>
            )}
            <button
              type="button"
              className="rts-btn btn-primary"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: "8px 14px" }}
            >
              {uploading ? "Uploading…" : config.imageUrl ? "Replace image" : "Upload image"}
            </button>
            {config.imageUrl ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => patch({ imageUrl: "" })}
                style={{
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  borderRadius: 6,
                  padding: "8px 12px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontSize: 13,
                }}
              >
                Use product image
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
