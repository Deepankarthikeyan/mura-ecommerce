"use client";

import Link from "next/link";
import { useStorefrontSettings } from "@/lib/storefront/useStorefrontSettings";
import { useCategories } from "@/lib/storefront/useCategories";

export default function MuraiFooter() {
  const { settings } = useStorefrontSettings();
  const { categories } = useCategories();
  const { site, footer } = settings;

  const categoryLinks =
    footer.categoryLinks.length > 0
      ? footer.categoryLinks
      : categories
          .filter((c) => c.key !== "all")
          .slice(0, 4)
          .map((c) => ({ label: c.label, href: `/shop?category=${encodeURIComponent(c.key)}` }));

  return (
    <footer className="suruchi-footer">
      <div className="suruchi-footer-grid">
        <div>
          <Link href="/" className="suruchi-logo footer-logo" aria-label={site.name}>
            <img src={site.logo} alt={site.name} width={108} height={67} loading="lazy" />
          </Link>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{footer.description}</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            {footer.quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Saree Types</h4>
          <ul>
            {categoryLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a href={`tel:${site.phone.replace(/\s+/g, "")}`}>{site.phone}</a></li>
            <li><Link href="/contact">{site.address}</Link></li>
          </ul>
        </div>
      </div>
      <div className="suruchi-footer-bottom">
        <p>{site.copyright}</p>
      </div>
    </footer>
  );
}
