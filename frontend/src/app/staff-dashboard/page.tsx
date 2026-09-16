// app/dashboard/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SideLeft from "./components/SideLeft";
import Header from "./components/Header";
import DemoContent from "./components/DemoContent";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  // Redirect to inventory page instead of showing dashboard
  useEffect(() => {
    router.replace('/staff-dashboard/inventory');
  }, [router]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Return empty while redirecting
  return (
    <div className="ekomart_dashboard">
      <SideLeft collapsed={sidebarCollapsed} />
      <div className={`right-area-body-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header onToggleSidebar={toggleSidebar} />
        <div style={{ padding: '40px', textAlign: 'center' }}>Redirecting to Inventory...</div>
      </div>
    </div>
  );
}
