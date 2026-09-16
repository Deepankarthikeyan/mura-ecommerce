"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { applyWebsiteAppearance } from "@/lib/theme/applyWebsiteAppearance";
import {
  getThemeColorDefaults,
  mergeWebsiteColors,
  type WebsiteColors,
} from "@/lib/theme/websiteColors";
import {
  DEFAULT_WEBSITE_THEME,
  WEBSITE_THEME_OPTIONS,
  isWebsiteTheme,
  type WebsiteTheme,
} from "@/lib/theme/websiteTheme";

async function loadThemeColors(theme: WebsiteTheme): Promise<WebsiteColors> {
  const res = await axios.get<{ success?: boolean; colors?: WebsiteColors }>(
    "/api/website-settings",
    { params: { theme } },
  );
  return mergeWebsiteColors(res.data?.colors, theme);
}

export default function ThemesContent() {
  const [theme, setTheme] = useState<WebsiteTheme>(DEFAULT_WEBSITE_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const savedThemeRef = useRef<WebsiteTheme>(DEFAULT_WEBSITE_THEME);
  const savedColorsRef = useRef<WebsiteColors>(getThemeColorDefaults());
  const dirtyRef = useRef(false);

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get<{ success?: boolean; theme?: unknown }>(
          "/api/website-settings/theme",
        );
        const nextTheme = isWebsiteTheme(res.data?.theme) ? res.data.theme : DEFAULT_WEBSITE_THEME;
        const colors = await loadThemeColors(nextTheme);
        if (cancelled) return;
        savedThemeRef.current = nextTheme;
        savedColorsRef.current = colors;
        setTheme(nextTheme);
        applyWebsiteAppearance(nextTheme, colors);
      } catch {
        if (!cancelled) {
          toast.error("Could not load the saved theme. Showing the default.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (dirtyRef.current) {
        applyWebsiteAppearance(savedThemeRef.current, savedColorsRef.current);
      }
    };
  }, []);

  const handleThemeChange = useCallback(async (value: string) => {
    if (!isWebsiteTheme(value)) return;
    setTheme(value);
    setDirty(true);
    try {
      const colors = await loadThemeColors(value);
      applyWebsiteAppearance(value, colors);
    } catch {
      applyWebsiteAppearance(value, getThemeColorDefaults(value));
      toast.error("Could not load colours for that theme. Showing defaults.");
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await axios.put<{ success?: boolean; theme?: unknown; message?: string }>(
        "/api/website-settings/theme",
        { theme },
      );
      if (res.data?.success && isWebsiteTheme(res.data.theme)) {
        const colors = await loadThemeColors(res.data.theme);
        savedThemeRef.current = res.data.theme;
        savedColorsRef.current = colors;
        setTheme(res.data.theme);
        applyWebsiteAppearance(res.data.theme, colors);
        setDirty(false);
        toast.success("Website theme saved.");
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
  }, [theme]);

  if (loading) {
    return (
      <div className="body-root-inner">
        <div className="transection">
          <h3 className="title">Themes</h3>
          <p style={{ marginTop: 16, color: "#666" }}>Loading theme…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="title-right-actioin-btn-wrapper-product-list">
          <h3 className="title">Themes</h3>
        </div>
        <p style={{ color: "#666", marginTop: 8, marginBottom: 0 }}>
          Choose the storefront theme. Ayurvedha uses the current look. Fashion will be styled next.
        </p>

        <div
          style={{
            marginTop: 24,
            padding: 20,
            border: "1px solid #e8e8e8",
            borderRadius: 8,
            background: "#fff",
            maxWidth: 420,
          }}
        >
          <label
            htmlFor="website-theme-select"
            style={{
              display: "block",
              fontWeight: 600,
              color: "#1a1a1a",
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            Theme
          </label>
          <select
            id="website-theme-select"
            value={theme}
            onChange={(e) => {
              void handleThemeChange(e.target.value);
            }}
            aria-label="Website theme"
            style={{
              width: "100%",
              border: "1px solid #d0d0d0",
              borderRadius: 6,
              padding: "10px 12px",
              fontSize: 14,
              color: "#1a1a1a",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {WEBSITE_THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 24,
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
            {saving ? "Saving…" : "Save theme"}
          </button>
          {dirty ? (
            <span style={{ color: "#6b7280", fontSize: 13 }}>Unsaved changes</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
