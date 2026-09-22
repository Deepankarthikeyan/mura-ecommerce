import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  getHomepageSectionSettings,
  upsertHomepageSectionSettings,
} from "@/functions/mongodbOperations";
import {
  HOMEPAGE_SECTIONS_CACHE_TAG,
  homepageSectionsPayload,
  parseHomepageSections,
} from "@/lib/homepageSections";

export async function GET() {
  try {
    const saved = await getHomepageSectionSettings();
    const sections = parseHomepageSections(saved);
    return NextResponse.json({ success: true, ...sections });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load homepage sections";
    const sections = parseHomepageSections(null);
    return NextResponse.json({ success: true, ...sections, message }, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      carouselEnabled?: unknown;
      carouselSlides?: unknown;
      discountsEnabled?: unknown;
      discountCards?: unknown;
      categoryProductsEnabled?: unknown;
      categoryProducts?: unknown;
      dealsOfTheDayEnabled?: unknown;
      dealsOfTheDay?: unknown;
      allProductsEnabled?: unknown;
      allProducts?: unknown;
      newsletterEnabled?: unknown;
      newsletter?: unknown;
      recommendationsEnabled?: unknown;
      recommendations?: unknown;
      sectionOrder?: unknown;
    };
    if (typeof body.carouselEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, message: "carouselEnabled is required" },
        { status: 400 },
      );
    }
    if (!Array.isArray(body.carouselSlides)) {
      return NextResponse.json(
        { success: false, message: "carouselSlides must be an array" },
        { status: 400 },
      );
    }
    if (typeof body.discountsEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, message: "discountsEnabled is required" },
        { status: 400 },
      );
    }
    if (!Array.isArray(body.discountCards)) {
      return NextResponse.json(
        { success: false, message: "discountCards must be an array" },
        { status: 400 },
      );
    }
    if (typeof body.categoryProductsEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, message: "categoryProductsEnabled is required" },
        { status: 400 },
      );
    }
    if (!body.categoryProducts || typeof body.categoryProducts !== "object" || Array.isArray(body.categoryProducts)) {
      return NextResponse.json(
        { success: false, message: "categoryProducts must be an object" },
        { status: 400 },
      );
    }
    if (typeof body.dealsOfTheDayEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, message: "dealsOfTheDayEnabled is required" },
        { status: 400 },
      );
    }
    if (!body.dealsOfTheDay || typeof body.dealsOfTheDay !== "object" || Array.isArray(body.dealsOfTheDay)) {
      return NextResponse.json(
        { success: false, message: "dealsOfTheDay must be an object" },
        { status: 400 },
      );
    }
    if (typeof body.allProductsEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, message: "allProductsEnabled is required" },
        { status: 400 },
      );
    }
    if (!body.allProducts || typeof body.allProducts !== "object" || Array.isArray(body.allProducts)) {
      return NextResponse.json(
        { success: false, message: "allProducts must be an object" },
        { status: 400 },
      );
    }
    if (typeof body.newsletterEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, message: "newsletterEnabled is required" },
        { status: 400 },
      );
    }
    if (!body.newsletter || typeof body.newsletter !== "object" || Array.isArray(body.newsletter)) {
      return NextResponse.json(
        { success: false, message: "newsletter must be an object" },
        { status: 400 },
      );
    }
    if (typeof body.recommendationsEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, message: "recommendationsEnabled is required" },
        { status: 400 },
      );
    }
    if (!body.recommendations || typeof body.recommendations !== "object" || Array.isArray(body.recommendations)) {
      return NextResponse.json(
        { success: false, message: "recommendations must be an object" },
        { status: 400 },
      );
    }

    const payload = homepageSectionsPayload({
      carouselEnabled: body.carouselEnabled,
      carouselSlides: body.carouselSlides,
      discountsEnabled: body.discountsEnabled,
      discountCards: body.discountCards,
      categoryProductsEnabled: body.categoryProductsEnabled,
      categoryProducts: body.categoryProducts,
      dealsOfTheDayEnabled: body.dealsOfTheDayEnabled,
      dealsOfTheDay: body.dealsOfTheDay,
      allProductsEnabled: body.allProductsEnabled,
      allProducts: body.allProducts,
      newsletterEnabled: body.newsletterEnabled,
      newsletter: body.newsletter,
      recommendationsEnabled: body.recommendationsEnabled,
      recommendations: body.recommendations,
      sectionOrder: body.sectionOrder,
    });
    await upsertHomepageSectionSettings(payload);
    revalidateTag(HOMEPAGE_SECTIONS_CACHE_TAG, "default");
    revalidatePath("/");
    const sections = parseHomepageSections({ ...payload });
    return NextResponse.json({ success: true, ...sections });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save homepage sections";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
