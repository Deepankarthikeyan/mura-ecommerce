import type { Metadata } from "next";
import MuraiFaqPage from "@/components/home-murai/MuraiFaqPage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/faq");

export default function FaqPage() {
  return <MuraiFaqPage />;
}
