"use client";

import type { AllProductsConfig } from "@/lib/homepageSections";

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

type AllProductsSectionEditorProps = {
  config: AllProductsConfig;
  onChange: (config: AllProductsConfig) => void;
};

export default function AllProductsSectionEditor({ config, onChange }: AllProductsSectionEditorProps) {
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
      <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>All products</p>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>
        Uses the existing Our Products grid: search, category filter, and product cards.
      </p>

      <div style={{ marginTop: 20 }}>
        <label style={labelStyle} htmlFor="all-products-title">
          Section title
        </label>
        <input
          id="all-products-title"
          type="text"
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          placeholder="Our Products"
          style={inputStyle}
        />
      </div>
    </div>
  );
}
