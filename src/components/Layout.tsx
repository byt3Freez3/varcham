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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );

    const checkAndObserve = () => {
      const els = Array.from(document.querySelectorAll('[data-reveal]:not(.is-visible)'));
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in the viewport (or above it), reveal immediately
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-visible');
        } else {
          observer.observe(el);
        }
      });
    };

    checkAndObserve();

    // Observe newly inserted DOM nodes (e.g. after async fetches or state updates)
    const mutObserver = new MutationObserver(() => {
      checkAndObserve();
    });

    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObserver.disconnect();
    };
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
