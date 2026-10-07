import Link from "next/link";
import { SAREE_MEGA_MENU } from "./sareeMegaMenu";

function CategoryCard({ item, tall = false }: { item: (typeof SAREE_MEGA_MENU)[number]; tall?: boolean }) {
  return (
    <Link href={item.href} className={`banner-card${tall ? " tall" : ""}`}>
      <img src={item.image} alt={item.label} loading="lazy" decoding="async" />
      <div className="banner-card-content">
        <h3>{item.label}</h3>
        <span className="banner-card-link">Shop Now →</span>
      </div>
    </Link>
  );
}

export default function MuraiBannerGrid() {
  return (
    <section className="banner-section" aria-label="Shop saree categories">
      <div className="banner-grid">
        <div className="banner-left">
          <CategoryCard item={SAREE_MEGA_MENU[0]} tall />
        </div>
        <div className="banner-right">
          {SAREE_MEGA_MENU.slice(1).map((item) => (
            <CategoryCard key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
