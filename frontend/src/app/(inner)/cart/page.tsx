"use client";

import HeaderOne from "@/components/header/Header";
import FooterOne from "@/components/Footer";
import MuraiBreadcrumb from "@/components/murai/MuraiBreadcrumb";
import ShortService from "@/components/service/ShortService";
import CartMain from "./CartMain";

export default function CartPage() {
  return (
    <div className="murai-home">
      <HeaderOne />
      <main>
        <MuraiBreadcrumb
          title="My Cart"
          bannerImage="/assets/images/murai/banners/banner-shop.jpg"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "My Cart" },
          ]}
        />
        <section className="section">
          <div className="container">
            <CartMain />
          </div>
        </section>
        <ShortService />
      </main>
      <FooterOne />
    </div>
  );
}
