"use client";

import { useCallback, useEffect, useId, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BannerFour from "@/components/banner/BannerFour";
import DiscountsGrid from "@/components/banner/DiscountsGrid";
import CategoryProducts from "@/components/product/CategoryProducts";
import DealsOfTheDay from "@/components/product/DealsOfTheDay";
import WeeklyBestSelling from "@/components/product/WeeklyBestSelling";
import NewsletterBanner from "@/components/banner/NewsletterBanner";
import RecentlyAdded from "@/components/product/RecentlyAdded";
import {
  createDefaultAllProducts,
  createDefaultCarouselSlides,
  createDefaultCategoryProducts,
  createDefaultDealsOfTheDay,
  createDefaultDiscountCards,
  createDefaultNewsletter,
  createDefaultRecommendations,
  type AllProductsConfig,
  type CarouselSlide,
  type CategoryProductsConfig,
  type DealsOfTheDayConfig,
  type DiscountCard,
  type HomepageSectionType,
  type HomepageSectionsConfig,
  type NewsletterConfig,
  type RecommendationsConfig,
} from "@/lib/homepageSections";
import CarouselSectionEditor from "./CarouselSectionEditor";
import DiscountsSectionEditor from "./DiscountsSectionEditor";
import CategoryProductsSectionEditor from "./CategoryProductsSectionEditor";
import DealsOfTheDaySectionEditor from "./DealsOfTheDaySectionEditor";
import AllProductsSectionEditor from "./AllProductsSectionEditor";
import NewsletterSectionEditor from "./NewsletterSectionEditor";
import RecommendationsSectionEditor from "./RecommendationsSectionEditor";

type PageSection =
  | { id: string; type: "carousel"; slides: CarouselSlide[] }
  | { id: string; type: "discounts"; cards: DiscountCard[] }
  | { id: string; type: "categoryProducts"; config: CategoryProductsConfig }
  | { id: string; type: "dealsOfTheDay"; config: DealsOfTheDayConfig }
  | { id: string; type: "allProducts"; config: AllProductsConfig }
  | { id: string; type: "newsletter"; config: NewsletterConfig }
  | { id: string; type: "recommendations"; config: RecommendationsConfig };

const SECTION_CATALOG: { type: HomepageSectionType; label: string; hint: string }[] = [
  { type: "carousel", label: "Carousel", hint: "Homepage image slideshow" },
  { type: "discounts", label: "Discounts", hint: "Four-card promotional grid" },
  { type: "categoryProducts", label: "Category products", hint: "Tabbed category product row" },
  { type: "dealsOfTheDay", label: "Deals of the day", hint: "Countdown and featured product" },
  { type: "allProducts", label: "All products", hint: "Searchable product grid" },
  { type: "newsletter", label: "Newsletter", hint: "Full-width email subscribe banner" },
  { type: "recommendations", label: "Recommendations", hint: "Recently added, top rated, top selling" },
];

const SECTION_LABEL: Record<HomepageSectionType, string> = {
  carousel: "Carousel",
  discounts: "Discounts",
  categoryProducts: "Category products",
  dealsOfTheDay: "Deals of the day",
  allProducts: "All products",
  newsletter: "Newsletter",
  recommendations: "Recommendations",
};

const CAROUSEL_SECTION_ID = "section-carousel";
const DISCOUNTS_SECTION_ID = "section-discounts";
const CATEGORY_PRODUCTS_SECTION_ID = "section-category-products";
const DEALS_OF_THE_DAY_SECTION_ID = "section-deals-of-the-day";
const ALL_PRODUCTS_SECTION_ID = "section-all-products";
const NEWSLETTER_SECTION_ID = "section-newsletter";
const RECOMMENDATIONS_SECTION_ID = "section-recommendations";

function sectionsFromConfig(config: HomepageSectionsConfig): PageSection[] {
  return config.sectionOrder.flatMap((type): PageSection[] => {
    if (type === "carousel" && config.carouselEnabled) {
      return [
        {
          id: CAROUSEL_SECTION_ID,
          type: "carousel",
          slides: config.carouselSlides.length
            ? config.carouselSlides
            : createDefaultCarouselSlides(),
        },
      ];
    }
    if (type === "discounts" && config.discountsEnabled) {
      return [
        {
          id: DISCOUNTS_SECTION_ID,
          type: "discounts",
          cards: config.discountCards.length ? config.discountCards : createDefaultDiscountCards(),
        },
      ];
    }
    if (type === "categoryProducts" && config.categoryProductsEnabled) {
      return [
        {
          id: CATEGORY_PRODUCTS_SECTION_ID,
          type: "categoryProducts",
          config: config.categoryProducts,
        },
      ];
    }
    if (type === "dealsOfTheDay" && config.dealsOfTheDayEnabled) {
      return [
        {
          id: DEALS_OF_THE_DAY_SECTION_ID,
          type: "dealsOfTheDay",
          config: config.dealsOfTheDay,
        },
      ];
    }
    if (type === "allProducts" && config.allProductsEnabled) {
      return [
        {
          id: ALL_PRODUCTS_SECTION_ID,
          type: "allProducts",
          config: config.allProducts,
        },
      ];
    }
    if (type === "newsletter" && config.newsletterEnabled) {
      return [
        {
          id: NEWSLETTER_SECTION_ID,
          type: "newsletter",
          config: config.newsletter,
        },
      ];
    }
    if (type === "recommendations" && config.recommendationsEnabled) {
      return [
        {
          id: RECOMMENDATIONS_SECTION_ID,
          type: "recommendations",
          config: config.recommendations,
        },
      ];
    }
    return [];
  });
}

export default function SectionEditorContent() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [savedSlides, setSavedSlides] = useState<CarouselSlide[]>(createDefaultCarouselSlides());
  const [savedCards, setSavedCards] = useState<DiscountCard[]>(createDefaultDiscountCards());
  const [savedCategoryProducts, setSavedCategoryProducts] = useState<CategoryProductsConfig>(
    createDefaultCategoryProducts(),
  );
  const [savedDealsOfTheDay, setSavedDealsOfTheDay] = useState<DealsOfTheDayConfig>(
    createDefaultDealsOfTheDay(),
  );
  const [savedAllProducts, setSavedAllProducts] = useState<AllProductsConfig>(createDefaultAllProducts());
  const [savedNewsletter, setSavedNewsletter] = useState<NewsletterConfig>(createDefaultNewsletter());
  const [savedRecommendations, setSavedRecommendations] = useState<RecommendationsConfig>(
    createDefaultRecommendations(),
  );
  const pickerTitleId = useId();

  const selected = sections.find((section) => section.id === selectedId) ?? null;
  const allSectionsAdded = SECTION_CATALOG.every((item) =>
    sections.some((section) => section.type === item.type),
  );

  const persist = useCallback(
    async (
      nextSections: PageSection[],
      successMessage: string,
      extras?: {
        slides?: CarouselSlide[];
        cards?: DiscountCard[];
        categoryProducts?: CategoryProductsConfig;
        dealsOfTheDay?: DealsOfTheDayConfig;
        allProducts?: AllProductsConfig;
        newsletter?: NewsletterConfig;
        recommendations?: RecommendationsConfig;
      },
    ) => {
      const carousel = nextSections.find((section) => section.type === "carousel");
      const discounts = nextSections.find((section) => section.type === "discounts");
      const categoryProducts = nextSections.find((section) => section.type === "categoryProducts");
      const dealsOfTheDay = nextSections.find((section) => section.type === "dealsOfTheDay");
      const allProducts = nextSections.find((section) => section.type === "allProducts");
      const newsletter = nextSections.find((section) => section.type === "newsletter");
      const recommendations = nextSections.find((section) => section.type === "recommendations");
      setSaving(true);
      try {
        const res = await axios.put<HomepageSectionsConfig & { success?: boolean; message?: string }>(
          "/api/website-settings/homepage-sections",
          {
            carouselEnabled: Boolean(carousel),
            carouselSlides: carousel?.slides ?? extras?.slides ?? savedSlides,
            discountsEnabled: Boolean(discounts),
            discountCards: discounts?.cards ?? extras?.cards ?? savedCards,
            categoryProductsEnabled: Boolean(categoryProducts),
            categoryProducts: categoryProducts?.config ?? extras?.categoryProducts ?? savedCategoryProducts,
            dealsOfTheDayEnabled: Boolean(dealsOfTheDay),
            dealsOfTheDay: dealsOfTheDay?.config ?? extras?.dealsOfTheDay ?? savedDealsOfTheDay,
            allProductsEnabled: Boolean(allProducts),
            allProducts: allProducts?.config ?? extras?.allProducts ?? savedAllProducts,
            newsletterEnabled: Boolean(newsletter),
            newsletter: newsletter?.config ?? extras?.newsletter ?? savedNewsletter,
            recommendationsEnabled: Boolean(recommendations),
            recommendations: recommendations?.config ?? extras?.recommendations ?? savedRecommendations,
            sectionOrder: nextSections.map((section) => section.type),
          },
        );
        if (!res.data?.success) {
          toast.error(res.data?.message || "Save failed.");
          return false;
        }
        setSavedSlides(
          res.data.carouselSlides.length ? res.data.carouselSlides : createDefaultCarouselSlides(),
        );
        setSavedCards(
          res.data.discountCards.length ? res.data.discountCards : createDefaultDiscountCards(),
        );
        setSavedCategoryProducts(res.data.categoryProducts ?? createDefaultCategoryProducts());
        setSavedDealsOfTheDay(res.data.dealsOfTheDay ?? createDefaultDealsOfTheDay());
        setSavedAllProducts(res.data.allProducts ?? createDefaultAllProducts());
        setSavedNewsletter(res.data.newsletter ?? createDefaultNewsletter());
        setSavedRecommendations(res.data.recommendations ?? createDefaultRecommendations());
        setDirty(false);
        toast.success(successMessage);
        return true;
      } catch (err: unknown) {
        const msg =
          axios.isAxiosError(err) && typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : "Save failed.";
        toast.error(msg);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [savedAllProducts, savedCards, savedCategoryProducts, savedDealsOfTheDay, savedNewsletter, savedRecommendations, savedSlides],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get<HomepageSectionsConfig & { success?: boolean }>(
          "/api/website-settings/homepage-sections",
        );
        if (cancelled || !res.data) return;
        const next = sectionsFromConfig(res.data);
        setSections(next);
        setSelectedId(next[0]?.id ?? null);
        setSavedSlides(
          res.data.carouselSlides.length ? res.data.carouselSlides : createDefaultCarouselSlides(),
        );
        setSavedCards(
          res.data.discountCards.length ? res.data.discountCards : createDefaultDiscountCards(),
        );
        setSavedCategoryProducts(res.data.categoryProducts ?? createDefaultCategoryProducts());
        setSavedDealsOfTheDay(res.data.dealsOfTheDay ?? createDefaultDealsOfTheDay());
        setSavedAllProducts(res.data.allProducts ?? createDefaultAllProducts());
        setSavedNewsletter(res.data.newsletter ?? createDefaultNewsletter());
        setSavedRecommendations(res.data.recommendations ?? createDefaultRecommendations());
        setDirty(false);
      } catch {
        if (!cancelled) {
          toast.error("Could not load homepage sections. Showing defaults.");
          const fallback = sectionsFromConfig({
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
          });
          setSections(fallback);
          setSelectedId(fallback[0]?.id ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddSection = useCallback(
    (type: HomepageSectionType) => {
      setSections((prev) => {
        if (prev.some((section) => section.type === type)) return prev;
        let nextSection: PageSection;
        if (type === "carousel") {
          nextSection = {
            id: CAROUSEL_SECTION_ID,
            type: "carousel",
            slides: savedSlides.length ? savedSlides : createDefaultCarouselSlides(),
          };
        } else if (type === "discounts") {
          nextSection = {
            id: DISCOUNTS_SECTION_ID,
            type: "discounts",
            cards: savedCards.length ? savedCards : createDefaultDiscountCards(),
          };
        } else if (type === "categoryProducts") {
          nextSection = {
            id: CATEGORY_PRODUCTS_SECTION_ID,
            type: "categoryProducts",
            config: savedCategoryProducts,
          };
        } else if (type === "dealsOfTheDay") {
          nextSection = {
            id: DEALS_OF_THE_DAY_SECTION_ID,
            type: "dealsOfTheDay",
            config: savedDealsOfTheDay,
          };
        } else if (type === "allProducts") {
          nextSection = {
            id: ALL_PRODUCTS_SECTION_ID,
            type: "allProducts",
            config: savedAllProducts,
          };
        } else if (type === "newsletter") {
          nextSection = {
            id: NEWSLETTER_SECTION_ID,
            type: "newsletter",
            config: savedNewsletter,
          };
        } else {
          nextSection = {
            id: RECOMMENDATIONS_SECTION_ID,
            type: "recommendations",
            config: savedRecommendations,
          };
        }
        setSelectedId(nextSection.id);
        setDirty(true);
        return [...prev, nextSection];
      });
      setPickerOpen(false);
    },
    [savedAllProducts, savedCards, savedCategoryProducts, savedDealsOfTheDay, savedNewsletter, savedRecommendations, savedSlides],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      const removed = sections.find((section) => section.id === id);
      const next = sections.filter((section) => section.id !== id);
      if (removed?.type === "carousel") {
        setSavedSlides(removed.slides);
      }
      if (removed?.type === "discounts") {
        setSavedCards(removed.cards);
      }
      if (removed?.type === "categoryProducts") {
        setSavedCategoryProducts(removed.config);
      }
      if (removed?.type === "dealsOfTheDay") {
        setSavedDealsOfTheDay(removed.config);
      }
      if (removed?.type === "allProducts") {
        setSavedAllProducts(removed.config);
      }
      if (removed?.type === "newsletter") {
        setSavedNewsletter(removed.config);
      }
      if (removed?.type === "recommendations") {
        setSavedRecommendations(removed.config);
      }
      setSections(next);
      setSelectedId(next[next.length - 1]?.id ?? null);
      const label = removed ? SECTION_LABEL[removed.type] : "Section";
      await persist(next, `${label} removed from the homepage.`, {
        slides: removed?.type === "carousel" ? removed.slides : undefined,
        cards: removed?.type === "discounts" ? removed.cards : undefined,
        categoryProducts: removed?.type === "categoryProducts" ? removed.config : undefined,
        dealsOfTheDay: removed?.type === "dealsOfTheDay" ? removed.config : undefined,
        allProducts: removed?.type === "allProducts" ? removed.config : undefined,
        newsletter: removed?.type === "newsletter" ? removed.config : undefined,
        recommendations: removed?.type === "recommendations" ? removed.config : undefined,
      });
    },
    [persist, sections],
  );

  const handleSlidesChange = useCallback(
    (slides: CarouselSlide[]) => {
      if (!selectedId) return;
      setSections((prev) =>
        prev.map((section) =>
          section.id === selectedId && section.type === "carousel" ? { ...section, slides } : section,
        ),
      );
      setDirty(true);
    },
    [selectedId],
  );

  const handleCardsChange = useCallback(
    (cards: DiscountCard[]) => {
      if (!selectedId) return;
      setSections((prev) =>
        prev.map((section) =>
          section.id === selectedId && section.type === "discounts" ? { ...section, cards } : section,
        ),
      );
      setDirty(true);
    },
    [selectedId],
  );

  const handleCategoryProductsChange = useCallback(
    (config: CategoryProductsConfig) => {
      if (!selectedId) return;
      setSections((prev) =>
        prev.map((section) =>
          section.id === selectedId && section.type === "categoryProducts"
            ? { ...section, config }
            : section,
        ),
      );
      setDirty(true);
    },
    [selectedId],
  );

  const handleDealsOfTheDayChange = useCallback(
    (config: DealsOfTheDayConfig) => {
      if (!selectedId) return;
      setSections((prev) =>
        prev.map((section) =>
          section.id === selectedId && section.type === "dealsOfTheDay"
            ? { ...section, config }
            : section,
        ),
      );
      setDirty(true);
    },
    [selectedId],
  );

  const handleAllProductsChange = useCallback(
    (config: AllProductsConfig) => {
      if (!selectedId) return;
      setSections((prev) =>
        prev.map((section) =>
          section.id === selectedId && section.type === "allProducts" ? { ...section, config } : section,
        ),
      );
      setDirty(true);
    },
    [selectedId],
  );

  const handleNewsletterChange = useCallback(
    (config: NewsletterConfig) => {
      if (!selectedId) return;
      setSections((prev) =>
        prev.map((section) =>
          section.id === selectedId && section.type === "newsletter" ? { ...section, config } : section,
        ),
      );
      setDirty(true);
    },
    [selectedId],
  );

  const handleRecommendationsChange = useCallback(
    (config: RecommendationsConfig) => {
      if (!selectedId) return;
      setSections((prev) =>
        prev.map((section) =>
          section.id === selectedId && section.type === "recommendations" ? { ...section, config } : section,
        ),
      );
      setDirty(true);
    },
    [selectedId],
  );

  const handleSave = useCallback(async () => {
    await persist(sections, "Homepage sections saved.");
  }, [persist, sections]);

  const footerButtons = (
    <div style={{ padding: 16, borderTop: "1px solid #e8e8e8", display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        type="button"
        className="rts-btn btn-primary"
        onClick={() => setPickerOpen(true)}
        disabled={saving || allSectionsAdded}
        style={{
          width: "100%",
          padding: "10px 16px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: allSectionsAdded ? 0.55 : 1,
          cursor: allSectionsAdded ? "not-allowed" : "pointer",
        }}
      >
        <i className="fa-light fa-plus" aria-hidden="true" />
        Add section
      </button>
      <button
        type="button"
        className="rts-btn btn-primary"
        onClick={handleSave}
        disabled={saving || loading}
        style={{
          width: "100%",
          padding: "10px 16px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {saving ? "Saving…" : "Save"}
      </button>
      {dirty ? (
        <span style={{ color: "#6b7280", fontSize: 12, textAlign: "center" }}>Unsaved changes</span>
      ) : null}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        background: "#f4f5f7",
      }}
    >
      <aside
        style={{
          width: 280,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          borderRight: "1px solid #e8e8e8",
          minHeight: 0,
        }}
      >
        {pickerOpen ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 16px 12px",
                borderBottom: "1px solid #e8e8e8",
              }}
            >
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Back to sections"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 4,
                  color: "#2C3C28",
                  fontSize: 16,
                }}
              >
                <i className="fa-light fa-arrow-left" aria-hidden="true" />
              </button>
              <h3 id={pickerTitleId} style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
                Add section
              </h3>
            </div>
            <ul
              aria-labelledby={pickerTitleId}
              style={{
                listStyle: "none",
                margin: 0,
                padding: 8,
                overflowY: "auto",
                flex: 1,
              }}
            >
              {SECTION_CATALOG.map((item) => {
                const alreadyAdded = sections.some((section) => section.type === item.type);
                return (
                  <li key={item.type}>
                    <button
                      type="button"
                      onClick={() => handleAddSection(item.type)}
                      disabled={alreadyAdded}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 10px",
                        border: "none",
                        borderRadius: 8,
                        background: "transparent",
                        cursor: alreadyAdded ? "not-allowed" : "pointer",
                        opacity: alreadyAdded ? 0.5 : 1,
                      }}
                    >
                      <i
                        className="fa-light fa-plus"
                        aria-hidden="true"
                        style={{ marginTop: 3, color: "var(--color-primary, #629D23)" }}
                      />
                      <span>
                        <span style={{ display: "block", fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>
                          {item.label}
                        </span>
                        <span style={{ display: "block", fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                          {alreadyAdded ? "Already on this page" : item.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {footerButtons}
          </>
        ) : (
          <>
            <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #e8e8e8" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>Homepage</h3>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>Sections</p>
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 8,
                overflowY: "auto",
                flex: 1,
              }}
            >
              {loading ? (
                <li style={{ padding: "16px 10px", fontSize: 13, color: "#6b7280" }}>Loading sections…</li>
              ) : sections.length === 0 ? (
                <li style={{ padding: "16px 10px", fontSize: 13, color: "#6b7280" }}>
                  No sections yet. Use Add section to start.
                </li>
              ) : (
                sections.map((section) => {
                  const isSelected = section.id === selectedId;
                  const label = SECTION_LABEL[section.type];
                  return (
                    <li key={section.id}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          borderRadius: 8,
                          background: isSelected ? "var(--color-primary-light, #F0F7E6)" : "transparent",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedId(section.id)}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            textAlign: "left",
                            padding: "10px 10px",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "#1a1a1a",
                            fontSize: 14,
                            fontWeight: isSelected ? 600 : 500,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: isSelected ? "var(--color-primary, #629D23)" : "#d1d5db",
                              flexShrink: 0,
                            }}
                          />
                          {label}
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${label}`}
                          disabled={saving}
                          onClick={() => handleRemove(section.id)}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: saving ? "not-allowed" : "pointer",
                            padding: "8px 10px",
                            color: "#9ca3af",
                            fontSize: 13,
                          }}
                        >
                          <i className="fa-light fa-xmark" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
            {footerButtons}
          </>
        )}
      </aside>

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: 28,
          overflowY: "auto",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#1a1a1a" }}>Section editor</h2>
        <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: 14 }}>
          Choose a section in the sidebar, or add a new one to the homepage.
        </p>

        {loading ? (
          <div
            style={{
              marginTop: 24,
              border: "1px solid #e8e8e8",
              borderRadius: 12,
              background: "#fff",
              padding: 28,
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>Loading…</p>
          </div>
        ) : selected ? (
          <>
            <div
              style={{
                marginTop: 24,
                border: "1px solid #e8e8e8",
                borderRadius: 12,
                background: "#fff",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #e8e8e8",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Preview
              </div>
              {selected.type === "carousel" ? (
                <BannerFour slides={selected.slides} preview />
              ) : selected.type === "discounts" ? (
                <DiscountsGrid cards={selected.cards} preview />
              ) : selected.type === "categoryProducts" ? (
                <CategoryProducts config={selected.config} preview />
              ) : selected.type === "dealsOfTheDay" ? (
                <DealsOfTheDay config={selected.config} preview />
              ) : selected.type === "allProducts" ? (
                <WeeklyBestSelling title={selected.config.title} preview />
              ) : selected.type === "newsletter" ? (
                <NewsletterBanner config={selected.config} preview />
              ) : (
                <RecentlyAdded config={selected.config} preview />
              )}
            </div>

            <div
              style={{
                marginTop: 16,
                border: "1px solid #e8e8e8",
                borderRadius: 12,
                background: "#fff",
                padding: 28,
              }}
            >
              {selected.type === "carousel" ? (
                <CarouselSectionEditor
                  key={selected.id}
                  slides={selected.slides}
                  onChange={handleSlidesChange}
                />
              ) : selected.type === "discounts" ? (
                <DiscountsSectionEditor
                  key={selected.id}
                  cards={selected.cards}
                  onChange={handleCardsChange}
                />
              ) : selected.type === "categoryProducts" ? (
                <CategoryProductsSectionEditor
                  key={selected.id}
                  config={selected.config}
                  onChange={handleCategoryProductsChange}
                />
              ) : selected.type === "dealsOfTheDay" ? (
                <DealsOfTheDaySectionEditor
                  key={selected.id}
                  config={selected.config}
                  onChange={handleDealsOfTheDayChange}
                />
              ) : selected.type === "allProducts" ? (
                <AllProductsSectionEditor
                  key={selected.id}
                  config={selected.config}
                  onChange={handleAllProductsChange}
                />
              ) : selected.type === "newsletter" ? (
                <NewsletterSectionEditor
                  key={selected.id}
                  config={selected.config}
                  onChange={handleNewsletterChange}
                />
              ) : (
                <RecommendationsSectionEditor
                  key={selected.id}
                  config={selected.config}
                  onChange={handleRecommendationsChange}
                />
              )}
            </div>

            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                className="rts-btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ padding: "10px 24px" }}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              {dirty ? <span style={{ color: "#6b7280", fontSize: 13 }}>Unsaved changes</span> : null}
            </div>
          </>
        ) : (
          <div
            style={{
              marginTop: 24,
              border: "1px solid #e8e8e8",
              borderRadius: 12,
              background: "#fff",
              padding: 28,
            }}
          >
            <p style={{ margin: 0, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
              Click Add section to start building this page.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
