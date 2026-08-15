"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type OrderOutcomeBarChartProps = {
  labels: string[];
  counts: number[];
};

export default function OrderOutcomeBarChart({ labels, counts }: OrderOutcomeBarChartProps) {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Jost, sans-serif",
      height: 360,
      type: "bar",
      toolbar: { show: false },
    },
    colors: ["#629D23", "#b45309", "#455A3F"],
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: "45%",
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
      y: {
        formatter: (val) => `${Math.round(val)} orders`,
      },
    },
  };

  const series = [{ name: "Orders", data: counts }];

  return (
    <div className="col-xl-5 col-lg-12">
      <div className="apex-xhart-area-one">
        <div className="apex-chart-top-area-banner mb--20">
          <div className="left-area">
            <h1 className="title-top mb--10">Order outcomes</h1>
            <span>Completed vs cancelled vs returned/refunded</span>
          </div>
        </div>
        <Chart options={options} series={series} type="bar" height={360} />
      </div>
    </div>
  );
}
