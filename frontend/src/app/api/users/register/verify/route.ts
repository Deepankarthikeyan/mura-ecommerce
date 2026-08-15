import { NextResponse } from "next/server";
import { verifyRegistrationOtp } from "@/functions/mongodbOperations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body ?? {};

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const result = await verifyRegistrationOtp(email, String(otp));
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Verification failed";
    const lower = message.toLowerCase();
    const status =
      lower.includes("pending") ||
      lower.includes("expired") ||
      lower.includes("session") ||
      lower.includes("invalid") ||
      lower.includes("6-digit")
        ? 400
        : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
