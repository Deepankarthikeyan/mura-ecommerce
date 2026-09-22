export const HOMEPAGE_SECTIONS_CACHE_TAG = "homepage-sections";
export const MAX_CAROUSEL_SLIDES = 8;
export const DISCOUNT_CARD_COUNT = 4;
export const MAX_CATEGORY_TABS = 8;
export const MAX_CATEGORY_PRODUCTS = 10;
export const DEFAULT_CATEGORY_PRODUCT_LIMIT = 5;

export type HomepageSectionType =
  | "carousel"
  | "discounts"
  | "categoryProducts"
  | "dealsOfTheDay"
  | "allProducts"
  | "newsletter"
  | "recommendations";

export const ALL_HOMEPAGE_SECTION_TYPES: HomepageSectionType[] = [
  "carousel",
  "discounts",
  "categoryProducts",
  "dealsOfTheDay",
  "allProducts",
  "newsletter",
  "recommendations",
];

export type CarouselSlide = {
  id: string;
  imageUrl: string;
  altText: string;
  ctaEnabled: boolean;
  ctaLink: string;
  ctaName: string;
};

export type DiscountCard = {
  id: string;
  imageUrl: string;
  altText: string;
  tag: string;
  headline: string;
  ctaEnabled: boolean;
  ctaLink: string;
  ctaName: string;
};

export type CategoryProductsConfig = {
  title: string;
  categories: string[];
  productLimit: number;
};

export type DealsOfTheDayConfig = {
  eyebrow: string;
  title: string;
  description: string;
  endsAt: string;
  productLookup: string;
  productTitle: string;
  imageUrl: string;
  discountBadge: string;
};

export type AllProductsConfig = {
  title: string;
};

export type NewsletterConfig = {
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
};

export type RecommendationsConfig = {
  recentlyAddedTitle: string;
  topRatedTitle: string;
  topSellingTitle: string;
  promoTag: string;
  promoHeadline: string;
  promoHighlight: string;
  promoCtaLabel: string;
  promoCtaLink: string;
  promoImageUrl: string;
};

export const DISCOUNT_CARD_SLOTS: { key: "tall" | "mid-a" | "mid-b" | "wide"; label: string }[] = [
  { key: "tall", label: "Large (left)" },
  { key: "mid-a", label: "Top left" },
  { key: "mid-b", label: "Top right" },
  { key: "wide", label: "Wide (bottom)" },
];

const DEFAULT_DISCOUNT_COPY: Pick<DiscountCard, "tag" | "headline">[] = [
  { tag: "", headline: "Silk Saree Sale" },
  { tag: "BANARASI", headline: "Banarasi Sarees" },
  { tag: "COTTON SAREES", headline: "Free Shipping Over Order ₹999" },
  { tag: "", headline: "Kanjivaram Silk Saree Sale" },
];

export type HomepageSectionsConfig = {
  hasSavedConfig: boolean;
  carouselEnabled: boolean;
  carouselSlides: CarouselSlide[];
  discountsEnabled: boolean;
  discountCards: DiscountCard[];
  categoryProductsEnabled: boolean;
  categoryProducts: CategoryProductsConfig;
  dealsOfTheDayEnabled: boolean;
  dealsOfTheDay: DealsOfTheDayConfig;
  allProductsEnabled: boolean;
  allProducts: AllProductsConfig;
  newsletterEnabled: boolean;
  newsletter: NewsletterConfig;
  recommendationsEnabled: boolean;
  recommendations: RecommendationsConfig;
  sectionOrder: HomepageSectionType[];
};

export function createEmptyCarouselSlide(index: number): CarouselSlide {
  return {
    id: `slide-${Date.now()}-${index}`,
    imageUrl: "",
    altText: "",
    ctaEnabled: true,
    ctaLink: "",
    ctaName: "",
  };
}

export function createDefaultCarouselSlides(): CarouselSlide[] {
  return [createEmptyCarouselSlide(1), createEmptyCarouselSlide(2)];
}

export function createEmptyDiscountCard(index: number): DiscountCard {
  const copy = DEFAULT_DISCOUNT_COPY[index] ?? DEFAULT_DISCOUNT_COPY[0];
  return {
    id: `discount-${Date.now()}-${index}`,
    imageUrl: "",
    altText: "",
    tag: copy.tag,
    headline: copy.headline,
    ctaEnabled: true,
    ctaLink: "/shop",
    ctaName: "SHOP NOW",
  };
}

export function createDefaultDiscountCards(): DiscountCard[] {
  return DEFAULT_DISCOUNT_COPY.map((copy, index) => ({
    id: `discount-card-${index + 1}`,
    imageUrl: "",
    altText: "",
    tag: copy.tag,
    headline: copy.headline,
    ctaEnabled: true,
    ctaLink: "/shop",
    ctaName: "SHOP NOW",
  }));
}

export function createDefaultCategoryProducts(): CategoryProductsConfig {
  return {
    title: "Sale Sarees",
    categories: [],
    productLimit: DEFAULT_CATEGORY_PRODUCT_LIMIT,
  };
}

export function createDefaultDealsOfTheDay(): DealsOfTheDayConfig {
  const ends = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  return {
    eyebrow: "",
    title: "Deals Of The Day",
    description:
      "Don't miss out on our exclusive daily saree deals. Limited stock on handwoven silk and cotton sarees.",
    endsAt: ends.toISOString(),
    productLookup: "",
    productTitle: "",
    imageUrl: "",
    discountBadge: "",
  };
}

export function createDefaultAllProducts(): AllProductsConfig {
  return { title: "Our Products" };
}

export function createDefaultNewsletter(): NewsletterConfig {
  return {
    title: "Join Our Newsletter",
    description:
      "Enter your email address to subscribe our notification of our new post & features by email.",
    placeholder: "Enter your email address",
    buttonLabel: "SUBSCRIBE",
  };
}

export function createDefaultRecommendations(): RecommendationsConfig {
  return {
    recentlyAddedTitle: "Recently Added",
    topRatedTitle: "Top Rated",
    topSellingTitle: "Top Selling",
    promoTag: "Weekend Discount",
    promoHeadline: "Discover Real organic",
    promoHighlight: "Flavors Vegetable",
    promoCtaLabel: "Read Details",
    promoCtaLink: "/shop",
    promoImageUrl: "",
  };
}

export function parseCarouselSlide(raw: unknown, index: number): CarouselSlide {
  const fallback = createEmptyCarouselSlide(index + 1);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : fallback.id;
  return {
    id,
    imageUrl: typeof o.imageUrl === "string" ? o.imageUrl.trim() : "",
    altText: typeof o.altText === "string" ? o.altText : "",
    ctaEnabled: o.ctaEnabled !== false,
    ctaLink: typeof o.ctaLink === "string" ? o.ctaLink.trim() : "",
    ctaName: typeof o.ctaName === "string" ? o.ctaName : "",
  };
}

export function parseDiscountCard(raw: unknown, index: number): DiscountCard {
  const fallback = createDefaultDiscountCards()[index] ?? createEmptyDiscountCard(index);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : fallback.id;
  return {
    id,
    imageUrl: typeof o.imageUrl === "string" ? o.imageUrl.trim() : "",
    altText: typeof o.altText === "string" ? o.altText : "",
    tag: typeof o.tag === "string" ? o.tag : fallback.tag,
    headline: typeof o.headline === "string" ? o.headline : fallback.headline,
    ctaEnabled: o.ctaEnabled !== false,
    ctaLink: typeof o.ctaLink === "string" ? o.ctaLink.trim() : fallback.ctaLink,
    ctaName: typeof o.ctaName === "string" ? o.ctaName : fallback.ctaName,
  };
}

export function parseDiscountCards(raw: unknown): DiscountCard[] {
  const defaults = createDefaultDiscountCards();
  const incoming = Array.isArray(raw) ? raw : [];
  return defaults.map((fallback, index) =>
    incoming[index] != null ? parseDiscountCard(incoming[index], index) : fallback,
  );
}

export function parseCategoryProducts(raw: unknown): CategoryProductsConfig {
  const fallback = createDefaultCategoryProducts();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  const o = raw as Record<string, unknown>;
  const title = typeof o.title === "string" && o.title.trim() ? o.title.trim() : fallback.title;
  const seen = new Set<string>();
  const categories: string[] = [];
  if (Array.isArray(o.categories)) {
    for (const item of o.categories) {
      const name = String(item ?? "").trim();
      if (!name || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      categories.push(name);
      if (categories.length >= MAX_CATEGORY_TABS) break;
    }
  }
  const limit = Number(o.productLimit);
  const productLimit = Number.isFinite(limit)
    ? Math.min(MAX_CATEGORY_PRODUCTS, Math.max(1, Math.round(limit)))
    : fallback.productLimit;
  return { title, categories, productLimit };
}

export function parseDealsOfTheDay(raw: unknown): DealsOfTheDayConfig {
  const fallback = createDefaultDealsOfTheDay();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  const o = raw as Record<string, unknown>;
  const endsAtRaw = typeof o.endsAt === "string" ? o.endsAt.trim() : "";
  const endsAtDate = endsAtRaw ? new Date(endsAtRaw) : null;
  return {
    eyebrow: typeof o.eyebrow === "string" && o.eyebrow.trim() ? o.eyebrow.trim() : fallback.eyebrow,
    title: typeof o.title === "string" && o.title.trim() ? o.title.trim() : fallback.title,
    description: typeof o.description === "string" ? o.description : fallback.description,
    endsAt: endsAtDate && !Number.isNaN(endsAtDate.getTime()) ? endsAtDate.toISOString() : fallback.endsAt,
    productLookup: typeof o.productLookup === "string" ? o.productLookup.trim() : "",
    productTitle: typeof o.productTitle === "string" ? o.productTitle.trim() : "",
    imageUrl: typeof o.imageUrl === "string" ? o.imageUrl.trim() : "",
    discountBadge: typeof o.discountBadge === "string" ? o.discountBadge.trim() : fallback.discountBadge,
  };
}

export function parseAllProducts(raw: unknown): AllProductsConfig {
  const fallback = createDefaultAllProducts();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  const o = raw as Record<string, unknown>;
  const title = typeof o.title === "string" && o.title.trim() ? o.title.trim() : fallback.title;
  return { title };
}

export function parseNewsletter(raw: unknown): NewsletterConfig {
  const fallback = createDefaultNewsletter();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  const o = raw as Record<string, unknown>;
  return {
    title: typeof o.title === "string" && o.title.trim() ? o.title.trim() : fallback.title,
    description: typeof o.description === "string" ? o.description : fallback.description,
    placeholder: typeof o.placeholder === "string" && o.placeholder.trim() ? o.placeholder.trim() : fallback.placeholder,
    buttonLabel: typeof o.buttonLabel === "string" && o.buttonLabel.trim() ? o.buttonLabel.trim() : fallback.buttonLabel,
  };
}

export function parseRecommendations(raw: unknown): RecommendationsConfig {
  const fallback = createDefaultRecommendations();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  const o = raw as Record<string, unknown>;
  return {
    recentlyAddedTitle:
      typeof o.recentlyAddedTitle === "string" && o.recentlyAddedTitle.trim()
        ? o.recentlyAddedTitle.trim()
        : fallback.recentlyAddedTitle,
    topRatedTitle:
      typeof o.topRatedTitle === "string" && o.topRatedTitle.trim()
        ? o.topRatedTitle.trim()
        : fallback.topRatedTitle,
    topSellingTitle:
      typeof o.topSellingTitle === "string" && o.topSellingTitle.trim()
        ? o.topSellingTitle.trim()
        : fallback.topSellingTitle,
    promoTag: typeof o.promoTag === "string" ? o.promoTag : fallback.promoTag,
    promoHeadline: typeof o.promoHeadline === "string" ? o.promoHeadline : fallback.promoHeadline,
    promoHighlight: typeof o.promoHighlight === "string" ? o.promoHighlight : fallback.promoHighlight,
    promoCtaLabel:
      typeof o.promoCtaLabel === "string" && o.promoCtaLabel.trim()
        ? o.promoCtaLabel.trim()
        : fallback.promoCtaLabel,
    promoCtaLink: typeof o.promoCtaLink === "string" ? o.promoCtaLink.trim() : fallback.promoCtaLink,
    promoImageUrl: typeof o.promoImageUrl === "string" ? o.promoImageUrl.trim() : "",
  };
}

export function parseSectionOrder(
  raw: unknown,
  enabled: Partial<Record<HomepageSectionType, boolean>>,
): HomepageSectionType[] {
  const enabledList = ALL_HOMEPAGE_SECTION_TYPES.filter((type) => enabled[type]);
  const fromRaw: HomepageSectionType[] = [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (
        typeof item === "string" &&
        (ALL_HOMEPAGE_SECTION_TYPES as string[]).includes(item) &&
        enabledList.includes(item as HomepageSectionType) &&
        !fromRaw.includes(item as HomepageSectionType)
      ) {
        fromRaw.push(item as HomepageSectionType);
      }
    }
  }
  for (const type of enabledList) {
    if (!fromRaw.includes(type)) fromRaw.push(type);
  }
  return fromRaw;
}

export function parseHomepageSections(raw: unknown): HomepageSectionsConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      hasSavedConfig: false,
      carouselEnabled: true,
      carouselSlides: createDefaultCarouselSlides(),
      discountsEnabled: false,
      discountCards: createDefaultDiscountCards(),
      categoryProductsEnabled: false,
      categoryProducts: createDefaultCategoryProducts(),
      dealsOfTheDayEnabled: false,
      dealsOfTheDay: createDefaultDealsOfTheDay(),
      allProductsEnabled: true,
      allProducts: createDefaultAllProducts(),
      newsletterEnabled: false,
      newsletter: createDefaultNewsletter(),
      recommendationsEnabled: true,
      recommendations: createDefaultRecommendations(),
      sectionOrder: ["carousel", "allProducts", "recommendations"],
    };
  }
  const o = raw as Record<string, unknown>;
  const carouselSlides = Array.isArray(o.carouselSlides)
    ? o.carouselSlides
        .map((slide, index) => parseCarouselSlide(slide, index))
        .slice(0, MAX_CAROUSEL_SLIDES)
    : [];
  const carouselEnabled = o.carouselEnabled !== false;
  const discountsEnabled = o.discountsEnabled === true;
  const discountCards = parseDiscountCards(o.discountCards);
  const categoryProductsEnabled = o.categoryProductsEnabled === true;
  const categoryProducts = parseCategoryProducts(o.categoryProducts);
  const dealsOfTheDayEnabled = o.dealsOfTheDayEnabled === true;
  const dealsOfTheDay = parseDealsOfTheDay(o.dealsOfTheDay);
  const allProductsEnabled = o.allProductsEnabled !== false;
  const allProducts = parseAllProducts(o.allProducts);
  const newsletterEnabled = o.newsletterEnabled === true;
  const newsletter = parseNewsletter(o.newsletter);
  const recommendationsEnabled = o.recommendationsEnabled !== false;
  const recommendations = parseRecommendations(o.recommendations);
  return {
    hasSavedConfig: true,
    carouselEnabled,
    carouselSlides,
    discountsEnabled,
    discountCards,
    categoryProductsEnabled,
    categoryProducts,
    dealsOfTheDayEnabled,
    dealsOfTheDay,
    allProductsEnabled,
    allProducts,
    newsletterEnabled,
    newsletter,
    recommendationsEnabled,
    recommendations,
    sectionOrder: parseSectionOrder(o.sectionOrder, {
      carousel: carouselEnabled,
      discounts: discountsEnabled,
      categoryProducts: categoryProductsEnabled,
      dealsOfTheDay: dealsOfTheDayEnabled,
      allProducts: allProductsEnabled,
      newsletter: newsletterEnabled,
      recommendations: recommendationsEnabled,
    }),
  };
}

export function homepageSectionsPayload(config: {
  carouselEnabled: boolean;
  carouselSlides: unknown[];
  discountsEnabled: boolean;
  discountCards: unknown[];
  categoryProductsEnabled: boolean;
  categoryProducts: unknown;
  dealsOfTheDayEnabled: boolean;
  dealsOfTheDay: unknown;
  allProductsEnabled: boolean;
  allProducts: unknown;
  newsletterEnabled: boolean;
  newsletter: unknown;
  recommendationsEnabled: boolean;
  recommendations: unknown;
  sectionOrder?: unknown;
}) {
  const carouselSlides = config.carouselSlides
    .map((slide, index) => parseCarouselSlide(slide, index))
    .slice(0, MAX_CAROUSEL_SLIDES);
  const discountCards = parseDiscountCards(config.discountCards);
  const categoryProducts = parseCategoryProducts(config.categoryProducts);
  const dealsOfTheDay = parseDealsOfTheDay(config.dealsOfTheDay);
  const allProducts = parseAllProducts(config.allProducts);
  const newsletter = parseNewsletter(config.newsletter);
  const recommendations = parseRecommendations(config.recommendations);
  const sectionOrder = parseSectionOrder(config.sectionOrder, {
    carousel: config.carouselEnabled,
    discounts: config.discountsEnabled,
    categoryProducts: config.categoryProductsEnabled,
    dealsOfTheDay: config.dealsOfTheDayEnabled,
    allProducts: config.allProductsEnabled,
    newsletter: config.newsletterEnabled,
    recommendations: config.recommendationsEnabled,
  });
  return {
    carouselEnabled: config.carouselEnabled,
    carouselSlides,
    discountsEnabled: config.discountsEnabled,
    discountCards,
    categoryProductsEnabled: config.categoryProductsEnabled,
    categoryProducts,
    dealsOfTheDayEnabled: config.dealsOfTheDayEnabled,
    dealsOfTheDay,
    allProductsEnabled: config.allProductsEnabled,
    allProducts,
    newsletterEnabled: config.newsletterEnabled,
    newsletter,
    recommendationsEnabled: config.recommendationsEnabled,
    recommendations,
    sectionOrder,
  };
}
