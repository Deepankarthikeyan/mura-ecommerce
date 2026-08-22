import Link from "next/link";

const BANNERS = [
  {
    href: "/shop",
    image: "/assets/images/murai/sarees/banarasi.webp",
    alt: "Silk Saree Sale",
    subtitle: "40% Off",
    title: (
      <>
        Silk Saree
        <br />
        Sale
      </>
    ),
    className: "banner-card tall",
  },
  {
    href: "/shop",
    image: "/assets/images/murai/sarees/paithani.webp",
    alt: "Banarasi Sarees",
    subtitle: "Banarasi",
    title: (
      <>
        Up to 50% Off
        <br />
        Banarasi Sarees
      </>
    ),
    className: "banner-card",
  },
  {
    href: "/shop",
    image: "/assets/images/murai/sarees/cotton-block.webp",
    alt: "Cotton Sarees",
    subtitle: "Cotton Sarees",
    title: (
      <>
        Free Shipping Over
        <br />
        Order ₹999
      </>
    ),
    className: "banner-card",
  },
  {
    href: "/shop",
    image: "/assets/images/murai/sarees/kanjivaram.webp",
    alt: "Kanjivaram Sarees",
    subtitle: "35% Off",
    title: (
      <>
        Kanjivaram Silk
        <br />
        Saree Sale
      </>
    ),
    className: "banner-card",
  },
];

export default function HomeBannerGrid() {
  const [tall, topLeft, topRight, bottom] = BANNERS;

  return (
    <section className="banner-section">
      <div className="banner-grid">
        <Link href={tall.href} className={tall.className}>
          <img src={tall.image} alt={tall.alt} loading="lazy" decoding="async" />
          <div className="banner-card-content">
            <span className="banner-card-subtitle">{tall.subtitle}</span>
            <h3>{tall.title}</h3>
            <span className="banner-card-link">View Discounts →</span>
          </div>
        </Link>
        <div className="banner-right">
          <div className="banner-right-top">
            {[topLeft, topRight].map((banner) => (
              <Link key={banner.alt} href={banner.href} className={banner.className}>
                <img src={banner.image} alt={banner.alt} loading="lazy" decoding="async" />
                <div className="banner-card-content">
                  <span className="banner-card-subtitle">{banner.subtitle}</span>
                  <h3>{banner.title}</h3>
                  <span className="banner-card-link">View Discounts →</span>
                </div>
              </Link>
            ))}
          </div>
          <Link href={bottom.href} className={bottom.className}>
            <img src={bottom.image} alt={bottom.alt} loading="lazy" decoding="async" />
            <div className="banner-card-content">
              <span className="banner-card-subtitle">{bottom.subtitle}</span>
              <h3>{bottom.title}</h3>
              <span className="banner-card-link">View Discounts →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
