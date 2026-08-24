import type { Metadata } from "next";
import MuraiAboutPage from "@/components/murai/MuraiAboutPage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/about");

export default function AboutPage() {
  return <MuraiAboutPage />;
}
