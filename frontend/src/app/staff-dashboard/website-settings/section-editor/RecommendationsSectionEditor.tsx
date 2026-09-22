"use client";

import { useCallback, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { RecommendationsConfig } from "@/lib/homepageSections";

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: "#374151",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

type RecommendationsSectionEditorProps = {
  config: RecommendationsConfig;
  onChange: (config: RecommendationsConfig) => void;
};

export default function RecommendationsSectionEditor({
  config,
  onChange,
}: RecommendationsSectionEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const patch = useCallback(
    (partial: Partial<RecommendationsConfig>) => onChange({ ...config, ...partial }),
    [config, onChange],
  );

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
        patch({ promoImageUrl: url });
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
      <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>Recommendations</p>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>
        Existing four-column layout: Recently Added, Top Rated, Top Selling, and a promo banner.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-recent">
            Column 1 title
          </label>
          <input
            id="rec-recent"
            type="text"
            value={config.recentlyAddedTitle}
            onChange={(e) => patch({ recentlyAddedTitle: e.target.value })}
            placeholder="Recently Added"
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-rated">
            Column 2 title
          </label>
          <input
            id="rec-rated"
            type="text"
            value={config.topRatedTitle}
            onChange={(e) => patch({ topRatedTitle: e.target.value })}
            placeholder="Top Rated"
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-selling">
            Column 3 title
          </label>
          <input
            id="rec-selling"
            type="text"
            value={config.topSellingTitle}
            onChange={(e) => patch({ topSellingTitle: e.target.value })}
            placeholder="Top Selling"
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-tag">
            Promo badge
          </label>
          <input
            id="rec-tag"
            type="text"
            value={config.promoTag}
            onChange={(e) => patch({ promoTag: e.target.value })}
            placeholder="Weekend Discount"
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-headline">
            Promo headline
          </label>
          <input
            id="rec-headline"
            type="text"
            value={config.promoHeadline}
            onChange={(e) => patch({ promoHeadline: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-highlight">
            Promo highlight
          </label>
          <input
            id="rec-highlight"
            type="text"
            value={config.promoHighlight}
            onChange={(e) => patch({ promoHighlight: e.target.value })}
            placeholder="Flavors Vegetable"
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-cta">
            Promo button label
          </label>
          <input
            id="rec-cta"
            type="text"
            value={config.promoCtaLabel}
            onChange={(e) => patch({ promoCtaLabel: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-link">
            Promo link
          </label>
          <input
            id="rec-link"
            type="text"
            value={config.promoCtaLink}
            onChange={(e) => patch({ promoCtaLink: e.target.value })}
            placeholder="/shop"
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="rec-image">
            Promo image{uploading ? " — uploading…" : ""}
          </label>
          <input
            ref={fileInputRef}
            id="rec-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageFileSelected}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <img
              src={config.promoImageUrl || "/assets/images/add/01.jpg"}
              alt=""
              style={{
                width: 120,
                height: 160,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#f3f4f6",
              }}
            />
            <button
              type="button"
              className="rts-btn btn-primary"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: "8px 14px" }}
            >
              {uploading ? "Uploading…" : config.promoImageUrl ? "Replace image" : "Upload image"}
            </button>
            {config.promoImageUrl ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => patch({ promoImageUrl: "" })}
                style={{
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  borderRadius: 6,
                  padding: "8px 12px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontSize: 13,
                }}
              >
                Use default image
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
