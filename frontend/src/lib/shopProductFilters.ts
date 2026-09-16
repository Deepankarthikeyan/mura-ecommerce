/**
 * Shop listing filters derived from product document fields.
 * Name/title and non-shoppable metadata (ids, media, description) are excluded.
 */

export type ShopFilterOption = {
  value: string;
  count: number;
  label: string;
};

export type ShopMultiFacet = {
  key: string;
  label: string;
  type: "multi";
  queryParam: string;
  options: ShopFilterOption[];
};

export type ShopRangeFacet = {
  key: string;
  label: string;
  type: "range";
  minParam: string;
  maxParam: string;
  min: number;
  max: number;
};

export type ShopAvailabilityFacet = {
  key: string;
  label: string;
  type: "availability";
  queryParam: string;
  options: ShopFilterOption[];
};

export type ShopFilterFacet = ShopMultiFacet | ShopRangeFacet | ShopAvailabilityFacet;

export type ProductListingFilterOptions = {
  search?: string;
  category?: string | string[];
  quantity?: string | string[];
  tags?: string | string[];
  author?: string | string[];
  ratings?: string | string[];
  discountPercentage?: string | string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  availability?: string | string[];
};

export const SHOP_FILTER_QUERY_KEYS = [
  "category",
  "quantity",
  "tag",
  "author",
  "rating",
  "discount",
  "minPrice",
  "maxPrice",
  "availability",
] as const;

export function csvToList(value: string | string[] | null | undefined): string[] {
  if (value == null) return [];
  const raw = Array.isArray(value) ? value : [value];
  const out: string[] = [];
  for (const entry of raw) {
    for (const part of String(entry).split(",")) {
      const trimmed = part.trim();
      if (trimmed) out.push(trimmed);
    }
  }
  return out;
}

function parseNumberParam(value: string | null | undefined): number | null {
  if (value == null || value.trim() === "") return null;
  const n = Number(String(value).replace(/,/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function parseProductFiltersFromSearchParams(
  searchParams: URLSearchParams
): ProductListingFilterOptions {
  const availability = csvToList(searchParams.get("availability"));
  return {
    search: searchParams.get("search")?.trim() ?? "",
    category: csvToList(searchParams.get("category")),
    quantity: csvToList(searchParams.get("quantity")),
    tags: csvToList(searchParams.get("tag")),
    author: csvToList(searchParams.get("author")),
    ratings: csvToList(searchParams.get("rating")),
    discountPercentage: csvToList(searchParams.get("discount")),
    minPrice: parseNumberParam(searchParams.get("minPrice")),
    maxPrice: parseNumberParam(searchParams.get("maxPrice")),
    availability,
  };
}

export function hasActiveShopFilters(filters: ProductListingFilterOptions): boolean {
  return (
    csvToList(filters.category).length > 0 ||
    csvToList(filters.quantity).length > 0 ||
    csvToList(filters.tags).length > 0 ||
    csvToList(filters.author).length > 0 ||
    csvToList(filters.ratings).length > 0 ||
    csvToList(filters.discountPercentage).length > 0 ||
    csvToList(filters.availability).length > 0 ||
    filters.minPrice != null ||
    filters.maxPrice != null
  );
}

function toTrimmedString(value: unknown): string {
  return String(value ?? "").trim();
}

function toFilterNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const n = Number(String(value).replace(/,/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function bumpCount(map: Map<string, number>, value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return;
  map.set(trimmed, (map.get(trimmed) ?? 0) + 1);
}

function optionsFromCountMap(
  map: Map<string, number>,
  key: string,
  extra?: (option: ShopFilterOption) => boolean
): ShopFilterOption[] {
  return [...map.entries()]
    .map(([value, count]) => ({
      value,
      count,
      label: formatShopFilterOption(key, value),
    }))
    .filter((option) => (extra ? extra(option) : true))
    .sort((a, b) =>
      a.value.localeCompare(b.value, undefined, { numeric: true, sensitivity: "base" })
    );
}

/** Build shop filter groups from loaded product documents (not a separate aggregation). */
export function buildShopFacetsFromProducts(
  products: Array<Record<string, unknown>>
): ShopFilterFacet[] {
  const categories = new Map<string, number>();
  const quantities = new Map<string, number>();
  const tags = new Map<string, number>();
  const authors = new Map<string, number>();
  const ratings = new Map<string, number>();
  const discounts = new Map<string, number>();
  const prices: number[] = [];
  let inStock = 0;
  let outStock = 0;

  for (const product of products) {
    bumpCount(categories, toTrimmedString(product.category));
    bumpCount(quantities, toTrimmedString(product.quantity));
    bumpCount(authors, toTrimmedString(product.author));

    const rawTags = product.tags;
    if (Array.isArray(rawTags)) {
      for (const tag of rawTags) bumpCount(tags, toTrimmedString(tag));
    } else if (typeof rawTags === "string") {
      for (const tag of csvToList(rawTags)) bumpCount(tags, tag);
    }

    const rating = toFilterNumber(product.ratings);
    if (rating != null) bumpCount(ratings, String(rating));

    const discount = toFilterNumber(product.discountPercentage);
    if (discount != null && discount > 0) bumpCount(discounts, String(discount));

    const price = toFilterNumber(product.price);
    if (price != null) prices.push(price);

    const stock = toFilterNumber(product.stock);
    if (stock != null && stock <= 0) outStock += 1;
    else inStock += 1;
  }

  const facets: ShopFilterFacet[] = [];
  const pushMulti = (
    key: string,
    label: string,
    queryParam: string,
    options: ShopFilterOption[]
  ) => {
    if (!options.length) return;
    facets.push({ key, label, type: "multi", queryParam, options });
  };

  pushMulti("category", "Category", "category", optionsFromCountMap(categories, "category"));
  pushMulti("quantity", "Quantity", "quantity", optionsFromCountMap(quantities, "quantity"));
  pushMulti("tags", "Tags", "tag", optionsFromCountMap(tags, "tags"));
  pushMulti("author", "Author", "author", optionsFromCountMap(authors, "author"));
  pushMulti(
    "ratings",
    "Ratings",
    "rating",
    optionsFromCountMap(ratings, "ratings").sort((a, b) => Number(b.value) - Number(a.value))
  );
  pushMulti("discountPercentage", "Discount", "discount", optionsFromCountMap(discounts, "discountPercentage"));

  if (prices.length) {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (max > min) {
      facets.push({
        key: "price",
        label: "Price",
        type: "range",
        minParam: "minPrice",
        maxParam: "maxPrice",
        min,
        max,
      });
    }
  }

  const availabilityOptions: ShopFilterOption[] = [];
  if (inStock > 0) {
    availabilityOptions.push({
      value: "in-stock",
      count: inStock,
      label: formatShopFilterOption("stock", "in-stock"),
    });
  }
  if (outStock > 0) {
    availabilityOptions.push({
      value: "out-of-stock",
      count: outStock,
      label: formatShopFilterOption("stock", "out-of-stock"),
    });
  }
  if (availabilityOptions.length) {
    facets.push({
      key: "stock",
      label: "Availability",
      type: "availability",
      queryParam: "availability",
      options: availabilityOptions,
    });
  }

  return facets;
}

/** Keep currently selected values visible even if they are not in the latest product set. */
export function mergeSelectedShopFacets(
  facets: ShopFilterFacet[],
  selected: Record<string, string[]>
): ShopFilterFacet[] {
  return facets.map((facet) => {
    if (facet.type === "range") return facet;
    const chosen = selected[facet.queryParam] ?? [];
    if (!chosen.length) return facet;
    const existing = new Set(facet.options.map((option) => option.value));
    const extras = chosen
      .filter((value) => !existing.has(value))
      .map((value) => ({
        value,
        count: 0,
        label: formatShopFilterOption(facet.key, value),
      }));
    if (!extras.length) return facet;
    return { ...facet, options: [...facet.options, ...extras] };
  });
}

export function formatShopFilterOption(key: string, value: string): string {
  if (key === "discountPercentage") {
    const n = Number(value);
    if (Number.isFinite(n)) return `${Math.round(n)}%`;
  }
  if (key === "ratings") {
    const n = Number(value);
    if (Number.isFinite(n)) return n === 1 ? "1 Star" : `${n} Stars`;
  }
  if (key === "stock" || value === "in-stock") return "In stock";
  if (value === "out-of-stock") return "Out of stock";
  return value;
}

export const SHOP_PAGE_SIZE = 12;

export function buildShopProductsQuery(
  search: string,
  filterParams: { get(name: string): string | null },
  pagination?: { skip: number; limit: number }
): string {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  for (const key of SHOP_FILTER_QUERY_KEYS) {
    const value = filterParams.get(key)?.trim();
    if (value) params.set(key, value);
  }
  if (pagination) {
    params.set("skip", String(Math.max(0, pagination.skip)));
    params.set("limit", String(pagination.limit));
  }
  const query = params.toString();
  return query ? `/api/products?${query}` : "/api/products";
}
