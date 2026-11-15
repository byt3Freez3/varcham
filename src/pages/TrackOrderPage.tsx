import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  PackageSearch,
  ExternalLink,
  AlertCircle,
  MessageCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { getOrderStatus } from '@/lib/api';
import { OrderRecord } from '@/types';
import { formatINR } from '@/lib/utils';
import { STORE_CONTACT } from '@/data/pages';
import { useAuth } from '@/context/AuthContext';

export function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [orderNumber, setOrderNumber] = useState(
    searchParams.get('order') || 'VAR-2611-0001'
  );
  const [phone, setPhone] = useState(searchParams.get('phone') || '9007996100');
  const [order, setOrder] = useState<OrderRecord | undefined>();
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatOrderInput = (val: string) => {
    // Keep letters, digits, and hyphens, convert to uppercase
    return val.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 16);
  };

  const formatPhoneInput = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 10);
  };

  const executeLookup = async (ordNum: string, ph: string) => {
    if (!ordNum.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await getOrderStatus(ordNum.trim(), ph.trim());
      setOrder(res);
    } catch {
      setOrder(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const qOrder = searchParams.get('order');
    const qPhone = searchParams.get('phone') || '';
    if (qOrder) {
      setOrderNumber(qOrder);
      if (qPhone) setPhone(qPhone);
      executeLookup(qOrder, qPhone);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ order: orderNumber, phone });
    executeLookup(orderNumber, phone);
  };

  const handleDemoSelect = (ordNum: string, ph: string) => {
    setOrderNumber(ordNum);
    setPhone(ph);
    setSearchParams({ order: ordNum, phone: ph });
    executeLookup(ordNum, ph);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Helmet>
        <title>Track My Order | Varcham India</title>
        <meta
          name="description"
          content="Track live status and delivery milestones for your Varcham India order. Enter your order number and mobile phone."
        />
        <link rel="canonical" href="https://varcham.in/track" />
        <meta property="og:title" content="Track My Order | Varcham India" />
        <meta
          property="og:description"
          content="Live tracking for Kolkata same-day delivery, store pickup, and pan-India dispatches."
        />
        <meta property="og:url" content="https://varcham.in/track" />
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="ORDERS"
        title="Track My Order"
        subline="Enter your order number and mobile number."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Track My Order' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl px-4 space-y-8">
          {/* Lookup Card on Parchment */}
          <div className="bg-parchment rounded-[6px] border border-hairline p-6 md:p-8 shadow-xs space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 space-y-1.5">
                  <label
                    htmlFor="orderNumberInput"
                    className="block text-xs font-cinzel uppercase tracking-[0.14em] text-walnut font-medium"
                  >
                    Order Number
                  </label>
                  <input
                    id="orderNumberInput"
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(formatOrderInput(e.target.value))}
                    placeholder="VAR-XXXX-XXXX"
                    required
                    className="w-full h-11 px-3.5 rounded-sm bg-white border border-hairline text-espresso font-mono text-sm placeholder:text-walnut/50 uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-tulsi focus:border-tulsi"
                  />
                  <p className="text-[11px] text-walnut/70">Format: VAR-XXXX-XXXX</p>
                </div>

                <div className="md:col-span-6 space-y-1.5">
                  <label
                    htmlFor="phoneInput"
                    className="block text-xs font-cinzel uppercase tracking-[0.14em] text-walnut font-medium"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="phoneInput"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                    placeholder="10-digit mobile"
                    className="w-full h-11 px-3.5 rounded-sm bg-white border border-hairline text-espresso text-sm placeholder:text-walnut/50 focus:outline-none focus:ring-1 focus:ring-tulsi focus:border-tulsi"
                  />
                  <p className="text-[11px] text-walnut/70">Used during checkout</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-7 rounded-sm bg-tulsi text-ivory font-semibold text-xs uppercase tracking-[0.12em] hover:bg-tulsi/90 transition-colors shrink-0 disabled:opacity-50"
                >
                  {loading ? 'Locating...' : 'Track order'}
                </button>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-walnut">
                  <span className="font-cinzel text-[11px] text-gold uppercase tracking-[0.1em] mr-1">
                    Try demo:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDemoSelect('VAR-2611-0001', '9007996100')}
                    className="px-2 py-1 rounded bg-white/70 border border-hairline font-mono text-[11px] hover:border-gold hover:text-tulsi transition-colors"
                  >
                    VAR-2611-0001 (Store pickup)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoSelect('VAR-2611-0108', '9830011223')}
                    className="px-2 py-1 rounded bg-white/70 border border-hairline font-mono text-[11px] hover:border-gold hover:text-tulsi transition-colors"
                  >
                    VAR-2611-0108 (Same-day)
                  </button>
                </div>
              </div>
            </form>

            {/* Logged in helper link */}
            <div className="pt-3 border-t border-hairline flex items-center justify-between text-xs text-walnut">
              <span>{user ? `Logged in as ${user.fullName}` : 'Have a Varcham account?'}</span>
              <Link
                to="/account"
                className="text-tulsi font-semibold hover:underline inline-flex items-center gap-1"
              >
                See all your orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Result: Not Found State */}
          {hasSearched && !loading && !order && (
            <div className="bg-white rounded-[6px] border border-hairline p-8 text-center space-y-4 shadow-xs">
              <PackageSearch className="w-10 h-10 text-gold mx-auto stroke-[1.5]" />
              <div className="space-y-1.5">
                <p className="font-playfair text-xl text-espresso">
                  We couldn&apos;t find that order
                </p>
                <p className="text-sm text-walnut max-w-md mx-auto">
                  Please double-check the order number on your confirmation message or email, or reach out to our Phoolbagan store desk directly.
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={STORE_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-parchment border border-hairline text-tulsi hover:bg-tulsi hover:text-ivory text-xs uppercase tracking-[0.1em] font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp us with Order ID
                </a>
              </div>
            </div>
          )}

          {/* Result: Order Found */}
          {order && (
            <div className="bg-white rounded-[6px] border border-hairline p-6 md:p-8 space-y-8 shadow-xs">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-hairline">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-tulsi tracking-wider">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-cinzel uppercase tracking-[0.1em] bg-parchment text-walnut border border-hairline">
                      {order.fulfilment === 'pickup'
                        ? 'Store Pickup'
                        : order.fulfilment === 'kolkata_same_day'
                        ? 'Kolkata Same-Day'
                        : 'Express Courier'}
                    </span>
                  </div>
                  <h2 className="font-playfair text-2xl text-espresso">
                    Status: {order.status}
                  </h2>
                  <p className="text-xs text-walnut flex items-center gap-1.5 pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>Estimated: <strong className="text-espresso font-medium">{order.estimatedDelivery}</strong></span>
                  </p>
                </div>

                <div className="md:text-right space-y-1">
                  <p className="font-playfair text-2xl text-espresso font-semibold">
                    {formatINR(order.total)}
                  </p>
                  <p className="text-xs text-walnut">
                    Payment:{' '}
                    <span className="font-medium text-tulsi">{order.paymentStatus}</span> ({order.paymentMethod.toUpperCase()})
                  </p>
                  {order.awbCode && (
                    <p className="text-xs text-walnut">
                      AWB:{' '}
                      <span className="font-mono font-medium text-espresso">{order.awbCode}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Status Alert for Cancelled or Pending Payment */}
              {order.status === 'Cancelled' && (
                <div className="p-4 rounded bg-sindoor/10 border border-sindoor/30 text-sindoor text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">This order has been cancelled.</p>
                    <p className="text-xs mt-0.5 text-sindoor/90">
                      Prepaid amounts are refunded to the original source within 5–7 working days.
                    </p>
                  </div>
                </div>
              )}

              {order.paymentStatus === 'Pending' && (
                <div className="p-4 rounded bg-gold/10 border border-gold/40 text-walnut text-sm flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-espresso">Still confirming payment</p>
                    <p className="text-xs mt-0.5">
                      Your bank transaction is being verified with Razorpay. This page will update once confirmed.
                    </p>
                  </div>
                </div>
              )}

              {/* Vertical Timeline */}
              <div className="space-y-4">
                <h3 className="font-cinzel text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                  DELIVERY TIMELINE
                </h3>

                <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-tulsi">
                  {order.timeline.map((step, idx) => {
                    const isLast = idx === order.timeline.length - 1;
                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        {/* Dot marker */}
                        <div
                          className={`absolute -left-[24px] top-1 w-6 h-6 rounded-full border-2 bg-ivory flex items-center justify-center transition-all ${
                            isLast
                              ? 'border-gold bg-parchment ring-4 ring-gold/20 animate-pulse'
                              : 'border-tulsi bg-tulsi text-ivory'
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isLast ? 'bg-gold' : 'bg-ivory'
                            }`}
                          />
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                isLast ? 'text-tulsi font-playfair text-base' : 'text-espresso'
                              }`}
                            >
                              {step.status}
                            </p>
                            <span className="text-xs text-walnut font-mono">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-walnut leading-relaxed">{step.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in Order */}
              <div className="pt-6 border-t border-hairline space-y-4">
                <h3 className="font-cinzel text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                  ITEMS IN THIS ORDER ({order.items.length})
                </h3>
                <div className="divide-y divide-hairline">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-4">
                      <div className="w-14 h-14 rounded bg-parchment border border-hairline overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair text-sm text-espresso truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-walnut">
                          {item.variantLabel} · Qty: {item.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-espresso">
                          {formatINR(item.unitPrice * item.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier & Destination details */}
              <div className="pt-4 border-t border-hairline grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-walnut">
                <div>
                  <span className="font-semibold text-espresso block mb-0.5">Destination:</span>
                  <p>{order.customerName}</p>
                  <p>{order.addressSummary}</p>
                </div>
                <div>
                  <span className="font-semibold text-espresso block mb-0.5">Need help with this order?</span>
                  <p>
                    WhatsApp us at{' '}
                    <a
                      href={`https://wa.me/919007996100?text=Hi%2C%20I%20have%20a%20query%20about%20order%20${order.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-tulsi font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      +91 90079 96100 <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
