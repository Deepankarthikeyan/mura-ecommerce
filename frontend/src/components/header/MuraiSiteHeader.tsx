"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDashboardPrefix } from "@/lib/dashboardPaths";
import LoginDialog from "@/components/auth/LoginDialog";
import RegisterDialog, { type RegistrationReadyPayload } from "@/components/auth/RegisterDialog";
import AddressDialog from "@/components/auth/AddressDialog";
import { useCart } from "@/components/header/CartContext";
import { useUser } from "@/components/header/UserContext";

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

function CloseIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function MuraiSiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const { cartItems } = useCart();

  const mountRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

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

  const updateNavFixed = useCallback((scrolled: boolean) => {
    setNavScrolled(scrolled);
    document.body.classList.toggle("nav-is-fixed", scrolled);

    const nav = navRef.current;
    const spacer = spacerRef.current;
    if (scrolled && window.innerWidth > 768 && nav && spacer) {
      spacer.style.height = `${nav.offsetHeight}px`;
    } else if (spacer) {
      spacer.style.height = "0";
    }
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateNavFixed(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(mount);

    const onScroll = () => {
      const scrolled = mount.getBoundingClientRect().bottom <= 0;
      updateNavFixed(scrolled);
    };

    const onResize = () => {
      if (document.body.classList.contains("nav-is-fixed")) {
        updateNavFixed(true);
      }
      if (window.innerWidth > 768) {
        setNavOpen(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("nav-is-fixed", "menu-open");
    };
  }, [updateNavFixed]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", navOpen);
    return () => {
      if (navOpen) document.body.classList.remove("menu-open");
    };
  }, [navOpen]);

  const closeMenu = () => setNavOpen(false);

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
              <option value="party">Party Wear</option>
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
              <span className="suruchi-badge cart-count" style={{ display: cartItemCount > 0 ? "flex" : "none" }}>
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`nav-overlay${navOpen ? " open" : ""}`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <nav
        ref={navRef}
        className={`suruchi-nav${navScrolled ? " is-scrolled" : ""}${navOpen ? " open" : ""}`}
        id="suruchi-nav"
      >
        <div className="suruchi-nav-inner">
          <div className="suruchi-nav-header">
            <Link href="/" className="suruchi-nav-logo" aria-label="MuRa@23 Home" onClick={closeMenu}>
              <img src="/assets/images/murai/mura-newlogo.png" alt="MuRa@23" width={97} height={60} decoding="async" />
            </Link>
            <button className="suruchi-nav-close" aria-label="Close menu" type="button" onClick={closeMenu}>
              <CloseIcon />
            </button>
          </div>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={activePage === item.id ? "active" : ""}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!isAuthenticated && (
              <li>
                <Link href="/login" className={activePage === "login" ? "active" : ""} onClick={closeMenu}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="suruchi-nav-spacer" ref={spacerRef} aria-hidden="true" />

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
    </>
  );
}
