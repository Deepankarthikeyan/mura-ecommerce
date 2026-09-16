import { NextResponse } from "next/server";
import { addNewsletterSubscriber } from "@/functions/mongodbOperations";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ success: false, message: "Enter a valid email address." }, { status: 400 });
    }

    const result = await addNewsletterSubscriber(email);
    return NextResponse.json({
      success: true,
      message: result.created ? "Thanks for subscribing." : "You are already subscribed.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Could not subscribe.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
