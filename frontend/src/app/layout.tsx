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

const FAVICON = "/murai/images/mura-newlogo.png";
const SITE_TITLE = "MuRa@23 — Sale Sarees Online";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSiteMetadata();
  return {
    ...meta,
    title: {
      default: SITE_TITLE,
      template: "%s | MuRa@23",
    },
    icons: {
      icon: FAVICON,
      apple: FAVICON,
    },
  };
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
