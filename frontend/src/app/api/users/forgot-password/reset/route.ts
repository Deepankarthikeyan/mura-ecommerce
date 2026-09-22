import { NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/functions/mongodbOperations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resetToken, password } = body ?? {};

    if (!resetToken || !password) {
      return NextResponse.json(
        { success: false, message: "Reset token and password are required" },
        { status: 400 }
      );
    }

    const result = await resetPasswordWithToken(String(resetToken), String(password));
    return NextResponse.json(result);
  } catch (error: any) {
    const message = error?.message || "Failed to reset password";
    const lower = String(message).toLowerCase();
    const status =
      lower.includes("password") ||
      lower.includes("token") ||
      lower.includes("expired") ||
      lower.includes("invalid") ||
      lower.includes("not found")
        ? 400
        : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
