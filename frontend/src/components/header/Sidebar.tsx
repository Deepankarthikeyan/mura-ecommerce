"use client"
import Link from 'next/link';
import CategoryMenu from './CategoryMenu';
import MobileMenu from './MobileMenu';
import { useUser } from './UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginDialog from '@/components/auth/LoginDialog';
import RegisterDialog, {
    type RegistrationReadyPayload,
} from '@/components/auth/RegisterDialog';
import AddressDialog from '@/components/auth/AddressDialog';
import {theme} from "@/data/settings"
import { getDashboardPrefix } from "@/lib/dashboardPaths";

const navLinkStyle: React.CSSProperties = {
    color: "#2563eb",
    fontSize: "15px",
    textDecoration: "none",
    display: "block",
    padding: "10px 0",
    borderBottom: "1px solid #e0e7ff",
};

const disabledNavLinkStyle: React.CSSProperties = {
    ...navLinkStyle,
    color: "#64748b",
    cursor: "not-allowed",
    opacity: 0.85,
};

const Sidebar = () => {
    const { user, isAuthenticated, logout } = useUser();
    const router = useRouter();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [signupContinue, setSignupContinue] =
        useState<RegistrationReadyPayload | null>(null);

    // tab
    const [activeTab, setActiveTab] = useState<string>('tab1');




    const handleMenuClickClose = () => {
        const sidebar = document.querySelector('.side-bar.header-two');
        if (sidebar) {
            sidebar.classList.remove('show');
        }
    };


    const handleSearchClose = () => {
        const sidebar = document.querySelector('.search-input-area');
        if (sidebar) {
            sidebar.classList.remove('show');
        }
    };



    return (
        <div>
            <div id="side-bar" className="side-bar header-two">
                <button className="close-icon-menu" onClick={handleMenuClickClose}>
                    <i className="far fa-times" />
                </button>
                {/* <form action="#" className="search-input-area-menu mt--30">
                    <input type="text" placeholder="Search..." />
                    <button>
                        <i className="fa-light fa-magnifying-glass" />
                    </button>
                </form> */}
                {/* Mobile Header Links */}
                <div style={{
                    padding: "20px",
                    background: "#fff",
                    margin: "20px 0",
                    borderRadius: "8px",
                    border: "2px solid #e0e7ff"
                }}>
                    {/* User Profile Section */}
                    {isAuthenticated && user ? (
                        <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "10px",
                            paddingBottom: "15px",
                            borderBottom: "1px solid #c7d2fe",
                            marginBottom: "15px"
                        }}>
                            <i className="fa-light fa-user" style={{ color: "#2563eb", fontSize: "20px" }} />
                            <span style={{ color: "#1e3a8a", fontSize: "16px", fontWeight: "600" }}>
                                Hi, {user.username}
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setIsLoginDialogOpen(true);
                                handleMenuClickClose();
                            }}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                color: '#2563eb', 
                                padding: "0 0 15px 0",
                                fontSize: "16px",
                                textAlign: "left",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                width: "100%",
                                borderBottom: "1px solid #c7d2fe",
                                marginBottom: "15px"
                            }}
                        >
                            <i className="fa-light fa-user" style={{ fontSize: "20px" }} />
                            My Account
                        </button>
                    )}

                    {/* Navigation Links (visible, disabled) */}
                    <div>
                        <span
                            role="link"
                            aria-disabled="true"
                            style={disabledNavLinkStyle}
                        >
                            About Us
                        </span>
                        <span
                            role="link"
                            aria-disabled="true"
                            style={disabledNavLinkStyle}
                        >
                            Order Tracking
                        </span>
                        {isAuthenticated && user ? (
                            <Link
                                href={getDashboardPrefix(user.userType)}
                                onClick={handleMenuClickClose}
                                style={navLinkStyle}
                            >
                                My Account
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoginDialogOpen(true);
                                    handleMenuClickClose();
                                }}
                                style={{
                                    ...navLinkStyle,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    width: "100%",
                                }}
                            >
                                My Account
                            </button>
                        )}
                    </div>

                    {/* Social Links */}
                    <div style={{ marginTop: "15px" }}>
                        <span style={{ color: "#64748b", fontSize: "13px", display: "block", marginBottom: "10px" }}>Follow Us:</span>
                        <div style={{ display: "flex", gap: "15px" }}>
                            <a href="#" style={{ color: "#2563eb", fontSize: "18px" }}>
                                <i className="fa-brands fa-facebook-f" />
                            </a>
                            <a href="#" style={{ color: "#2563eb", fontSize: "18px" }}>
                                <i className="fa-brands fa-twitter" />
                            </a>
                            <a href="#" style={{ color: "#2563eb", fontSize: "18px" }}>
                                <i className="fa-regular fa-envelope" />
                            </a>
                            <a href="#" style={{ color: "#2563eb", fontSize: "18px" }}>
                                <i className="fa-brands fa-instagram" />
                            </a>
                            <a href="#" style={{ color: "#2563eb", fontSize: "18px" }}>
                                <i className="fa-brands fa-youtube" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* button area wrapper start */}
                <div style={{ padding: "0 20px 20px 20px" }}>
                    {isAuthenticated && user ? (
                        <button
                            onClick={() => {
                                logout();
                                handleMenuClickClose();
                            }}
                            style={{ 
                                width: "100%",
                                padding: "12px",
                                background: "#dc2626", 
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "15px",
                                fontWeight: "500"
                            }}
                        >
                            <i className="fa-light fa-sign-out" style={{ marginRight: "8px" }} />
                            Logout
                        </button>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <button
                                onClick={() => setIsLoginDialogOpen(true)}
                                style={{ 
                                    width: "100%",
                                    padding: "12px",
                                    background: "var(--color-primary, #629D23)", 
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "15px",
                                    fontWeight: "500"
                                }}
                            >
                                Sign In
                            </button>
                            <Link 
                                href="/register" 
                                onClick={handleMenuClickClose}
                                style={{ 
                                    width: "100%",
                                    padding: "12px",
                                    background: "#fff", 
                                    color: "var(--color-primary, #629D23)",
                                    border: "2px solid var(--color-primary, #629D23)",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    textAlign: "center",
                                    textDecoration: "none",
                                    display: "block"
                                }}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
                {/* button area wrapper end */}
            </div>
            <div className="search-input-area">
                <div className="container">
                    <div className="search-input-inner">
                    <div className="input-div">
                        <input
                        id="searchInput1"
                        className="search-input"
                        type="text"
                        placeholder="Search by keyword or #"
                        />
                        <button>
                        <i className="far fa-search" />
                        </button>
                    </div>
                    </div>
                </div>
                <div id="close" className="search-close-icon" onClick={handleSearchClose}>
                    <i className="far fa-times" />
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
    )
}

export default Sidebar