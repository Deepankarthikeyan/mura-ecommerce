import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStorefrontSettingsRaw, upsertStorefrontSettings } from "@/functions/mongodbOperations";
import {
  getDefaultStorefrontSettings,
  mergeStorefrontSettings,
} from "@/lib/storefront/defaultStorefrontSettings";
import type { StorefrontSettings } from "@/lib/storefront/types";

export async function GET() {
  try {
    const raw = await getStorefrontSettingsRaw();
    let saved: Partial<StorefrontSettings> | null = null;
    if (raw) {
      try {
        saved = JSON.parse(raw) as Partial<StorefrontSettings>;
      } catch {
        saved = null;
      }
    }
    const settings = mergeStorefrontSettings(saved);
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load storefront settings";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { settings?: unknown };
    if (!body.settings || typeof body.settings !== "object" || Array.isArray(body.settings)) {
      return NextResponse.json(
        { success: false, message: "Valid settings object is required" },
        { status: 400 }
      );
    }

    const merged = mergeStorefrontSettings(body.settings as Partial<StorefrontSettings>);
    const defaults = getDefaultStorefrontSettings();
    const content = JSON.stringify(merged, null, 2);
    await upsertStorefrontSettings(content);
    revalidatePath("/", "layout");
    revalidatePath("/shop");
    return NextResponse.json({ success: true, settings: merged, defaults });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save storefront settings";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
