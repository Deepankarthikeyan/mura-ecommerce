import Link from "next/link";
import type { PromoBanner } from "@/lib/storefront/types";
import { renderMultiline } from "@/lib/storefront/renderMultiline";

function EmptyBannerCard({ className }: { className?: string }) {
  return <div className={`banner-card banner-card--empty ${className ?? ""}`.trim()} aria-hidden />;
}

function BannerCard({ banner, className }: { banner: PromoBanner; className: string }) {
  return (
    <Link href={banner.href} className={className}>
      <img src={banner.image} alt="" loading="lazy" />
      <div className="banner-card-content">
        {banner.subtitle ? <span className="banner-card-subtitle">{banner.subtitle}</span> : null}
        {banner.title ? <h3>{renderMultiline(banner.title)}</h3> : null}
        {banner.linkLabel ? <span className="banner-card-link">{banner.linkLabel}</span> : null}
      </div>
    </Link>
  );
}

type MuraiBannerGridProps = {
  banners: PromoBanner[];
};

/** Always renders the 4-card MuRa banner grid; fills slots when panel data exists. */
export default function MuraiBannerGrid({ banners }: MuraiBannerGridProps) {
  const tall = banners.find((b) => b.layout === "tall");
  const small = banners.filter((b) => b.layout === "small");
  const wide = banners.find((b) => b.layout === "wide");

  return (
    <section className="banner-section">
      <div className="banner-grid">
        {tall ? <BannerCard banner={tall} className="banner-card tall" /> : <EmptyBannerCard className="tall" />}
        <div className="banner-right">
          <div className="banner-right-top">
            {small[0] ? <BannerCard banner={small[0]} className="banner-card" /> : <EmptyBannerCard />}
            {small[1] ? <BannerCard banner={small[1]} className="banner-card" /> : <EmptyBannerCard />}
          </div>
          {wide ? <BannerCard banner={wide} className="banner-card" /> : <EmptyBannerCard />}
        </div>
      </div>
    </section>
  );
}
