import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { COLLECTIONS } from '@/data/collections';
import { STORE_INFO } from '@/data/store';
import { BrandLogo } from '@/components/BrandMark';
import { useToast } from '@/context/ToastContext';

export function Footer() {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !whatsapp.trim()) {
      showToast({ message: 'Enter an email or WhatsApp number for festival reminders.', variant: 'error' });
      return;
    }
    setSubscribed(true);
    setEmail('');
    setWhatsapp('');
    showToast({ message: 'Namaste — your festival reminders are saved.' });
  };

  return (
    <footer className="bg-tulsi text-ivory pt-16 pb-24 md:pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-ivory/15">
          {/* Brand + Newsletter */}
          <div className="md:col-span-4 space-y-5">
            <BrandLogo variant="reversed" />
            <p className="font-playfair italic text-lg text-gold-light">
              {STORE_INFO.tagline}
            </p>
            <p className="text-sm text-ivory/80 leading-relaxed max-w-sm">
              Authentic puja samagri, pure attars, museum-grade sandalwood, and heirloom brass &amp; marble — curated from our Phoolbagan store in Kolkata.
            </p>

            <div className="pt-2">
              <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold-light mb-2.5">
                Get Festival Reminders
              </p>
              {subscribed ? (
                <p className="text-sm text-gold-light bg-ivory/10 px-4 py-3 rounded-sm border border-gold-light/30">
                  Shubh ho — we&apos;ll send your puja checklist 7 days before every major festival.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2.5 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    aria-label="Email for festival reminders"
                    className="w-full h-11 rounded-sm bg-parchment text-espresso placeholder:text-walnut/60 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-light"
                  />
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp number (optional)"
                      aria-label="WhatsApp number for festival reminders"
                      className="flex-1 h-11 rounded-sm bg-parchment text-espresso placeholder:text-walnut/60 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-light"
                    />
                    <button
                      type="submit"
                      className="h-11 px-4 rounded-sm bg-gold-light text-espresso font-semibold text-xs uppercase tracking-[0.08em] hover:bg-ivory transition-colors shrink-0"
                    >
                      Join
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2">
            <h3 className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold-light mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm text-ivory/85">
              <li>
                <Link to="/shop" className="hover:text-gold-light transition-colors">
                  All Essentials
                </Link>
              </li>
              {COLLECTIONS.slice(0, 6).map((col) => (
                <li key={col.id}>
                  <Link to={`/collections/${col.slug}`} className="hover:text-gold-light transition-colors">
                    {col.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Quick Links */}
          <div className="md:col-span-2">
            <h3 className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold-light mb-4">
              Help
            </h3>
            <ul className="space-y-2.5 text-sm text-ivory/85">
              <li>
                <Link to="/our-story" className="hover:text-gold-light transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/policies/shipping" className="hover:text-gold-light transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/returns" className="hover:text-gold-light transition-colors">
                  Returns &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/cancellation" className="hover:text-gold-light transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy" className="hover:text-gold-light transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/policies/terms" className="hover:text-gold-light transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-gold-light transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-gold-light transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-light transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h3 className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold-light mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-ivory/85">
              <li>
                <Link to="/festivals" className="hover:text-gold-light transition-colors">
                  Festival Kits
                </Link>
              </li>
              <li>
                <Link to="/gifting" className="hover:text-gold-light transition-colors">
                  Corporate Gifting
                </Link>
              </li>
              <li>
                <Link to="/visit" className="hover:text-gold-light transition-colors">
                  Visit Phoolbagan Store
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-light transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gold-light transition-colors text-ivory/60">
                  Store Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Visit Us */}
          <div className="md:col-span-2">
            <h3 className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold-light mb-4">
              Visit Us
            </h3>
            <ul className="space-y-3 text-sm text-ivory/85">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-light shrink-0 mt-1" />
                <span>
                  {STORE_INFO.addressLine1}, {STORE_INFO.addressLandmark},{' '}
                  {STORE_INFO.cityStatePin}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-light shrink-0" />
                <a href={STORE_INFO.phoneHref} className="hover:text-gold-light">
                  {STORE_INFO.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-light shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="hover:text-gold-light break-all">
                  {STORE_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-light shrink-0" />
                <span>{STORE_INFO.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ivory/80">
            <span className="mr-1 text-gold-light font-cinzel uppercase tracking-[0.2em] text-[10px]">
              Accepted:
            </span>
            {['UPI', 'Cards', 'Netbanking', 'Cash on Delivery'].map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 rounded-sm border border-ivory/20 bg-ivory/5 text-[11px]"
              >
                {method}
              </span>
            ))}
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="font-cinzel text-[11px] tracking-[0.25em] text-gold-light">
              © 2026 VARCHAM INDIA. ALL RIGHTS RESERVED.
            </p>
            <p className="font-cinzel text-[10px] tracking-[0.2em] text-gold-light/80">
              GSTIN: TO BE ADDED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

