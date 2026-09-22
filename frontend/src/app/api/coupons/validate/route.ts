import { NextResponse } from "next/server";
import { getCouponByCode } from "../../../../functions/mongodbOperations";

function toDateOrNull(value: unknown): Date | null {
  if (value == null || value === "") return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body?.code ?? "").trim();
    const subtotal = Number(body?.subtotal);

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return NextResponse.json(
        { success: false, message: "Valid cart subtotal is required" },
        { status: 400 }
      );
    }

    const coupon = await getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon code is incorrect" },
        { status: 404 }
      );
    }

    if (coupon.status !== "active") {
      return NextResponse.json(
        { success: false, message: "This coupon is not active" },
        { status: 400 }
      );
    }

    const fromDate = toDateOrNull(coupon.fromDate);
    const toDate = toDateOrNull(coupon.toDate);
    const now = new Date();
    if (fromDate && now < startOfDay(fromDate)) {
      return NextResponse.json(
        { success: false, message: "This coupon is not valid yet" },
        { status: 400 }
      );
    }
    if (toDate && now > endOfDay(toDate)) {
      return NextResponse.json(
        { success: false, message: "This coupon has expired" },
        { status: 400 }
      );
    }

    const discountPrice = Number(coupon.discountPrice) || 0;
    const discountPercentage = Number(coupon.discountPercentage) || 0;
    const hasPercentage = discountPercentage > 0;
    const hasPrice = discountPrice > 0;

    if (!hasPercentage && !hasPrice) {
      return NextResponse.json(
        { success: false, message: "This coupon has no discount configured" },
        { status: 400 }
      );
    }

    let discountType: "percentage" | "price";
    let discountAmount: number;
    let label: string;

    if (hasPercentage) {
      discountType = "percentage";
      discountAmount = Math.min(subtotal, (subtotal * discountPercentage) / 100);
      label = `${discountPercentage}%`;
    } else {
      discountType = "price";
      discountAmount = Math.min(subtotal, discountPrice);
      label = `₹${discountPrice.toFixed(2)}`;
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return NextResponse.json({
      success: true,
      body: {
        code: coupon.couponCode,
        couponName: coupon.couponName,
        discountType,
        discountPercentage: hasPercentage ? discountPercentage : 0,
        discountPrice: hasPrice ? discountPrice : 0,
        discountAmount,
        label,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to validate coupon";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
