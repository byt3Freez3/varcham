import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Minus, Plus, Trash2, Gift, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { STORE_INFO } from '@/data/store';
import { validateCoupon } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DiyaTulsiMark } from '@/components/BrandMark';

export function CartPage() {
  const {
    items,
    subtotal,
    freeKolkataRemaining,
    freeKolkataProgress,
    updateQty,
    removeItem,
    giftWrap,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
    couponCode,
    couponDiscount,
    applyCouponState,
    clearCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await validateCoupon(couponInput, subtotal);
    setCouponFeedback(res.message);
    if (res.valid) applyCouponState(res.code, res.discount);
  };

  const total = Math.max(0, subtotal - couponDiscount + (giftWrap ? STORE_INFO.giftWrapFee : 0));

  return (
    <>
      <Helmet>
        <title>Your Thali (Cart) | Varcham India</title>
        <meta name="description" content="Review your selected puja samagri, attars, and brass or marble articles before checkout." />
      </Helmet>

      <section className="py-10 md:py-16 bg-ivory">
        <div className="container">
          <h1 className="font-playfair text-3xl md:text-4xl text-espresso mb-2">Your thali</h1>
          <p className="text-sm text-walnut mb-8">
            Checked, packed, and dispatched from our Phoolbagan store in Kolkata.
          </p>

          {items.length === 0 ? (
            <div className="py-16 text-center rounded-md border border-hairline bg-parchment/40">
              <DiyaTulsiMark className="w-12 h-12 text-gold mx-auto mb-3" />
              <h2 className="font-playfair text-2xl text-espresso">Your thali is empty</h2>
              <p className="text-sm text-walnut mt-1">Explore our collections or pick a ready festival kit.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button asChild>
                  <Link to="/shop">Shop Puja Essentials</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/festivals">Festival Kits</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <div className="p-4 rounded-sm bg-parchment border border-hairline">
                  <p className="text-xs font-medium text-espresso mb-2">
                    {freeKolkataRemaining === 0
                      ? 'Free same-day Kolkata delivery unlocked!'
                      : `Add ${formatINR(freeKolkataRemaining)} more for free Kolkata delivery`}
                  </p>
                  <div className="h-1.5 bg-sandal rounded-full overflow-hidden">
                    <div className="h-full bg-tulsi" style={{ width: `${freeKolkataProgress}%` }} />
                  </div>
                </div>

                <div className="rounded-md border border-hairline divide-y divide-hairline bg-white">
                  {items.map((item) => (
                    <div key={item.sku} className="p-4 md:p-5 flex gap-4 items-center">
                      <Link
                        to={`/product/${item.slug}`}
                        className="w-20 h-24 rounded-sm bg-parchment overflow-hidden shrink-0 border border-hairline"
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.slug}`}
                          className="font-playfair text-lg text-espresso hover:text-tulsi"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-walnut">
                          {item.nameHi} · {item.variantLabel}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <div className="inline-flex items-center border border-hairline rounded-sm h-9">
                            <button
                              type="button"
                              onClick={() => updateQty(item.sku, item.qty - 1)}
                              aria-label="Decrease quantity"
                              className="w-9 h-full flex items-center justify-center hover:bg-sandal"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold font-tabular">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.sku, item.qty + 1)}
                              aria-label="Increase quantity"
                              className="w-9 h-full flex items-center justify-center hover:bg-sandal"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.sku)}
                            className="inline-flex items-center gap-1 text-xs text-walnut hover:text-sindoor"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right font-semibold text-base font-tabular text-espresso">
                        {formatINR(item.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="lg:col-span-4 p-6 rounded-md border border-hairline bg-parchment/60 space-y-5">
                <h2 className="font-cinzel text-xs uppercase tracking-[0.22em] text-gold">
                  ORDER SUMMARY
                </h2>

                <div className="p-3.5 rounded-sm bg-ivory border border-hairline space-y-2">
                  <label className="flex items-center justify-between cursor-pointer text-sm">
                    <span className="flex items-center gap-2 font-medium text-espresso">
                      <Gift className="w-4 h-4 text-gold" />
                      Gift wrap (+{formatINR(STORE_INFO.giftWrapFee)})
                    </span>
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="h-4 w-4 accent-tulsi"
                    />
                  </label>
                  {giftWrap && (
                    <textarea
                      rows={2}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Gift note..."
                      className="w-full rounded-sm border border-hairline bg-white p-2 text-xs"
                    />
                  )}
                </div>

                {couponCode ? (
                  <div className="flex items-center justify-between text-xs px-3 py-2 bg-ivory rounded-sm border border-tulsi/40">
                    <span className="text-tulsi font-medium">
                      {couponCode} (-{formatINR(couponDiscount)})
                    </span>
                    <button type="button" onClick={clearCoupon} className="underline text-walnut">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code (SHUBH10)"
                      className="flex-1 h-10 rounded-sm border border-hairline bg-white px-3 text-sm"
                    />
                    <Button type="submit" variant="secondary" size="sm">
                      Apply
                    </Button>
                  </form>
                )}
                {couponFeedback && !couponCode && (
                  <p className="text-xs text-sindoor">{couponFeedback}</p>
                )}

                <div className="space-y-2 text-sm border-t border-hairline pt-4">
                  <div className="flex justify-between text-walnut">
                    <span>Items subtotal</span>
                    <span className="font-tabular">{formatINR(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-tulsi">
                      <span>Discount</span>
                      <span className="font-tabular">-{formatINR(couponDiscount)}</span>
                    </div>
                  )}
                  {giftWrap && (
                    <div className="flex justify-between text-walnut">
                      <span>Gift wrap</span>
                      <span className="font-tabular">{formatINR(STORE_INFO.giftWrapFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-espresso pt-2 border-t border-hairline">
                    <span>Estimated Total</span>
                    <span className="font-tabular">{formatINR(total)}</span>
                  </div>
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-walnut">
                  <Lock className="w-3.5 h-3.5 text-gold" />
                  <span>Safe UPI, Cards &amp; Cash on Delivery</span>
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

