import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { STORE_INFO } from '@/data/store';

export function WhatsAppFloat() {
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <a
      href={STORE_INFO.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed right-4 bottom-20 md:bottom-6 md:right-6 z-40 inline-flex items-center gap-2 bg-tulsi text-ivory px-4 h-11 rounded-full border border-gold-light/40 shadow-card hover:bg-tulsi-hover transition-all duration-fast active:scale-[0.98]"
    >
      <MessageCircle className="w-4 h-4 text-gold-light" />
      <span className="text-xs font-semibold uppercase tracking-[0.06em] hidden sm:inline">
        Order on WhatsApp
      </span>
      <span className="text-xs font-semibold sm:hidden">WhatsApp</span>
    </a>
  );
}

