'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { parseMoneyAmount } from '@/lib/shopProductDisplay';

function normalizeCartUnitPrice(raw: unknown): number {
  return parseMoneyAmount(raw as string | number | null | undefined) ?? 0;
}

interface CartItem {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
  active: boolean; // true = cart, false = wishlist
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  addToWishlist: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isCartLoaded: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart) as CartItem[];
        setCartItems(
          parsed.map((row) => ({
            ...row,
            price: normalizeCartUnitPrice(row.price),
          }))
        );
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    setIsCartLoaded(true);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isCartLoaded]);

  // Add item to cart (active: true)
  const addToCart = (item: CartItem) => {
    const normalized: CartItem = {
      ...item,
      price: normalizeCartUnitPrice(item.price),
    };
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === normalized.id && i.active === true);
      if (existing) {
        return prev.map((i) =>
          i.id === normalized.id && i.active === true
            ? { ...i, quantity: i.quantity + normalized.quantity }
            : i
        );
      } else {
        return [...prev, normalized];
      }
    });
  };

  // Add item to wishlist (active: false)
  const addToWishlist = (item: CartItem) => {
    const normalized: CartItem = {
      ...item,
      price: normalizeCartUnitPrice(item.price),
    };
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === normalized.id && i.active === false);
      if (existing) {
        return prev.map((i) =>
          i.id === normalized.id && i.active === false
            ? { ...i, quantity: i.quantity + normalized.quantity }
            : i
        );
      } else {
        return [...prev, normalized];
      }
    });
  };

  // Remove item by ID
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity (cart or wishlist)
  const updateItemQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Clear all cart items
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addToWishlist,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        isCartLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
