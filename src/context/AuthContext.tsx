import React, { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_ORDERS } from '@/data/store';
import { Address, OrderRecord } from '@/types';

export interface UserProfile {
  fullName: string;
  phone: string;
  email: string;
  whatsappOptIn: boolean;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserProfile;
  addresses: Address[];
  orders: OrderRecord[];
  reminders: string[]; // festival slugs
  loginWithPhone: (phone: string, fullName?: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  toggleReminder: (festivalSlug: string) => void;
  recordOrder: (order: OrderRecord) => void;
}

const DEFAULT_USER: UserProfile = {
  fullName: 'Sunita Agarwal',
  phone: '9830011223',
  email: 'sunita.agarwal@example.com',
  whatsappOptIn: true,
};

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home (Salt Lake)',
    name: 'Sunita Agarwal',
    phone: '9830011223',
    line1: 'Block BE-14, Sector 1',
    landmark: 'Near Swimming Pool',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700064',
    isDefault: true,
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('varcham_auth') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('varcham_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem('varcham_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('varcham_orders');
      const localOrders: OrderRecord[] = saved ? JSON.parse(saved) : [];
      return [...localOrders, ...MOCK_ORDERS];
    } catch {
      return MOCK_ORDERS;
    }
  });

  const [reminders, setReminders] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('varcham_reminders');
      return saved ? JSON.parse(saved) : ['dev-uthani-ekadashi', 'diwali-lakshmi-puja'];
    } catch {
      return ['dev-uthani-ekadashi', 'diwali-lakshmi-puja'];
    }
  });

  useEffect(() => {
    localStorage.setItem('varcham_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('varcham_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('varcham_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('varcham_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const loginWithPhone = (phone: string, fullName?: string) => {
    setUser((prev) => ({
      ...prev,
      phone,
      fullName: fullName && fullName.trim() ? fullName.trim() : prev.fullName,
    }));
    setIsAuthenticated(true);
  };

  const logout = () => setIsAuthenticated(false);

  const updateProfile = (patch: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = { ...addr, id: `addr-${Date.now()}` };
    setAddresses((prev) => {
      const list = addr.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : prev;
      return [newAddr, ...list];
    });
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleReminder = (festivalSlug: string) => {
    setReminders((prev) =>
      prev.includes(festivalSlug) ? prev.filter((f) => f !== festivalSlug) : [...prev, festivalSlug]
    );
  };

  const recordOrder = (order: OrderRecord) => {
    const saved = localStorage.getItem('varcham_orders');
    const existing: OrderRecord[] = saved ? JSON.parse(saved) : [];
    const updatedLocal = [order, ...existing];
    localStorage.setItem('varcham_orders', JSON.stringify(updatedLocal));
    setOrders([order, ...existing, ...MOCK_ORDERS]);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        addresses,
        orders,
        reminders,
        loginWithPhone,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        toggleReminder,
        recordOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

