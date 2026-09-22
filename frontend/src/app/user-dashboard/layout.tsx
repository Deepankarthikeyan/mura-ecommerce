import type { Metadata } from "next";
import DashboardRouteGuard from "@/components/dashboard/DashboardRouteGuard";

export const metadata: Metadata = {
    title: "Account",
    description: "Customer account for managing MuRa@23 orders",
};

export default function UserLayout({
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
            <DashboardRouteGuard variant="user">
                <div className="dashboard-wrapper">
                    {children}
                </div>
            </DashboardRouteGuard>
        </>
    );
}
