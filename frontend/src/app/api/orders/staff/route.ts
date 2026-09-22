import { NextResponse } from "next/server";
import {
  getOrdersListing,
  getOrderDistinctStatuses,
  getOrderDistinctDates,
  getOrderByMongoId,
  sendOrderStatusUpdateToCustomer,
  updateOrderStatusByMongoId,
} from "@/functions/mongodbOperations";

function serializeOrder(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  const idStr =
    _id != null &&
    typeof _id === "object" &&
    "toString" in _id &&
    typeof (_id as { toString: () => string }).toString === "function"
      ? String((_id as { toString: () => string }).toString())
      : _id;
  return { ...rest, _id: idStr };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "";
    const date = searchParams.get("date")?.trim() ?? "";
    const statusesOnly =
      searchParams.get("statuses") === "true" || searchParams.get("statuses") === "1";
    const datesOnly = searchParams.get("dates") === "true" || searchParams.get("dates") === "1";

    if (statusesOnly) {
      const statuses = await getOrderDistinctStatuses();
      return NextResponse.json({ success: true, body: statuses });
    }

    if (datesOnly) {
      const dates = await getOrderDistinctDates();
      return NextResponse.json({ success: true, body: dates });
    }

    const raw = await getOrdersListing({ search, status, date });
    const body = raw.map((d) => serializeOrder(d as Record<string, unknown>));
    return NextResponse.json({ success: true, body });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id?: unknown; status?: unknown };
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const status = typeof body.status === "string" ? body.status.trim() : "";
    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "id and status are required" },
        { status: 400 },
      );
    }

    const existingOrder = await getOrderByMongoId(id);
    if (!existingOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 400 });
    }

    const previousStatus = String(existingOrder.status ?? "").trim().toLowerCase();
    const nextStatus = status.trim().toLowerCase();

    await updateOrderStatusByMongoId(id, nextStatus);

    if (previousStatus !== nextStatus) {
      try {
        await sendOrderStatusUpdateToCustomer(
          { ...existingOrder, status: nextStatus } as Record<string, unknown>,
          nextStatus,
        );
      } catch (notifyError: unknown) {
        console.error("Order status customer notification failed:", notifyError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    const status =
      message === "Invalid order id" ||
      message === "Invalid order status" ||
      message === "Order not found"
        ? 400
        : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
