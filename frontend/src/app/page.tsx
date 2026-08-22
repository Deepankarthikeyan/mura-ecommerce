import MuraiHomePage from "@/components/murai/MuraiHomePage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";
import type { Metadata } from "next";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/");

export default function Home() {
  return <MuraiHomePage />;
}
