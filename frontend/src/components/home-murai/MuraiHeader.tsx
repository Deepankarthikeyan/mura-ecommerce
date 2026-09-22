"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/header/CartContext";
import { useUser } from "@/components/header/UserContext";
import LoginDialog from "@/components/auth/LoginDialog";
import RegisterDialog, {
  type RegistrationReadyPayload,
} from "@/components/auth/RegisterDialog";
import AddressDialog from "@/components/auth/AddressDialog";
import { getDashboardPrefix } from "@/lib/dashboardPaths";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "shop", label: "Shop", href: "/shop" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

function isNavActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MuraiHeader() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { cartItems } = useCart();
  const { user, isAuthenticated } = useUser();
  const mountRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navFixed, setNavFixed] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Sarees");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [signupContinue, setSignupContinue] = useState<RegistrationReadyPayload | null>(null);

  const cartCount = cartItems.filter((item) => item.active).reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const update = () => {
      const mount = mountRef.current;
      if (!mount) return;
      const scrolled = mount.getBoundingClientRect().bottom <= 0;
      setNavFixed(scrolled);
      if (spacerRef.current) {
        spacerRef.current.style.height =
          scrolled && window.innerWidth > 768 ? `${navRef.current?.offsetHeight ?? 0}px` : "0";
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const root = mountRef.current?.closest(".murai-home");
    root?.classList.toggle("menu-open", menuOpen);
    root?.classList.toggle("nav-is-fixed", navFixed);
    root?.classList.toggle("search-open", searchOpen);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      root?.classList.remove("menu-open");
      root?.classList.remove("nav-is-fixed");
      root?.classList.remove("search-open");
      document.body.style.overflow = "";
    };
  }, [menuOpen, navFixed, searchOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 992) setMenuOpen(false);
      if (window.innerWidth > 992) setSearchOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category !== "All Sarees") params.set("category", category);
    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
    setSearchOpen(false);
  };

  return (
    <>
      <div id="site-header-mount" ref={mountRef}>
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
          <Link href="/" className="suruchi-logo" aria-label="MuRa@23 Home">
            <img src="/murai/mura-newlogo.png" alt="MuRa@23" width={129} height={80} decoding="async" />
          </Link>
          <form id="suruchi-search" className={`suruchi-search${searchOpen ? " is-open" : ""}`} onSubmit={onSearch}>
            <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All Sarees</option>
              <option>Silk Sarees</option>
              <option>Cotton Sarees</option>
              <option>Banarasi</option>
              <option>Kanjivaram</option>
              <option>Party Wear</option>
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
            <button
              type="button"
              className={`suruchi-header-action suruchi-search-toggle${searchOpen ? " is-open" : ""}`}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              aria-controls="suruchi-search"
              onClick={() => {
                setSearchOpen((open) => !open);
                setMenuOpen(false);
              }}
            >
              {searchOpen ? (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              )}
            </button>
            {isAuthenticated && user ? (
              <Link href={getDashboardPrefix(user.userType)} className="suruchi-header-action">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
                <span>My Account</span>
              </Link>
            ) : (
              <button
                type="button"
                className="suruchi-header-action"
                onClick={() => setIsLoginDialogOpen(true)}
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
                <span>My Account</span>
              </button>
            )}
            {/* <Link href="/wishlist" className="suruchi-header-action">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span>Wish List</span>
            </Link> */}
            <Link href="/cart" className="suruchi-header-action">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <span>My Cart</span>
              {cartCount > 0 ? <span className="suruchi-badge cart-count">{cartCount}</span> : null}
            </Link>
            <button
              className="suruchi-mobile-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              type="button"
              onClick={() => {
                setMenuOpen((open) => !open);
                setSearchOpen(false);
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`suruchi-nav${menuOpen ? " open" : ""}${navFixed ? " is-scrolled" : ""}`}
        id="suruchi-nav"
        ref={navRef}
      >
        <div className="suruchi-nav-inner">
          <div className="suruchi-nav-header">
            <Link href="/" className="suruchi-nav-logo" aria-label="MuRa@23 Home">
              <img src="/murai/mura-newlogo.png" alt="MuRa@23" width={97} height={60} decoding="async" />
            </Link>
            <button className="suruchi-nav-close" aria-label="Close menu" type="button" onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className={isNavActive(item.href, pathname) ? "active" : ""} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div
        className={`nav-overlay${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />
      <div className="suruchi-nav-spacer" aria-hidden="true" ref={spacerRef} />
      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSwitchToRegister={() => setIsRegisterDialogOpen(true)}
      />
      <RegisterDialog
        isOpen={isRegisterDialogOpen}
        onClose={() => setIsRegisterDialogOpen(false)}
        onSwitchToLogin={() => setIsLoginDialogOpen(true)}
        onRegisterSuccess={(payload) => {
          setSignupContinue(payload);
          setIsRegisterDialogOpen(false);
          setIsAddressDialogOpen(true);
        }}
      />
      <AddressDialog
        isOpen={isAddressDialogOpen}
        onClose={() => {
          setIsAddressDialogOpen(false);
          setSignupContinue(null);
        }}
        userEmail={signupContinue?.email ?? ""}
        registrationToken={signupContinue?.registrationToken}
        signupPassword={signupContinue?.password}
        onSwitchToLogin={() => {
          setSignupContinue(null);
          setIsAddressDialogOpen(false);
          setIsLoginDialogOpen(true);
        }}
      />
    </>
  );
}
