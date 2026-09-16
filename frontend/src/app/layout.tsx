import React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ClientProviders from "../components/providers/ClientProviders";
import GoogleAnalytics from "../components/seo/GoogleAnalytics";
import PageSeoJsonLd from "../components/seo/PageSeoJsonLd";
import JsonLdScript from "../components/seo/JsonLdScript";
import WebsiteThemeStyle from "../components/theme/WebsiteThemeStyle";
import ApplyThemeOnClient from "../components/theme/ApplyThemeOnClient";
import { buildSiteMetadata, loadLiveSeoSchemas } from "../lib/seo/loadSeoSettings";
import { SITE_FAVICON } from "../lib/brand";
import { loadWebsiteTheme } from "../lib/theme/loadWebsiteTheme";
import { loadWebsiteColors } from "../lib/theme/loadWebsiteColors";

import "./globals.css";
import "../themes/ayurvedha/theme.css";
import "../themes/fashion/theme.css";
import "react-toastify/dist/ReactToastify.css";

const FAVICON = SITE_FAVICON;

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata();
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [schemas, websiteTheme] = await Promise.all([
    loadLiveSeoSchemas(),
    loadWebsiteTheme(),
  ]);
  const websiteColors = await loadWebsiteColors(websiteTheme);

  return (
    <html lang="en-IN" data-website-theme={websiteTheme}>
      <head>
        <link rel="icon" href={FAVICON} type="image/png" />
        <link rel="shortcut icon" href={FAVICON} type="image/png" />
        <link rel="apple-touch-icon" href={FAVICON} />
        <link key="bootstrap" rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link key="plugins" rel="stylesheet" href="/assets/css/plugins.css" />
        <link key="style" rel="stylesheet" href="/assets/css/style.css" />
        <WebsiteThemeStyle />
        <JsonLdScript data={schemas.organization} />
        <JsonLdScript data={schemas.website} />
        <JsonLdScript data={schemas.localBusiness} />
        <PageSeoJsonLd />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ApplyThemeOnClient theme={websiteTheme} colors={websiteColors} />
        <GoogleAnalytics />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
