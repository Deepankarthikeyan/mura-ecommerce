"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  MAX_CATEGORY_PRODUCTS,
  MAX_CATEGORY_TABS,
  type CategoryProductsConfig,
} from "@/lib/homepageSections";

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

type CategoryProductsSectionEditorProps = {
  config: CategoryProductsConfig;
  onChange: (config: CategoryProductsConfig) => void;
};

export default function CategoryProductsSectionEditor({
  config,
  onChange,
}: CategoryProductsSectionEditorProps) {
  const [catalog, setCatalog] = useState<string[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get<{ success?: boolean; body?: unknown }>("/api/products?categories=true");
        if (cancelled) return;
        const list = Array.isArray(data?.body) ? data.body.map(String).filter(Boolean) : [];
        setCatalog(list);
      } catch {
        if (!cancelled) setCatalogError("Could not load product categories.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = useCallback(
    (partial: Partial<CategoryProductsConfig>) => {
      onChange({ ...config, ...partial });
    },
    [config, onChange],
  );

  const addCategory = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      if (config.categories.some((item) => item.toLowerCase() === trimmed.toLowerCase())) return;
      if (config.categories.length >= MAX_CATEGORY_TABS) return;
      patch({ categories: [...config.categories, trimmed] });
    },
    [config.categories, patch],
  );

  const removeCategory = useCallback(
    (name: string) => {
      patch({ categories: config.categories.filter((item) => item !== name) });
    },
    [config.categories, patch],
  );

  const moveCategory = useCallback(
    (index: number, direction: -1 | 1) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= config.categories.length) return;
      const next = [...config.categories];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      patch({ categories: next });
    },
    [config.categories, patch],
  );

  const unusedCatalog = catalog.filter(
    (name) => !config.categories.some((item) => item.toLowerCase() === name.toLowerCase()),
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
      <p style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 600, color: "#1a1a1a" }}>Category products</p>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6b7280" }}>
        Centered title, category tabs, and a product row from your catalog.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="category-products-title">
            Section title
          </label>
          <input
            id="category-products-title"
            type="text"
            value={config.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="Sale Sarees"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="category-products-limit">
            Products per tab
          </label>
          <input
            id="category-products-limit"
            type="number"
            min={1}
            max={MAX_CATEGORY_PRODUCTS}
            value={config.productLimit}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!Number.isFinite(value)) return;
              patch({
                productLimit: Math.min(MAX_CATEGORY_PRODUCTS, Math.max(1, Math.round(value))),
              });
            }}
            style={{ ...inputStyle, maxWidth: 120 }}
          />
        </div>

        <div style={fieldStyle}>
          <span style={labelStyle}>Tabs ({config.categories.length}/{MAX_CATEGORY_TABS})</span>
          {config.categories.length === 0 ? (
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "#6b7280" }}>
              Add categories below. Tab order is the order they appear on the homepage.
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: "0 0 12px", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {config.categories.map((name, index) => (
                <li
                  key={`${name}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    background: "#fafafa",
                  }}
                >
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{name}</span>
                  <button
                    type="button"
                    aria-label={`Move ${name} up`}
                    disabled={index === 0}
                    onClick={() => moveCategory(index, -1)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: index === 0 ? "not-allowed" : "pointer",
                      color: "#6b7280",
                    }}
                  >
                    <i className="fa-light fa-chevron-up" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${name} down`}
                    disabled={index === config.categories.length - 1}
                    onClick={() => moveCategory(index, 1)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: index === config.categories.length - 1 ? "not-allowed" : "pointer",
                      color: "#6b7280",
                    }}
                  >
                    <i className="fa-light fa-chevron-down" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${name}`}
                    onClick={() => removeCategory(name)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#9ca3af",
                    }}
                  >
                    <i className="fa-light fa-xmark" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {catalogError ? <p style={{ margin: "0 0 8px", fontSize: 13, color: "#b91c1c" }}>{catalogError}</p> : null}

          {unusedCatalog.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {unusedCatalog.map((name) => (
                <button
                  key={name}
                  type="button"
                  disabled={config.categories.length >= MAX_CATEGORY_TABS}
                  onClick={() => addCategory(name)}
                  style={{
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 13,
                    cursor: config.categories.length >= MAX_CATEGORY_TABS ? "not-allowed" : "pointer",
                    color: "#374151",
                  }}
                >
                  + {name}
                </button>
              ))}
            </div>
          ) : catalog.length > 0 ? (
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>All catalog categories are already added.</p>
          ) : !catalogError ? (
            <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>No product categories found yet.</p>
          ) : null}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Custom tab name"
              style={{ ...inputStyle, flex: 1, minWidth: 180 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCategory(customName);
                  setCustomName("");
                }
              }}
            />
            <button
              type="button"
              className="rts-btn btn-primary"
              disabled={!customName.trim() || config.categories.length >= MAX_CATEGORY_TABS}
              onClick={() => {
                addCategory(customName);
                setCustomName("");
              }}
              style={{ padding: "8px 14px" }}
            >
              Add tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
