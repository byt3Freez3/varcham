import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types';
import { useToast } from '@/context/ToastContext';

interface WishlistContextValue {
  items: string[]; // productIds
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('varcham_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('varcham_wishlist', JSON.stringify(items));
  }, [items]);

  const toggleWishlist = (product: Product) => {
    setItems((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast({ message: `Removed ${product.name} from wishlist` });
        return prev.filter((id) => id !== product.id);
      }
      showToast({
        message: `Saved ${product.name} to wishlist`,
        actionLabel: 'View',
        actionTo: '/account?tab=wishlist',
      });
      return [...prev, product.id];
    });
  };

  const isWishlisted = (productId: string) => items.includes(productId);
  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

