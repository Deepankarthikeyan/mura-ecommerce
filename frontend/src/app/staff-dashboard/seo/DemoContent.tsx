"use client";

import { useState } from "react";
import GlobalSeoPanel from "./GlobalSeoPanel";
import PageSeoPanel from "./PageSeoPanel";

type SeoTab = "global" | "pages";

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: "10px 20px",
  border: "none",
  borderBottom: active ? "2px solid #0d6efd" : "2px solid transparent",
  background: "transparent",
  color: active ? "#0d6efd" : "#666",
  fontWeight: active ? 600 : 400,
  cursor: "pointer",
  fontSize: "14px",
});

export default function DemoContent() {
  const [tab, setTab] = useState<SeoTab>("pages");

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="title-right-actioin-btn-wrapper-product-list">
          <h3 className="title">SEO settings</h3>
        </div>

        <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid #e8e8e8", marginTop: "8px" }}>
          <button type="button" style={tabStyle(tab === "pages")} onClick={() => setTab("pages")}>
            Pages &amp; templates
          </button>
          <button type="button" style={tabStyle(tab === "global")} onClick={() => setTab("global")}>
            Static site SEO
          </button>
        </div>

        {tab === "pages" ? <PageSeoPanel /> : <GlobalSeoPanel />}
      </div>
    </div>
  );
}
