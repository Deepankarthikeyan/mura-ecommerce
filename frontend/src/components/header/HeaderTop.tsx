"use client"
import {theme} from "@/data/settings"
import { useUser } from './UserContext';
import { useState } from 'react';
import LoginDialog from '@/components/auth/LoginDialog';
import RegisterDialog, {
    type RegistrationReadyPayload,
} from '@/components/auth/RegisterDialog';
import AddressDialog from '@/components/auth/AddressDialog';

function XPlatformIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="16"
            height="16"
            aria-hidden="true"
            style={{ display: 'block' }}
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function HeaderTop() {
    const { user, isAuthenticated } = useUser();
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [signupContinue, setSignupContinue] =
        useState<RegistrationReadyPayload | null>(null);

    return <div className={`p-3 ${theme?.primary} d-none d-lg-block`}>
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="bwtween-area-header-top header-top-style-four" style={{ justifyContent: 'center' }}>
                        <div className="follow-us-social" style={{ margin: '0 auto' }}>
                            <span>Follow Us:</span>
                            <div className="social">
                                <a
                                    href="https://www.facebook.com/profile.php?id=61551352461006"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    style={{ transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                                >
                                    <i className="fa-brands fa-facebook-f" />
                                </a>
                                <a
                                    href="https://www.instagram.com/aathithya.herbal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    style={{ transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                                >
                                    <i className="fa-brands fa-instagram" />
                                </a>
                                <a
                                    href="https://www.youtube.com/@AathithyaHerbal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    style={{ transition: 'all 0.3s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                                >
                                    <i className="fa-brands fa-youtube" />
                                </a>
                                <a
                                    href="https://x.com/HerbalAathithya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X"
                                    style={{ transition: 'all 0.3s ease', color: '#fff', display: 'inline-flex', alignItems: 'center' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                                >
                                    <XPlatformIcon />
                                </a>
                            </div>
                        </div>
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

export default HeaderTop