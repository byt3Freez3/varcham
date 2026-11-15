import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORE_INFO } from '@/data/store';
import { CartItem, Product, ProductVariant } from '@/types';
import { useToast } from '@/context/ToastContext';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  bellSwing: boolean;
  giftWrap: boolean;
  setGiftWrap: (enabled: boolean) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  couponCode: string;
  couponDiscount: number;
  applyCouponState: (code: string, discount: number) => void;
  clearCoupon: () => void;
  itemCount: number;
  subtotal: number;
  freeKolkataRemaining: number;
  freeKolkataProgress: number;
  addItem: (product: Product, variant?: ProductVariant, qty?: number, openDrawer?: boolean) => void;
  addMultipleItems: (
    entries: { product: Product; variant?: ProductVariant; qty: number }[],
    kitDiscountPercent?: number
  ) => void;
  updateQty: (sku: string, qty: number) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('varcham_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [bellSwing, setBellSwing] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('varcham_cart', JSON.stringify(items));
  }, [items]);

  const triggerBellSwing = () => {
    setBellSwing(true);
    setTimeout(() => setBellSwing(false), 450);
  };

  const addItem = (
    product: Product,
    variant?: ProductVariant,
    qty = 1,
    openDrawer = true
  ) => {
    const selectedVariant = variant ?? product.variants[0];
    if (!selectedVariant || selectedVariant.stock === 0) {
      showToast({ message: `${product.name} is currently out of stock.`, variant: 'error' });
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.sku === selectedVariant.sku);
      if (existing) {
        const nextQty = Math.min(existing.maxStock, existing.qty + qty);
        return prev.map((item) =>
          item.sku === selectedVariant.sku ? { ...item, qty: nextQty } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          nameHi: product.nameHi,
          variantLabel: selectedVariant.label,
          sku: selectedVariant.sku,
          price: selectedVariant.price,
          compareAtPrice: selectedVariant.compareAtPrice,
          image: product.images[0],
          qty: Math.min(qty, selectedVariant.stock),
          maxStock: selectedVariant.stock,
        },
      ];
    });

    triggerBellSwing();
    if (openDrawer) {
      setIsOpen(true);
    } else {
      showToast({
        message: `${product.name} added to your thali`,
        actionLabel: 'View thali',
        onAction: () => setIsOpen(true),
      });
    }
  };

  const addMultipleItems = (
    entries: { product: Product; variant?: ProductVariant; qty: number }[],
    kitDiscountPercent = 0
  ) => {
    setItems((prev) => {
      const next = [...prev];
      entries.forEach(({ product, variant, qty }) => {
        const v = variant ?? product.variants[0];
        if (!v || v.stock === 0 || qty <= 0) return;
        const discountedPrice =
          kitDiscountPercent > 0
            ? Math.round(v.price * (1 - kitDiscountPercent / 100))
            : v.price;
        const idx = next.findIndex((i) => i.sku === v.sku);
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            qty: Math.min(v.stock, next[idx].qty + qty),
            price: discountedPrice,
            compareAtPrice: kitDiscountPercent > 0 ? v.price : v.compareAtPrice,
          };
        } else {
          next.push({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            nameHi: product.nameHi,
            variantLabel: v.label,
            sku: v.sku,
            price: discountedPrice,
            compareAtPrice: kitDiscountPercent > 0 ? v.price : v.compareAtPrice,
            image: product.images[0],
            qty: Math.min(qty, v.stock),
            maxStock: v.stock,
          });
        }
      });
      return next;
    });
    triggerBellSwing();
    setIsOpen(true);
  };

  const updateQty = (sku: string, qty: number) => {
    if (qty <= 0) {
      removeItem(sku);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, qty: Math.min(item.maxStock, qty) } : item
      )
    );
  };

  const removeItem = (sku: string) => {
    setItems((prev) => prev.filter((item) => item.sku !== sku));
  };

  const clearCart = () => {
    setItems([]);
    setGiftWrap(false);
    setGiftMessage('');
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCouponState = (code: string, discount: number) => {
    setCouponCode(code);
    setCouponDiscount(discount);
  };

  const clearCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freeKolkataRemaining = Math.max(0, STORE_INFO.freeKolkataThreshold - subtotal);
  const freeKolkataProgress = Math.min(100, Math.round((subtotal / STORE_INFO.freeKolkataThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        bellSwing,
        giftWrap,
        setGiftWrap,
        giftMessage,
        setGiftMessage,
        couponCode,
        couponDiscount,
        applyCouponState,
        clearCoupon,
        itemCount,
        subtotal,
        freeKolkataRemaining,
        freeKolkataProgress,
        addItem,
        addMultipleItems,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

