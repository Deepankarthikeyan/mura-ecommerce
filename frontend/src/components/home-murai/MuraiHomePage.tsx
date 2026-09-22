"use client";

import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiHero from "./MuraiHero";
import MuraiBannerGrid from "./MuraiBannerGrid";
import MuraiSaleSarees from "./MuraiSaleSarees";
import MuraiDeals from "./MuraiDeals";
import MuraiBestsellers from "./MuraiBestsellers";
import MuraiPromoBanners from "./MuraiPromoBanners";
import MuraiTestimonials from "./MuraiTestimonials";
import MuraiDiwaliBanner from "./MuraiDiwaliBanner";
import MuraiBlog from "./MuraiBlog";
import MuraiNewsletter from "./MuraiNewsletter";
import MuraiServiceBar from "./MuraiServiceBar";
import MuraiFooter from "./MuraiFooter";

export default function MuraiHomePage() {
  return (
    <div className="murai-home" data-page="home">
      <MuraiHeader />
      <main>
        <MuraiHero />
        <MuraiBannerGrid />
        <MuraiSaleSarees />
        <MuraiDeals />
        <MuraiBestsellers />
        <MuraiPromoBanners />
        <MuraiTestimonials />
        <MuraiDiwaliBanner />
        <MuraiBlog />
        <MuraiNewsletter />
        <MuraiServiceBar />
      </main>
      <MuraiFooter />
    </div>
  );
}
