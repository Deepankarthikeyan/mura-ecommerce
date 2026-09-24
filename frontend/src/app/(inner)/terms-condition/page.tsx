import type { Metadata } from "next";
import MuraiTermsPage from "@/components/home-murai/MuraiTermsPage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/terms-condition");

export default function TermsConditionPage() {
  return <MuraiTermsPage />;
}
