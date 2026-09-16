"use client";

import { useCallback, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DISCOUNT_CARD_SLOTS, type DiscountCard } from "@/lib/homepageSections";

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

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: "10px 16px",
    border: "none",
    borderBottom: active ? "2px solid var(--color-primary, #629D23)" : "2px solid transparent",
    background: "transparent",
    color: active ? "var(--color-primary, #629D23)" : "#666",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };
}

function UploadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

type DiscountsSectionEditorProps = {
  cards: DiscountCard[];
  onChange: (cards: DiscountCard[]) => void;
};

export default function DiscountsSectionEditor({ cards, onChange }: DiscountsSectionEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeIndex = cards.length === 0 ? -1 : Math.min(activeIndex, cards.length - 1);
  const activeCard = safeIndex >= 0 ? cards[safeIndex] : null;
  const activeSlot = DISCOUNT_CARD_SLOTS[safeIndex];

  const updateCard = useCallback(
    (cardId: string, patch: Partial<DiscountCard>) => {
      onChange(cards.map((card) => (card.id === cardId ? { ...card, ...patch } : card)));
    },
    [onChange, cards],
  );

  const updateActiveCard = useCallback(
    (patch: Partial<DiscountCard>) => {
      if (!activeCard) return;
      updateCard(activeCard.id, patch);
    },
    [activeCard, updateCard],
  );

  const handleImageFileSelected = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !activeCard) return;

      const mime = file.type || "";
      if (!mime.startsWith("image/")) {
        toast.error("Please choose an image file.");
        return;
      }

      const cardId = activeCard.id;
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

        updateCard(cardId, { imageUrl: url });
        toast.success("Image uploaded.");
      } catch (err: unknown) {
        const msg =
          axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : err instanceof Error
              ? err.message
              : "Upload failed.";
        toast.error(msg);
      } finally {
        setUploading(false);
      }
    },
    [activeCard, updateCard],
  );

  if (!activeCard) {
    return (
      <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
        Discount cards could not be loaded. Remove and re-add this section.
      </p>
    );
  }

  const ctaDisabled = !activeCard.ctaEnabled;

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
      <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>Discounts</p>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>
        Four promotional cards in a bento layout. Upload a Cloudinary image for each slot.
      </p>

      <div
        role="tablist"
        aria-label="Discount cards"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 4,
          borderBottom: "1px solid #e8e8e8",
          marginTop: 20,
        }}
      >
        {cards.map((card, index) => {
          const active = index === safeIndex;
          const slot = DISCOUNT_CARD_SLOTS[index];
          return (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={active}
              id={`discount-card-tab-${index}`}
              aria-controls={`discount-card-panel-${index}`}
              style={tabStyle(active)}
              onClick={() => setActiveIndex(index)}
            >
              {slot?.label ?? `Card ${index + 1}`}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`discount-card-panel-${safeIndex}`}
        aria-labelledby={`discount-card-tab-${safeIndex}`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          marginTop: 20,
          textAlign: "left",
        }}
      >
        {activeSlot ? (
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
            Editing {activeSlot.label.toLowerCase()} card
          </p>
        ) : null}

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="discount-card-image">
            Image{uploading ? " — uploading…" : ""}
          </label>
          <input
            ref={fileInputRef}
            key={activeCard.id}
            id="discount-card-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageFileSelected}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {activeCard.imageUrl ? (
              <img
                src={activeCard.imageUrl}
                alt={activeCard.altText || "Discount card preview"}
                style={{
                  width: 160,
                  height: 96,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                }}
              />
            ) : (
              <div
                style={{
                  width: 160,
                  height: 96,
                  borderRadius: 8,
                  border: "1px dashed #d1d5db",
                  background: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  fontSize: 12,
                }}
              >
                No image
              </div>
            )}
            <button
              type="button"
              className="rts-btn btn-primary"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: "8px 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <UploadIcon />
              {uploading ? "Uploading…" : activeCard.imageUrl ? "Replace image" : "Upload image"}
            </button>
            {activeCard.imageUrl ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => updateActiveCard({ imageUrl: "" })}
                style={{
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  borderRadius: 6,
                  padding: "8px 12px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  color: "#374151",
                  fontSize: 13,
                }}
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="discount-card-alt">
            Alt image text
          </label>
          <input
            id="discount-card-alt"
            type="text"
            value={activeCard.altText}
            onChange={(e) => updateActiveCard({ altText: e.target.value })}
            placeholder="Describe the card image"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="discount-card-tag">
            Tag
          </label>
          <input
            id="discount-card-tag"
            type="text"
            value={activeCard.tag}
            onChange={(e) => updateActiveCard({ tag: e.target.value })}
            placeholder="40% OFF"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="discount-card-headline">
            Headline
          </label>
          <input
            id="discount-card-headline"
            type="text"
            value={activeCard.headline}
            onChange={(e) => updateActiveCard({ headline: e.target.value })}
            placeholder="Silk Saree Sale"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <label style={{ ...labelStyle, marginBottom: 0 }} htmlFor="discount-card-cta-link">
              CTA link
            </label>
            <label
              htmlFor="discount-card-cta-enabled"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#374151",
                cursor: "pointer",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              <input
                id="discount-card-cta-enabled"
                type="checkbox"
                checked={activeCard.ctaEnabled}
                onChange={(e) => updateActiveCard({ ctaEnabled: e.target.checked })}
                style={{ accentColor: "var(--color-primary, #629D23)", width: 16, height: 16 }}
              />
              Enable CTA
            </label>
          </div>
          <input
            id="discount-card-cta-link"
            type="text"
            value={activeCard.ctaLink}
            onChange={(e) => updateActiveCard({ ctaLink: e.target.value })}
            placeholder="https://… or /shop"
            disabled={ctaDisabled}
            style={{
              ...inputStyle,
              background: ctaDisabled ? "#f3f4f6" : "#fff",
              color: ctaDisabled ? "#9ca3af" : "#111827",
            }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="discount-card-cta-name">
            CTA name
          </label>
          <input
            id="discount-card-cta-name"
            type="text"
            value={activeCard.ctaName}
            onChange={(e) => updateActiveCard({ ctaName: e.target.value })}
            placeholder="SHOP NOW"
            disabled={ctaDisabled}
            style={{
              ...inputStyle,
              background: ctaDisabled ? "#f3f4f6" : "#fff",
              color: ctaDisabled ? "#9ca3af" : "#111827",
            }}
          />
        </div>
      </div>
    </div>
  );
}
