import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteSeoPage,
  getAllSeoPageRecords,
  upsertSeoPage,
} from "@/functions/mongodbOperations";
import {
  ALL_MANAGED_SEO_PATHS,
  normalizeSeoPath,
  type PageSeoConfig,
} from "@/lib/seo/pageSeoTypes";
import {
  getDefaultFullPageSeoConfig,
  mergePageSeoConfigs,
  normalizePageSeoConfig,
  pageSeoConfigToFormState,
} from "@/lib/seo/pageSeoForm";
import { SEO_PAGES_CACHE_TAG } from "@/lib/seo/buildPageMetadata";

function parsePageSeoBody(content: unknown): PageSeoConfig | null {
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return normalizePageSeoConfig(content);
  }
  if (typeof content === "string" && content.trim()) {
    try {
      return normalizePageSeoConfig(JSON.parse(content.trim()));
    } catch {
      return null;
    }
  }
  return null;
}

function mergeWithDefaults(path: string, saved: PageSeoConfig | null): PageSeoConfig {
  const defaults = getDefaultFullPageSeoConfig(path);
  return mergePageSeoConfigs(defaults, saved);
}

export async function GET() {
  try {
    const savedRecords = await getAllSeoPageRecords();
    const savedByPath = Object.fromEntries(
      savedRecords.map((row) => {
        let config: PageSeoConfig | null = null;
        try {
          config = normalizePageSeoConfig(JSON.parse(row.content));
        } catch {
          config = null;
        }
        return [row.path, config];
      }),
    );

    const pages = ALL_MANAGED_SEO_PATHS.map(({ path, label, kind }) => ({
      path,
      label,
      kind,
      config: pageSeoConfigToFormState(mergeWithDefaults(path, savedByPath[path] ?? null)),
      hasCustomSave: Boolean(savedByPath[path]),
      updatedAt: savedRecords.find((r) => r.path === path)?.updatedAt ?? null,
    }));

    const customPages = savedRecords
      .filter((row) => !ALL_MANAGED_SEO_PATHS.some((entry) => entry.path === row.path))
      .map((row) => {
        let config: PageSeoConfig | null = null;
        try {
          config = normalizePageSeoConfig(JSON.parse(row.content));
        } catch {
          config = null;
        }
        return {
          path: row.path,
          label: row.path,
          kind: "static" as const,
          config: pageSeoConfigToFormState(mergeWithDefaults(row.path, config)),
          hasCustomSave: true,
          updatedAt: row.updatedAt ?? null,
        };
      });

    return NextResponse.json({ success: true, pages: [...pages, ...customPages] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load page SEO";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { path?: unknown; config?: unknown };
    const path = normalizeSeoPath(typeof body.path === "string" ? body.path : "");
    const config = parsePageSeoBody(body.config);

    if (!path) {
      return NextResponse.json({ success: false, message: "Valid path is required" }, { status: 400 });
    }
    if (!config) {
      return NextResponse.json(
        { success: false, message: "Valid SEO config object is required" },
        { status: 400 },
      );
    }

    for (const key of ["service", "faq", "review"] as const) {
      const val = config[key];
      if (typeof val === "string" && val.trim()) {
        try {
          config[key] = JSON.parse(val.trim()) as Record<string, unknown>;
        } catch {
          return NextResponse.json(
            { success: false, message: `${key} must be valid JSON` },
            { status: 400 },
          );
        }
      }
    }

    await upsertSeoPage(path, JSON.stringify(config));
    revalidateTag(SEO_PAGES_CACHE_TAG, "default");
    revalidatePath(path);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save page SEO";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { path?: unknown };
    const path = normalizeSeoPath(typeof body.path === "string" ? body.path : "");

    if (!path) {
      return NextResponse.json({ success: false, message: "Valid path is required" }, { status: 400 });
    }

    await deleteSeoPage(path);
    revalidateTag(SEO_PAGES_CACHE_TAG, "default");
    revalidatePath(path);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete page SEO";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
