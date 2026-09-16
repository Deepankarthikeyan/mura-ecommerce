import React from 'react'
import ApexChartOne from "./ApexChartOne";
import ApexChartTwo from "./ApexChartTwo";
import TopProductCountries from "./TopProductCountries";
import OtherBestSeller from "./OtherBestSeller";
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';

function DemoContent() {
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
                    {[
                        {
                            heading: "Revenue",
                            percentage: 50.8,
                            value: 158
                        },
                        {
                            heading: "Revenue",
                            percentage: 50.8,
                            value: 158
                        },
                        {
                            heading: "Revenue",
                            percentage: 50.8,
                            value: 158
                        },
                        {
                            heading: "Revenue",
                            percentage: 50.8,
                            value: 158
                        },
                    ]?.map((datum, index)=>{
                        return <AnalyticsCard
                        key={index}
                        heading={datum?.heading}
                        percentage={datum?.percentage}
                        value={datum?.value}
                        />
                    })}
                </div>

                <div className='row mt--10 g-5'>
                    <ApexChartOne />
                    <ApexChartTwo />
                    <TopProductCountries />
                    <OtherBestSeller />
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