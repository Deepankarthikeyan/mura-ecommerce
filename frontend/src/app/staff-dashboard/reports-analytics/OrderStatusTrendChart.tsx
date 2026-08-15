"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type OrderStatusTrendChartProps = {
  labels: string[];
  completed: number[];
  cancelled: number[];
  returnedRefunded: number[];
};

export default function OrderStatusTrendChart({
  labels,
  completed,
  cancelled,
  returnedRefunded,
}: OrderStatusTrendChartProps) {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Jost, sans-serif",
      height: 360,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#629D23", "#b45309", "#455A3F"],
    stroke: { width: 3, curve: "smooth" },
    markers: { size: 3, strokeWidth: 0 },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    grid: {
      show: true,
      borderColor: "#eef2f0",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: labels,
      labels: { style: { colors: "#6b7280", fontSize: "12px" } },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        style: { colors: "#6b7280", fontSize: "12px" },
        formatter: (val) => String(Math.round(val)),
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${Math.round(val)} orders`,
      },
    },
  };

  const series = [
    { name: "Completed", data: completed },
    { name: "Cancelled", data: cancelled },
    { name: "Returned/refunded", data: returnedRefunded },
  ];

  return (
    <div className="col-xl-7 col-lg-12">
      <div className="apex-xhart-area-one">
        <div className="apex-chart-top-area-banner mb--20">
          <div className="left-area">
            <h1 className="title-top mb--10">Order trends</h1>
            <span>Outcomes by month (last 12 months)</span>
          </div>
        </div>
        <Chart options={options} series={series} type="line" height={360} />
      </div>
    </div>
  );
}
