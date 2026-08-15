"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportsAnalyticsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/staff-dashboard/reports-analytics/sales");
  }, [router]);

  return null;
}
