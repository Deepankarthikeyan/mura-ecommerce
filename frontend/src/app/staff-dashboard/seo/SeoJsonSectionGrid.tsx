"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  SEO_SECTION_LABELS,
  SEO_SECTION_BADGES,
  getDefaultSeoContent,
  type SeoSectionKey,
  type SeoSectionBadge,
} from "@/lib/seo/defaultSeoContent";

const cardStyle: React.CSSProperties = {
  borderRadius: "8px",
  border: "1px solid #e8e8e8",
  background: "#fff",
  padding: "24px",
};

const textareaStyle: React.CSSProperties = {
  border: "1px solid #d0d0d0",
  borderRadius: "6px",
  padding: "8px 12px",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "monospace",
  fontSize: "13px",
  lineHeight: 1.5,
  resize: "vertical",
};

const badgeStyles: Record<SeoSectionBadge, React.CSSProperties> = {
  DYNAMIC: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    color: "#0d6efd",
    background: "#e7f1ff",
    border: "1px solid #b6d4fe",
  },
  STATIC: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    color: "#495057",
    background: "#f1f3f5",
    border: "1px solid #dee2e6",
  },
};

type SeoJsonSectionGridProps = {
  sectionKeys: readonly SeoSectionKey[];
  description?: string;
  loadingMessage?: string;
};

export default function SeoJsonSectionGrid({
  sectionKeys,
  description,
  loadingMessage = "Loading SEO settings…",
}: SeoJsonSectionGridProps) {
  const [sections, setSections] = useState<Record<SeoSectionKey, string>>(
    getDefaultSeoContent(),
  );
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<SeoSectionKey | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get<{ success?: boolean; sections?: Record<SeoSectionKey, string> }>(
          "/api/seo",
        );
        if (!cancelled && res.data?.success && res.data.sections) {
          setSections(res.data.sections);
        }
      } catch {
        if (!cancelled) {
          toast.error("Could not load saved SEO settings. Showing defaults.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = useCallback((key: SeoSectionKey, value: string) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(
    async (key: SeoSectionKey) => {
      const content = sections[key] ?? "";
      const trimmed = content.trim();

      if (trimmed) {
        try {
          JSON.parse(trimmed);
        } catch {
          toast.error(`${SEO_SECTION_LABELS[key]} must be valid JSON.`);
          return;
        }
      }

      setSavingKey(key);
      try {
        const res = await axios.put<{ success?: boolean; message?: string }>("/api/seo", {
          key,
          content,
        });
        if (res.data?.success) {
          toast.success(`${SEO_SECTION_LABELS[key]} saved.`);
        } else {
          toast.error(res.data?.message || "Save failed.");
        }
      } catch (err: unknown) {
        const msg =
          axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : "Save failed.";
        toast.error(msg);
      } finally {
        setSavingKey(null);
      }
    },
    [sections],
  );

  if (loading) {
    return <p style={{ marginTop: "16px", color: "#666" }}>{loadingMessage}</p>;
  }

  return (
    <div>
      {description ? (
        <p style={{ color: "#666", marginTop: "8px", marginBottom: "0" }}>{description}</p>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginTop: description ? "16px" : "8px",
          width: "100%",
        }}
      >
        {sectionKeys.map((key) => (
          <div key={key} className="card-body table-product-select" style={cardStyle}>
            <div style={{ marginBottom: "16px" }}>
              <h5
                style={{
                  margin: "0 0 8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  letterSpacing: "0.02em",
                }}
              >
                {SEO_SECTION_LABELS[key]}
              </h5>
              <span style={badgeStyles[SEO_SECTION_BADGES[key]]}>
                {SEO_SECTION_BADGES[key]}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <textarea
                id={`seo-${key}`}
                rows={10}
                value={sections[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                style={textareaStyle}
                spellCheck={false}
              />
              <button
                type="button"
                className="rts-btn btn-primary"
                style={{ padding: "10px 24px", alignSelf: "flex-start" }}
                disabled={savingKey === key}
                onClick={() => handleSave(key)}
              >
                {savingKey === key ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { badgeStyles, cardStyle, textareaStyle };
