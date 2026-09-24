import Link from "next/link";

export default function MuraiFooter() {
  return (
    <footer className="suruchi-footer">
      <div className="suruchi-footer-grid">
        <div className="suruchi-footer-brand">
          <Link href="/" className="suruchi-logo footer-logo" aria-label="MuRa@23">
            <img src="/murai/mura-newlogo.png" alt="MuRa@23" width={120} height={74} loading="lazy" decoding="async" />
          </Link>
          <p>
            India&apos;s finest sale sarees — silk, cotton, Banarasi, Kanjivaram and designer sarees at unbeatable prices.
          </p>
        </div>
        <div className="suruchi-footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-condition">Terms &amp; Conditions</Link></li>
            <li><Link href="/shipping-policy">Shipping &amp; Returns</Link></li>
          </ul>
        </div>
        <div className="suruchi-footer-col">
          <h4>Saree Types</h4>
          <ul>
            <li><Link href="/shop">Silk Sarees</Link></li>
            <li><Link href="/shop">Cotton Sarees</Link></li>
            <li><Link href="/shop">Banarasi</Link></li>
            <li><Link href="/shop">Kanjivaram</Link></li>
          </ul>
        </div>
        <div className="suruchi-footer-col">
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
