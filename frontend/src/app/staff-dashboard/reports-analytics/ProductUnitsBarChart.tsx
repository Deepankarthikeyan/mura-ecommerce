"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ProductUnitsBarChartProps = {
  labels: string[];
  unitsSold: number[];
};

export default function ProductUnitsBarChart({ labels, unitsSold }: ProductUnitsBarChartProps) {
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
        horizontal: true,
        barHeight: "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      show: true,
      borderColor: "#eef2f0",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: labels,
      labels: {
        style: { colors: "#6b7280", fontSize: "12px" },
        formatter: (val) => String(Math.round(Number(val))),
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280", fontSize: "12px" },
        maxWidth: 140,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${Math.round(val)} units`,
      },
    },
  };

  const series = [{ name: "Units sold", data: unitsSold }];

  return (
    <div className="col-xl-7 col-lg-12">
      <div className="apex-xhart-area-one">
        <div className="apex-chart-top-area-banner mb--20">
          <div className="left-area">
            <h1 className="title-top mb--10">Best-selling products</h1>
            <span>Top products by units sold</span>
          </div>
        </div>
        <Chart options={options} series={series} type="bar" height={360} />
      </div>
    </div>
  );
}
