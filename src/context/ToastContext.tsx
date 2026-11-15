import React, { createContext, useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastMessage {
  id: string;
  message: string;
  variant?: 'gold' | 'error';
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-1), { ...toast, id }]);
      if (toast.variant !== 'error') {
        setTimeout(() => {
          dismissToast(id);
        }, 3200);
      }
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0 z-50 flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-center justify-between gap-3 bg-ivory text-espresso px-4 py-3 rounded-sm shadow-card border border-hairline text-sm transition-all duration-fast',
              t.variant === 'error' ? 'border-l-[3px] border-l-sindoor' : 'border-l-[3px] border-l-gold'
            )}
          >
            <span className="flex-1 leading-snug">{t.message}</span>
            {t.actionLabel && t.actionTo ? (
              <Link
                to={t.actionTo}
                onClick={() => dismissToast(t.id)}
                className="text-xs font-semibold uppercase tracking-wider text-tulsi hover:underline shrink-0"
              >
                {t.actionLabel}
              </Link>
            ) : t.actionLabel && t.onAction ? (
              <button
                type="button"
                onClick={() => {
                  t.onAction?.();
                  dismissToast(t.id);
                }}
                className="text-xs font-semibold uppercase tracking-wider text-tulsi hover:underline shrink-0"
              >
                {t.actionLabel}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="text-walnut hover:text-espresso p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

