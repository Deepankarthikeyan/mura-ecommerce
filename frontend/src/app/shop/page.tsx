import type { Metadata } from "next";
import MuraiShopPage from "@/components/home-murai/MuraiShopPage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/shop");

export default function ShopPage() {
  return <MuraiShopPage />;
}
