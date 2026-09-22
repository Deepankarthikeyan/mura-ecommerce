import { NextResponse } from "next/server";
import { initiateRegistrationWithOtp } from "@/functions/mongodbOperations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body ?? {};

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const result = await initiateRegistrationWithOtp({ username, email, password });
    return NextResponse.json(result);
  } catch (error: any) {
    const message = error?.message || "Failed to send verification code";
    const lower = message.toLowerCase();
    const status =
      lower.includes("already exists") ? 409 : lower.includes("password") || lower.includes("username") ? 400 : 500;
    if (lower.includes("email credentials") || lower.includes("email_user")) {
      return NextResponse.json({ success: false, message }, { status: 503 });
    }
    return NextResponse.json({ success: false, message }, { status });
  }
}
