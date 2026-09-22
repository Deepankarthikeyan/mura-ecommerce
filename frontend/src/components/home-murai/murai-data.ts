export type MuraiSaree = {
  id: number;
  name: string;
  cat: string;
  category: string;
  price: number;
  old: number;
  img: string;
  badge?: string;
  href?: string;
  ratings?: number;
};

export const MURAI_IMG = "/murai/sarees";

export const ALL_SAREES: MuraiSaree[] = [
  { id: 101, name: "Banarasi Silk Saree", cat: "Silk Saree", category: "silk", price: 3599, old: 5999, img: `${MURAI_IMG}/banarasi.webp` },
  { id: 102, name: "Kanjivaram Silk Saree", cat: "Kanjivaram", category: "kanjivaram", price: 4999, old: 7999, img: `${MURAI_IMG}/kanjivaram.webp` },
  { id: 103, name: "Cotton Block Print Saree", cat: "Cotton Saree", category: "cotton", price: 899, old: 1499, img: `${MURAI_IMG}/cotton-block.webp` },
  { id: 104, name: "Georgette Party Saree", cat: "Party Wear", category: "party", price: 1299, old: 2199, img: `${MURAI_IMG}/georgette-party.webp` },
  { id: 105, name: "Chiffon Embroidered Saree", cat: "Designer Saree", category: "party", price: 1599, old: 2499, img: `${MURAI_IMG}/chiffon.webp` },
  { id: 106, name: "Tussar Silk Saree", cat: "Silk Saree", category: "silk", price: 2199, old: 3499, img: `${MURAI_IMG}/tussar.webp` },
  { id: 107, name: "Patola Silk Saree", cat: "Silk Saree", category: "silk", price: 5499, old: 8999, img: `${MURAI_IMG}/patola.webp` },
  { id: 108, name: "Linen Cotton Saree", cat: "Cotton Saree", category: "cotton", price: 1099, old: 1799, img: `${MURAI_IMG}/linen-cotton.webp` },
  { id: 109, name: "Organza Designer Saree", cat: "Designer Saree", category: "party", price: 1899, old: 2999, img: `${MURAI_IMG}/organza.webp` },
  { id: 110, name: "Mysore Silk Saree", cat: "Silk Saree", category: "silk", price: 3999, old: 5999, img: `${MURAI_IMG}/mysore.webp` },
  { id: 111, name: "Kalamkari Cotton Saree", cat: "Cotton Saree", category: "cotton", price: 999, old: 1599, img: `${MURAI_IMG}/kalamkari.webp` },
  { id: 112, name: "Net Party Wear Saree", cat: "Party Wear", category: "party", price: 1499, old: 2299, img: `${MURAI_IMG}/net-party.webp` },
  { id: 113, name: "Kanchipuram Silk Saree", cat: "Kanjivaram", category: "kanjivaram", price: 5999, old: 8999, img: `${MURAI_IMG}/kanchipuram.webp` },
];

export const SALE_TABS = [
  { id: "featured", label: "Silk Sarees", filter: (s: MuraiSaree) => s.category === "silk" },
  { id: "trending", label: "Cotton Sarees", filter: (s: MuraiSaree) => s.category === "cotton" },
  { id: "newarrival", label: "Designer Sarees", filter: (s: MuraiSaree) => s.category === "party" || s.category === "kanjivaram" },
] as const;

export const BESTSELLERS = ALL_SAREES.slice(0, 4);

export const DEAL_PRODUCT = ALL_SAREES[0];

export const MURAI_TESTIMONIALS = [
  {
    id: "priya",
    name: "Priya Sharma",
    role: "Saree Lover",
    avatar: "/murai/avatars/priya-sharma.svg",
    text: "The Banarasi silk saree I bought on sale is absolutely stunning! Rich zari work and the fabric quality is exceptional. Best saree purchase ever!",
  },
  {
    id: "laura",
    name: "Laura Johnson",
    role: "Saree Lover",
    avatar: "/murai/avatars/laura-johnson.svg",
    text: "MuRa@23 has the best saree sale online! Got a beautiful Kanjivaram. Fast delivery and elegant packaging. Highly recommended!",
  },
  {
    id: "richard",
    name: "Richard Smith",
    role: "Saree Lover",
    avatar: "/murai/avatars/richard-smith.svg",
    text: "The silk saree I purchased exceeded my expectations. Gorgeous colors and the packaging was elegant. Perfect for gifting too.",
  },
];

export const MURAI_BLOGS = [
  {
    title: "How to Choose the Perfect Silk Saree",
    date: "February 03, 2026",
    img: "/murai/blog/blog-1.jpg",
    alt: "MuRa@23 Maheshwari saree — timeless elegance",
  },
  {
    title: "Banarasi vs Kanjivaram: A Complete Guide",
    date: "February 03, 2026",
    img: "/murai/blog/blog-2.jpg",
    alt: "MuRa@23 aqua blue and cream Maheshwari saree",
  },
  {
    title: "5 Ways to Style Your Saree for Modern Occasions",
    date: "February 03, 2026",
    img: "/murai/blog/blog-3.jpg",
    alt: "MuRa@23 Maheshwari saree with subtle beauty details",
  },
];

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
