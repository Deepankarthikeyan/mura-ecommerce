"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getDashboardPrefix } from "@/lib/dashboardPaths";
import LoginDialog from "@/components/auth/LoginDialog";
import RegisterDialog, { type RegistrationReadyPayload } from "@/components/auth/RegisterDialog";
import AddressDialog from "@/components/auth/AddressDialog";
import { useCart } from "@/components/header/CartContext";
import { useUser } from "@/components/header/UserContext";
import BackToTop from "@/components/common/BackToTop";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/" },
  { id: "shop", label: "Shop", href: "/shop" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

function SearchIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function MuraiSiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const { cartItems } = useCart();
  const navRef = useRef<HTMLElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [signupContinue, setSignupContinue] = useState<RegistrationReadyPayload | null>(null);

  const cartItemCount = cartItems
    .filter((item) => item.active)
    .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const activePage = (() => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/shop")) return "shop";
    if (pathname.startsWith("/about")) return "about";
    if (pathname.startsWith("/contact")) return "contact";
    if (pathname.startsWith("/login")) return "login";
    return "";
  })();

  useEffect(() => {
    const onScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      const navTop = nav.getBoundingClientRect().top + window.scrollY;
      setNavScrolled(window.scrollY >= navTop - 1);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-is-fixed", navScrolled);
    return () => document.body.classList.remove("nav-is-fixed");
  }, [navScrolled]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const accountHref = isAuthenticated && user ? getDashboardPrefix(user.userType) : undefined;

  return (
    <div id="site-header-mount" className="site-header-sticky">
      <div className="suruchi-topbar">
        <div className="suruchi-topbar-inner">
          <div className="suruchi-topbar-left">
            <span>Big Saree Sale — Up to 70% Off</span>
            <Link href="/shop">Shop Sale Sarees</Link>
            <a href="mailto:murapodanur@gmail.com">murapodanur@gmail.com</a>
          </div>
          <div className="suruchi-topbar-right">
            <span>English</span>
            <span>₹ INR</span>
          </div>
        </div>
      </div>

      <div className="suruchi-header-main">
        <button
          className="suruchi-mobile-toggle"
          type="button"
          aria-label="Open menu"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((open) => !open)}
        >
          <MenuIcon />
        </button>

        <Link href="/" className="suruchi-logo" aria-label="MuRa@23 Home">
          <img
            src="/assets/images/murai/mura-newlogo.png"
            alt="MuRa@23"
            width={129}
            height={80}
            decoding="async"
          />
        </Link>

        <form className="suruchi-search" onSubmit={handleSearch}>
          <select aria-label="Category" defaultValue="all">
            <option value="all">All Sarees</option>
            <option value="silk">Silk Sarees</option>
            <option value="cotton">Cotton Sarees</option>
            <option value="banarasi">Banarasi</option>
            <option value="kanjivaram">Kanjivaram</option>
          </select>
          <input
            type="text"
            placeholder="Search sarees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        <div className="suruchi-header-actions">
          {accountHref ? (
            <Link href={accountHref} className="suruchi-header-action">
              <UserIcon />
              <span>Hi, {user?.username}</span>
            </Link>
          ) : (
            <button
              type="button"
              className="suruchi-header-action"
              onClick={() => setIsLoginDialogOpen(true)}
              suppressHydrationWarning
            >
              <UserIcon />
              <span>My Account</span>
            </button>
          )}
          <Link href="/wishlist" className="suruchi-header-action">
            <HeartIcon />
            <span>Wish List</span>
          </Link>
          <Link href="/cart" className="suruchi-header-action">
            <CartIcon />
            <span>My Cart</span>
            {cartItemCount > 0 && (
              <span className="suruchi-badge cart-count" style={{ display: "flex" }}>
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div
        className={`nav-overlay${navOpen ? " open" : ""}`}
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
      />

      <nav
        ref={navRef}
        className={`suruchi-nav${navScrolled ? " is-scrolled" : ""}${navOpen ? " open" : ""}`}
        id="suruchi-nav"
      >
        <div className="suruchi-nav-inner">
          <Link href="/" className="suruchi-nav-logo" aria-label="MuRa@23">
            <img src="/assets/images/murai/mura-newlogo.png" alt="MuRa@23" width={108} height={67} />
          </Link>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={activePage === item.id ? "active" : ""}
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!isAuthenticated && (
              <li>
                <button
                  type="button"
                  className={activePage === "login" ? "active" : ""}
                  onClick={() => {
                    setNavOpen(false);
                    setIsLoginDialogOpen(true);
                  }}
                  style={{ background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
                  suppressHydrationWarning
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="suruchi-nav-spacer" aria-hidden="true" />

      <BackToTop />

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSwitchToRegister={() => setIsRegisterDialogOpen(true)}
      />
      <RegisterDialog
        isOpen={isRegisterDialogOpen}
        onClose={() => setIsRegisterDialogOpen(false)}
        onSwitchToLogin={() => setIsLoginDialogOpen(true)}
        onRegisterSuccess={(p) => {
          setSignupContinue(p);
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
    </div>
  );
}
