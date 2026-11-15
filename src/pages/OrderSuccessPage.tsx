import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageCircle, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { OrderRecord } from '@/types';
import { formatINR } from '@/lib/utils';
import { STORE_INFO } from '@/data/store';
import { DiyaTulsiMark } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';

export function OrderSuccessPage() {
  const { number } = useParams<{ number?: string }>();
  const location = useLocation();
  const { orders } = useAuth();
  const [waOptIn, setWaOptIn] = useState(true);

  const stateOrder = (location.state as { order?: OrderRecord } | null)?.order;
  const order =
    stateOrder ??
    orders.find((o) => o.orderNumber === number) ??
    orders[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Varcham India</title>
        <meta name="description" content="Thank you for your order with Varcham India Kolkata." />
      </Helmet>

      <section className="py-10 md:py-16 bg-ivory">
        <div className="container max-w-2xl">
          <div className="relative rounded-sm border border-gold/50 bg-parchment/35 p-6 md:p-12 text-center space-y-6">
            {/* Diya glow mark */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 diya-glow animate-diya-breathe" aria-hidden="true" />
              <div className="relative w-16 h-16 rounded-full bg-tulsi flex items-center justify-center border border-gold-light/50">
                <DiyaTulsiMark className="w-9 h-9 text-gold-light" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-cinzel text-xs uppercase tracking-[0.28em] text-gold">
                ORDER {order?.orderNumber || number || 'VAR-2611-0112'}
              </p>
              <h1 className="font-playfair text-3xl md:text-4xl text-espresso">
                Your order is placed. Shubh ho!
              </h1>
              <p className="text-sm text-walnut max-w-md mx-auto">
                {order?.estimatedDelivery ||
                  'Our Phoolbagan store team has received your list and will begin packing shortly.'}
              </p>
            </div>

            {order && (
              <div className="text-left rounded-sm border border-hairline bg-ivory p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-cinzel uppercase tracking-[0.2em] text-gold border-b border-hairline pb-2">
                  <span>Items Summary</span>
                  <span>{order.paymentStatus}</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between gap-2 text-espresso">
                      <span>
                        {item.name} ({item.variantLabel}) × {item.qty}
                      </span>
                      <span className="font-semibold font-tabular">
                        {formatINR(item.unitPrice * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-hairline flex justify-between font-semibold text-base text-espresso">
                  <span>Total</span>
                  <span className="font-tabular">{formatINR(order.total)}</span>
                </div>
                <p className="text-xs text-walnut flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                  <span>{order.addressSummary}</span>
                </p>
              </div>
            )}

            {/* WhatsApp Opt-in */}
            <label className="flex items-center justify-center gap-2.5 p-3.5 rounded-sm bg-ivory border border-hairline text-sm text-espresso cursor-pointer">
              <input
                type="checkbox"
                checked={waOptIn}
                onChange={(e) => setWaOptIn(e.target.checked)}
                className="h-4 w-4 accent-tulsi"
              />
              <MessageCircle className="w-4 h-4 text-tulsi" />
              <span>Send packing &amp; rider updates on WhatsApp</span>
            </label>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild>
                <Link to={`/track?order=${order?.orderNumber || ''}`}>Track order</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </div>

            <p className="text-xs text-walnut">
              Questions? Call our store at {STORE_INFO.phoneDisplay}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

