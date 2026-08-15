"use client";

import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Cart from './Cart';
import WishList from './WishList';
import { useCompare } from '@/components/header/CompareContext';
import { useUser } from '@/components/header/UserContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {theme} from "@/data/settings"
import { getDashboardPrefix } from "@/lib/dashboardPaths";
import LoginDialog from '@/components/auth/LoginDialog';
import RegisterDialog, {
    type RegistrationReadyPayload,
} from '@/components/auth/RegisterDialog';
import AddressDialog from '@/components/auth/AddressDialog';
import { useCart } from '@/components/header/CartContext';

// Menu links component for reuse
function HeaderMenuLinks({ isAuthenticated, user, onLoginClick }: { isAuthenticated: boolean; user: any; onLoginClick: () => void }) {
    return (
        <div className="header-menu-links flex items-center gap-4 text-lg">
            <Link href="/about" className="hover:text-[#1f72b0] transition-colors">About Us</Link>
            {isAuthenticated && user ? (
                <Link href={getDashboardPrefix(user.userType)} className="hover:text-[#1f72b0] transition-colors">
                    Hi, {user.username}
                </Link>
            ) : (
                <button
                    onClick={onLoginClick}
                    className="hover:text-[#1f72b0] transition-colors"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
                    suppressHydrationWarning
                >
                    My Account
                </button>
            )}
            <Link href="/wishlist" className="hover:text-[#1f72b0] transition-colors">Wishlist</Link>
            <Link href="/order-tracking" className="hover:text-[#1f72b0] transition-colors">Order Tracking</Link>
        </div>
    );
}

function HeaderSearch() {

    const { compareItems } = useCompare();
    const { user, isAuthenticated, logout } = useUser();
    const { cartItems } = useCart();
    const router = useRouter();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [signupContinue, setSignupContinue] =
        useState<RegistrationReadyPayload | null>(null);
    // counter down start
    useEffect(() => {
        const countDownElements = document.querySelectorAll<HTMLElement>('.countDown');
        const endDates: Date[] = [];

        countDownElements.forEach((el) => {
            const match = el.innerText.match(/([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/);
            if (!match) return;

            const end = new Date(+match[3], +match[1] - 1, +match[2], +match[4], +match[5], +match[6]);
            if (end > new Date()) {
                endDates.push(end);
                const next = calcTime(end.getTime() - new Date().getTime());
                el.innerHTML = renderDisplay(next);
            } else {
                el.innerHTML = `<p class="end">Sorry, your session has expired.</p>`;
            }
        });

        const interval = setInterval(() => {
            countDownElements.forEach((el, i) => {
                const end = endDates[i];
                if (!end) return;
                const now = new Date();
                const diff = end.getTime() - now.getTime();

                if (diff <= 0) {
                    el.innerHTML = `<p class="end">Sorry, your session has expired.</p>`;
                } else {
                    const next = calcTime(diff);
                    el.innerHTML = renderDisplay(next);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calcTime = (milliseconds: number) => {
        const secondsTotal = Math.floor(milliseconds / 1000);
        const days = Math.floor(secondsTotal / 86400);
        const hours = Math.floor((secondsTotal % 86400) / 3600);
        const minutes = Math.floor((secondsTotal % 3600) / 60);
        const seconds = secondsTotal % 60;
        return [days, hours, minutes, seconds].map((v) => v.toString().padStart(2, '0'));
    };

    const renderDisplay = (timeArr: string[]) => {
        return timeArr
            .map((item) => `<div class='container'><div class='a'><div>${item}</div></div></div>`)
            .join('');
    };

    // header sticky
    const [isSticky, setIsSticky] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleLogout = () => {
        logout();
        // UI will re-render automatically when auth state changes
    };

    const cartItemCount = cartItems
        .filter((item) => item.active)
        .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

    const handleMenuClick = () => {
        const sidebar = document.querySelector('.side-bar.header-two');
        if (sidebar) {
            sidebar.classList.toggle('show');
        }
    };

    const allSuggestions = [
        "Profitable business makes your profit Best Solution",
        "Details Profitable business makes your profit",
        "One Profitable business makes your profit",
        "Me Profitable business makes your profit",
        "Details business makes your profit",
        "Firebase business makes your profit",
        "Netlyfy business makes your profit",
        "Profitable business makes your profit",
        "Valuable business makes your profit",
        "System business makes your profit",
        "Profitables business makes your profit",
        "Content business makes your profit",
        "Dalivaring business makes your profit",
        "Staning business makes your profit",
        "Best business makes your profit",
        "cooler business makes your profit",
        "Best-one Profitable business makes your profit",
        "Super Fresh Meat",
        "Original Fresh frut",
        "Organic Fresh frut",
        "Lite Fresh frut"
    ];

    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            const filtered = allSuggestions.filter(item =>
                item.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchTerm]);

    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        router.push(`/shop?search=${encodeURIComponent(suggestion)}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false);
        } else {
            router.push('/shop');
        }
    };



    return <div className="bg-white">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="">
                        <div className='flex items-center justify-between gap-2 py-2 flex-nowrap w-100'>
                            {/* Logo */}
                            <Link href="/" className="flex-shrink-0 min-w-0" style={{ lineHeight: 0 }}>
                                <img
                                    src="/assets/images/logo/logo-1-jpg.jpeg"
                                    alt="logo-main"
                                    className="logo"
                                    width={180}
                                    height={90}
                                    style={{
                                        display: 'block',
                                        maxHeight: '52px',
                                        width: 'auto',
                                        height: 'auto',
                                    }}
                                />
                            </Link>
                            {/* Mobile: cart + menu (same row as logo) */}
                            <div className="d-flex d-lg-none align-items-center gap-2 flex-shrink-0">
                                <Link
                                    href="/cart"
                                    className="btn-border-only cart"
                                    style={{
                                        textDecoration: 'none',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        overflow: 'visible',
                                    }}
                                    aria-label="Shopping cart"
                                >
                                    <i
                                        className="fa-sharp fa-regular fa-cart-shopping"
                                        style={{ fontSize: '18px', lineHeight: 1 }}
                                        aria-hidden
                                    />
                                    {cartItemCount > 0 && (
                                        <span
                                            className="number cart-count-badge"
                                            aria-label="Items in cart"
                                            style={{
                                                position: 'absolute',
                                                top: '-4px',
                                                right: '-4px',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                borderRadius: '999px',
                                                minWidth: '18px',
                                                height: '18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '10px',
                                                fontWeight: 700,
                                                lineHeight: 1,
                                                padding: '0 4px',
                                                border: '2px solid #fff',
                                                boxSizing: 'border-box',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            {cartItemCount > 99 ? '99+' : cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                <div
                                    className="menu-btn"
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleMenuClick}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleMenuClick();
                                        }
                                    }}
                                    aria-label="Open menu"
                                >
                                    <svg width={20} height={16} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect y={14} width={20} height={2} fill="#1F1F25" />
                                        <rect y={7} width={20} height={2} fill="#1F1F25" />
                                        <rect width={20} height={2} fill="#1F1F25" />
                                    </svg>
                                </div>
                            </div>
                            {/* Desktop: cart + account */}
                            <div className='d-none d-lg-flex align-items-center gap-3 px-5 flex-shrink-0'>
                                <Cart />
                                {isAuthenticated && user ? (
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={getDashboardPrefix(user.userType)}
                                            className="btn-border-only account"
                                            style={{
                                                transition: 'all 0.3s ease',
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                textDecoration: 'none',
                                                border: '2px solid #1f72b0',
                                                color: '#1f72b0'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#1f72b0';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = '#1f72b0';
                                            }}
                                        >
                                            <i className="fa-light fa-user" />
                                            {user.username}
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="btn-border-only account"
                                            style={{
                                                marginLeft: '8px',
                                                transition: 'all 0.3s ease',
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                background: 'none',
                                                border: '2px solid #1f72b0',
                                                cursor: 'pointer',
                                                color: '#1f72b0'
                                            }}
                                            title="Logout"
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#1f72b0';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = '#1f72b0';
                                            }}
                                            suppressHydrationWarning
                                        >
                                            <i className="fa-light fa-sign-out" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsLoginDialogOpen(true)}
                                        className="btn-border-only account"
                                        style={{
                                            background: 'none',
                                            border: '2px solid #1f72b0',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            color: '#1f72b0'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#1f72b0';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#1f72b0';
                                        }}
                                        suppressHydrationWarning
                                    >
                                        <i className="fa-light fa-user" />
                                        Account
                                    </button>
                                )}
                            </div>
                        </div>                        
                        <div className="category-search-wrapper">
                            {/* <div className="location-area">
                                <div className="icon">
                                    <i className="fa-light fa-location-dot" />
                                </div>
                                <div className="information">
                                    <span>Your location</span>
                                    <p>Select Location</p>
                                </div>
                            </div> */}
                            {/* <form onSubmit={handleSubmit} className="search-header" autoComplete="off">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search for products, categories or brands"
                                    required
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                                />
                                <button type="submit" className={`rts-btn radious-sm with-icon ${theme?.primary}`}>
                                    <div className="btn-text">Search</div>
                                    <div className="arrow-icon">
                                        <i className="fa-light fa-magnifying-glass" />
                                    </div>
                                </button>

                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className="autocomplete-suggestions" style={{
                                        position: 'absolute',
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        marginTop: '4px',
                                        width: '100%',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        listStyleType: 'none',
                                        padding: 0,
                                        borderRadius: '4px',
                                    }}>
                                        {suggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                style={{
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                }}
                                                onMouseDown={(e) => e.preventDefault()} // prevent input blur
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </form> */}
                        </div>
                        {/* <div className="accont-wishlist-cart-area-header"> */}
                                {/* <Link href="/shop-compare" className="btn-border-only account compare-number">
                                <i className="fa-regular fa-code-compare"></i>
                                <span className="number">{compareItems.length}</span>
                                </Link> */}
                            {/* <WishList /> */}
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>

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
}

export default HeaderSearch