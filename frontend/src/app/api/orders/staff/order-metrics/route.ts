import { NextResponse } from "next/server";
import { getOrderReportMetrics } from "@/functions/mongodbOperations";

export async function GET() {
  try {
    const body = await getOrderReportMetrics();
    return NextResponse.json({ success: true, body });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch order report metrics";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
