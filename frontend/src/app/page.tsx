import type { Metadata } from "next";
import HeaderFour from "@/components/header/Header";
import BannerFour from "@/components/banner/BannerFour";
import HomeBannerGrid from "@/components/banner/HomeBannerGrid";
import HomePromoBanners from "@/components/home/HomePromoBanners";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import HomeNewsletter from "@/components/home/HomeNewsletter";
import Footer from "@/components/Footer";
import WeeklyBestSelling from '@/components/product/WeeklyBestSelling';
import RecentlyAdded from "@/components/product/RecentlyAdded";
import ShortService from "@/components/service/ShortService";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/");

export default function Home() {
  return (
    <div className="murai-home">
      <HeaderFour />
      <main>
        <BannerFour />
        <HomeBannerGrid />
        <WeeklyBestSelling />
        <RecentlyAdded />
        <HomePromoBanners />
        <HomeTestimonials />
        <HomeNewsletter />
        <ShortService />
      </main>
      <Footer />
    </div>
  );
}
