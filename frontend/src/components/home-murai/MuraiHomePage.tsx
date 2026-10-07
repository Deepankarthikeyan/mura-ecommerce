"use client";

import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiHero from "./MuraiHero";
import MuraiBannerGrid from "./MuraiBannerGrid";
import MuraiSaleSarees from "./MuraiSaleSarees";
import MuraiTestimonials from "./MuraiTestimonials";
import MuraiInstagram from "./MuraiInstagram";
import MuraiNewsletter from "./MuraiNewsletter";
import MuraiServiceBar from "./MuraiServiceBar";
import MuraiShopFooter from "./MuraiShopFooter";

export default function MuraiHomePage() {
  return (
    <div className="murai-home" data-page="home">
      <MuraiHeader />
      <main>
        <MuraiHero />
        <MuraiBannerGrid />
        <MuraiSaleSarees />
        <MuraiTestimonials />
        <MuraiInstagram />
        <MuraiNewsletter />
        <MuraiServiceBar />
      </main>
      <MuraiShopFooter />
    </div>
  );
}
