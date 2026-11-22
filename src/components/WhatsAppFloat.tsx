import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { STORE_INFO } from '@/data/store';
import { cn } from '@/lib/utils';

export function WhatsAppFloat() {
  const { pathname } = useLocation();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Only check hero on pages with hero section (primarily HomePage)
    const heroEl = document.getElementById('hero-section');
    if (!heroEl) {
      setHeroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <a
      href={STORE_INFO.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      className={cn(
        'fixed right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+80px)] md:bottom-6 md:right-6 z-40',
        'inline-flex items-center justify-center gap-2 bg-tulsi text-ivory rounded-full border border-gold-light/40 shadow-card hover:bg-tulsi-hover active:scale-[0.98]',
        // Mobile: 52px round button, Desktop: 44px pill (h-11)
        'w-[52px] h-[52px] p-0 md:w-auto md:h-11 md:px-4',
        'transition-all duration-300 ease-temple',
        // Hide on mobile while hero is in viewport so it never covers the headline
        heroVisible
          ? 'opacity-0 pointer-events-none translate-y-4 md:opacity-100 md:pointer-events-auto md:translate-y-0'
          : 'opacity-100 pointer-events-auto translate-y-0'
      )}
    >
      <MessageCircle className="w-6 h-6 text-ivory md:w-4 md:h-4 md:text-gold-light" />
      <span className="text-xs font-semibold uppercase tracking-[0.06em] hidden md:inline">
        Order on WhatsApp
      </span>
    </a>
  );
}
