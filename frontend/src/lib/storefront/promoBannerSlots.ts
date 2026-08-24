import type { PromoBanner } from "./types";

export const PROMO_BANNER_SLOT_COUNT = 8;

/** Fixed layout per homepage banner slot (two rows of four). */
export const PROMO_BANNER_SLOT_LAYOUTS: PromoBanner["layout"][] = [
  "tall",
  "small",
  "small",
  "wide",
  "tall",
  "small",
  "small",
  "wide",
];

export const PROMO_BANNER_IMAGE_SIZES: Record<
  PromoBanner["layout"],
  { label: string; width: number; height: number; note: string }
> = {
  tall: {
    label: "Tall banner (slots 1 & 5)",
    width: 600,
    height: 500,
    note: "Left column, full row height (~420px min on screen).",
  },
  small: {
    label: "Small banner (slots 2, 3, 6 & 7)",
    width: 400,
    height: 220,
    note: "Top-right pair in each row.",
  },
  wide: {
    label: "Wide banner (slots 4 & 8)",
    width: 800,
    height: 200,
    note: "Bottom-right wide card in each row.",
  },
};

export function createEmptyPromoBanner(layout: PromoBanner["layout"]): PromoBanner {
  return {
    title: "",
    subtitle: "",
    linkLabel: "",
    href: "/shop",
    image: "",
    layout,
  };
}

export function createEmptyPromoBannerSlots(): PromoBanner[] {
  return PROMO_BANNER_SLOT_LAYOUTS.map((layout) => createEmptyPromoBanner(layout));
}

/** Pad or trim saved banners to exactly eight slots with fixed layouts. */
export function normalizePromoBanners(banners: PromoBanner[] | undefined | null): PromoBanner[] {
  const list = banners ?? [];
  return PROMO_BANNER_SLOT_LAYOUTS.map((layout, index) => ({
    ...createEmptyPromoBanner(layout),
    ...(list[index] ?? {}),
    layout,
  }));
}

export function promoBannerSizeHint(layout: PromoBanner["layout"]): string {
  const size = PROMO_BANNER_IMAGE_SIZES[layout];
  return `${size.width}×${size.height}px — ${size.note}`;
}
