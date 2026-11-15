import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { MobileTabBar } from '@/components/MobileTabBar';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname, search } = useLocation();
  const isCheckout = pathname.startsWith('/checkout');
  const isAdmin = pathname.startsWith('/admin');

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, search]);

  // Global IntersectionObserver for data-reveal scroll reveals
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-ivory text-espresso">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-espresso">
      {!isCheckout && <AnnouncementBar />}
      {!isCheckout && <Header />}

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {!isCheckout && <Footer />}
      <CartDrawer />
      <MobileTabBar />
      <WhatsAppFloat />
    </div>
  );
}

