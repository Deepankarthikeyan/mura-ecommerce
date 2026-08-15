import type { Metadata } from "next";
import { getStoreProductByLookup } from "@/functions/mongodbOperations";
import JsonLdScript from "@/components/seo/JsonLdScript";
import {
  buildProductJsonLd,
  buildProductPageMetadata,
} from "@/lib/seo/buildPageMetadata";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStoreProductByLookup(slug);
  return buildProductPageMetadata(product as Parameters<typeof buildProductPageMetadata>[0], slug);
}

export default async function ShopProductLayout({
  children,
  params,
}: LayoutProps) {
  const { slug } = await params;
  const product = await getStoreProductByLookup(slug);
  const productSchema = product
    ? buildProductJsonLd(
        product as Parameters<typeof buildProductJsonLd>[0],
        slug,
      )
    : null;

  return (
    <>
      {productSchema ? <JsonLdScript data={productSchema} /> : null}
      {children}
    </>
  );
}
