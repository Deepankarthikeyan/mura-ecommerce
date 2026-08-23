import Link from "next/link";

export default function MuraiFooter() {
  return (
    <footer className="suruchi-footer">
      <div className="suruchi-footer-grid">
        <div>
          <Link href="/" className="suruchi-logo footer-logo" aria-label="MuRa@23">
            <img src="/murai/images/mura-newlogo.png" alt="MuRa@23" width={108} height={67} loading="lazy" />
          </Link>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            India&apos;s finest sale sarees — silk, cotton, Banarasi, Kanjivaram and designer sarees at unbeatable prices.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Saree Types</h4>
          <ul>
            <li><Link href="/shop?category=silk">Silk Sarees</Link></li>
            <li><Link href="/shop?category=cotton">Cotton Sarees</Link></li>
            <li><Link href="/shop?category=kanjivaram">Banarasi</Link></li>
            <li><Link href="/shop?category=kanjivaram">Kanjivaram</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:murapodanur@gmail.com">murapodanur@gmail.com</a></li>
            <li><a href="tel:02123333444">02 123 333 444</a></li>
            <li><Link href="/contact">Podanur, Tamil Nadu, India</Link></li>
          </ul>
        </div>
      </div>
      <div className="suruchi-footer-bottom">
        <p>&copy; 2026 MuRa@23. All rights reserved. Handcrafted with love in India.</p>
      </div>
    </footer>
  );
}
