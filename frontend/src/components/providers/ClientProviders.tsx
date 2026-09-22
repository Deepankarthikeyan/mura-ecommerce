'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CartProvider } from "../header/CartContext";
import { WishlistProvider } from "../header/WishlistContext";
import { CompareProvider } from "../header/CompareContext";
import { UserProvider } from "../header/UserContext";
import { ToastContainer } from "react-toastify";

function AppToastContainer() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <ToastContainer
      position={isMobile ? "top-center" : "top-right"}
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      style={{ zIndex: 100000 }}
    />,
    document.documentElement
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CompareProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
            <AppToastContainer />
          </CartProvider>
        </WishlistProvider>
      </CompareProvider>
    </UserProvider>
  );
}
