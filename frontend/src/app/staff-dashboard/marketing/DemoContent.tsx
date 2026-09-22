"use client";

import React, { useRef, useState } from "react";
import {
  parseMarketingPhoneSegments,
  normalizeWhatsAppToDigits,
  isValidTemplateName,
} from "@/lib/marketingPhones";

export default function DemoContent() {
  const [templateForm, setTemplateForm] = useState({
    templateName: "",
    body: "",
  });

  const [marketingForm, setMarketingForm] = useState({
    templateName: "",
    body: "",
  });

  const [marketingFieldErrors, setMarketingFieldErrors] = useState<{
    templateName?: string;
    phones?: string;
  }>({});
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [marketingHeaderImage, setMarketingHeaderImage] = useState<File | null>(null);
  const marketingImageInputRef = useRef<HTMLInputElement>(null);
  const [marketingBodyParamLines, setMarketingBodyParamLines] = useState("");
  const [marketingUrlButtonSuffix, setMarketingUrlButtonSuffix] = useState("");
  const [marketingUrlButtonParameterName, setMarketingUrlButtonParameterName] = useState("");
  const [marketingUrlButtonIndex, setMarketingUrlButtonIndex] = useState("0");
  const [marketingFeedback, setMarketingFeedback] = useState<{
    type: "success" | "error" | "partial";
    text: string;
  } | null>(null);

  const handleTemplateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setTemplateForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleMarketingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const key =
      id === "marketingTemplateName"
        ? "templateName"
        : id === "marketingBody"
          ? "body"
          : null;
    if (!key) return;
    setMarketingForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMarketingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMarketingHeaderImage(file ?? null);
  };

  const clearMarketingHeaderImage = () => {
    setMarketingHeaderImage(null);
    if (marketingImageInputRef.current) {
      marketingImageInputRef.current.value = "";
    }
  };

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Template draft:", templateForm);
  };

  const handleMarketingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMarketingFeedback(null);
    setMarketingFieldErrors({});

    const name = marketingForm.templateName.trim();
    const errors: { templateName?: string; phones?: string } = {};

    if (!name) {
      errors.templateName = "Enter a template name.";
    } else if (!isValidTemplateName(name)) {
      errors.templateName =
        "Use a Meta template name: start with a letter; only lowercase letters, numbers, and underscores.";
    }

    const segments = parseMarketingPhoneSegments(marketingForm.body);
    if (segments.length === 0) {
      errors.phones = "Enter at least one phone number (one per line and/or separated by commas).";
    } else {
      const invalid = segments.filter((s) => !normalizeWhatsAppToDigits(s));
      if (invalid.length > 0) {
        errors.phones = `Could not parse these numbers: ${invalid.slice(0, 4).join(", ")}${invalid.length > 4 ? "…" : ""}`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setMarketingFieldErrors(errors);
      return;
    }

    setMarketingLoading(true);
    try {
      const bodyParams = marketingBodyParamLines
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      const urlSuffix = marketingUrlButtonSuffix.trim();
      const urlParamName = marketingUrlButtonParameterName.trim();
      const urlIdx = /^\d+$/.test(marketingUrlButtonIndex.trim())
        ? parseInt(marketingUrlButtonIndex.trim(), 10)
        : 0;

      let res: Response;
      if (marketingHeaderImage) {
        const fd = new FormData();
        fd.append("templateName", name);
        fd.append("phoneListText", marketingForm.body);
        fd.append("headerImage", marketingHeaderImage);
        if (bodyParams.length > 0) {
          fd.append("bodyParams", JSON.stringify(bodyParams));
        }
        if (urlSuffix) {
          fd.append("urlButtonSuffix", urlSuffix);
          fd.append("urlButtonIndex", String(urlIdx));
          if (urlParamName) {
            fd.append("urlButtonParameterName", urlParamName);
          }
        }
        res = await fetch("/api/whatsapp/marketing-send", { method: "POST", body: fd });
      } else {
        const payload: Record<string, unknown> = {
          templateName: name,
          phoneListText: marketingForm.body,
        };
        if (bodyParams.length > 0) {
          payload.bodyParams = bodyParams;
        }
        if (urlSuffix) {
          payload.urlButtonSuffix = urlSuffix;
          payload.urlButtonIndex = urlIdx;
          if (urlParamName) {
            payload.urlButtonParameterName = urlParamName;
          }
        }
        res = await fetch("/api/whatsapp/marketing-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();

      if (!res.ok) {
        setMarketingFeedback({
          type: "error",
          text: typeof data.message === "string" ? data.message : "Request failed.",
        });
        return;
      }

      const sent = typeof data.sent === "number" ? data.sent : 0;
      const failed = typeof data.failed === "number" ? data.failed : 0;

      if (failed === 0) {
        setMarketingFeedback({
          type: "success",
          text: `Sent template “${data.templateName ?? name.toLowerCase()}” to ${sent} recipient(s).`,
        });
        clearMarketingHeaderImage();
        setMarketingBodyParamLines("");
        setMarketingUrlButtonSuffix("");
        setMarketingUrlButtonParameterName("");
        setMarketingUrlButtonIndex("0");
      } else {
        const firstErr = Array.isArray(data.results)
          ? (data.results as { error?: string }[]).find((r) => r.error)?.error
          : undefined;
        setMarketingFeedback({
          type: "partial",
          text: `Sent ${sent}, failed ${failed}. ${firstErr ? String(firstErr) : "Check server logs for details."}`,
        });
      }
    } catch {
      setMarketingFeedback({
        type: "error",
        text: "Network error. Try again.",
      });
    } finally {
      setMarketingLoading(false);
    }
  };

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="title-right-actioin-btn-wrapper-product-list">
          <h3 className="title">WhatsApp messages</h3>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginTop: "16px",
            width: "100%",
            maxWidth: "1120px",
          }}
        >
          <div
            className="card-body table-product-select"
            style={{
              borderRadius: "8px",
              border: "1px solid #e8e8e8",
              background: "#fff",
              padding: "24px",
            }}
          >
            <h5
              style={{
                margin: "0 0 8px",
                fontSize: "18px",
                fontWeight: 600,
                color: "#1a1a1a",
              }}
            >
              Utility message
            </h5>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#666" }}>
              Define a reusable template for approvals and customer messages.
            </p>
            <form
              onSubmit={handleTemplateSubmit}
              className="input-main-wrapper"
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <div
                className="single-input"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="templateName">Template name</label>
                <input
                  type="text"
                  id="templateName"
                  placeholder="e.g. order_shipped_notice"
                  value={templateForm.templateName}
                  onChange={handleTemplateChange}
                  style={{
                    border: "1px solid #d0d0d0",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div
                className="single-input"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="body">Message body</label>
                <textarea
                  id="body"
                  placeholder="Hi {{1}}, your order {{2}} is on the way."
                  rows={5}
                  value={templateForm.body}
                  onChange={handleTemplateChange}
                  style={{
                    border: "1px solid #d0d0d0",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div className="single-input" style={{ marginBottom: 0 }}>
                <button
                  type="submit"
                  className="rts-btn btn-primary"
                  style={{ padding: "10px 24px" }}
                >
                  Save template draft
                </button>
              </div>
            </form>
          </div>

          <div
            className="card-body table-product-select"
            style={{
              borderRadius: "8px",
              border: "1px solid #e8e8e8",
              background: "#fff",
              padding: "24px",
            }}
          >
            <h5
              style={{
                margin: "0 0 8px",
                fontSize: "18px",
                fontWeight: 600,
                color: "#1a1a1a",
              }}
            >
              Marketing message
            </h5>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: "#666" }}>
              Send to a list of numbers or paste customer replies for a quick send.
            </p>
            <form
              onSubmit={handleMarketingSubmit}
              className="input-main-wrapper"
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <div
                className="single-input"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="marketingTemplateName">Template name</label>
                <input
                  type="text"
                  id="marketingTemplateName"
                  placeholder="e.g. order_shipped_notice"
                  value={marketingForm.templateName}
                  onChange={handleMarketingChange}
                  aria-invalid={!!marketingFieldErrors.templateName}
                  style={{
                    border: `1px solid ${marketingFieldErrors.templateName ? "#c62828" : "#d0d0d0"}`,
                    borderRadius: "6px",
                    padding: "8px 12px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                {marketingFieldErrors.templateName ? (
                  <span style={{ fontSize: "13px", color: "#c62828" }}>
                    {marketingFieldErrors.templateName}
                  </span>
                ) : null}
              </div>
              <div
                className="single-input"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="marketingHeaderImage">
                  Header image <span style={{ fontWeight: 400, color: "#666" }}>(optional)</span>
                </label>
                <input
                  ref={marketingImageInputRef}
                  id="marketingHeaderImage"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleMarketingImageChange}
                  style={{
                    border: "1px solid #d0d0d0",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#fafafa",
                  }}
                />
                <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: 1.45 }}>
                  Use for Meta templates with an <strong>IMAGE</strong> header. The file is uploaded once to
                  WhatsApp and reused for every recipient in this send. Max 5 MB, JPG or PNG.
                </p>
                {marketingHeaderImage ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#333" }}>
                      Selected: {marketingHeaderImage.name}
                    </span>
                    <button
                      type="button"
                      className="rts-btn btn-border"
                      onClick={clearMarketingHeaderImage}
                      style={{ padding: "6px 14px", fontSize: "13px", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>
              <div
                className="single-input"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="marketingBodyParamLines">
                  Body variables <span style={{ fontWeight: 400, color: "#666" }}>(optional)</span>
                </label>
                <textarea
                  id="marketingBodyParamLines"
                  placeholder={`One value per line, in order of {{1}}, {{2}}, … in the template body.\nExample: first line for {{1}}, second for {{2}}.`}
                  rows={3}
                  value={marketingBodyParamLines}
                  onChange={(e) => setMarketingBodyParamLines(e.target.value)}
                  style={{
                    border: "1px solid #d0d0d0",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: 1.45 }}>
                  Optional — only fill this if your approved template has body placeholders (
                  <code style={{ fontSize: "12px" }}>{'{{1}}'}</code>
                  , etc.). Leave empty for templates with a fixed body.
                </p>
              </div>
              <div
                className="single-input"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="marketingUrlButtonSuffix">
                  URL button suffix <span style={{ fontWeight: 400, color: "#666" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  id="marketingUrlButtonSuffix"
                  placeholder='e.g. order_123 (dynamic end of the template CTA link — not the full URL)'
                  value={marketingUrlButtonSuffix}
                  onChange={(e) => setMarketingUrlButtonSuffix(e.target.value)}
                  style={{
                    border: "1px solid #d0d0d0",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    alignItems: "end",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label htmlFor="marketingUrlButtonIndex" style={{ fontSize: "13px" }}>
                      URL button index
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="marketingUrlButtonIndex"
                      placeholder="0"
                      value={marketingUrlButtonIndex}
                      onChange={(e) => setMarketingUrlButtonIndex(e.target.value)}
                      style={{
                        border: "1px solid #d0d0d0",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label htmlFor="marketingUrlButtonParameterName" style={{ fontSize: "13px" }}>
                      Named param for URL <span style={{ fontWeight: 400, color: "#888" }}>(if any)</span>
                    </label>
                    <input
                      type="text"
                      id="marketingUrlButtonParameterName"
                      placeholder="e.g. order_id (max 20 chars, Meta name only)"
                      value={marketingUrlButtonParameterName}
                      onChange={(e) => setMarketingUrlButtonParameterName(e.target.value)}
                      maxLength={20}
                      style={{
                        border: "1px solid #d0d0d0",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: 1.45 }}>
                  Use when the template has a <strong>URL</strong> button whose link ends with a variable
                  (e.g. <code style={{ fontSize: "12px" }}>{'…/track/{{1}}'}</code>
                  ). Enter only the piece that replaces that variable.
                </p>
              </div>
              <div
                className="single-input"
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label htmlFor="marketingBody">Customer phone number list</label>
                <textarea
                  id="marketingBody"
                  placeholder={`One number per line and/or comma-separated, e.g.\n+919876543210, +919876543211\n+91 98765 43210`}
                  rows={5}
                  value={marketingForm.body}
                  onChange={handleMarketingChange}
                  aria-invalid={!!marketingFieldErrors.phones}
                  style={{
                    border: `1px solid ${marketingFieldErrors.phones ? "#c62828" : "#d0d0d0"}`,
                    borderRadius: "6px",
                    padding: "8px 12px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                {marketingFieldErrors.phones ? (
                  <span style={{ fontSize: "13px", color: "#c62828" }}>
                    {marketingFieldErrors.phones}
                  </span>
                ) : null}
              </div>
              {marketingFeedback ? (
                <div
                  role="status"
                  style={{
                    fontSize: "14px",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    background:
                      marketingFeedback.type === "success"
                        ? "#e8f5e9"
                        : marketingFeedback.type === "partial"
                          ? "#fff8e1"
                          : "#ffebee",
                    color:
                      marketingFeedback.type === "success"
                        ? "#1b5e20"
                        : marketingFeedback.type === "partial"
                          ? "#e65100"
                          : "#b71c1c",
                  }}
                >
                  {marketingFeedback.text}
                </div>
              ) : null}
              <div className="single-input" style={{ marginBottom: 0 }}>
                <button
                  type="submit"
                  className="rts-btn btn-primary"
                  style={{ padding: "10px 24px" }}
                  disabled={marketingLoading}
                >
                  {marketingLoading ? "Sending…" : "Send marketing message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
