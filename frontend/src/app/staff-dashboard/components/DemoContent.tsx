"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexChartOne from "./ApexChartOne";
import ApexChartTwo from "./ApexChartTwo";
import TopProductCountries from "./TopProductCountries";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";

function DemoContent() {
    const [orderCount, setOrderCount] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchOrderCount = async () => {
            try {
                const { data } = await axios.get("/api/orders/staff");
                if (cancelled) return;
                if (data?.success && Array.isArray(data.body)) {
                    setOrderCount(data.body.length);
                } else {
                    setOrderCount(0);
                }
            } catch {
                if (!cancelled) setOrderCount(0);
            }
        };

        void fetchOrderCount();
        return () => {
            cancelled = true;
        };
    }, []);

    const analyticsCards = [
        {
            heading: "Total orders",
            percentage: 50.8,
            value: orderCount ?? "—",
        },
        {
            heading: "Total customers",
            percentage: 50.8,
            value: 158,
        },
        {
            heading: "Total revenue",
            percentage: 50.8,
            value: 158,
        },
    ];

    return (
        <div>
            <div className='body-root-inner'>
                <div className='transection'>
                    <div className="title-right-actioin-btn-wrapper-product-list">
                        <h3 className="title">Overview</h3>
                        <div className="button-wrapper">
                            <div className="single-select">
                                <select className="nice-select">
                                    <option>Week</option>
                                    <option>Month</option>
                                    <option>Year</option>
                                    <option>6 Month</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row g-5">
                    {analyticsCards.map((datum, index) => {
                        return <AnalyticsCard
                        key={index}
                        heading={datum?.heading}
                        percentage={datum?.percentage}
                        value={datum?.value}
                        colClass="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
                        />
                    })}
                </div>

                <div className='row mt--10 g-5'>
                    <ApexChartOne />
                    <ApexChartTwo />
                    <TopProductCountries />
                </div>

                <div className="footer-copyright">
                    <div className="left">
                        <p>Copyright © 2026 All Right Reserved.</p>
                    </div>
                    {/*
                    <ul>
                        <li>
                            <a href="#">Terms</a>
                        </li>
                        <li>
                            <a href="#">Privacy</a>
                        </li>
                        <li>
                            <a href="#">Help</a>
                        </li>
                    </ul>
                    */}
                </div>


            </div>
        </div>
    )
}

export default DemoContent