import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Sparkles, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shop', label: 'Shop', icon: ShoppingBag },
  { to: '/festivals', label: 'Festivals', icon: Sparkles },
  { to: '/account?tab=wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account', label: 'Account', icon: User },
];

export function MobileTabBar() {
  const { pathname, search } = useLocation();

  if (pathname.startsWith('/checkout') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-ivory border-t border-hairline pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isWishlist = tab.to.includes('wishlist');
          const active = isWishlist
            ? pathname === '/account' && search.includes('wishlist')
            : tab.to === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.to) && !(pathname === '/account' && search.includes('wishlist'));

          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                active ? 'text-tulsi' : 'text-walnut'
              )}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 w-8 h-[2px] bg-gold rounded-full"
                />
              )}
              <Icon className="w-[22px] h-[22px] stroke-[1.6]" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

