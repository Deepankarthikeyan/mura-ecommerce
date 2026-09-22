"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  WEBSITE_COLOR_GROUPS,
  WEBSITE_COLOR_KEYS,
  WEBSITE_COLOR_META,
  applyWebsiteColorsToDocument,
  getThemeColorDefaults,
  isHexColor,
  mergeWebsiteColors,
  type WebsiteColorKey,
  type WebsiteColors,
} from "@/lib/theme/websiteColors";
import { DEFAULT_WEBSITE_THEME, isWebsiteTheme, type WebsiteTheme } from "@/lib/theme/websiteTheme";

const HEX6_RE = /^#([0-9a-fA-F]{6})$/;

function toColorInputValue(hex: string, fallback: string): string {
  const normalized = hex.trim();
  if (HEX6_RE.test(normalized)) return normalized;
  if (/^#([0-9a-fA-F]{3})$/.test(normalized)) {
    const r = normalized[1];
    const g = normalized[2];
    const b = normalized[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return fallback;
}

export default function DemoContent() {
  const [theme, setTheme] = useState<WebsiteTheme>(DEFAULT_WEBSITE_THEME);
  const [colors, setColors] = useState<WebsiteColors>(() => getThemeColorDefaults());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get<{ success?: boolean; theme?: unknown; colors?: WebsiteColors }>(
          "/api/website-settings",
        );
        if (!cancelled && res.data?.colors) {
          const nextTheme = isWebsiteTheme(res.data.theme) ? res.data.theme : DEFAULT_WEBSITE_THEME;
          const merged = mergeWebsiteColors(res.data.colors, nextTheme);
          setTheme(nextTheme);
          setColors(merged);
          applyWebsiteColorsToDocument(merged, nextTheme);
        }
      } catch {
        if (!cancelled) {
          toast.error("Could not load saved colours. Showing defaults.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleColorChange = useCallback((key: WebsiteColorKey, value: string) => {
    setColors((prev) => {
      const next = { ...prev, [key]: value };
      if (isHexColor(value)) {
        applyWebsiteColorsToDocument(mergeWebsiteColors(next, theme), theme);
      }
      return next;
    });
    setDirty(true);
  }, [theme]);

  const handleResetDefaults = useCallback(() => {
    const defaults = getThemeColorDefaults(theme);
    setColors(defaults);
    applyWebsiteColorsToDocument(defaults, theme);
    setDirty(true);
  }, [theme]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await axios.put<{ success?: boolean; colors?: WebsiteColors; message?: string }>(
        "/api/website-settings",
        { colors, theme },
      );
      if (res.data?.success) {
        const saved = mergeWebsiteColors(res.data.colors ?? colors, theme);
        setColors(saved);
        applyWebsiteColorsToDocument(saved, theme);
        setDirty(false);
        toast.success("Website colours saved. They now apply across the site.");
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
      setSaving(false);
    }
  }, [colors, theme]);

  const groupedKeys = useMemo(
    () =>
      WEBSITE_COLOR_GROUPS.map((group) => ({
        group,
        keys: WEBSITE_COLOR_KEYS.filter((key) => WEBSITE_COLOR_META[key].group === group),
      })),
    [],
  );

  if (loading) {
    return (
      <div className="body-root-inner">
        <div className="transection">
          <h3 className="title">Website settings</h3>
          <p style={{ marginTop: 16, color: "#666" }}>Loading colours…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="title-right-actioin-btn-wrapper-product-list">
          <h3 className="title">Website settings</h3>
        </div>
        <p style={{ color: "#666", marginTop: 8, marginBottom: 0 }}>
          These colours apply to the active theme ({theme === "ayurvedha" ? "Ayurvedha" : "Fashion"}).
          Save to store them in the database and apply them site-wide.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 20,
            padding: 16,
            border: "1px solid #e8e8e8",
            borderRadius: 8,
            background: "#fff",
          }}
        >
          {WEBSITE_COLOR_KEYS.map((key) => (
            <div
              key={`preview-${key}`}
              title={WEBSITE_COLOR_META[key].label}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: colors[key],
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          ))}
        </div>

        {groupedKeys.map(({ group, keys }) => (
          <div key={group} style={{ marginTop: 28 }}>
            <h4
              style={{
                margin: "0 0 12px",
                fontSize: 16,
                fontWeight: 600,
                color: "#1a1a1a",
              }}
            >
              {group}
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {keys.map((key) => {
                const meta = WEBSITE_COLOR_META[key];
                const value = colors[key];
                return (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      padding: 16,
                      border: "1px solid #e8e8e8",
                      borderRadius: 8,
                      background: "#fff",
                    }}
                  >
                    <input
                      type="color"
                      className="website-settings-color-picker"
                      value={toColorInputValue(value, colors.primary)}
                      onChange={(e) => handleColorChange(key, e.target.value.toUpperCase())}
                      aria-label={meta.label}
                      style={{
                        width: 48,
                        height: 48,
                        padding: 0,
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        background: "transparent",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          display: "block",
                          fontWeight: 600,
                          color: "#1a1a1a",
                          fontSize: 14,
                        }}
                      >
                        {meta.label}
                      </span>
                      <span
                        style={{
                          display: "block",
                          color: "#6b7280",
                          fontSize: 12,
                          marginTop: 2,
                          lineHeight: 1.4,
                        }}
                      >
                        {meta.hint}
                      </span>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        spellCheck={false}
                        aria-label={`${meta.label} hex`}
                        style={{
                          marginTop: 8,
                          width: "100%",
                          maxWidth: 140,
                          border: "1px solid #d0d0d0",
                          borderRadius: 6,
                          padding: "6px 10px",
                          fontFamily: "monospace",
                          fontSize: 13,
                        }}
                      />
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 28,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            className="rts-btn btn-primary"
            style={{ padding: "10px 24px" }}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving…" : "Save colours"}
          </button>
          <button
            type="button"
            className="rts-btn"
            style={{
              padding: "10px 24px",
              background: "#fff",
              color: "#374151",
              border: "1px solid #d1d5db",
            }}
            disabled={saving}
            onClick={handleResetDefaults}
          >
            Reset to defaults
          </button>
          {dirty ? (
            <span style={{ color: "#6b7280", fontSize: 13 }}>Unsaved changes</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
