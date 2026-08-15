import { NextResponse } from "next/server";
import {
  createCoupon,
  deleteCouponById,
  getAllCoupons,
  updateCouponFields,
} from "../../../functions/mongodbOperations";

function parseDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function dayCount(from: Date, to: Date): number {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

export async function GET() {
  try {
    const coupons = await getAllCoupons();
    return NextResponse.json({ success: true, body: coupons });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load coupons";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const couponName = String(body?.couponName ?? "").trim();
    const discountPrice = Number(body?.discountPrice);
    const discountPercentage = Number(body?.discountPercentage);
    const fromDate = parseDate(body?.fromDate);
    const toDate = parseDate(body?.toDate);

    if (!couponName) {
      return NextResponse.json(
        { success: false, message: "Coupon name is required" },
        { status: 400 }
      );
    }
    const hasPrice = Number.isFinite(discountPrice) && discountPrice > 0;
    const hasPercentage =
      Number.isFinite(discountPercentage) && discountPercentage > 0 && discountPercentage <= 100;
    if (hasPrice === hasPercentage) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide either discount price or discount percentage (not both)",
        },
        { status: 400 }
      );
    }
    if (Number.isFinite(discountPercentage) && (discountPercentage < 0 || discountPercentage > 100)) {
      return NextResponse.json(
        { success: false, message: "Discount percentage must be between 0 and 100" },
        { status: 400 }
      );
    }
    if (!fromDate || !toDate) {
      return NextResponse.json(
        { success: false, message: "From date and to date are required" },
        { status: 400 }
      );
    }
    if (toDate < fromDate) {
      return NextResponse.json(
        { success: false, message: "To date must be on or after from date" },
        { status: 400 }
      );
    }

    const numberOfDaysRaw = Number(body?.numberOfDays);
    const numberOfDays = Number.isFinite(numberOfDaysRaw) && numberOfDaysRaw > 0
      ? Math.round(numberOfDaysRaw)
      : dayCount(new Date(fromDate), new Date(toDate));

    const status = body?.status === "inactive" ? "inactive" : "active";
    const { id, coupon } = await createCoupon({
      couponName,
      discountPrice,
      discountPercentage,
      fromDate,
      toDate,
      numberOfDays,
      status,
    });

    return NextResponse.json({ success: true, id, body: coupon });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create coupon";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = String(body?.id ?? "").trim();
    if (!id) {
      return NextResponse.json({ success: false, message: "Coupon id is required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (body?.status === "active" || body?.status === "inactive") {
      updates.status = body.status;
    }
    if (body?.couponName != null) {
      const couponName = String(body.couponName).trim();
      if (!couponName) {
        return NextResponse.json(
          { success: false, message: "Coupon name cannot be empty" },
          { status: 400 }
        );
      }
      updates.couponName = couponName;
      updates.title = couponName;
      updates.couponCode = couponName.replace(/\s+/g, "").toUpperCase();
    }
    if (body?.discountPrice != null && body.discountPrice !== "") {
      const n = Number(body.discountPrice);
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid discount price" },
          { status: 400 }
        );
      }
      updates.discountPrice = n;
    }
    if (body?.discountPercentage != null && body.discountPercentage !== "") {
      const n = Number(body.discountPercentage);
      if (!Number.isFinite(n) || n < 0 || n > 100) {
        return NextResponse.json(
          { success: false, message: "Invalid discount percentage" },
          { status: 400 }
        );
      }
      updates.discountPercentage = n;
    }

    const fromDate = body?.fromDate != null ? parseDate(body.fromDate) : null;
    const toDate = body?.toDate != null ? parseDate(body.toDate) : null;
    if (body?.fromDate != null) {
      if (!fromDate) {
        return NextResponse.json({ success: false, message: "Invalid from date" }, { status: 400 });
      }
      updates.fromDate = fromDate;
      updates.startTime = fromDate;
    }
    if (body?.toDate != null) {
      if (!toDate) {
        return NextResponse.json({ success: false, message: "Invalid to date" }, { status: 400 });
      }
      updates.toDate = toDate;
      updates.endTime = toDate;
    }
    if (body?.numberOfDays != null && body.numberOfDays !== "") {
      const n = Number(body.numberOfDays);
      if (!Number.isFinite(n) || n < 1) {
        return NextResponse.json(
          { success: false, message: "Invalid number of days" },
          { status: 400 }
        );
      }
      updates.numberOfDays = Math.round(n);
    } else if (updates.fromDate instanceof Date && updates.toDate instanceof Date) {
      updates.numberOfDays = dayCount(new Date(updates.fromDate), new Date(updates.toDate));
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update" },
        { status: 400 }
      );
    }

    const result = await updateCouponFields(id, updates);
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update coupon";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = String(searchParams.get("id") ?? "").trim();
    if (!id) {
      return NextResponse.json({ success: false, message: "Coupon id is required" }, { status: 400 });
    }
    const result = await deleteCouponById(id);
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete coupon";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
