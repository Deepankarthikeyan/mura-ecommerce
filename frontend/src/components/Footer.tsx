import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

const SAREE_TYPES = [
  { label: "Silk Sarees", href: "/shop" },
  { label: "Cotton Sarees", href: "/shop" },
  { label: "Banarasi", href: "/shop" },
  { label: "Kanjivaram", href: "/shop" },
];

function FooterOne() {
  return (
    <footer className="suruchi-footer">
      <div className="suruchi-footer-grid">
        <div>
          <Link href="/" className="suruchi-logo footer-logo" aria-label="MuRa@23">
            <img
              src="/assets/images/murai/mura-newlogo.png"
              alt="MuRa@23"
              width={108}
              height={67}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            India&apos;s finest sale sarees — silk, cotton, Banarasi, Kanjivaram and designer sarees at unbeatable prices.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Saree Types</h4>
          <ul>
            {SAREE_TYPES.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:murapodanur@gmail.com">murapodanur@gmail.com</a>
            </li>
            <li>
              <a href="tel:02123333444">02 123 333 444</a>
            </li>
            <li>
              <Link href="/contact">Podanur, Tamil Nadu, India</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="suruchi-footer-bottom">
        <p>&copy; {new Date().getFullYear()} MuRa@23. All rights reserved. Handcrafted with love in India.</p>
      </div>
    </footer>
  );
}

export default FooterOne;
