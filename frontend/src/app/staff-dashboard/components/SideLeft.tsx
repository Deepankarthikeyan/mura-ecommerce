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
          src="/assets/images/logo/logo-1-jpg.jpeg"
          alt="logo"
          width={131}
          height={32}
        />
      </Link>
      <SideMenu />
    </div>
  );
}

export default SideLeft;