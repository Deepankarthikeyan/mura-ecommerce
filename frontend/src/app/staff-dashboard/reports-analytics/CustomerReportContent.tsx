"use client";

import AnalyticsCard from "@/components/dashboard/AnalyticsCard";

const CARD_COL = "col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12";

const tiles = [
  { heading: "New customers", value: "—" },
  { heading: "Returning customers", value: "—" },
  { heading: "Total customers", value: "—" },
] as const;

export default function CustomerReportContent() {
  return (
    <div>
      <div className="body-root-inner">
        <div className="transection">
          <div className="title-right-actioin-btn-wrapper-product-list">
            <h3 className="title">Customer Report</h3>
          </div>
        </div>

        <div className="row g-5">
          {tiles.map((tile) => (
            <AnalyticsCard
              key={tile.heading}
              heading={tile.heading}
              value={tile.value}
              colClass={CARD_COL}
            />
          ))}
        </div>

        <div className="footer-copyright">
          <div className="left">
            <p>Copyright © 2026 All Right Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
