"use client";

import React, { useCallback, useEffect, useMemo, useState, ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import OrderProductsDialog, { OrderProductItem } from "@/components/dialog/OrderProductsDialog";

/** Must stay in sync with `STAFF_ORDER_STATUS_WHITELIST` in mongodbOperations. */
const ORDER_STATUS_OPTIONS = [
  "pending",
  "order accepted",
  "dispatched",
  "delivered",
  "cancel in review",
  "cancel approved",
  "cancel rejected",
  "return in review",
  "return approved",
  "return rejected",
  "refund processing",
  "refunded",
] as const;

function formatOrderStatusDisplay(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (s === "paid") return "Order received";
  if (s === "disptached" || s === "dispatched") return "Dispatched";
  if (raw === "—") return raw;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function resolveStatusForSelect(raw: string | undefined): string {
  const s = (raw ?? "pending").trim().toLowerCase();
  if (s === "paid") return "pending";
  if (s === "disptached") return "dispatched";
  if (s === "canceled" || s === "cancelled") return "cancel approved";
  if (s === "returned") return "return approved";
  const hit = ORDER_STATUS_OPTIONS.find((o) => o === s);
  if (hit) return hit;
  return "pending";
}

interface DbOrder {
  _id?: string;
  orderId?: string;
  userEmail?: string;
  billingInfo?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  items?: { title?: string; quantity?: number; price?: number; image?: string }[];
  subtotal?: number;
  discount?: number;
  shippingCost?: number;
  total?: number | string;
  paymentMethod?: string;
  orderNotes?: string;
  status?: string;
  createdAt?: string | Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

interface OrderLineItem extends OrderProductItem {}

interface OrderRow {
  id: string;
  orderId: string;
  createdAt: string;
  customer: string;
  items: OrderLineItem[];
  itemsSummary: string;
  itemCount: number;
  total: string;
  status: string;
  payment: string;
}

function formatMoney(raw: number | string | undefined): string {
  if (raw === undefined || raw === null || raw === "") return "—";
  const n = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/[^0-9.-]/g, ""));
  if (Number.isFinite(n)) return `₹${n.toFixed(2)}`;
  return String(raw);
}

function formatDate(raw: string | Date | undefined): string {
  if (raw == null) return "—";
  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateFilterLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00+05:30`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function docToRow(doc: DbOrder, index: number): OrderRow {
  const id = doc._id ?? (doc.orderId ? String(doc.orderId) : `idx-${index}`);
  const email = doc.userEmail || doc.billingInfo?.email || "";
  const name = [doc.billingInfo?.firstName, doc.billingInfo?.lastName].filter(Boolean).join(" ").trim();
  const customer = email || name || "—";

  const items = Array.isArray(doc.items) ? doc.items : [];
  const lineItems: OrderLineItem[] = items.map((i) => ({
    title: i.title?.trim() || "Item",
    quantity: i.quantity ?? 1,
    price: i.price ?? 0,
    image: i.image || undefined,
  }));
  const itemsSummary = lineItems
    .map((i) => `${i.title} ×${i.quantity}`)
    .join(", ");

  return {
    id: String(id),
    orderId: String(doc.orderId ?? "—"),
    createdAt: formatDate(doc.createdAt),
    customer,
    items: lineItems,
    itemsSummary: itemsSummary || "—",
    itemCount: lineItems.length,
    total: formatMoney(doc.total),
    status: String(doc.status ?? "—"),
    payment: String(doc.paymentMethod ?? "—"),
  };
}

function mapApiOrdersToRows(raw: unknown): { rows: OrderRow[]; docs: DbOrder[] } {
  if (!Array.isArray(raw)) {
    return { rows: [], docs: [] };
  }
  const list = raw as DbOrder[];
  return {
    docs: list,
    rows: list.map((doc, index) => docToRow(doc, index)),
  };
}

function buildStaffOrdersQuery(search: string, date: string, status: string): string {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }
  if (date) {
    params.set("date", date);
  }
  if (status) {
    params.set("status", status);
  }
  const query = params.toString();
  return query ? `/api/orders/staff?${query}` : "/api/orders/staff";
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) {
    pages.push("ellipsis");
  } else {
    for (let i = 2; i < left; i++) pages.push(i);
  }

  for (let i = left; i <= right; i++) pages.push(i);

  if (right < total - 1) {
    pages.push("ellipsis");
  } else {
    for (let i = right + 1; i < total; i++) pages.push(i);
  }

  if (total > 1) pages.push(total);

  return pages;
}

interface StaffOrderCardProps {
  row: OrderRow;
  onView: () => void;
  onViewProducts: () => void;
}

const skeletonPulse = "staff-order-card-pulse 1.5s ease-in-out infinite";

const StaffOrderCardSkeleton: React.FC = () => (
  <article className="order-card-item" aria-hidden="true">
    <div className="order-card-item__inner">
      <div className="order-card-item__header">
        <div
          style={{
            width: "45%",
            height: 18,
            backgroundColor: "#e0e0e0",
            borderRadius: 4,
            animation: skeletonPulse,
          }}
        />
        <div
          style={{
            width: 80,
            height: 24,
            backgroundColor: "#e0e0e0",
            borderRadius: 12,
            animation: skeletonPulse,
          }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ gridColumn: i <= 3 ? "1 / -1" : undefined }}>
            <div
              style={{
                width: "40%",
                height: 12,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
                marginBottom: 6,
                animation: skeletonPulse,
              }}
            />
            <div
              style={{
                width: "70%",
                height: 14,
                backgroundColor: "#e0e0e0",
                borderRadius: 4,
                animation: skeletonPulse,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  </article>
);

const StaffOrderCard: React.FC<StaffOrderCardProps> = ({ row, onView, onViewProducts }) => (
  <article className="order-card-item">
    <div className="order-card-item__inner">
      <div className="order-card-item__header">
        <p className="order-card-item__order-no">{row.orderId}</p>
        <div className="order-card-item__status-row">
          <span className="order-card-item__status-badge">{formatOrderStatusDisplay(row.status)}</span>
          <button
            type="button"
            onClick={onView}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              color: "#1f2937",
              whiteSpace: "nowrap",
            }}
          >
            View
          </button>
        </div>
      </div>
      <dl className="order-card-item__fields">
        <div className="order-card-item__field order-card-item__field--wide">
          <dt>Placed</dt>
          <dd>{row.createdAt}</dd>
        </div>
        <div className="order-card-item__field order-card-item__field--wide">
          <dt>Customer</dt>
          <dd>{row.customer}</dd>
        </div>
        <div className="order-card-item__field order-card-item__field--wide">
          <dt>Items</dt>
          <dd>
            {row.items.length > 0 ? (
              <button type="button" className="order-products-link" onClick={onViewProducts}>
                View products
              </button>
            ) : (
              "—"
            )}
          </dd>
        </div>
        <div className="order-card-item__field">
          <dt>Total</dt>
          <dd>{row.total}</dd>
        </div>
        <div className="order-card-item__field">
          <dt>Payment</dt>
          <dd>{row.payment}</dd>
        </div>
      </dl>
    </div>
  </article>
);

const OverviewTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderDates, setOrderDates] = useState<string[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [rawOrders, setRawOrders] = useState<DbOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailOrder, setDetailOrder] = useState<DbOrder | null>(null);
  const [productsDialog, setProductsDialog] = useState<{ orderNo: string; items: OrderProductItem[] } | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const loadFilters = async () => {
      try {
        const [datesRes, statusesRes] = await Promise.all([
          axios.get("/api/orders/staff?dates=true"),
          axios.get("/api/orders/staff?statuses=true"),
        ]);
        if (cancelled) return;
        if (datesRes.data?.success && Array.isArray(datesRes.data.body)) {
          setOrderDates(datesRes.data.body.map(String));
        }
        if (statusesRes.data?.success && Array.isArray(statusesRes.data.body)) {
          setOrderStatuses(statusesRes.data.body.map(String));
        }
      } catch (err) {
        console.error("Error fetching order filters:", err);
      }
    };

    void loadFilters();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");
        const { data } = await axios.get(buildStaffOrdersQuery(debouncedSearch, selectedDate, selectedStatus));
        if (cancelled) return;

        const raw = data?.body;
        if (!data?.success || !Array.isArray(raw)) {
          setOrders([]);
          setRawOrders([]);
          if (data?.message) setError(String(data.message));
          return;
        }

        const { rows, docs } = mapApiOrdersToRows(raw);
        setRawOrders(docs);
        setOrders(rows);
      } catch (err: unknown) {
        if (cancelled) return;
        console.error("Error fetching orders:", err);
        const msg =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "Failed to load orders";
        setError(msg);
        setOrders([]);
        setRawOrders([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    setCurrentPage(1);
    void fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedDate, selectedStatus]);

  const openDetail = useCallback(
    (row: OrderRow) => {
      const found = rawOrders.find(
        (o) => String(o._id ?? o.orderId) === row.id || String(o.orderId) === row.orderId,
      );
      if (found) setDetailOrder(found);
      else toast.error("Could not load order details.");
    },
    [rawOrders],
  );

  const handleOrderStatusChange = useCallback(
    async (e: ChangeEvent<HTMLSelectElement>) => {
      if (!detailOrder) return;
      const mongoId = detailOrder._id != null ? String(detailOrder._id) : "";
      if (!mongoId) {
        toast.error("This order has no database id; status cannot be updated.");
        return;
      }
      const newStatus = e.target.value;
      setStatusSaving(true);
      try {
        const { data } = await axios.patch("/api/orders/staff", { id: mongoId, status: newStatus });
        if (data?.success) {
          toast.success("Order status updated.");
          const idStr = mongoId;
          setDetailOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
          setRawOrders((prev) =>
            prev.map((o) => (String(o._id ?? "") === idStr ? { ...o, status: newStatus } : o)),
          );
          setOrders((prev) => prev.map((r) => (r.id === idStr ? { ...r, status: newStatus } : r)));
        } else {
          toast.error(typeof data?.message === "string" ? data.message : "Update failed.");
        }
      } catch (err: unknown) {
        const msg =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "Update failed.";
        toast.error(msg);
      } finally {
        setStatusSaving(false);
      }
    },
    [detailOrder],
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = orders.length === 0 ? 0 : (safePage - 1) * rowsPerPage + 1;
  const pageEnd = Math.min(safePage * rowsPerPage, orders.length);
  const paginatedItems = orders.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

  const visiblePages = useMemo(
    () => getPageNumbers(safePage, totalPages),
    [safePage, totalPages],
  );

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="title-right-actioin-btn-wrapper-product-list">
          <h3 className="title">Orders</h3>
        </div>

        <div className="vendor-list-main-wrapper product-wrapper">
          <div className="order-cards-panel">
            <div className="order-cards-toolbar staff-orders-toolbar">
              <label htmlFor="staff-orders-length">
                Show{" "}
                <select
                  id="staff-orders-length"
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                >
                  {[5, 10, 15, 20, 50].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>{" "}
                entries
              </label>
              <div className="staff-orders-filters">
                <div className="staff-orders-search">
                  <input
                    id="staff-orders-search"
                    type="search"
                    className="staff-orders-search-input"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search orders"
                  />
                  <i className="fa-light fa-magnifying-glass" aria-hidden="true" />
                </div>
                <select
                  className="staff-orders-date-select"
                  value={selectedDate}
                  onChange={handleDateChange}
                  aria-label="Filter by order date"
                >
                  <option value="">All Dates</option>
                  {orderDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDateFilterLabel(date)}
                    </option>
                  ))}
                </select>
                <select
                  className="staff-orders-status-select"
                  value={selectedStatus}
                  onChange={handleStatusFilterChange}
                  aria-label="Filter by order status"
                >
                  <option value="">All Statuses</option>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatOrderStatusDisplay(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <style>{`
              @keyframes staff-order-card-pulse {
                0% { opacity: 1; }
                50% { opacity: 0.4; }
                100% { opacity: 1; }
              }
              .staff-orders-toolbar {
                background: transparent !important;
              }
              .staff-orders-filters {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: nowrap;
              }
              .staff-orders-search {
                position: relative;
                width: 220px;
              }
              .staff-orders-search-input {
                width: 100%;
                height: 38px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 0 40px 0 14px;
                font-size: 14px;
                color: #374151;
                background: #fff;
                outline: none;
              }
              .staff-orders-search-input:focus {
                border-color: var(--color-primary, #629d23);
              }
              .staff-orders-search i {
                position: absolute;
                right: 14px;
                top: 50%;
                transform: translateY(-50%);
                color: #374151;
                pointer-events: none;
              }
              .staff-orders-date-select,
              .staff-orders-status-select {
                width: 170px;
                height: 38px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 0 36px 0 14px;
                font-size: 14px;
                color: #374151;
                background: #fff;
                cursor: pointer;
                outline: none;
              }
              .staff-orders-date-select:focus,
              .staff-orders-status-select:focus {
                border-color: var(--color-primary, #629d23);
              }
            `}</style>

            {isLoading ? (
              <div className="order-cards-grid">
                {Array.from({ length: rowsPerPage }, (_, i) => (
                  <StaffOrderCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>
                <p>{error}</p>
              </div>
            ) : paginatedItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>
                  {debouncedSearch || selectedDate || selectedStatus
                    ? "No orders match your filters."
                    : "No orders found in the database."}
                </p>
              </div>
            ) : (
              <div className="order-cards-grid">
                {paginatedItems.map((row) => (
                  <StaffOrderCard
                    key={row.id}
                    row={row}
                    onView={() => openDetail(row)}
                    onViewProducts={() => setProductsDialog({ orderNo: row.orderId, items: row.items })}
                  />
                ))}
              </div>
            )}

            {!isLoading && !error && orders.length > 0 && (
              <div className="order-cards-pagination">
                <p className="order-cards-pagination__info">
                  Showing {pageStart} to {pageEnd} of {orders.length} entries
                </p>
                <div className="order-cards-pagination__controls">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  {visiblePages.map((page, index) =>
                    page === "ellipsis" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="order-cards-pagination__ellipsis"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        className={page === safePage ? "is-active" : undefined}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="left">
          <p>Copyright © 2026 All Right Reserved.</p>
        </div>
      </div>

      {detailOrder ? (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 10060,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDetailOrder(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            style={{
              background: "#fff",
              borderRadius: 12,
              maxWidth: 560,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="orders-staff-detail-modal"
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
              <h4 id="order-detail-title" style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" }}>
                Order {detailOrder.orderId ?? "—"}
              </h4>
              <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6b7280" }}>
                {formatDate(detailOrder.createdAt)} · {formatOrderStatusDisplay(detailOrder.status ?? "—")}
              </p>
            </div>
            <div style={{ padding: 20, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Customer</p>
              <p style={{ margin: "0 0 16px" }}>
                {detailOrder.userEmail || detailOrder.billingInfo?.email || "—"}
                <br />
                {[detailOrder.billingInfo?.firstName, detailOrder.billingInfo?.lastName].filter(Boolean).join(" ")}
                {detailOrder.billingInfo?.phone ? (
                  <>
                    <br />
                    {detailOrder.billingInfo.phone}
                  </>
                ) : null}
              </p>
              {detailOrder.billingInfo?.address ? (
                <>
                  <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Address</p>
                  <p style={{ margin: "0 0 16px", whiteSpace: "pre-line" }}>
                    {[
                      detailOrder.billingInfo.address,
                      detailOrder.billingInfo.city,
                      detailOrder.billingInfo.state,
                      detailOrder.billingInfo.zip,
                      detailOrder.billingInfo.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </>
              ) : null}
              <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Items</p>
              <ul style={{ margin: "0 0 16px", paddingLeft: 20 }}>
                {(detailOrder.items ?? []).map((it, i) => (
                  <li key={i}>
                    {it.title ?? "Item"} × {it.quantity ?? 1} — {formatMoney(
                      typeof it.price === "number" && it.quantity != null
                        ? it.price * it.quantity
                        : it.price,
                    )}
                  </li>
                ))}
              </ul>
              <p style={{ margin: "0 0 4px" }}>
                <strong>Subtotal:</strong> {formatMoney(detailOrder.subtotal)}
              </p>
              <p style={{ margin: "0 0 4px" }}>
                <strong>Total:</strong> {formatMoney(detailOrder.total)}
              </p>
              <p style={{ margin: "0 0 4px" }}>
                <strong>Payment:</strong> {detailOrder.paymentMethod ?? "—"}
              </p>
              {detailOrder.orderNotes ? (
                <p style={{ margin: "12px 0 0" }}>
                  <strong>Notes:</strong> {detailOrder.orderNotes}
                </p>
              ) : null}

              <div className="order-status-row">
                <label htmlFor="staff-order-status">Order status</label>
                <select
                  id="staff-order-status"
                  aria-label="Order status"
                  disabled={statusSaving || !detailOrder._id}
                  value={resolveStatusForSelect(detailOrder.status)}
                  onChange={(ev) => void handleOrderStatusChange(ev)}
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ padding: "12px 20px 20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setDetailOrder(null)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: "#1f72b0",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <OrderProductsDialog
        isOpen={productsDialog !== null}
        orderNo={productsDialog?.orderNo ?? ""}
        items={productsDialog?.items ?? []}
        onClose={() => setProductsDialog(null)}
      />
    </div>
  );
};

export default OverviewTable;
