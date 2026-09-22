import Link from "next/link";

export default function MuraiPromoBanners() {
  return (
    <section className="promo-banners">
      <div className="promo-banner bg-1">
        <div>
          <h3>Sarees</h3>
          <p>Shop Silk & Cotton</p>
          <Link href="/shop" className="btn">
            Shop Now
          </Link>
        </div>
      </div>
      <div className="promo-banner bg-2">
        <div>
          <h3>Maheswari Sarees</h3>
          <p>Limited time sale</p>
          <Link href="/shop" className="btn">
            Discover Now
          </Link>
        </div>
      </div>
    </section>
  );
}
