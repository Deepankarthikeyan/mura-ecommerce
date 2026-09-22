import Link from "next/link";

export default function MuraiBannerGrid() {
  return (
    <section className="banner-section">
      <div className="banner-grid">
        <Link href="/shop" className="banner-card tall">
          <img src="/murai/sarees/banarasi.webp" alt="Silk Saree Sale" loading="lazy" decoding="async" />
          <div className="banner-card-content">
            <h3>
              Silk Saree
              <br />
              Sale
            </h3>
            <span className="banner-card-link">Shop Now →</span>
          </div>
        </Link>
        <div className="banner-right">
          <div className="banner-right-top">
            <Link href="/shop" className="banner-card">
              <img src="/murai/sarees/paithani.webp" alt="Banarasi Sarees" loading="lazy" decoding="async" />
              <div className="banner-card-content">
                <span className="banner-card-subtitle">Banarasi</span>
                <h3>Banarasi Sarees</h3>
                <span className="banner-card-link">Shop Now →</span>
              </div>
            </Link>
            <Link href="/shop" className="banner-card">
              <img src="/murai/sarees/cotton-block.webp" alt="Cotton Sarees" loading="lazy" decoding="async" />
              <div className="banner-card-content">
                <span className="banner-card-subtitle">Cotton Sarees</span>
                <h3>
                  Free Shipping Over
                  <br />
                  Order ₹999
                </h3>
                <span className="banner-card-link">Shop Now →</span>
              </div>
            </Link>
          </div>
          <Link href="/shop" className="banner-card">
            <img src="/murai/sarees/kanjivaram.webp" alt="Kanjivaram Sarees" loading="lazy" decoding="async" />
            <div className="banner-card-content">
              <h3>
                Kanjivaram Silk
                <br />
                Saree Sale
              </h3>
              <span className="banner-card-link">Shop Now →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
