import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/blog");

export default function BlogIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
