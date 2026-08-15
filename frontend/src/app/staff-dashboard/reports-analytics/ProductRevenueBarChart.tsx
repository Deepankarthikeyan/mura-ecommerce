"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ProductRevenueBarChartProps = {
  labels: string[];
  revenues: number[];
};

export default function ProductRevenueBarChart({
  labels,
  revenues,
}: ProductRevenueBarChartProps) {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Jost, sans-serif",
      height: 360,
      type: "bar",
      toolbar: { show: false },
    },
    colors: ["#629D23"],
    plotOptions: {
      bar: {
        columnWidth: "42%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      show: true,
      borderColor: "#eef2f0",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: labels,
      labels: {
        style: { colors: "#6b7280", fontSize: "11px" },
        rotate: -35,
        trim: true,
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        style: { colors: "#6b7280", fontSize: "12px" },
        formatter: (val) =>
          `₹${Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) =>
          `₹${Number(val).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
  };

  const series = [{ name: "Product revenue", data: revenues }];

  return (
    <div className="col-xl-5 col-lg-12">
      <div className="apex-xhart-area-one">
        <div className="apex-chart-top-area-banner mb--20">
          <div className="left-area">
            <h1 className="title-top mb--10">Product revenue</h1>
            <span>Top products by revenue</span>
          </div>
        </div>
        <Chart options={options} series={series} type="bar" height={360} />
      </div>
    </div>
  );
}
