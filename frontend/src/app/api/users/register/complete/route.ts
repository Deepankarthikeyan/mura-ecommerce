import { NextResponse } from "next/server";
import { finalizeRegistrationWithAddress } from "@/functions/mongodbOperations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { registrationToken, password, billingInfo } = body ?? {};

    if (!registrationToken || !password || !billingInfo) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Registration token, password, and address details are required",
        },
        { status: 400 }
      );
    }

    const result = await finalizeRegistrationWithAddress(
      String(registrationToken),
      String(password),
      billingInfo as Record<string, unknown>
    );
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Could not complete registration";
    const lower = message.toLowerCase();
    const status =
      lower.includes("already exists") || lower.includes("password")
        ? 400
        : lower.includes("invalid") ||
            lower.includes("expired") ||
            lower.includes("session") ||
            lower.includes("required") ||
            lower.includes("characters") ||
            lower.includes("phone") ||
            lower.includes("address") ||
            lower.includes("zip") ||
            lower.includes("city") ||
            lower.includes("state") ||
            lower.includes("country") ||
            lower.includes("name")
          ? 400
          : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
