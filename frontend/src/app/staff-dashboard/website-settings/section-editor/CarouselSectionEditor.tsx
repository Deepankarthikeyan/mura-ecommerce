"use client";

import { useCallback, useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MAX_CAROUSEL_SLIDES,
  createEmptyCarouselSlide,
  type CarouselSlide,
} from "@/lib/homepageSections";

export type { CarouselSlide };

const MAX_SLIDES = MAX_CAROUSEL_SLIDES;

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

function createSlide(index: number): CarouselSlide {
  return createEmptyCarouselSlide(index);
}

type CarouselSectionEditorProps = {
  slides: CarouselSlide[];
  onChange: (slides: CarouselSlide[]) => void;
};

export default function CarouselSectionEditor({ slides, onChange }: CarouselSectionEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeIndex = slides.length === 0 ? -1 : Math.min(activeIndex, slides.length - 1);
  const activeSlide = safeIndex >= 0 ? slides[safeIndex] : null;

  const updateSlide = useCallback(
    (slideId: string, patch: Partial<CarouselSlide>) => {
      onChange(slides.map((slide) => (slide.id === slideId ? { ...slide, ...patch } : slide)));
    },
    [onChange, slides],
  );

  const updateActiveSlide = useCallback(
    (patch: Partial<CarouselSlide>) => {
      if (!activeSlide) return;
      updateSlide(activeSlide.id, patch);
    },
    [activeSlide, updateSlide],
  );

  const handleAddSlide = useCallback(() => {
    if (slides.length >= MAX_SLIDES) {
      toast.error(`You can add up to ${MAX_SLIDES} slides.`);
      return;
    }
    const next = [...slides, createSlide(slides.length + 1)];
    onChange(next);
    setActiveIndex(next.length - 1);
  }, [onChange, slides]);

  const handleRemoveSlide = useCallback(
    (index: number) => {
      if (slides.length <= 1) return;
      const next = slides.filter((_, i) => i !== index);
      onChange(next);
      setActiveIndex((current) => {
        if (current > index) return current - 1;
        if (current === index) return Math.max(0, index - 1);
        return current;
      });
    },
    [onChange, slides],
  );

  const handleImageFileSelected = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !activeSlide) return;

      const mime = file.type || "";
      if (!mime.startsWith("image/")) {
        toast.error("Please choose an image file.");
        return;
      }

      const slideId = activeSlide.id;
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

        updateSlide(slideId, { imageUrl: url });
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
    [activeSlide, updateSlide],
  );

  if (!activeSlide) {
    return (
      <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
        Add a slide to start editing this carousel.
      </p>
    );
  }

  const ctaDisabled = !activeSlide.ctaEnabled;

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
      <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>Carousel</p>

      <div
        role="tablist"
        aria-label="Carousel slides"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 4,
          borderBottom: "1px solid #e8e8e8",
          marginTop: 20,
        }}
      >
        {slides.map((slide, index) => {
          const active = index === safeIndex;
          return (
            <div key={slide.id} style={{ display: "flex", alignItems: "stretch" }}>
              <button
                type="button"
                role="tab"
                aria-selected={active}
                id={`carousel-slide-tab-${index}`}
                aria-controls={`carousel-slide-panel-${index}`}
                style={tabStyle(active)}
                onClick={() => setActiveIndex(index)}
              >
                Slide {index + 1}
              </button>
              {slides.length > 1 ? (
                <button
                  type="button"
                  aria-label={`Remove slide ${index + 1}`}
                  onClick={() => handleRemoveSlide(index)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: "0 6px 0 0",
                    fontSize: 12,
                  }}
                >
                  <i className="fa-light fa-xmark" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          );
        })}
        <button
          type="button"
          aria-label="Add slide"
          onClick={handleAddSlide}
          disabled={slides.length >= MAX_SLIDES || uploading}
          style={{
            ...tabStyle(false),
            fontWeight: 600,
            fontSize: 18,
            padding: "8px 14px",
            color: "var(--color-primary, #629D23)",
            opacity: slides.length >= MAX_SLIDES ? 0.4 : 1,
            cursor: slides.length >= MAX_SLIDES ? "not-allowed" : "pointer",
          }}
        >
          +
        </button>
      </div>

      <div
        role="tabpanel"
        id={`carousel-slide-panel-${safeIndex}`}
        aria-labelledby={`carousel-slide-tab-${safeIndex}`}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          marginTop: 20,
          textAlign: "left",
        }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="carousel-slide-image">
            Image{uploading ? " — uploading…" : ""}
          </label>
          <input
            ref={fileInputRef}
            key={activeSlide.id}
            id="carousel-slide-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageFileSelected}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {activeSlide.imageUrl ? (
              <img
                src={activeSlide.imageUrl}
                alt={activeSlide.altText || "Slide preview"}
                style={{
                  width: 120,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                }}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 72,
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
              {uploading ? "Uploading…" : activeSlide.imageUrl ? "Replace image" : "Upload image"}
            </button>
            {activeSlide.imageUrl ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => updateActiveSlide({ imageUrl: "" })}
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
          <label style={labelStyle} htmlFor="carousel-slide-alt">
            Alt image text
          </label>
          <input
            id="carousel-slide-alt"
            type="text"
            value={activeSlide.altText}
            onChange={(e) => updateActiveSlide({ altText: e.target.value })}
            placeholder="Describe the slide image"
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
            <label style={{ ...labelStyle, marginBottom: 0 }} htmlFor="carousel-slide-cta-link">
              CTA link
            </label>
            <label
              htmlFor="carousel-slide-cta-enabled"
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
                id="carousel-slide-cta-enabled"
                type="checkbox"
                checked={activeSlide.ctaEnabled}
                onChange={(e) => updateActiveSlide({ ctaEnabled: e.target.checked })}
                style={{ accentColor: "var(--color-primary, #629D23)", width: 16, height: 16 }}
              />
              Enable CTA button
            </label>
          </div>
          <input
            id="carousel-slide-cta-link"
            type="url"
            value={activeSlide.ctaLink}
            onChange={(e) => updateActiveSlide({ ctaLink: e.target.value })}
            placeholder="https://…"
            disabled={ctaDisabled}
            style={{
              ...inputStyle,
              background: ctaDisabled ? "#f3f4f6" : "#fff",
              color: ctaDisabled ? "#9ca3af" : "#111827",
            }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="carousel-slide-cta-name">
            CTA name
          </label>
          <input
            id="carousel-slide-cta-name"
            type="text"
            value={activeSlide.ctaName}
            onChange={(e) => updateActiveSlide({ ctaName: e.target.value })}
            placeholder="Shop now"
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

export function createDefaultCarouselSlides(): CarouselSlide[] {
  return [createEmptyCarouselSlide(1), createEmptyCarouselSlide(2)];
}
