"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import ProductUnitsBarChart from "./ProductUnitsBarChart";
import ProductRevenueBarChart from "./ProductRevenueBarChart";

type ProductChart = {
  labels: string[];
  unitsSold: number[];
  revenueLabels: string[];
  revenues: number[];
};

type ProductMetrics = {
  bestSellingProduct: string;
  bestSellingUnits: number;
  unitsSold: number;
  productRevenue: number;
  chart: ProductChart;
};

const CARD_COL = "col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12";
const skeletonPulse = "product-metric-pulse 1.5s ease-in-out infinite";

const EMPTY_CHART: ProductChart = {
  labels: [],
  unitsSold: [],
  revenueLabels: [],
  revenues: [],
};

function formatMoney(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatCount(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-IN");
}

function truncateTitle(title: string, max = 28): string {
  const t = title.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function MetricCardSkeleton() {
  return (
    <div className={CARD_COL} aria-hidden="true">
      <div className="single-over-fiew-card">
        <div
          style={{
            width: "42%",
            height: 14,
            borderRadius: 4,
            backgroundColor: "#e5e7eb",
            animation: skeletonPulse,
            marginBottom: 18,
          }}
        />
        <div className="bottom">
          <div
            style={{
              width: "58%",
              height: 32,
              borderRadius: 6,
              backgroundColor: "#e5e7eb",
              animation: skeletonPulse,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton({ colClass }: { colClass: string }) {
  return (
    <div className={colClass} aria-hidden="true">
      <div className="apex-xhart-area-one">
        <div className="apex-chart-top-area-banner mb--20">
          <div
            style={{
              width: 160,
              height: 22,
              borderRadius: 4,
              backgroundColor: "#e5e7eb",
              animation: skeletonPulse,
              marginBottom: 10,
            }}
          />
          <div
            style={{
              width: 180,
              height: 14,
              borderRadius: 4,
              backgroundColor: "#e5e7eb",
              animation: skeletonPulse,
            }}
          />
        </div>
        <div
          style={{
            width: "100%",
            height: 360,
            borderRadius: 8,
            backgroundColor: "#e5e7eb",
            animation: skeletonPulse,
          }}
        />
      </div>
    </div>
  );
}

export default function ProductReportContent() {
  const [metrics, setMetrics] = useState<ProductMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("/api/orders/staff/product-metrics");
        if (cancelled) return;
        if (data?.success && data.body) {
          const chart = data.body.chart ?? EMPTY_CHART;
          setMetrics({
            bestSellingProduct: String(data.body.bestSellingProduct ?? "—"),
            bestSellingUnits: Number(data.body.bestSellingUnits) || 0,
            unitsSold: Number(data.body.unitsSold) || 0,
            productRevenue: Number(data.body.productRevenue) || 0,
            chart: {
              labels: Array.isArray(chart.labels) ? chart.labels.map(String) : [],
              unitsSold: Array.isArray(chart.unitsSold)
                ? chart.unitsSold.map((n: unknown) => Number(n) || 0)
                : [],
              revenueLabels: Array.isArray(chart.revenueLabels)
                ? chart.revenueLabels.map(String)
                : Array.isArray(chart.labels)
                  ? chart.labels.map(String)
                  : [],
              revenues: Array.isArray(chart.revenues)
                ? chart.revenues.map((n: unknown) => Number(n) || 0)
                : [],
            },
          });
        } else {
          setMetrics(null);
          setError(data?.message || "Failed to load product metrics.");
        }
      } catch {
        if (!cancelled) {
          setMetrics(null);
          setError("Failed to load product metrics.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      heading: "Best-selling product",
      value: metrics ? truncateTitle(metrics.bestSellingProduct) : "—",
    },
    {
      heading: "Units sold",
      value: formatCount(metrics?.unitsSold ?? null),
    },
    {
      heading: "Product revenue",
      value: formatMoney(metrics?.productRevenue ?? null),
    },
  ];

  const chart = metrics?.chart ?? EMPTY_CHART;

  return (
    <div>
      <div className="body-root-inner">
        <style>{`
          @keyframes product-metric-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
          }
        `}</style>

        <div className="transection">
          <div className="title-right-actioin-btn-wrapper-product-list">
            <h3 className="title">Product Report</h3>
          </div>
        </div>

        {error ? (
          <p style={{ color: "#b45309", marginBottom: 16 }}>{error}</p>
        ) : null}

        <div className="row g-5" aria-busy={loading} aria-live="polite">
          {loading
            ? [0, 1, 2].map((i) => <MetricCardSkeleton key={i} />)
            : cards.map((card) => (
                <AnalyticsCard
                  key={card.heading}
                  heading={card.heading}
                  value={card.value}
                  colClass={CARD_COL}
                />
              ))}
        </div>

        <div className="row mt--10 g-5" aria-busy={loading}>
          {loading ? (
            <>
              <ChartSkeleton colClass="col-xl-7 col-lg-12" />
              <ChartSkeleton colClass="col-xl-5 col-lg-12" />
            </>
          ) : (
            <>
              <ProductUnitsBarChart labels={chart.labels} unitsSold={chart.unitsSold} />
              <ProductRevenueBarChart labels={chart.revenueLabels} revenues={chart.revenues} />
            </>
          )}
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
