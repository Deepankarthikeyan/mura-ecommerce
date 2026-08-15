import React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ClientProviders from "../components/providers/ClientProviders";
import GoogleAnalytics from "../components/seo/GoogleAnalytics";
import PageSeoJsonLd from "../components/seo/PageSeoJsonLd";
import JsonLdScript from "../components/seo/JsonLdScript";
import { buildSiteMetadata, loadLiveSeoSchemas } from "../lib/seo/loadSeoSettings";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const FAVICON = "/assets/images/fav.png";

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
  const schemas = await loadLiveSeoSchemas();

  return (
    <html lang="en-IN">
      <head>
        <link rel="icon" href={FAVICON} type="image/png" />
        <link rel="apple-touch-icon" href={FAVICON} />
        <link key="bootstrap" rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link key="plugins" rel="stylesheet" href="/assets/css/plugins.css" />
        <link key="style" rel="stylesheet" href="/assets/css/style.css" />
        <JsonLdScript data={schemas.organization} />
        <JsonLdScript data={schemas.website} />
        <JsonLdScript data={schemas.localBusiness} />
        <PageSeoJsonLd />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GoogleAnalytics />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
