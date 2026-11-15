import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, Gift, Sparkles, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getRelatedLowPriceAddOns, validateCoupon } from '@/lib/api';
import { STORE_INFO } from '@/data/store';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DiyaTulsiMark } from '@/components/BrandMark';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    freeKolkataRemaining,
    freeKolkataProgress,
    updateQty,
    removeItem,
    addItem,
    giftWrap,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
    couponCode,
    couponDiscount,
    applyCouponState,
    clearCoupon,
  } = useCart();

  const [addOns, setAddOns] = useState<Product[]>([]);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  useEffect(() => {
    getRelatedLowPriceAddOns().then(setAddOns);
  }, []);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await validateCoupon(couponInput, subtotal);
    setCouponFeedback(res.message);
    if (res.valid) {
      applyCouponState(res.code, res.discount);
    }
  };

  const finalSubtotal =
    subtotal - couponDiscount + (giftWrap ? STORE_INFO.giftWrapFee : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Your shopping thali"
    >
      {/* Scrim */}
      <div
        className="flex-1 bg-espresso/40 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="w-full md:w-[420px] bg-ivory h-full border-l border-hairline shadow-drawer flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
          <div>
            <h2 className="font-playfair text-2xl text-espresso">Your thali</h2>
            <p className="text-xs text-walnut">
              {items.reduce((s, i) => s + i.qty, 0)} essentials selected
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close thali drawer"
            className="w-11 h-11 flex items-center justify-center rounded-sm text-espresso hover:bg-sandal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery bar */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-parchment border-b border-hairline">
            <p className="text-xs text-espresso font-medium mb-2">
              {freeKolkataRemaining === 0 ? (
                <span className="text-tulsi font-semibold">
                  You&apos;ve unlocked free Kolkata same-day delivery
                </span>
              ) : (
                <>
                  Add <span className="font-semibold font-tabular">{formatINR(freeKolkataRemaining)}</span> more for free Kolkata delivery
                </>
              )}
            </p>
            <div className="relative h-1.5 bg-sandal rounded-full overflow-hidden">
              <div
                className="h-full bg-tulsi transition-all duration-base ease-temple rounded-full"
                style={{ width: `${freeKolkataProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-parchment flex items-center justify-center mb-4">
                <DiyaTulsiMark className="w-9 h-9 text-gold" />
              </div>
              <h3 className="font-playfair text-xl text-espresso">Your thali is empty</h3>
              <p className="text-sm text-walnut mt-1.5 max-w-xs">
                Begin with daily kapur and chandan, or pick a festival kit checked item by item.
              </p>
              <Button asChild className="mt-6" onClick={closeCart}>
                <Link to="/shop">Shop Puja Essentials</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Line items */}
              <ul className="divide-y divide-hairline">
                {items.map((item) => (
                  <li key={item.sku} className="py-3.5 flex gap-3.5">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="w-16 h-20 rounded-sm bg-parchment overflow-hidden shrink-0 border border-hairline"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="font-playfair text-sm font-medium text-espresso hover:text-tulsi line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-walnut">{item.variantLabel}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.sku)}
                          aria-label={`Remove ${item.name}`}
                          className="text-walnut/70 hover:text-sindoor p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="inline-flex items-center border border-hairline rounded-sm bg-white h-8">
                          <button
                            type="button"
                            onClick={() => updateQty(item.sku, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="w-8 h-full flex items-center justify-center text-espresso hover:bg-sandal"
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
                            className="w-8 h-full flex items-center justify-center text-espresso hover:bg-sandal"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-semibold font-tabular text-espresso">
                            {formatINR(item.price * item.qty)}
                          </span>
                          {item.compareAtPrice && (
                            <span className="block text-[11px] text-walnut line-through font-tabular">
                              {formatINR(item.compareAtPrice * item.qty)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Don't forget add-ons */}
              {addOns.length > 0 && (
                <div className="pt-3 border-t border-hairline">
                  <p className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-gold mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Don&apos;t forget
                  </p>
                  <div className="space-y-2">
                    {addOns
                      .filter((p) => !items.some((i) => i.productId === p.id))
                      .slice(0, 2)
                      .map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-sm bg-parchment/50 border border-hairline"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={addon.images[0]}
                              alt={addon.name}
                              className="w-10 h-12 object-cover rounded-sm shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-espresso truncate">
                                {addon.name}
                              </p>
                              <p className="text-xs text-walnut font-tabular">
                                {formatINR(addon.price)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addItem(addon, addon.variants[0], 1, false)}
                            className="px-3 h-8 rounded-sm border border-tulsi text-tulsi text-[11px] font-semibold uppercase tracking-wider hover:bg-tulsi hover:text-ivory transition-colors shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Gift wrap */}
              <div className="p-3.5 rounded-sm bg-parchment/50 border border-hairline space-y-2.5">
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="flex items-center gap-2 text-sm text-espresso font-medium">
                    <Gift className="w-4 h-4 text-gold" />
                    Add ceremonial gift wrap (+{formatINR(STORE_INFO.giftWrapFee)})
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
                    placeholder="Write a blessing or gift note..."
                    className="w-full rounded-sm border border-hairline bg-white p-2.5 text-sm text-espresso focus:outline-none focus:border-tulsi"
                  />
                )}
              </div>

              {/* Coupon */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-parchment border border-tulsi/40 text-xs">
                    <span className="text-tulsi font-medium">
                      {couponCode} applied (-{formatINR(couponDiscount)})
                    </span>
                    <button
                      type="button"
                      onClick={clearCoupon}
                      className="text-walnut hover:text-sindoor underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. SHUBH10)"
                      className="flex-1 h-10 px-3 rounded-sm border border-hairline bg-white text-sm text-espresso focus:outline-none focus:border-tulsi"
                    />
                    <button
                      type="submit"
                      className="h-10 px-4 rounded-sm border border-espresso text-xs font-semibold uppercase tracking-wider text-espresso hover:bg-sandal"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback && !couponCode && (
                  <p className="text-xs text-sindoor mt-1">{couponFeedback}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-hairline bg-parchment/40 space-y-3">
            <div className="flex items-center justify-between text-base font-semibold text-espresso">
              <span>Subtotal</span>
              <span className="font-tabular text-lg">{formatINR(Math.max(0, finalSubtotal))}</span>
            </div>
            <p className="text-xs text-walnut">
              Shipping &amp; COD calculated at next step. Same-day Kolkata dispatch before 2 pm.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button asChild size="lg" className="w-full" onClick={closeCart}>
                <Link to="/checkout">Checkout</Link>
              </Button>
              <Link
                to="/cart"
                onClick={closeCart}
                className="text-center text-xs font-medium text-walnut hover:text-espresso underline underline-offset-4 py-1"
              >
                View full thali page
              </Link>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-walnut pt-1">
              <Lock className="w-3 h-3 text-gold" />
              <span>Secure Razorpay UPI, Cards &amp; COD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

