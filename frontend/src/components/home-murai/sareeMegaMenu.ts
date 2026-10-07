export type SareeMegaMenuItem = {
  label: string;
  href: string;
  image: string;
};

export const DEFAULT_SHOP_BANNER: SareeMegaMenuItem = {
  label: "Shop Sarees",
  href: "/shop",
  image: "/murai/banners/banner-shop.jpg",
};

export const SAREE_MEGA_MENU: SareeMegaMenuItem[] = [
  {
    label: "Chanderi Saree",
    href: "/shop?category=Chanderi%20Saree",
    image: "/murai/categories/chanderi.webp",
  },
  {
    label: "Cotton Saree",
    href: "/shop?category=Cotton%20Saree",
    image: "/murai/categories/cotton.webp",
  },
  {
    label: "Cotton Saree Club",
    href: "/shop?category=Cotton%20Saree%20Club",
    image: "/murai/categories/cotton.webp",
  },
  {
    label: "Ikat Saree",
    href: "/shop?category=Ikat%20Saree",
    image: "/murai/categories/ikat.webp",
  },
  {
    label: "Maheswari Saree",
    href: "/shop?category=Maheshwari%20Saree",
    image: "/murai/categories/maheswari.webp",
  },
  {
    label: "Narayanpet Saree",
    href: "/shop?category=Narayanpet%20Saree",
    image: "/murai/categories/narayanpet.webp",
  },
];

const CATEGORY_ALIASES: Record<string, string> = {
  handloom: "cotton saree club",
  kalamkari: "cotton saree club",
  "cotton saree clubit": "cotton saree club",
};

export function getSareeCategoryBanner(category: string): SareeMegaMenuItem {
  const normalize = (value: string) => {
    const base = value.trim().toLowerCase()
      .replace(/sarees?$/, "")
      .replace("maheshwari", "maheswari")
      .trim();
    return CATEGORY_ALIASES[base] ?? base;
  };

  const normalized = normalize(category);
  if (!normalized || normalized === "all") return DEFAULT_SHOP_BANNER;

  return SAREE_MEGA_MENU.find((item) => normalize(item.label) === normalized)
    ?? DEFAULT_SHOP_BANNER;
}
