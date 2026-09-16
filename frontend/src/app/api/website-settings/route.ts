import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  getWebsiteColorSettings,
  getWebsiteThemeSetting,
  upsertWebsiteColorSettings,
} from "@/functions/mongodbOperations";
import {
  WEBSITE_COLOR_KEYS,
  WEBSITE_COLORS_CACHE_TAG,
  getThemeColorDefaults,
  isHexColor,
  mergeWebsiteColors,
  type WebsiteColorKey,
} from "@/lib/theme/websiteColors";
import {
  DEFAULT_WEBSITE_THEME,
  isWebsiteTheme,
  parseWebsiteTheme,
  type WebsiteTheme,
} from "@/lib/theme/websiteTheme";

async function resolveTheme(requested?: unknown): Promise<WebsiteTheme> {
  if (isWebsiteTheme(requested)) return requested;
  const saved = await getWebsiteThemeSetting();
  return parseWebsiteTheme(saved);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const theme = await resolveTheme(url.searchParams.get("theme"));
    const saved = await getWebsiteColorSettings(theme);
    const colors = mergeWebsiteColors(saved, theme);
    return NextResponse.json({ success: true, theme, colors });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load website colors";
    return NextResponse.json(
      {
        success: true,
        theme: DEFAULT_WEBSITE_THEME,
        colors: getThemeColorDefaults(DEFAULT_WEBSITE_THEME),
        message,
      },
      { status: 200 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { colors?: unknown; theme?: unknown };
    if (!body.colors || typeof body.colors !== "object" || Array.isArray(body.colors)) {
      return NextResponse.json(
        { success: false, message: "Color settings are required" },
        { status: 400 },
      );
    }

    const theme = await resolveTheme(body.theme);
    const incoming = body.colors as Record<string, unknown>;
    const invalid = WEBSITE_COLOR_KEYS.filter((key) => {
      const value = incoming[key];
      return value !== undefined && !isHexColor(value);
    });
    if (invalid.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid hex color for: ${invalid.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const colors = mergeWebsiteColors(incoming, theme);
    const payload = Object.fromEntries(
      WEBSITE_COLOR_KEYS.map((key: WebsiteColorKey) => [key, colors[key]]),
    );
    await upsertWebsiteColorSettings(payload, theme);
    revalidateTag(WEBSITE_COLORS_CACHE_TAG, "default");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, theme, colors });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save website colors";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
