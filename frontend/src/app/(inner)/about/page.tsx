
import type { Metadata } from "next";
import HeaderOne from "@/components/header/Header";
import CounterOne from "@/components/counterup/CounterOne";
import AboutOne from "@/components/about/About";
import ServiceOne from "@/components/service/ServiceOne";
import TestimonilsOne from "@/components/Testimonials";
import ShortService from "@/components/service/ShortService";
import FooterOne from "@/components/Footer";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/about");

export default function Home() {
    return (
        <div className="demo-one">
            <HeaderOne />
            <CounterOne/>
            <AboutOne/>
            <ServiceOne/>
            <TestimonilsOne/>
            <ShortService/>



            <FooterOne />

        </div>
    );
}
