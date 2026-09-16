export type SareeCategory = {
  key: string;
  label: string;
  image: string;
};

/** Primary saree types shown in the header mega menu and shop sidebar. */
export const SAREE_CATEGORIES: SareeCategory[] = [
  {
    key: "maheshwari",
    label: "Maheshwari Saree",
    image: "/murai/sarees/banarasi.webp",
  },
  {
    key: "ikat",
    label: "Ikat Saree",
    image: "/murai/sarees/cotton-block.webp",
  },
  {
    key: "mulmul",
    label: "Mulmul Saree",
    image: "/murai/sarees/linen-cotton.webp",
  },
  {
    key: "kolkata",
    label: "Kolkata Saree",
    image: "/murai/sarees/kanjivaram.webp",
  },
  {
    key: "chanderi",
    label: "Chanderi Saree",
    image: "/murai/sarees/georgette-party.webp",
  },
  {
    key: "modal",
    label: "Modal Saree",
    image: "/murai/sarees/paithani.webp",
  },
  {
    key: "narayanpet",
    label: "Narayanpet Saree",
    image: "/murai/sarees/patola.webp",
  },
];

export function getSareeCategoryByKey(key: string): SareeCategory | undefined {
  return SAREE_CATEGORIES.find((c) => c.key === key);
}

export function productMatchesSareeCategory(productCategory: string, categoryKey: string): boolean {
  const hay = productCategory.toLowerCase();
  const key = categoryKey.toLowerCase();
  const saree = getSareeCategoryByKey(key);
  if (!saree) return hay.includes(key);
  const baseName = saree.label.replace(/\s+saree$/i, "").toLowerCase();
  return hay.includes(key) || hay.includes(baseName);
}
