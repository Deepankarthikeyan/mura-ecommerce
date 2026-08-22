import type { Viewport } from "next";
import { Jost, Playfair_Display } from "next/font/google";

import ClientProviders from "../components/providers/ClientProviders";
import GoogleAnalytics from "../components/seo/GoogleAnalytics";
import PageSeoJsonLd from "../components/seo/PageSeoJsonLd";
import JsonLdScript from "../components/seo/JsonLdScript";
import { buildSiteMetadata, loadLiveSeoSchemas } from "../lib/seo/loadSeoSettings";
import { MURAI_FAVICON, MURAI_HOME_TITLE, MURAI_SITE_NAME } from "../data/siteBrand";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const FAVICON = MURAI_FAVICON;

export async function generateMetadata() {
  const base = await buildSiteMetadata();
  return {
    ...base,
    title: {
      default: MURAI_HOME_TITLE,
      template: `%s | ${MURAI_SITE_NAME}`,
    },
    icons: {
      icon: FAVICON,
      shortcut: FAVICON,
      apple: FAVICON,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemas = await loadLiveSeoSchemas();

  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href={FAVICON} type="image/png" />
        <link rel="apple-touch-icon" href={FAVICON} />
        <link
          key="swiper-bundle"
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css"
        />
        <link key="murai-style" rel="stylesheet" href="/assets/css/murai/style.css" />
        <link key="murai-header" rel="stylesheet" href="/assets/css/murai/header.css" />
        <link key="murai-home" rel="stylesheet" href="/assets/css/murai/home.css" />
        <link key="murai-diwali" rel="stylesheet" href="/assets/css/murai/diwali-banner.css" />
        <link key="murai-responsive" rel="stylesheet" href="/assets/css/murai/responsive.css" />
        <style
          dangerouslySetInnerHTML={{
            __html: ":root { --font-body: 'Jost', sans-serif; --font-heading: 'Playfair Display', serif; }",
          }}
        />
        <JsonLdScript data={schemas.organization} />
        <JsonLdScript data={schemas.website} />
        <JsonLdScript data={schemas.localBusiness} />
        <PageSeoJsonLd />
      </head>
      <body className={`${playfair.variable} ${jost.variable} murai-theme`}>
        <GoogleAnalytics />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
