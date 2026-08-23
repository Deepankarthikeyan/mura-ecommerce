"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/header/CartContext";
import { useUser } from "@/components/header/UserContext";
import { useWishlist } from "@/components/header/WishlistContext";

const NAV = [
  { href: "/", label: "Home", id: "home" },
  { href: "/shop", label: "Shop", id: "shop" },
  { href: "/about", label: "About", id: "about" },
  { href: "/contact", label: "Contact", id: "contact" },
  { href: "/login", label: "Login", id: "login" },
];

type MuraiHeaderProps = {
  activePage?: string;
};

export default function MuraiHeader({ activePage }: MuraiHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { isAuthenticated, user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const cartCount = cartItems.filter((i) => i.active).reduce((s, i) => s + i.quantity, 0);
  const wishCount = wishlistItems.length;

  const pageId =
    activePage ??
    (pathname === "/" ? "home" : pathname?.split("/")[1] ?? "home");

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const mount = document.getElementById("site-header-mount");
    const nav = document.getElementById("suruchi-nav");
    if (!mount || !nav) return;

    const onScroll = () => {
      const scrolled = mount.getBoundingClientRect().bottom <= 0;
      nav.classList.toggle("is-scrolled", scrolled);
      document.body.classList.toggle("nav-is-fixed", scrolled);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <>
      <div id="site-header-mount">
        <div className="suruchi-topbar">
          <div className="suruchi-topbar-inner">
            <div className="suruchi-topbar-left">
              <span>Big Saree Sale — Up to 70% Off</span>
              <Link href="/shop">Shop Sale Sarees</Link>
              <a href="mailto:murapodanur@gmail.com">murapodanur@gmail.com</a>
            </div>
            <div className="suruchi-topbar-right">
              <a href="#">English ▾</a>
              <a href="#">₹ INR ▾</a>
            </div>
          </div>
        </div>

        <div className="suruchi-header-main">
        <button
          className="suruchi-mobile-toggle"
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/" className="suruchi-logo" aria-label="MuRa@23 Home">
          <img src="/murai/images/mura-newlogo.png" alt="MuRa@23" width={129} height={80} />
        </Link>

        <form className="suruchi-search" onSubmit={onSearch}>
          <select aria-label="Category" defaultValue="all">
            <option>All Sarees</option>
            <option>Silk Sarees</option>
            <option>Cotton Sarees</option>
            <option>Banarasi</option>
            <option>Kanjivaram</option>
          </select>
          <input
            type="text"
            placeholder="Search sarees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </form>

        <div className="suruchi-header-actions">
          <Link href={isAuthenticated ? "/account" : "/login"} className="suruchi-header-action">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
            <span>{isAuthenticated && user ? user.username : "My Account"}</span>
          </Link>
          <Link href="/wishlist" className="suruchi-header-action">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span>Wish List</span>
            {wishCount > 0 ? <span className="suruchi-badge">{wishCount}</span> : null}
          </Link>
          <Link href="/cart" className="suruchi-header-action">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <span>My Cart</span>
            <span className="suruchi-badge cart-count" style={{ display: cartCount > 0 ? "flex" : "none" }}>
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
      </div>

      <div className={`nav-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} aria-hidden />

      <nav className={`suruchi-nav ${menuOpen ? "open" : ""}`} id="suruchi-nav">
        <div className="suruchi-nav-inner">
          <div className="suruchi-nav-header">
            <Link href="/" className="suruchi-nav-logo" onClick={() => setMenuOpen(false)}>
              <img src="/murai/images/mura-newlogo.png" alt="MuRa@23" width={97} height={60} />
            </Link>
            <button className="suruchi-nav-close" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={pageId === item.id ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="suruchi-nav-spacer" aria-hidden />
    </>
  );
}
