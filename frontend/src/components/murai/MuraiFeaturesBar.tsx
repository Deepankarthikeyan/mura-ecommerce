"use client";

import { useStorefrontSettings } from "@/lib/storefront/useStorefrontSettings";
import { SERVICE_BAR_ICONS } from "@/lib/storefront/serviceBarIcons";

export default function MuraiFeaturesBar() {
  const { settings } = useStorefrontSettings();
  const items = settings.serviceBar;

  if (!items.length) return null;

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="features-grid">
          {items.map((item, i) => (
            <div key={`${item.title}-${i}`} className="feature-card">
              <div className="feature-icon">{SERVICE_BAR_ICONS[i % SERVICE_BAR_ICONS.length]}</div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
