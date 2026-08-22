"use client";

import HeaderOne from "@/components/header/Header";
import FooterOne from "@/components/Footer";
import MuraiBreadcrumb from "@/components/murai/MuraiBreadcrumb";
import ShortService from "@/components/service/ShortService";
import CheckOutMain from "./CheckOutMain";

export default function CheckoutPage() {
  return (
    <div className="murai-home">
      <HeaderOne />
      <main>
        <MuraiBreadcrumb
          title="Checkout"
          bannerImage="/assets/images/murai/banners/banner-shop.jpg"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Checkout" },
          ]}
        />
        <section className="section">
          <div className="container">
            <CheckOutMain />
          </div>
        </section>
        <ShortService />
      </main>
      <FooterOne />
    </div>
  );
}
