import Link from "next/link";
import type { PromoBanner } from "@/lib/storefront/types";
import { normalizePromoBanners } from "@/lib/storefront/promoBannerSlots";
import { renderMultiline } from "@/lib/storefront/renderMultiline";

function EmptyBannerCard({ className }: { className?: string }) {
  return <div className={`banner-card banner-card--empty ${className ?? ""}`.trim()} aria-hidden />;
}

function BannerCard({ banner, className }: { banner: PromoBanner; className: string }) {
  const hasContent = banner.image || banner.title || banner.subtitle || banner.linkLabel;

  if (!hasContent) {
    return <EmptyBannerCard className={className} />;
  }

  return (
    <Link href={banner.href || "/shop"} className={className}>
      {banner.image ? <img src={banner.image} alt="" loading="lazy" /> : null}
      <div className="banner-card-content">
        {banner.subtitle ? <span className="banner-card-subtitle">{banner.subtitle}</span> : null}
        {banner.title ? <h3>{renderMultiline(banner.title)}</h3> : null}
        {banner.linkLabel ? <span className="banner-card-link">{banner.linkLabel}</span> : null}
      </div>
    </Link>
  );
}

function BannerRow({ slots }: { slots: PromoBanner[] }) {
  const [tall, small1, small2, wide] = slots;

  return (
    <div className="banner-grid">
      {tall?.image || tall?.title ? (
        <BannerCard banner={tall} className="banner-card tall" />
      ) : (
        <EmptyBannerCard className="tall" />
      )}
      <div className="banner-right">
        <div className="banner-right-top">
          {small1?.image || small1?.title ? (
            <BannerCard banner={small1} className="banner-card" />
          ) : (
            <EmptyBannerCard />
          )}
          {small2?.image || small2?.title ? (
            <BannerCard banner={small2} className="banner-card" />
          ) : (
            <EmptyBannerCard />
          )}
        </div>
        {wide?.image || wide?.title ? (
          <BannerCard banner={wide} className="banner-card" />
        ) : (
          <EmptyBannerCard />
        )}
      </div>
    </div>
  );
}

type MuraiBannerGridProps = {
  banners: PromoBanner[];
};

/** Always renders two rows (8 slots) of the MuRa banner grid. */
export default function MuraiBannerGrid({ banners }: MuraiBannerGridProps) {
  const slots = normalizePromoBanners(banners);
  const row1 = slots.slice(0, 4);
  const row2 = slots.slice(4, 8);

  return (
    <section className="banner-section">
      <BannerRow slots={row1} />
      <BannerRow slots={row2} />
    </section>
  );
}
