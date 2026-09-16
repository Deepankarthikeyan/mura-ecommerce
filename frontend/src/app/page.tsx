import type { Metadata } from "next";
import MuraiHomePage from "@/components/home-murai/MuraiHomePage";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/");

export default function Home() {
  return <MuraiHomePage />;
}
