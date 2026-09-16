"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import OrdersLineChart from "./OrdersLineChart";
import OrderValueBarChart from "./OrderValueBarChart";

type SalesChart = {
  labels: string[];
  orderCounts: number[];
  orderValues: number[];
};

type SalesMetrics = {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  chart: SalesChart;
};

const CARD_COL = "col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12";
const skeletonPulse = "sales-metric-pulse 1.5s ease-in-out infinite";

const EMPTY_CHART: SalesChart = {
  labels: [],
  orderCounts: [],
  orderValues: [],
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
              width: 120,
              height: 22,
              borderRadius: 4,
              backgroundColor: "#e5e7eb",
              animation: skeletonPulse,
              marginBottom: 10,
            }}
          />
          <div
            style={{
              width: 200,
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

export default function SalesReportContent() {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("/api/orders/staff/metrics");
        if (cancelled) return;
        if (data?.success && data.body) {
          const chart = data.body.chart ?? EMPTY_CHART;
          setMetrics({
            totalSales: Number(data.body.totalSales) || 0,
            orderCount: Number(data.body.orderCount) || 0,
            averageOrderValue: Number(data.body.averageOrderValue) || 0,
            chart: {
              labels: Array.isArray(chart.labels) ? chart.labels.map(String) : [],
              orderCounts: Array.isArray(chart.orderCounts)
                ? chart.orderCounts.map((n: unknown) => Number(n) || 0)
                : [],
              orderValues: Array.isArray(chart.orderValues)
                ? chart.orderValues.map((n: unknown) => Number(n) || 0)
                : [],
            },
          });
        } else {
          setMetrics(null);
          setError(data?.message || "Failed to load sales metrics.");
        }
      } catch {
        if (!cancelled) {
          setMetrics(null);
          setError("Failed to load sales metrics.");
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
      heading: "Total sales",
      value: formatMoney(metrics?.totalSales ?? null),
    },
    {
      heading: "Number of orders",
      value: formatCount(metrics?.orderCount ?? null),
    },
    {
      heading: "Average order value",
      value: formatMoney(metrics?.averageOrderValue ?? null),
    },
  ];

  const chart = metrics?.chart ?? EMPTY_CHART;

  return (
    <div>
      <div className="body-root-inner">
        <style>{`
          @keyframes sales-metric-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
          }
        `}</style>

        <div className="transection">
          <div className="title-right-actioin-btn-wrapper-product-list">
            <h3 className="title">Sales Report</h3>
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
              <OrdersLineChart labels={chart.labels} orderCounts={chart.orderCounts} />
              <OrderValueBarChart labels={chart.labels} orderValues={chart.orderValues} />
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
