import type { Metadata } from "next";
import HeaderOne from "@/components/header/Header";
import StoreBanner from "@/components/banner/StoreBanner";
import StoreLocation from "@/components/common/StoreLocation";
import ShortService from "@/components/service/ShortService";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/store");





import FooterOne from "@/components/Footer";

export default function Home() {
    return (
        <div className="demo-one">
            <HeaderOne />
            <StoreBanner />
            <StoreLocation />
            <ShortService/>




            <FooterOne />

        </div>
    );
}
