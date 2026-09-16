// components/SideLeft.tsx
"use client";
import Image from 'next/image';
import SideMenu from "./SideMenu";
import Link from 'next/link';

interface SideLeftProps {
  collapsed: boolean;
}

function SideLeft({ collapsed }: SideLeftProps) {
  return (
    <div className={`sidebar_left ${collapsed ? 'collapsed' : ''}`}>
      <Link href="/" className="logo">
        <Image
          src="/murai/mura-newlogo.png"
          alt="MuRa@23"
          width={129}
          height={80}
          style={{ height: 56, width: "auto" }}
        />
      </Link>
      <SideMenu />
    </div>
  );
}

export default SideLeft;