import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  getWebsiteThemeSetting,
  upsertWebsiteThemeSetting,
} from "@/functions/mongodbOperations";
import { WEBSITE_COLORS_CACHE_TAG } from "@/lib/theme/websiteColors";
import {
  DEFAULT_WEBSITE_THEME,
  WEBSITE_THEME_CACHE_TAG,
  isWebsiteTheme,
  parseWebsiteTheme,
} from "@/lib/theme/websiteTheme";

export async function GET() {
  try {
    const saved = await getWebsiteThemeSetting();
    const theme = parseWebsiteTheme(saved);
    return NextResponse.json({ success: true, theme });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load website theme";
    return NextResponse.json(
      { success: true, theme: DEFAULT_WEBSITE_THEME, message },
      { status: 200 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { theme?: unknown };
    if (!isWebsiteTheme(body.theme)) {
      return NextResponse.json(
        { success: false, message: "Theme must be Ayurvedha or Fashion" },
        { status: 400 },
      );
    }

    await upsertWebsiteThemeSetting(body.theme);
    revalidateTag(WEBSITE_THEME_CACHE_TAG, "default");
    revalidateTag(WEBSITE_COLORS_CACHE_TAG, "default");
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, theme: body.theme });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save website theme";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
