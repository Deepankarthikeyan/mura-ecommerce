"use client";

import { Suspense } from 'react';
import HeaderOne from "@/components/header/Header";
import ShortService from "@/components/service/ShortService";
import FooterOne from "@/components/Footer";
import ThankYouContent from './ThankYouContent';

// Loading fallback for Suspense
const ThankYouSkeleton = () => (
    <div className="rts-register-area rts-section-gap bg_light-1">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="registration-wrapper-1 text-center py-5">
                        <div
                            style={{
                                width: "100px",
                                height: "100px",
                                backgroundColor: "#e5e7eb",
                                borderRadius: "50%",
                                margin: "0 auto 20px"
                            }}
                        />
                        <div style={{ width: "300px", height: "30px", backgroundColor: "#e5e7eb", margin: "0 auto 20px" }} />
                        <div style={{ width: "200px", height: "20px", backgroundColor: "#e5e7eb", margin: "0 auto" }} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function ThankYou() {
    return (
        <div className="demo-one">
            <HeaderOne />
            <Suspense fallback={<ThankYouSkeleton />}>
                <ThankYouContent />
            </Suspense>
            <ShortService />
            <FooterOne />
        </div>
    );
}
