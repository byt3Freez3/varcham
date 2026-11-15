import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { COLLECTIONS } from '@/data/collections';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { BrandLogo } from '@/components/BrandMark';
import { SearchOverlay } from '@/components/SearchOverlay';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const hoverTimeout = useRef<number | null>(null);
  const { itemCount, openCart, bellSwing } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { lang, toggleLang, t } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleMegaEnter = () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    hoverTimeout.current = window.setTimeout(() => setMegaOpen(true), 150);
  };

  const handleMegaLeave = () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    hoverTimeout.current = window.setTimeout(() => setMegaOpen(false), 180);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 bg-ivory border-b border-hairline transition-all duration-base ease-temple',
          scrolled ? 'h-14 md:h-16 shadow-sm' : 'h-14 md:h-[88px]'
        )}
      >
        <div className="container h-full flex items-center justify-between gap-4">
          {/* Mobile left controls */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="w-11 h-11 flex items-center justify-center text-espresso"
            >
              <Menu className="w-6 h-6 stroke-[1.6]" />
            </button>
          </div>

          {/* Desktop left navigation */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-6 lg:gap-7">
            <div
              className="relative"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <button
                type="button"
                onClick={() => setMegaOpen((o) => !o)}
                aria-expanded={megaOpen}
                className="inline-flex items-center gap-1 py-2 text-[13px] font-medium uppercase tracking-[0.08em] text-espresso hover:text-tulsi transition-colors"
              >
                <span>{t('Shop', 'खरीदारी')}</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 text-gold transition-transform duration-fast',
                    megaOpen && 'rotate-180'
                  )}
                />
              </button>
            </div>
            <Link
              to="/festivals"
              className="text-[13px] font-medium uppercase tracking-[0.08em] text-espresso hover:text-tulsi transition-colors"
            >
              {t('Festivals', 'त्योहार')}
            </Link>
            <Link
              to="/gifting"
              className="text-[13px] font-medium uppercase tracking-[0.08em] text-espresso hover:text-tulsi transition-colors"
            >
              {t('Gifting', 'उपहार')}
            </Link>
            <Link
              to="/our-story"
              className="hidden lg:inline text-[13px] font-medium uppercase tracking-[0.08em] text-espresso hover:text-tulsi transition-colors"
            >
              {t('Our Story', 'हमारी कहानी')}
            </Link>
            <Link
              to="/visit"
              className="hidden lg:inline text-[13px] font-medium uppercase tracking-[0.08em] text-espresso hover:text-tulsi transition-colors"
            >
              {t('Visit Store', 'स्टोर')}
            </Link>
          </nav>

          {/* Centred Brand Logo */}
          <Link
            to="/"
            aria-label="Varcham India home"
            className="shrink-0 focus-visible:outline-none"
          >
            <BrandLogo compact={scrolled} />
          </Link>

          {/* Right action icons */}
          <div className="flex items-center gap-0.5 md:gap-2">
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Toggle English or Hindi language"
              className="hidden md:inline-flex items-center justify-center px-2.5 h-9 rounded-sm border border-hairline bg-parchment/60 text-xs font-medium text-espresso hover:bg-sandal transition-colors"
            >
              <span className={lang === 'en' ? 'text-tulsi font-semibold' : 'text-walnut'}>EN</span>
              <span className="mx-1 text-gold">/</span>
              <span lang="hi" className={lang === 'hi' ? 'text-tulsi font-semibold' : 'text-walnut'}>
                हिं
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="w-11 h-11 flex items-center justify-center text-espresso hover:text-tulsi transition-colors"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </button>

            <Link
              to="/account"
              aria-label="Account"
              className="hidden md:flex w-11 h-11 items-center justify-center text-espresso hover:text-tulsi transition-colors"
            >
              <User className="w-5 h-5 stroke-[1.6]" />
            </Link>

            <Link
              to="/account?tab=wishlist"
              aria-label={`Wishlist (${wishlistItems.length})`}
              className="hidden md:flex relative w-11 h-11 items-center justify-center text-espresso hover:text-tulsi transition-colors"
            >
              <Heart className="w-5 h-5 stroke-[1.6]" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-2 right-1.5 w-4 h-4 rounded-full bg-gold text-ivory text-[10px] font-semibold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open shopping thali (${itemCount} items)`}
              className="relative w-11 h-11 flex items-center justify-center text-espresso hover:text-tulsi transition-colors"
            >
              <ShoppingBag
                className={cn(
                  'w-5 h-5 stroke-[1.6] origin-top',
                  bellSwing && 'animate-bell-swing'
                )}
              />
              {itemCount > 0 && (
                <span className="absolute top-2 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-tulsi text-ivory text-[10px] font-semibold flex items-center justify-center font-tabular">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Shop Mega-Menu */}
        {megaOpen && (
          <div
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
            className="hidden md:block absolute left-0 right-0 top-full bg-ivory border-b border-hairline shadow-card z-40"
          >
            <div className="container py-8 grid grid-cols-12 gap-6">
              <div className="col-span-9 grid grid-cols-4 gap-x-6 gap-y-6">
                {COLLECTIONS.map((col) => (
                  <div key={col.id}>
                    <Link
                      to={`/collections/${col.slug}`}
                      className="font-cinzel text-[11px] font-semibold uppercase tracking-[0.2em] text-gold hover:text-tulsi transition-colors block mb-2"
                    >
                      {col.name}
                    </Link>
                    <ul className="space-y-1.5">
                      {col.subcategories.slice(0, 4).map((sub) => (
                        <li key={sub}>
                          <Link
                            to={`/collections/${col.slug}?sub=${encodeURIComponent(sub)}`}
                            className="text-[13px] text-walnut hover:text-espresso hover:underline underline-offset-4 transition-colors"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="col-span-3 border-l border-hairline pl-6">
                <Link
                  to="/gifting"
                  className="group block rounded-md border border-hairline bg-parchment/50 overflow-hidden hover:shadow-card transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src="/images/gifting-hampers.jpg"
                      alt="Varcham Diwali and Corporate Gifting Hampers"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow ease-temple"
                    />
                  </div>
                  <div className="p-3.5">
                    <p className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-gold">
                      Corporate &amp; Festive
                    </p>
                    <p className="font-playfair text-base text-espresso mt-0.5">
                      Diwali Gifting Hampers
                    </p>
                    <p className="text-xs text-walnut mt-1">
                      Custom brass &amp; Herbaa hampers with GST invoice →
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Left Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true" aria-label="Menu">
          <div
            className="w-[86vw] max-w-xs bg-ivory h-full border-r border-hairline flex flex-col overflow-y-auto animate-in slide-in-from-left duration-base"
          >
            <div className="flex items-center justify-between p-4 border-b border-hairline">
              <BrandLogo compact />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-11 h-11 flex items-center justify-center text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 space-y-1">
              <div className="border-b border-hairline pb-2">
                <button
                  type="button"
                  onClick={() => setMobileShopExpanded((prev) => !prev)}
                  className="w-full flex items-center justify-between py-3 text-sm font-semibold uppercase tracking-[0.08em] text-espresso"
                >
                  <span>Shop by Collection</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-gold transition-transform',
                      mobileShopExpanded && 'rotate-180'
                    )}
                  />
                </button>
                {mobileShopExpanded && (
                  <div className="pl-3 pb-2 space-y-2">
                    <Link
                      to="/shop"
                      className="block py-1.5 text-sm font-medium text-tulsi"
                    >
                      All Essentials (View All)
                    </Link>
                    {COLLECTIONS.map((col) => (
                      <Link
                        key={col.id}
                        to={`/collections/${col.slug}`}
                        className="flex items-center justify-between py-1.5 text-sm text-walnut"
                      >
                        <span>{col.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gold" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {[
                { to: '/festivals', label: 'Festival Kits' },
                { to: '/gifting', label: 'Diwali & Bulk Gifting' },
                { to: '/our-story', label: 'Our Story & Purity Promise' },
                { to: '/visit', label: 'Visit Kolkata Store' },
                { to: '/journal', label: 'Varcham Journal' },
                { to: '/track', label: 'Track Order' },
                { to: '/contact', label: 'Contact & Help' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-3 text-sm font-medium text-espresso border-b border-hairline/70"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-hairline bg-parchment/60 flex items-center justify-between">
              <span className="text-xs text-walnut">Language</span>
              <button
                type="button"
                onClick={toggleLang}
                className="px-3 py-1.5 rounded-sm border border-hairline bg-ivory text-xs font-medium"
              >
                {lang === 'en' ? 'Switch to हिंदी' : 'Switch to English'}
              </button>
            </div>
          </div>
          <div
            className="flex-1 bg-espresso/40"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

