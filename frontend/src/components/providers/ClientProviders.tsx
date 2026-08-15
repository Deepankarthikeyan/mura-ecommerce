'use client';

import React from 'react';
import { CartProvider } from "../header/CartContext";
import { WishlistProvider } from "../header/WishlistContext";
import { CompareProvider } from "../header/CompareContext";
import { UserProvider } from "../header/UserContext";
import { ToastContainer } from "react-toastify";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CompareProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </CartProvider>
        </WishlistProvider>
      </CompareProvider>
    </UserProvider>
  );
}
