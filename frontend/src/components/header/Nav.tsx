"use client";

import Link from "next/link";
import { useState } from "react";
import { SAREE_CATEGORIES } from "@/lib/storefront/sareeCategories";

function NavItem() {
  const [hoveredSareeKey, setHoveredSareeKey] = useState(SAREE_CATEGORIES[0].key);
  const hoveredSaree =
    SAREE_CATEGORIES.find((cat) => cat.key === hoveredSareeKey) ?? SAREE_CATEGORIES[0];

  return (
    <div>
      <nav>
        <ul className="parent-nav">
          <li className="parent with-megamenu">
            <Link href="/shop">Sarees</Link>
            <div className="rts-megamenu">
              <div className="wrapper">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <div className="megamenu-item-wrapper">
                      <div className="single-megamenu-wrapper">
                        <p className="title">Saree Categories</p>
                        <ul>
                          {SAREE_CATEGORIES.map((cat) => (
                            <li key={cat.key}>
                              <Link
                                className="sub-b"
                                href={`/shop?category=${cat.key}`}
                                onMouseEnter={() => setHoveredSareeKey(cat.key)}
                                onFocus={() => setHoveredSareeKey(cat.key)}
                              >
                                {cat.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <Link href={`/shop?category=${hoveredSaree.key}`} className="feature-add-megamenu-area">
                      <img src={hoveredSaree.image} alt={hoveredSaree.label} />
                    </Link>
                  </div>
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
