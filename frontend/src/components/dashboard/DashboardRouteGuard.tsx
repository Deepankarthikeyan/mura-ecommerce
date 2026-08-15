"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/components/header/UserContext";
import { getDashboardPrefix, STAFF_DASHBOARD_PREFIX, USER_DASHBOARD_PREFIX } from "@/lib/dashboardPaths";

type DashboardVariant = "user" | "staff";

function defaultLandingSuffixForPrefix(prefix: string): string {
  return prefix === STAFF_DASHBOARD_PREFIX ? "/inventory" : "/order";
}

/** Map paths when the primary list page uses different segments per dashboard. */
function mapCrossDashboardSuffix(
  suffix: string,
  fromPrefix: string,
  toPrefix: string
): string {
  let s = suffix;
  if (fromPrefix === USER_DASHBOARD_PREFIX && toPrefix === STAFF_DASHBOARD_PREFIX) {
    if (s === "/order" || s.startsWith("/order/")) {
      s = "/inventory" + s.slice("/order".length);
    }
  } else if (fromPrefix === STAFF_DASHBOARD_PREFIX && toPrefix === USER_DASHBOARD_PREFIX) {
    if (s === "/inventory" || s.startsWith("/inventory/")) {
      s = "/order" + s.slice("/inventory".length);
    }
  }
  return s;
}

export default function DashboardRouteGuard({
  variant,
  children,
}: {
  variant: DashboardVariant;
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isUserLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoaded || !isAuthenticated || !user) return;

    const correctPrefix = getDashboardPrefix(user.userType);
    const thisPrefix = variant === "staff" ? STAFF_DASHBOARD_PREFIX : USER_DASHBOARD_PREFIX;

    if (correctPrefix === thisPrefix) return;

    let suffix = pathname.startsWith(thisPrefix) ? pathname.slice(thisPrefix.length) : "";
    const targetDefault = defaultLandingSuffixForPrefix(correctPrefix);
    if (!suffix) {
      suffix = targetDefault;
    } else {
      suffix = mapCrossDashboardSuffix(suffix, thisPrefix, correctPrefix);
    }

    router.replace(`${correctPrefix}${suffix}`);
  }, [isUserLoaded, isAuthenticated, user, pathname, variant, router]);

  return <>{children}</>;
}
