import type { Metadata } from "next";
import HeaderFour from "@/components/header/Header";
import BannerFour from "@/components/banner/BannerFour";
import BlogFour from "@/components/blog/BlogFour";
import Footer from "@/components/Footer";
import FeatureCategory from '@/components/feature/FeatureCategory';
import WeeklyBestSelling from '@/components/product/WeeklyBestSelling';
import FeatureDiscount from "@/components/product/FeatureDiscount";
import LessDiscount from "@/components/product/LessDiscount";
import LessDiscountTwo from "@/components/product/LessDiscountTwo";
import RecentlyAdded from "@/components/product/RecentlyAdded";
import ShortService from "@/components/service/ShortService";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/");

export default function Home() {

  

  return (
    <div className="index-bg-gray">
      <HeaderFour />
      <BannerFour />
      {/* <FeatureCategory /> */}
      <WeeklyBestSelling />
      {/* <FeatureDiscount /> */}
      {/* <LessDiscount />
      <LessDiscountTwo /> */}
      <RecentlyAdded />

      {/* <BlogFour /> */}
      <ShortService />
      <Footer />

    </div>
  );
}
