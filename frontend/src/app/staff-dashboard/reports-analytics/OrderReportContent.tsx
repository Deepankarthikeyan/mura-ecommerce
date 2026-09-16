"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import OrderStatusTrendChart from "./OrderStatusTrendChart";
import OrderOutcomeBarChart from "./OrderOutcomeBarChart";

type OrderChart = {
  labels: string[];
  completed: number[];
  cancelled: number[];
  returnedRefunded: number[];
  summaryLabels: string[];
  summaryCounts: number[];
};

type OrderMetrics = {
  completedOrders: number;
  cancelledOrders: number;
  returnedRefundedOrders: number;
  chart: OrderChart;
};

const CARD_COL = "col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12";
const skeletonPulse = "order-metric-pulse 1.5s ease-in-out infinite";

const EMPTY_CHART: OrderChart = {
  labels: [],
  completed: [],
  cancelled: [],
  returnedRefunded: [],
  summaryLabels: ["Completed", "Cancelled", "Returned/refunded"],
  summaryCounts: [0, 0, 0],
};

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
              width: 140,
              height: 22,
              borderRadius: 4,
              backgroundColor: "#e5e7eb",
              animation: skeletonPulse,
              marginBottom: 10,
            }}
          />
          <div
            style={{
              width: 220,
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

export default function OrderReportContent() {
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("/api/orders/staff/order-metrics");
        if (cancelled) return;
        if (data?.success && data.body) {
          const chart = data.body.chart ?? EMPTY_CHART;
          setMetrics({
            completedOrders: Number(data.body.completedOrders) || 0,
            cancelledOrders: Number(data.body.cancelledOrders) || 0,
            returnedRefundedOrders: Number(data.body.returnedRefundedOrders) || 0,
            chart: {
              labels: Array.isArray(chart.labels) ? chart.labels.map(String) : [],
              completed: Array.isArray(chart.completed)
                ? chart.completed.map((n: unknown) => Number(n) || 0)
                : [],
              cancelled: Array.isArray(chart.cancelled)
                ? chart.cancelled.map((n: unknown) => Number(n) || 0)
                : [],
              returnedRefunded: Array.isArray(chart.returnedRefunded)
                ? chart.returnedRefunded.map((n: unknown) => Number(n) || 0)
                : [],
              summaryLabels: Array.isArray(chart.summaryLabels)
                ? chart.summaryLabels.map(String)
                : EMPTY_CHART.summaryLabels,
              summaryCounts: Array.isArray(chart.summaryCounts)
                ? chart.summaryCounts.map((n: unknown) => Number(n) || 0)
                : EMPTY_CHART.summaryCounts,
            },
          });
        } else {
          setMetrics(null);
          setError(data?.message || "Failed to load order metrics.");
        }
      } catch {
        if (!cancelled) {
          setMetrics(null);
          setError("Failed to load order metrics.");
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
      heading: "Completed orders",
      value: formatCount(metrics?.completedOrders ?? null),
    },
    {
      heading: "Cancelled orders",
      value: formatCount(metrics?.cancelledOrders ?? null),
    },
    {
      heading: "Returned/refunded orders",
      value: formatCount(metrics?.returnedRefundedOrders ?? null),
    },
  ];

  const chart = metrics?.chart ?? EMPTY_CHART;

  return (
    <div>
      <div className="body-root-inner">
        <style>{`
          @keyframes order-metric-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
          }
        `}</style>

        <div className="transection">
          <div className="title-right-actioin-btn-wrapper-product-list">
            <h3 className="title">Order Report</h3>
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
              <OrderStatusTrendChart
                labels={chart.labels}
                completed={chart.completed}
                cancelled={chart.cancelled}
                returnedRefunded={chart.returnedRefunded}
              />
              <OrderOutcomeBarChart
                labels={chart.summaryLabels}
                counts={chart.summaryCounts}
              />
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
