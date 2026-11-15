import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogOut, Package, MapPin, Heart, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { getFestivals, getProducts } from '@/lib/api';
import { Festival, Product } from '@/types';
import { formatINR, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';

type AccountTab = 'orders' | 'addresses' | 'wishlist' | 'reminders' | 'profile';

export function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as AccountTab) || 'orders';
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  const {
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
  } = useAuth();
  const { items: wishlistIds } = useWishlist();
  const { addItem } = useCart();
  const { lang, setLang } = useLanguage();
  const { showToast } = useToast();

  // Mock OTP login state
  const [phoneInput, setPhoneInput] = useState('9830011223');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // Wishlist & Festivals data
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);

  // New Address state
  const [newLabel, setNewLabel] = useState('Home');
  const [newLine1, setNewLine1] = useState('');
  const [newPincode, setNewPincode] = useState('700054');
  const [newCity, setNewCity] = useState('Kolkata');

  useEffect(() => {
    const paramTab = searchParams.get('tab') as AccountTab | null;
    if (paramTab) setActiveTab(paramTab);
  }, [searchParams]);

  useEffect(() => {
    getProducts().then((all) => {
      setWishlistProducts(all.filter((p) => wishlistIds.includes(p.id)));
    });
    getFestivals().then(setFestivals);
  }, [wishlistIds]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phoneInput.replace(/\D/g, '');
    if (digits.length < 10) {
      setOtpError('Enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError('');
    setOtpSent(true);
    showToast({ message: 'Demo OTP sent — enter any 4 digits (e.g. 1234).' });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim().length < 4) {
      setOtpError('Enter the 4-digit OTP code.');
      return;
    }
    setOtpError('');
    loginWithPhone(phoneInput.replace(/\D/g, '').slice(-10));
    showToast({ message: 'Namaste — welcome back to Varcham.' });
  };

  const handleBuyAgain = async (orderIdx: number) => {
    const ord = orders[orderIdx];
    const allProds = await getProducts();
    let count = 0;
    ord.items.forEach((it) => {
      const prod = allProds.find((p) => p.name === it.name);
      if (prod && prod.inStock) {
        const variant = prod.variants.find((v) => v.label === it.variantLabel) ?? prod.variants[0];
        addItem(prod, variant, it.qty, true);
        count++;
      }
    });
    if (count === 0) {
      showToast({ message: 'Added available essentials to your thali.' });
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine1.trim()) return;
    addAddress({
      label: newLabel,
      name: user.fullName,
      phone: user.phone,
      line1: newLine1,
      city: newCity,
      state: 'West Bengal',
      pincode: newPincode,
      isDefault: false,
    });
    setNewLine1('');
    showToast({ message: 'Address saved to your account.' });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Sign In | Varcham India</title>
          <meta name="description" content="Sign in with mobile OTP to view orders, saved addresses, wishlist, and festival reminders." />
        </Helmet>

        <section className="py-12 md:py-20 bg-ivory">
          <div className="container max-w-md">
            <div className="rounded-md border border-hairline bg-parchment/45 p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="font-cinzel text-xs uppercase tracking-[0.28em] text-gold">
                  NAMASTE · <span lang="hi">नमस्ते</span>
                </p>
                <h1 className="font-playfair text-3xl text-espresso">Sign in to Varcham</h1>
                <p className="text-sm text-walnut">
                  Track orders, save delivery addresses, and manage festival reminders.
                </p>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <Input
                    label="Mobile Number"
                    type="tel"
                    inputMode="numeric"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="10-digit mobile number"
                    error={otpError}
                  />
                  <Button type="submit" size="lg" className="w-full">
                    Send OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-xs text-walnut">
                    Entering OTP for <strong className="text-espresso">+91 {phoneInput}</strong>{' '}
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-tulsi underline ml-1"
                    >
                      Change
                    </button>
                  </p>
                  <Input
                    label="4-Digit OTP (demo: enter 1234)"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="1234"
                    error={otpError}
                  />
                  <Button type="submit" size="lg" className="w-full">
                    Verify &amp; Sign In
                  </Button>
                </form>
              )}

              <p className="text-center text-xs text-walnut pt-2 border-t border-hairline">
                Or continue straight to{' '}
                <Link to="/account?tab=wishlist" onClick={() => loginWithPhone('9830011223')} className="text-tulsi underline">
                  preview Sunita ji&apos;s demo account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  const tabs: { id: AccountTab; label: string; icon: typeof Package }[] = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: `Wishlist (${wishlistProducts.length})`, icon: Heart },
    { id: 'reminders', label: 'Festival Reminders', icon: Bell },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <>
      <Helmet>
        <title>Account | Varcham India</title>
        <meta name="description" content="Manage your Varcham orders, wishlist, addresses, and festival reminders." />
      </Helmet>

      <section className="py-10 md:py-16 bg-ivory">
        <div className="container space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-hairline">
            <div>
              <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold">
                YOUR ACCOUNT
              </p>
              <h1 className="font-playfair text-3xl md:text-4xl text-espresso mt-1">
                Namaste, {user.fullName} ji
              </h1>
            </div>
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto border-b border-hairline pb-0.5 no-scrollbar">
            {tabs.map((tb) => {
              const Icon = tb.icon;
              const active = activeTab === tb.id;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tb.id);
                    setSearchParams({ tab: tb.id }, { replace: true });
                  }}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                    active
                      ? 'border-gold text-tulsi font-semibold'
                      : 'border-transparent text-walnut hover:text-espresso'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tb.label}</span>
                </button>
              );
            })}
          </div>

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.map((ord, idx) => (
                <div
                  key={ord.orderNumber}
                  className="rounded-md border border-hairline bg-parchment/35 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-cinzel text-sm font-semibold text-espresso">
                        {ord.orderNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-tulsi text-ivory text-[11px] font-medium">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-walnut">{ord.estimatedDelivery}</p>
                    <p className="text-sm text-espresso">
                      {ord.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold text-base font-tabular text-espresso mr-2">
                      {formatINR(ord.total)}
                    </span>
                    <Button asChild variant="secondary" size="sm">
                      <Link to={`/track?order=${ord.orderNumber}`}>Track</Link>
                    </Button>
                    <Button size="sm" onClick={() => handleBuyAgain(idx)}>
                      Buy again
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-md border border-hairline bg-parchment/40 flex items-start justify-between gap-4"
                  >
                    <div>
                      <span className="font-cinzel text-xs uppercase tracking-[0.18em] text-gold">
                        {addr.label}
                      </span>
                      <p className="font-medium text-espresso mt-1">{addr.name}</p>
                      <p className="text-sm text-walnut">
                        {addr.line1}, {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      <p className="text-xs text-walnut mt-1">Mobile: +91 {addr.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddress(addr.id)}
                      className="text-xs text-walnut hover:text-sindoor underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleAddAddress}
                className="lg:col-span-5 p-5 rounded-md border border-hairline bg-white space-y-4"
              >
                <h2 className="font-playfair text-xl text-espresso">Add Address</h2>
                <Input label="Label (e.g. Home, Office)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                <Input label="Street & House / Flat No." value={newLine1} onChange={(e) => setNewLine1(e.target.value)} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
                  <Input label="Pincode" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} maxLength={6} />
                </div>
                <Button type="submit" className="w-full">Save Address</Button>
              </form>
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <>
              {wishlistProducts.length === 0 ? (
                <div className="py-12 text-center rounded-md border border-hairline bg-parchment/40">
                  <h2 className="font-playfair text-2xl text-espresso">Nothing saved yet</h2>
                  <p className="text-sm text-walnut mt-1">
                    Tap the heart on anything you&apos;d like to come back to.
                  </p>
                  <Button asChild className="mt-5">
                    <Link to="/shop">Browse Essentials</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Festival Reminders */}
          {activeTab === 'reminders' && (
            <div className="max-w-2xl space-y-3">
              <p className="text-sm text-walnut mb-4">
                Receive a calm checklist message 7 days before your chosen vrats and pujas.
              </p>
              {festivals.map((fest) => {
                const enabled = reminders.includes(fest.slug);
                return (
                  <label
                    key={fest.slug}
                    className="flex items-center justify-between gap-4 p-4 rounded-md border border-hairline bg-parchment/35 cursor-pointer"
                  >
                    <div>
                      <p className="font-playfair text-lg text-espresso">{fest.name}</p>
                      <p className="text-xs text-walnut">{fest.dateLabel}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleReminder(fest.slug)}
                      className="h-5 w-5 accent-tulsi"
                    />
                  </label>
                );
              })}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="max-w-lg p-6 rounded-md border border-hairline bg-white space-y-4">
              <Input
                label="Full Name"
                value={user.fullName}
                onChange={(e) => updateProfile({ fullName: e.target.value })}
              />
              <Input label="Mobile Number" value={user.phone} disabled />
              <Input
                label="Email Address"
                value={user.email}
                onChange={(e) => updateProfile({ email: e.target.value })}
              />
              <div className="pt-2">
                <p className="text-xs font-medium text-walnut mb-2">Preferred Language</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={lang === 'en' ? 'primary' : 'secondary'}
                    onClick={() => setLang('en')}
                  >
                    English
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={lang === 'hi' ? 'primary' : 'secondary'}
                    onClick={() => setLang('hi')}
                  >
                    हिंदी
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

