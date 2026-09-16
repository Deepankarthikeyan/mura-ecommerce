"use client"
import HeaderOne from "@/components/header/Header";
import ShortService from "@/components/service/ShortService";
import Accordion from "./Accordion";
import FooterOne from "@/components/Footer";

export default function Home() {
    return (
        <div className="demo-one">
            <HeaderOne />

            <>
                


            <Accordion/>

                
                
            </>

            <ShortService />
            <FooterOne />
        </div>
    );
}
