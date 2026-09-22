"use client";

import type { CSSProperties } from "react";
import type { NewsletterConfig } from "@/lib/homepageSections";

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

type NewsletterSectionEditorProps = {
  config: NewsletterConfig;
  onChange: (config: NewsletterConfig) => void;
};

export default function NewsletterSectionEditor({ config, onChange }: NewsletterSectionEditorProps) {
  const patch = (partial: Partial<NewsletterConfig>) => onChange({ ...config, ...partial });

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
      <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>Newsletter</p>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>
        Full-width subscribe banner. Emails are saved when visitors subscribe.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="newsletter-title">
            Title
          </label>
          <input
            id="newsletter-title"
            type="text"
            value={config.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Join Our Newsletter"
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="newsletter-description">
            Description
          </label>
          <textarea
            id="newsletter-description"
            value={config.description}
            onChange={(e) => patch({ description: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="newsletter-placeholder">
            Email placeholder
          </label>
          <input
            id="newsletter-placeholder"
            type="text"
            value={config.placeholder}
            onChange={(e) => patch({ placeholder: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="newsletter-button">
            Button label
          </label>
          <input
            id="newsletter-button"
            type="text"
            value={config.buttonLabel}
            onChange={(e) => patch({ buttonLabel: e.target.value })}
            style={{ ...inputStyle, maxWidth: 220 }}
          />
        </div>
      </div>
    </div>
  );
}
