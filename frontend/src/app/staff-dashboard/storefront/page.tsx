// app/staff-dashboard/storefront/page.tsx
"use client";
import { useState } from "react";
import SideLeft from "../components/SideLeft";
import Header from "../components/Header";
import DemoContent from "./DemoContent";

export default function StorefrontPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="ekomart_dashboard">
      <SideLeft collapsed={sidebarCollapsed} />
      <div className={`right-area-body-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Header onToggleSidebar={() => setSidebarCollapsed((c) => !c)} />
        <DemoContent />
      </div>
    </div>
  );
}
