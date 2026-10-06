import Link from "next/link";

const CATEGORIES = [
  { name: "Chanderi Saree", category: "Chanderi Saree", image: "/murai/categories/chanderi.webp" },
  { name: "Cotton Saree", category: "Cotton Saree", image: "/murai/categories/cotton.webp" },
  { name: "Handloom Saree", category: "Handloom Saree", image: "/murai/categories/handloom.webp" },
  { name: "Ikat Saree", category: "Ikat Saree", image: "/murai/categories/ikat.webp" },
  { name: "Kalamkari Saree", category: "Kalamkari Saree", image: "/murai/categories/kalamkari.webp" },
  { name: "Maheswari Saree", category: "Maheshwari Saree", image: "/murai/categories/maheswari.webp" },
  { name: "Narayanpet Saree", category: "Narayanpet Saree", image: "/murai/categories/narayanpet.webp" },
];

function CategoryCard({ item, tall = false }: { item: (typeof CATEGORIES)[number]; tall?: boolean }) {
  return (
    <Link href={`/shop?category=${encodeURIComponent(item.category)}`} className={`banner-card${tall ? " tall" : ""}`}>
      <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
      <div className="banner-card-content">
        <h3>{item.name}</h3>
        <span className="banner-card-link">Shop Now →</span>
      </div>
    </Link>
  );
}

export default function MuraiBannerGrid() {
  return (
    <section className="banner-section" aria-label="Shop saree categories">
      <div className="banner-grid">
        <CategoryCard item={CATEGORIES[0]} tall />
        <div className="banner-right">
          {CATEGORIES.slice(1).map((item) => (
            <CategoryCard key={item.category} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
