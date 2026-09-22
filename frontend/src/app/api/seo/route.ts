import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSeoSettings, upsertSeoSetting } from "@/functions/mongodbOperations";
import {
  SEO_SECTION_KEYS,
  getDefaultSeoContent,
  type SeoSectionKey,
} from "@/lib/seo/defaultSeoContent";
import { SEO_SETTINGS_CACHE_TAG } from "@/lib/seo/loadSeoSettings";
function isSeoSectionKey(key: string): key is SeoSectionKey {
  return (SEO_SECTION_KEYS as readonly string[]).includes(key);
}

export async function GET() {
  try {
    const saved = await getSeoSettings();
    const defaults = getDefaultSeoContent();
    const sections = Object.fromEntries(
      SEO_SECTION_KEYS.map((key) => [key, saved[key] ?? defaults[key]]),
    );
    return NextResponse.json({ success: true, sections });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load SEO settings";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { key?: unknown; content?: unknown };
    const key = typeof body.key === "string" ? body.key.trim() : "";
    const content = typeof body.content === "string" ? body.content : "";

    if (!key || !isSeoSectionKey(key)) {
      return NextResponse.json(
        { success: false, message: "Valid SEO section key is required" },
        { status: 400 },
      );
    }

    const trimmed = content.trim();
    if (trimmed) {
      try {
        JSON.parse(trimmed);
      } catch {
        return NextResponse.json(
          { success: false, message: "Content must be valid JSON" },
          { status: 400 },
        );
      }
    }

    await upsertSeoSetting(key, content);
    revalidateTag(SEO_SETTINGS_CACHE_TAG, "default");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save SEO setting";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
