import Link from "next/link";

export default function HomePromoBanners() {
  return (
    <section className="promo-banners">
      <div className="promo-banner bg-1">
        <div>
          <h3>
            Up to 50% Off
            <br />
            Sarees
          </h3>
          <p>Shop Silk &amp; Cotton</p>
          <Link href="/shop" className="btn">
            Shop Now
          </Link>
        </div>
      </div>
      <div className="promo-banner bg-2">
        <div>
          <h3>
            Up to 70% Off
            <br />
            Sarees
          </h3>
          <p>Limited time sale</p>
          <Link href="/shop" className="btn">
            Discover Now
          </Link>
        </div>
      </div>
    </section>
  );
}
