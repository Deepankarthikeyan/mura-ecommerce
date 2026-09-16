import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/shop");

export default function ShopListLayout({ children }: { children: React.ReactNode }) {
  return children;
}
