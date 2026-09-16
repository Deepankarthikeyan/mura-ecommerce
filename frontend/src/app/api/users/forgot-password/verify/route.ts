import { NextResponse } from "next/server";
import { verifyPasswordResetOtp } from "@/functions/mongodbOperations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body ?? {};

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const result = await verifyPasswordResetOtp(String(email), String(otp));
    return NextResponse.json(result);
  } catch (error: any) {
    const message = error?.message || "Verification failed";
    const lower = String(message).toLowerCase();
    const status =
      lower.includes("invalid") ||
      lower.includes("expired") ||
      lower.includes("6-digit") ||
      lower.includes("no password reset")
        ? 400
        : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
