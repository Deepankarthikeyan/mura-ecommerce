"use client";

import Link from "next/link";
import { SAREE_CATEGORIES } from "@/lib/storefront/sareeCategories";

function NavItem() {
  return (
    <div>
      <nav>
        <ul className="parent-nav">
          <li className="parent with-megamenu">
            <Link href="/shop">Sarees</Link>
            <div className="rts-megamenu">
              <div className="wrapper">
                <div className="suruchi-sarees-grid nav-sarees-grid">
                  {SAREE_CATEGORIES.map((cat) => (
                    <Link key={cat.key} href={`/shop?category=${cat.key}`} className="suruchi-saree-card">
                      <img src={cat.image} alt={cat.label} loading="lazy" />
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavItem;
