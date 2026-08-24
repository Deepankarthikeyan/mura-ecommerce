import type { Metadata } from "next";
import DashboardRouteGuard from "@/components/dashboard/DashboardRouteGuard";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata: Metadata = {
    title: "Staff Dashboard - MuRa@23",
    description: "Staff dashboard for managing MuRa@23 inventory and storefront",
};

export default function StaffLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <link rel="stylesheet" href="/dashboard-assets/css/plugins.css" />
            <link rel="stylesheet" href="/dashboard-assets/css/style.css" />
            <link rel="stylesheet" href="/dashboard-assets/css/table.css" />
            <link rel="stylesheet" href="/dashboard-assets/css/order-cards.css" />
            <link rel="stylesheet" href="/dashboard-assets/css/dashboard-icons-fix.css" />
            <DashboardRouteGuard variant="staff">
                <div className="dashboard-wrapper">
                    {children}
                </div>
            </DashboardRouteGuard>
        </>
    );
}
