"use client";

import BackToTop from "@/components/common/BackToTop";
import MuraiHeader from "@/components/home-murai/MuraiHeader";
import "@/components/home-murai/murai.css";

function HeaderOne() {
  return (
    <div className="murai-home murai-storefront-chrome">
      <MuraiHeader />
      <BackToTop />
    </div>
  );
}

export default HeaderOne;
