"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type CouponStatus = "active" | "inactive";

interface CouponRow {
  id: string;
  couponName: string;
  couponCode: string;
  discountPrice: number;
  discountPercentage: number;
  fromDate: string;
  toDate: string;
  numberOfDays: number;
  status: CouponStatus;
}

interface CouponFormState {
  couponName: string;
  discountPrice: string;
  discountPercentage: string;
  fromDate: string;
  toDate: string;
  numberOfDays: string;
}

const emptyForm = (): CouponFormState => ({
  couponName: "",
  discountPrice: "",
  discountPercentage: "",
  fromDate: "",
  toDate: "",
  numberOfDays: "",
});

function toDateInputValue(value: unknown): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDisplayDate(value: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calcNumberOfDays(fromDate: string, toDate: string): string {
  if (!fromDate || !toDate) return "";
  const from = new Date(fromDate);
  const to = new Date(toDate);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return "";
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return String(Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

function normalizeCoupon(raw: Record<string, unknown>): CouponRow {
  return {
    id: String(raw.id ?? ""),
    couponName: String(raw.couponName ?? ""),
    couponCode: String(raw.couponCode ?? ""),
    discountPrice: Number(raw.discountPrice ?? 0),
    discountPercentage: Number(raw.discountPercentage ?? 0),
    fromDate: toDateInputValue(raw.fromDate),
    toDate: toDateInputValue(raw.toDate),
    numberOfDays: Number(raw.numberOfDays ?? 0),
    status: raw.status === "inactive" ? "inactive" : "active",
  };
}

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#6b7280",
  marginBottom: 6,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const fieldInputStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "0 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 14,
  color: "#111827",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

function couponToForm(coupon: CouponRow): CouponFormState {
  const hasPrice = Number(coupon.discountPrice) > 0;
  const hasPct = Number(coupon.discountPercentage) > 0;
  return {
    couponName: coupon.couponName || "",
    discountPrice: hasPrice ? String(coupon.discountPrice) : "",
    discountPercentage: hasPct && !hasPrice ? String(coupon.discountPercentage) : "",
    fromDate: coupon.fromDate || "",
    toDate: coupon.toDate || "",
    numberOfDays:
      coupon.numberOfDays > 0
        ? String(coupon.numberOfDays)
        : calcNumberOfDays(coupon.fromDate, coupon.toDate),
  };
}

const DemoContent: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddCard, setShowAddCard] = useState(false);
  const [form, setForm] = useState<CouponFormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [statusBusyId, setStatusBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CouponFormState>(emptyForm());
  const [editSaving, setEditSaving] = useState(false);

  const loadCoupons = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/coupons");
      if (data?.success === false) {
        setError(data?.message || "Could not load coupons.");
        setCoupons([]);
        return;
      }
      const list = Array.isArray(data?.body) ? data.body : [];
      setCoupons(list.map((item: Record<string, unknown>) => normalizeCoupon(item)));
    } catch (err: unknown) {
      console.error("Error fetching coupons:", err);
      setError("Could not load coupons.");
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const openAddCard = () => {
    setEditingId(null);
    setEditForm(emptyForm());
    setForm(emptyForm());
    setShowAddCard(true);
  };

  const closeAddCard = () => {
    if (saving) return;
    setShowAddCard(false);
    setForm(emptyForm());
  };

  const applyFormFieldUpdate = (
    prev: CouponFormState,
    key: keyof CouponFormState,
    value: string
  ): CouponFormState => {
    const next = { ...prev, [key]: value };
    if (key === "discountPrice") {
      if (value.trim() !== "") {
        next.discountPercentage = "";
      }
    }
    if (key === "discountPercentage") {
      if (value.trim() !== "") {
        next.discountPrice = "";
      }
    }
    if (key === "fromDate" || key === "toDate") {
      next.numberOfDays = calcNumberOfDays(
        key === "fromDate" ? value : next.fromDate,
        key === "toDate" ? value : next.toDate
      );
    }
    return next;
  };

  const hasDiscountPrice = form.discountPrice.trim() !== "";
  const hasDiscountPercentage = form.discountPercentage.trim() !== "";
  const editHasDiscountPrice = editForm.discountPrice.trim() !== "";
  const editHasDiscountPercentage = editForm.discountPercentage.trim() !== "";

  const updateFormField = (key: keyof CouponFormState, value: string) => {
    setForm((prev) => applyFormFieldUpdate(prev, key, value));
  };

  const updateEditFormField = (key: keyof CouponFormState, value: string) => {
    setEditForm((prev) => applyFormFieldUpdate(prev, key, value));
  };

  const isCouponFormValid = (state: CouponFormState) => {
    if (!state.couponName.trim()) return false;
    const priceFilled = state.discountPrice.trim() !== "";
    const pctFilled = state.discountPercentage.trim() !== "";
    if (priceFilled === pctFilled) return false; // exactly one required
    if (priceFilled) {
      const price = Number(state.discountPrice);
      if (!Number.isFinite(price) || price <= 0) return false;
    }
    if (pctFilled) {
      const pct = Number(state.discountPercentage);
      if (!Number.isFinite(pct) || pct <= 0 || pct > 100) return false;
    }
    if (!state.fromDate || !state.toDate) return false;
    if (new Date(state.toDate) < new Date(state.fromDate)) return false;
    const days = Number(state.numberOfDays);
    if (!Number.isFinite(days) || days < 1) return false;
    return true;
  };

  const formValid = useMemo(() => isCouponFormValid(form), [form]);
  const editFormValid = useMemo(() => isCouponFormValid(editForm), [editForm]);

  const startEditCoupon = (coupon: CouponRow) => {
    if (editSaving) return;
    setShowAddCard(false);
    setForm(emptyForm());
    setEditingId(coupon.id);
    setEditForm(couponToForm(coupon));
  };

  const cancelEditCoupon = () => {
    if (editSaving) return;
    setEditingId(null);
    setEditForm(emptyForm());
  };

  const handleSaveEdit = async (coupon: CouponRow) => {
    if (!editFormValid) {
      toast.error("Please fill all coupon fields correctly.");
      return;
    }
    setEditSaving(true);
    try {
      const { data } = await axios.patch("/api/coupons", {
        id: coupon.id,
        couponName: editForm.couponName.trim(),
        discountPrice: editHasDiscountPrice ? Number(editForm.discountPrice) : 0,
        discountPercentage: editHasDiscountPercentage
          ? Number(editForm.discountPercentage)
          : 0,
        fromDate: editForm.fromDate,
        toDate: editForm.toDate,
        numberOfDays: Number(editForm.numberOfDays),
      });
      if (data?.success === false) {
        toast.error(data?.message || "Could not update coupon.");
        return;
      }
      toast.success("Coupon updated.");
      setEditingId(null);
      setEditForm(emptyForm());
      await loadCoupons();
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Could not update coupon.";
      toast.error(message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleSaveCoupon = async (status: CouponStatus) => {
    if (!formValid) {
      toast.error("Please fill all coupon fields correctly.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await axios.post("/api/coupons", {
        couponName: form.couponName.trim(),
        discountPrice: hasDiscountPrice ? Number(form.discountPrice) : 0,
        discountPercentage: hasDiscountPercentage ? Number(form.discountPercentage) : 0,
        fromDate: form.fromDate,
        toDate: form.toDate,
        numberOfDays: Number(form.numberOfDays),
        status,
      });
      if (data?.success === false) {
        toast.error(data?.message || "Could not save coupon.");
        return;
      }
      toast.success(status === "active" ? "Coupon activated." : "Coupon saved as inactive.");
      setShowAddCard(false);
      setForm(emptyForm());
      await loadCoupons();
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Could not save coupon.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (coupon: CouponRow, status: CouponStatus) => {
    if (coupon.status === status) return;
    setStatusBusyId(coupon.id);
    try {
      const { data } = await axios.patch("/api/coupons", { id: coupon.id, status });
      if (data?.success === false) {
        toast.error(data?.message || "Could not update status.");
        return;
      }
      setCoupons((prev) =>
        prev.map((row) => (row.id === coupon.id ? { ...row, status } : row))
      );
      toast.success(status === "active" ? "Coupon activated." : "Coupon deactivated.");
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Could not update status.";
      toast.error(message);
    } finally {
      setStatusBusyId(null);
    }
  };

  const showEmptyState = !isLoading && !error && coupons.length === 0 && !showAddCard;

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="title-right-actioin-btn-wrapper-product-list">
          <h3 className="title">Discounts and Coupons</h3>
          <div className="button-wrapper">
            <button
              type="button"
              className="rts-btn btn-primary"
              onClick={openAddCard}
              disabled={showAddCard}
            >
              + Add coupon
            </button>
          </div>
        </div>

        <div className="vendor-list-main-wrapper product-wrapper">
          <div className="order-cards-panel" style={{ padding: 20 }}>
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                Loading coupons…
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#b91c1c" }}>
                {error}
              </div>
            ) : showEmptyState ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <p style={{ margin: 0, color: "#6b7280", fontSize: 15 }}>
                  No coupons added yet.
                </p>
                <button
                  type="button"
                  className="rts-btn btn-primary"
                  onClick={openAddCard}
                >
                  Add coupons
                </button>
              </div>
            ) : (
              <div className="order-cards-grid">
                {showAddCard && (
                  <article className="order-card-item" style={{ gridColumn: "1 / -1" }}>
                    <div className="order-card-item__inner" style={{ padding: 20 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 18,
                          gap: 12,
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" }}>
                          Add coupon
                        </h4>
                        <button
                          type="button"
                          onClick={closeAddCard}
                          disabled={saving}
                          aria-label="Close"
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: saving ? "not-allowed" : "pointer",
                            fontSize: 20,
                            lineHeight: 1,
                            color: "#6b7280",
                          }}
                        >
                          ×
                        </button>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: 16,
                        }}
                      >
                        <label style={{ display: "block" }}>
                          <span style={fieldLabelStyle}>Coupon name</span>
                          <input
                            type="text"
                            value={form.couponName}
                            onChange={(e) => updateFormField("couponName", e.target.value)}
                            placeholder="e.g. SUMMER25"
                            style={fieldInputStyle}
                          />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={fieldLabelStyle}>Discount price</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.discountPrice}
                            onChange={(e) => updateFormField("discountPrice", e.target.value)}
                            placeholder="e.g. 50"
                            disabled={hasDiscountPercentage}
                            style={{
                              ...fieldInputStyle,
                              background: hasDiscountPercentage ? "#f3f4f6" : "#fff",
                              cursor: hasDiscountPercentage ? "not-allowed" : "text",
                            }}
                          />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={fieldLabelStyle}>Discount percentage</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={form.discountPercentage}
                            onChange={(e) =>
                              updateFormField("discountPercentage", e.target.value)
                            }
                            placeholder="e.g. 10"
                            disabled={hasDiscountPrice}
                            style={{
                              ...fieldInputStyle,
                              background: hasDiscountPrice ? "#f3f4f6" : "#fff",
                              cursor: hasDiscountPrice ? "not-allowed" : "text",
                            }}
                          />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={fieldLabelStyle}>From date</span>
                          <input
                            type="date"
                            value={form.fromDate}
                            onChange={(e) => updateFormField("fromDate", e.target.value)}
                            style={{ ...fieldInputStyle, cursor: "pointer" }}
                          />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={fieldLabelStyle}>To date</span>
                          <input
                            type="date"
                            value={form.toDate}
                            min={form.fromDate || undefined}
                            onChange={(e) => updateFormField("toDate", e.target.value)}
                            style={{ ...fieldInputStyle, cursor: "pointer" }}
                          />
                        </label>
                        <label style={{ display: "block" }}>
                          <span style={fieldLabelStyle}>Number of days</span>
                          <input
                            type="text"
                            value={form.numberOfDays}
                            readOnly
                            tabIndex={-1}
                            placeholder="Auto from dates"
                            style={{
                              ...fieldInputStyle,
                              background: "#f3f4f6",
                              cursor: "default",
                              color: "#374151",
                            }}
                          />
                        </label>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 20,
                        }}
                      >
                        <button
                          type="button"
                          className="rts-btn btn-primary"
                          disabled={saving || !formValid}
                          onClick={() => handleSaveCoupon("active")}
                          style={{
                            opacity: saving || !formValid ? 0.6 : 1,
                            width: "auto",
                            maxWidth: "max-content",
                            flex: "0 0 auto",
                          }}
                        >
                          {saving ? "Saving…" : "Activate"}
                        </button>
                        <button
                          type="button"
                          disabled={saving || !formValid}
                          onClick={() => handleSaveCoupon("inactive")}
                          style={{
                            height: 44,
                            padding: "0 18px",
                            borderRadius: 6,
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            color: "#374151",
                            fontWeight: 600,
                            width: "auto",
                            maxWidth: "max-content",
                            flex: "0 0 auto",
                            cursor: saving || !formValid ? "not-allowed" : "pointer",
                            opacity: saving || !formValid ? 0.6 : 1,
                          }}
                        >
                          Deactivate
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {coupons.map((coupon) => {
                  const isEditing = editingId === coupon.id;
                  const previewCode = editForm.couponName
                    .trim()
                    .replace(/\s+/g, "")
                    .toUpperCase();

                  return (
                  <article className="order-card-item" key={coupon.id}>
                    <div className="order-card-item__inner">
                      <div className="order-card-item__header">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {isEditing ? (
                            <label style={{ display: "block" }}>
                              <span style={fieldLabelStyle}>Coupon name</span>
                              <input
                                type="text"
                                value={editForm.couponName}
                                onChange={(e) =>
                                  updateEditFormField("couponName", e.target.value)
                                }
                                style={fieldInputStyle}
                              />
                              <span
                                style={{
                                  display: "block",
                                  marginTop: 6,
                                  fontSize: 12,
                                  color: "#6b7280",
                                }}
                              >
                                Code: {previewCode || "—"}
                              </span>
                            </label>
                          ) : (
                            <>
                              <h4
                                className="order-card-item__title"
                                style={{ color: "#629D23", marginBottom: 4 }}
                              >
                                {coupon.couponName || "Untitled coupon"}
                              </h4>
                              <span style={{ fontSize: 12, color: "#6b7280" }}>
                                Code: {coupon.couponCode || "—"}
                              </span>
                            </>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background:
                              coupon.status === "active" ? "#dcfce7" : "#f3f4f6",
                            color: coupon.status === "active" ? "#166534" : "#4b5563",
                            flexShrink: 0,
                          }}
                        >
                          {coupon.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {isEditing ? (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: 12,
                            marginTop: 12,
                          }}
                        >
                          <label style={{ display: "block" }}>
                            <span style={fieldLabelStyle}>Discount price</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editForm.discountPrice}
                              onChange={(e) =>
                                updateEditFormField("discountPrice", e.target.value)
                              }
                              disabled={editHasDiscountPercentage}
                              style={{
                                ...fieldInputStyle,
                                background: editHasDiscountPercentage ? "#f3f4f6" : "#fff",
                                cursor: editHasDiscountPercentage ? "not-allowed" : "text",
                              }}
                            />
                          </label>
                          <label style={{ display: "block" }}>
                            <span style={fieldLabelStyle}>Discount %</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={editForm.discountPercentage}
                              onChange={(e) =>
                                updateEditFormField("discountPercentage", e.target.value)
                              }
                              disabled={editHasDiscountPrice}
                              style={{
                                ...fieldInputStyle,
                                background: editHasDiscountPrice ? "#f3f4f6" : "#fff",
                                cursor: editHasDiscountPrice ? "not-allowed" : "text",
                              }}
                            />
                          </label>
                          <label style={{ display: "block" }}>
                            <span style={fieldLabelStyle}>From date</span>
                            <input
                              type="date"
                              value={editForm.fromDate}
                              onChange={(e) =>
                                updateEditFormField("fromDate", e.target.value)
                              }
                              style={{ ...fieldInputStyle, cursor: "pointer" }}
                            />
                          </label>
                          <label style={{ display: "block" }}>
                            <span style={fieldLabelStyle}>To date</span>
                            <input
                              type="date"
                              value={editForm.toDate}
                              min={editForm.fromDate || undefined}
                              onChange={(e) =>
                                updateEditFormField("toDate", e.target.value)
                              }
                              style={{ ...fieldInputStyle, cursor: "pointer" }}
                            />
                          </label>
                          <label style={{ display: "block" }}>
                            <span style={fieldLabelStyle}>Number of days</span>
                            <input
                              type="text"
                              value={editForm.numberOfDays}
                              readOnly
                              tabIndex={-1}
                              style={{
                                ...fieldInputStyle,
                                background: "#f3f4f6",
                                cursor: "default",
                                color: "#374151",
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <dl className="order-card-item__fields">
                          <div className="order-card-item__field">
                            <dt>Discount price</dt>
                            <dd>₹{Number(coupon.discountPrice || 0).toFixed(2)}</dd>
                          </div>
                          <div className="order-card-item__field">
                            <dt>Discount %</dt>
                            <dd>{Number(coupon.discountPercentage || 0)}%</dd>
                          </div>
                          <div className="order-card-item__field">
                            <dt>From date</dt>
                            <dd>{formatDisplayDate(coupon.fromDate)}</dd>
                          </div>
                          <div className="order-card-item__field">
                            <dt>To date</dt>
                            <dd>{formatDisplayDate(coupon.toDate)}</dd>
                          </div>
                          <div className="order-card-item__field">
                            <dt>Number of days</dt>
                            <dd>{coupon.numberOfDays || "—"}</dd>
                          </div>
                        </dl>
                      )}

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 14,
                          paddingTop: 12,
                          borderTop: "1px solid #f3f4f6",
                        }}
                      >
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="rts-btn btn-primary"
                              disabled={editSaving || !editFormValid}
                              onClick={() => handleSaveEdit(coupon)}
                              style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                opacity: editSaving || !editFormValid ? 0.55 : 1,
                              }}
                            >
                              {editSaving ? "Saving…" : "Save"}
                            </button>
                            <button
                              type="button"
                              disabled={editSaving}
                              onClick={cancelEditCoupon}
                              style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                fontWeight: 600,
                                borderRadius: 6,
                                border: "1px solid #d1d5db",
                                background: "#fff",
                                color: "#374151",
                                cursor: editSaving ? "not-allowed" : "pointer",
                                opacity: editSaving ? 0.55 : 1,
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={editSaving || editingId != null}
                              onClick={() => startEditCoupon(coupon)}
                              style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                fontWeight: 600,
                                borderRadius: 6,
                                border: "1px solid #629D23",
                                background: "#fff",
                                color: "#629D23",
                                cursor:
                                  editSaving || editingId != null
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: editSaving || editingId != null ? 0.55 : 1,
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="rts-btn btn-primary"
                              disabled={
                                statusBusyId === coupon.id || coupon.status === "active"
                              }
                              onClick={() => handleToggleStatus(coupon, "active")}
                              style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                opacity:
                                  statusBusyId === coupon.id || coupon.status === "active"
                                    ? 0.55
                                    : 1,
                              }}
                            >
                              Activate
                            </button>
                            <button
                              type="button"
                              disabled={
                                statusBusyId === coupon.id || coupon.status === "inactive"
                              }
                              onClick={() => handleToggleStatus(coupon, "inactive")}
                              style={{
                                padding: "8px 14px",
                                fontSize: 13,
                                fontWeight: 600,
                                borderRadius: 6,
                                border: "1px solid #d1d5db",
                                background: "#fff",
                                color: "#374151",
                                cursor:
                                  statusBusyId === coupon.id || coupon.status === "inactive"
                                    ? "not-allowed"
                                    : "pointer",
                                opacity:
                                  statusBusyId === coupon.id || coupon.status === "inactive"
                                    ? 0.55
                                    : 1,
                              }}
                            >
                              Deactivate
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoContent;
