import JsonLdScript from "./JsonLdScript";
import { resolvePageDynamicJsonLd } from "@/lib/seo/buildPageMetadata";
import {
  BLOG_SEO_TEMPLATE_PATH,
  PRODUCT_SEO_TEMPLATE_PATH,
} from "@/lib/seo/pageSeoTypes";

type PageSeoJsonLdProps = {
  path?: string;
};

function templatePathForRoute(pathname: string): string | undefined {
  if (pathname.startsWith("/shop/") && pathname.length > "/shop/".length) {
    return PRODUCT_SEO_TEMPLATE_PATH;
  }
  if (pathname.startsWith("/blog/") && pathname.length > "/blog/".length) {
    return BLOG_SEO_TEMPLATE_PATH;
  }
  return undefined;
}

export default async function PageSeoJsonLd({ path: pathProp }: PageSeoJsonLdProps) {
  let pathname = pathProp?.trim() ?? "";

  if (!pathname) {
    const { headers } = await import("next/headers");
    pathname = (await headers()).get("x-pathname")?.trim() ?? "/";
  }

  const schemas = await resolvePageDynamicJsonLd(pathname, {
    templatePath: templatePathForRoute(pathname),
  });

  return (
    <>
      {schemas.service ? <JsonLdScript data={schemas.service} /> : null}
      {schemas.faq ? <JsonLdScript data={schemas.faq} /> : null}
      {schemas.review ? <JsonLdScript data={schemas.review} /> : null}
    </>
  );
}
