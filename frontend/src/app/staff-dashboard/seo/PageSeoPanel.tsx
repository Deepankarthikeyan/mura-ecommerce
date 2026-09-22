"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  formStateToPageSeoConfig,
  getDefaultFullPageSeoConfig,
  pageSeoConfigToFormState,
  type PageSeoFormState,
} from "@/lib/seo/pageSeoForm";
import {
  ALL_MANAGED_SEO_PATHS,
  KNOWN_STATIC_SEO_PATHS,
  KNOWN_TEMPLATE_SEO_PATHS,
  normalizeSeoPath,
} from "@/lib/seo/pageSeoTypes";

type PageRow = {
  path: string;
  label: string;
  kind: "static" | "template";
  config: PageSeoFormState;
  hasCustomSave: boolean;
  updatedAt: string | null;
};

const cardStyle: React.CSSProperties = {
  borderRadius: "8px",
  border: "1px solid #e8e8e8",
  background: "#fff",
  padding: "24px",
  flex: "1 1 480px",
  maxWidth: "760px",
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #d0d0d0",
  borderRadius: "6px",
  padding: "8px 12px",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  fontFamily: "monospace",
  fontSize: "13px",
  lineHeight: 1.5,
  resize: "vertical",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#333",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const sectionHeadStyle: React.CSSProperties = {
  margin: "24px 0 12px",
  paddingBottom: "8px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  color: "#0d6efd",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const dynamicBadge: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "999px",
  fontSize: "10px",
  fontWeight: 600,
  color: "#0d6efd",
  background: "#e7f1ff",
  border: "1px solid #b6d4fe",
};

function Field({
  id,
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  mono = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle} htmlFor={id}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...textareaStyle, ...(mono ? {} : { fontFamily: "inherit" }) }}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h6 style={sectionHeadStyle}>
      {title}
      <span style={dynamicBadge}>DYNAMIC</span>
    </h6>
  );
}

export default function PageSeoPanel() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [selectedPath, setSelectedPath] = useState(ALL_MANAGED_SEO_PATHS[0]?.path ?? "/");
  const [form, setForm] = useState<PageSeoFormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customPath, setCustomPath] = useState("");

  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ success?: boolean; pages?: PageRow[] }>("/api/seo/pages");
      if (res.data?.success && res.data.pages) {
        setPages(res.data.pages);
      }
    } catch {
      toast.error("Could not load page SEO settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    const row = pages.find((p) => p.path === selectedPath);
    if (row) setForm(row.config);
  }, [selectedPath, pages]);

  const selectedRow = pages.find((p) => p.path === selectedPath);

  const setField = <K extends keyof PageSeoFormState>(key: K, value: PageSeoFormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!form) return;

    for (const [label, json] of [
      ["Service", form.serviceJson],
      ["FAQ", form.faqJson],
      ["Review", form.reviewJson],
    ] as const) {
      if (json.trim()) {
        try {
          JSON.parse(json);
        } catch {
          toast.error(`${label} schema must be valid JSON.`);
          return;
        }
      }
    }

    setSaving(true);
    try {
      const res = await axios.put<{ success?: boolean; message?: string }>("/api/seo/pages", {
        path: selectedPath,
        config: formStateToPageSeoConfig(form),
      });
      if (res.data?.success) {
        toast.success(`SEO saved for ${selectedRow?.label ?? selectedPath}.`);
        await loadPages();
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
  };

  const handleReset = async () => {
    if (!window.confirm(`Remove custom SEO for ${selectedPath} and use defaults?`)) return;
    setSaving(true);
    try {
      const res = await axios.delete<{ success?: boolean }>("/api/seo/pages", {
        data: { path: selectedPath },
      });
      if (res.data?.success) {
        toast.success("Reset to defaults.");
        await loadPages();
      }
    } catch {
      toast.error("Reset failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomPath = () => {
    const path = normalizeSeoPath(customPath);
    if (!path || path.startsWith("__template:")) {
      toast.error("Enter a valid page path (e.g. /about).");
      return;
    }
    if (pages.some((p) => p.path === path)) {
      setSelectedPath(path);
      setCustomPath("");
      return;
    }
    setPages((prev) => [
      ...prev,
      {
        path,
        label: path,
        kind: "static",
        config: pageSeoConfigToFormState(getDefaultFullPageSeoConfig(path)),
        hasCustomSave: false,
        updatedAt: null,
      },
    ]);
    setSelectedPath(path);
    setForm(pageSeoConfigToFormState(getDefaultFullPageSeoConfig(path)));
    setCustomPath("");
  };

  const staticPages = pages.filter((p) =>
    KNOWN_STATIC_SEO_PATHS.some((entry) => entry.path === p.path),
  );
  const templatePages = pages.filter((p) =>
    KNOWN_TEMPLATE_SEO_PATHS.some((entry) => entry.path === p.path),
  );
  const customPages = pages.filter(
    (p) =>
      !KNOWN_STATIC_SEO_PATHS.some((entry) => entry.path === p.path) &&
      !KNOWN_TEMPLATE_SEO_PATHS.some((entry) => entry.path === p.path),
  );

  const renderPageList = (rows: PageRow[]) => (
    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
      {rows.map((row) => (
        <li key={row.path}>
          <button
            type="button"
            onClick={() => setSelectedPath(row.path)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 10px",
              marginBottom: "4px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              background: selectedPath === row.path ? "#e7f1ff" : "transparent",
              color: selectedPath === row.path ? "#0d6efd" : "#333",
              fontWeight: selectedPath === row.path ? 600 : 400,
            }}
          >
            {row.label}
            {row.hasCustomSave ? " •" : ""}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <p style={{ color: "#666", marginTop: "8px", maxWidth: "760px" }}>
        Select a page or template, then edit all dynamic SEO sections (Basic, OG, Twitter,
        Canonical, Service, FAQ, Review). Add a product or blog URL under custom paths for
        page-specific SEO, or use templates with placeholders such as {"{title}"} and
        {"{description}"}.
      </p>

      {loading || !form ? (
        <p style={{ marginTop: "16px", color: "#666" }}>Loading page SEO…</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "16px" }}>
          <div style={{ minWidth: "220px", flex: "0 0 220px" }}>
            <h6 style={{ margin: "0 0 8px", fontSize: "13px", color: "#888" }}>PAGES</h6>
            {renderPageList(staticPages)}

            <h6 style={{ margin: "20px 0 8px", fontSize: "13px", color: "#888" }}>TEMPLATES</h6>
            {renderPageList(templatePages)}

            {customPages.length > 0 ? (
              <>
                <h6 style={{ margin: "20px 0 8px", fontSize: "13px", color: "#888" }}>
                  CUSTOM PATHS
                </h6>
                {renderPageList(customPages)}
              </>
            ) : null}

            <div style={{ marginTop: "20px" }}>
              <label style={labelStyle}>Add custom path</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <input
                  type="text"
                  placeholder="/my-page"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  className="rts-btn btn-primary"
                  style={{ padding: "8px 14px", whiteSpace: "nowrap" }}
                  onClick={handleAddCustomPath}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="card-body table-product-select" style={cardStyle}>
            <h5 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600 }}>
              {selectedRow?.label ?? selectedPath}
            </h5>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#666" }}>{selectedPath}</p>

            <SectionHeader title="BASIC" />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Field id="basicTitle" label="Title" value={form.basicTitle} onChange={(v) => setField("basicTitle", v)} />
              <Field id="basicDescription" label="Description" value={form.basicDescription} onChange={(v) => setField("basicDescription", v)} multiline />
              <Field id="basicKeywords" label="Keywords" value={form.basicKeywords} onChange={(v) => setField("basicKeywords", v)} />
              <Field id="basicAuthors" label="Authors (comma-separated)" value={form.basicAuthors} onChange={(v) => setField("basicAuthors", v)} />
            </div>

            <SectionHeader title="OG" />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Field id="ogTitle" label="OG title" value={form.ogTitle} onChange={(v) => setField("ogTitle", v)} />
              <Field id="ogDescription" label="OG description" value={form.ogDescription} onChange={(v) => setField("ogDescription", v)} multiline />
              <Field id="ogType" label="OG type" value={form.ogType} onChange={(v) => setField("ogType", v)} />
              <Field id="ogUrl" label="OG URL" value={form.ogUrl} onChange={(v) => setField("ogUrl", v)} />
              <Field id="ogSiteName" label="OG site name" value={form.ogSiteName} onChange={(v) => setField("ogSiteName", v)} />
              <Field id="ogLocale" label="OG locale" value={form.ogLocale} onChange={(v) => setField("ogLocale", v)} />
              <Field id="ogImage" label="OG image URL" value={form.ogImage} onChange={(v) => setField("ogImage", v)} />
              <Field id="ogLogo" label="OG logo URL" value={form.ogLogo} onChange={(v) => setField("ogLogo", v)} />
            </div>

            <SectionHeader title="TWITTER" />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Field id="twitterCard" label="Twitter card type" value={form.twitterCard} onChange={(v) => setField("twitterCard", v)} />
              <Field id="twitterTitle" label="Twitter title" value={form.twitterTitle} onChange={(v) => setField("twitterTitle", v)} />
              <Field id="twitterDescription" label="Twitter description" value={form.twitterDescription} onChange={(v) => setField("twitterDescription", v)} multiline />
              <Field id="twitterImage" label="Twitter image URL" value={form.twitterImage} onChange={(v) => setField("twitterImage", v)} />
            </div>

            <SectionHeader title="CANONICAL" />
            <Field id="canonicalUrl" label="Canonical URL" value={form.canonicalUrl} onChange={(v) => setField("canonicalUrl", v)} />

            <SectionHeader title="SERVICE" />
            <Field id="serviceJson" label="Service schema (JSON-LD)" value={form.serviceJson} onChange={(v) => setField("serviceJson", v)} multiline rows={8} mono />

            <SectionHeader title="FAQ" />
            <Field id="faqJson" label="FAQ schema (JSON-LD)" value={form.faqJson} onChange={(v) => setField("faqJson", v)} multiline rows={8} mono />

            <SectionHeader title="REVIEW" />
            <Field id="reviewJson" label="Review schema (JSON-LD)" value={form.reviewJson} onChange={(v) => setField("reviewJson", v)} multiline rows={8} mono />

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", marginTop: "20px" }}>
              <input
                type="checkbox"
                checked={form.noindex}
                onChange={(e) => setField("noindex", e.target.checked)}
              />
              Noindex (hide from search engines)
            </label>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                type="button"
                className="rts-btn btn-primary"
                style={{ padding: "10px 24px" }}
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              {selectedRow?.hasCustomSave ? (
                <button
                  type="button"
                  className="rts-btn"
                  style={{ padding: "10px 24px", border: "1px solid #ccc" }}
                  disabled={saving}
                  onClick={handleReset}
                >
                  Reset to defaults
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
