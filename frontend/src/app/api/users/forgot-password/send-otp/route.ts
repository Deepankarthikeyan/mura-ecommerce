import { NextResponse } from "next/server";
import { initiatePasswordResetOtp } from "@/functions/mongodbOperations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body ?? {};

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const result = await initiatePasswordResetOtp(String(email));
    return NextResponse.json(result);
  } catch (error: any) {
    const message = error?.message || "Failed to send verification code";
    const lower = String(message).toLowerCase();
    const status =
      lower.includes("valid email") || lower.includes("no account")
        ? 400
        : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
