"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import SideLeft from "../components/SideLeft";
import Header from "../components/Header";
import { useUser } from "@/components/header/UserContext";
import { isAdmin, STAFF_DASHBOARD_LANDING } from "@/lib/dashboardPaths";

export default function ReportShell({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, isUserLoaded, isAuthenticated } = useUser();
  const router = useRouter();
  const allowed = isUserLoaded && isAuthenticated && isAdmin(user?.userType);

  useEffect(() => {
    if (!isUserLoaded) return;
    if (!isAuthenticated || !isAdmin(user?.userType)) {
      router.replace(STAFF_DASHBOARD_LANDING);
    }
  }, [isUserLoaded, isAuthenticated, user?.userType, router]);

  if (!allowed) {
    return null;
  }

  return (
    <div className="ekomart_dashboard">
      <SideLeft collapsed={sidebarCollapsed} />
      <div className={`right-area-body-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Header onToggleSidebar={() => setSidebarCollapsed((v) => !v)} />
        {children}
      </div>
    </div>
  );
}
