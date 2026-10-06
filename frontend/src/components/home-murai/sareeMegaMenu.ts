export type SareeMegaMenuItem = {
  label: string;
  href: string;
  image: string;
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
    label: "Handloom Saree",
    href: "/shop?category=Handloom%20Saree",
    image: "/murai/categories/handloom.webp",
  },
  {
    label: "Ikat Saree",
    href: "/shop?category=Ikat%20Saree",
    image: "/murai/categories/ikat.webp",
  },
  {
    label: "Kalamkari Saree",
    href: "/shop?category=Kalamkari%20Saree",
    image: "/murai/categories/kalamkari.webp",
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

export function getSareeCategoryBanner(category: string): SareeMegaMenuItem {
  const normalize = (value: string) => value.trim().toLowerCase()
    .replace(/sarees?$/, "").replace("maheshwari", "maheswari").trim();
  return SAREE_MEGA_MENU.find((item) => normalize(item.label) === normalize(category))
    ?? SAREE_MEGA_MENU[0];
}
