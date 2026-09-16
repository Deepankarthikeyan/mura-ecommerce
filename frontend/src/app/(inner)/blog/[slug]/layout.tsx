import type { Metadata } from "next";
import Posts from "@/data/Posts.json";
import { buildBlogPostMetadata } from "@/lib/seo/buildPageMetadata";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const post = Posts.find(
    (entry) =>
      entry.slug === slug ||
      String(entry.id) === slug ||
      String(entry.slug ?? "").toLowerCase() === slug.toLowerCase(),
  );
  return buildBlogPostMetadata(post, slug, Posts);
}

export default function BlogPostLayout({ children }: Pick<LayoutProps, "children">) {
  return children;
}
