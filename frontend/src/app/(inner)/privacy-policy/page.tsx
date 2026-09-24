import type { Metadata } from "next";
import MuraiPrivacyPolicyPage from "@/components/home-murai/MuraiPrivacyPolicyPage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/privacy-policy");

export default function PrivacyPolicyPage() {
  return <MuraiPrivacyPolicyPage />;
}
