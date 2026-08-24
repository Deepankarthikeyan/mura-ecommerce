"use client";

import SideMenu from "./SideMenu";
import Link from "next/link";
import { useStorefrontSettings } from "@/lib/storefront/useStorefrontSettings";

interface SideLeftProps {
  collapsed: boolean;
}

function SideLeft({ collapsed }: SideLeftProps) {
  const { settings } = useStorefrontSettings();
  const { name, logo } = settings.site;

  return (
    <div className={`sidebar_left ${collapsed ? "collapsed" : ""}`}>
      <Link href="/" className="logo" aria-label={`${name} home`}>
        <img
          src={logo}
          alt={name}
          width={131}
          height={48}
          style={{ width: "auto", height: "auto", maxHeight: 48, objectFit: "contain" }}
        />
        <span
          className="dashboard-store-name"
          style={{
            display: "block",
            marginTop: 6,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "#083A5E",
          }}
        >
          {name}
        </span>
      </Link>
      <SideMenu />
    </div>
  );
}

export default SideLeft;
