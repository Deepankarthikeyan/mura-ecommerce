import type { Metadata } from "next";
import MuraiContactPage from "@/components/murai/MuraiContactPage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/contact");

export default function ContactPage() {
  return <MuraiContactPage />;
}
