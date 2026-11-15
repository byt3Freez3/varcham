import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, ChevronDown, Store, Truck, Package, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { checkPincode } from '@/lib/api';
import { STORE_INFO } from '@/data/store';
import { FulfilmentType, OrderRecord } from '@/types';
import { formatINR, cn } from '@/lib/utils';
import { BrandLogo } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CheckoutPage() {
  const { items, subtotal, couponDiscount, giftWrap, giftMessage, clearCart } = useCart();
  const { user, recordOrder } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, navigate]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Step 1: Contact
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [contactError, setContactError] = useState('');

  // Step 2: Delivery
  const [fullName, setFullName] = useState(user.fullName || '');
  const [pincode, setPincode] = useState('700054');
  const [city, setCity] = useState('Kolkata');
  const [stateName, setStateName] = useState('West Bengal');
  const [line1, setLine1] = useState('');
  const [landmark, setLandmark] = useState('');
  const [fulfilment, setFulfilment] = useState<FulfilmentType>('kolkata_same_day');
  const [deliveryError, setDeliveryError] = useState('');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [placingOrder, setPlacingOrder] = useState(false);

  const isKolkataPin = pincode.trim().startsWith('700') && pincode.trim().length === 6;

  const handlePincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      const info = await checkPincode(clean);
      if (info.valid) {
        setCity(info.city);
        setStateName(info.state);
        if (!info.isKolkata && fulfilment === 'kolkata_same_day') {
          setFulfilment('courier');
        } else if (info.isKolkata && fulfilment === 'courier') {
          setFulfilment('kolkata_same_day');
        }
      }
    }
  };

  const shippingFee =
    fulfilment === 'pickup'
      ? 0
      : fulfilment === 'kolkata_same_day'
      ? subtotal >= STORE_INFO.freeKolkataThreshold
        ? 0
        : STORE_INFO.kolkataShippingFee
      : subtotal >= STORE_INFO.freeIndiaThreshold
      ? 0
      : STORE_INFO.panIndiaShippingFee;

  const codFee = paymentMethod === 'cod' && fulfilment !== 'pickup' ? STORE_INFO.codFee : 0;
  const giftFee = giftWrap ? STORE_INFO.giftWrapFee : 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee + codFee + giftFee);

  const handleContinueStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setContactError('Enter a 10-digit Indian mobile number for order updates.');
      return;
    }
    setContactError('');
    setStep(2);
  };

  const handleContinueStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setDeliveryError('Please enter recipient full name.');
      return;
    }
    if (fulfilment !== 'pickup' && (pincode.length !== 6 || !line1.trim())) {
      setDeliveryError('Enter a 6-digit pincode and street address.');
      return;
    }
    setDeliveryError('');
    setStep(3);
  };

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    const num = `VAR-${new Date().toISOString().slice(2, 4)}11-${Math.floor(1000 + Math.random() * 8999)}`;
    const eta =
      fulfilment === 'pickup'
        ? 'Ready today at Phoolbagan store (10 AM – 8:30 PM)'
        : fulfilment === 'kolkata_same_day'
        ? 'Today by 7:30 PM (Kolkata Same-Day)'
        : 'Arriving in 3–6 business days';

    const newOrder: OrderRecord = {
      orderNumber: num,
      createdAt: new Date().toISOString(),
      customerName: fullName,
      phone: phone.replace(/\D/g, '').slice(-10),
      email: email || undefined,
      city,
      pincode,
      addressSummary:
        fulfilment === 'pickup'
          ? STORE_INFO.fullAddress
          : `${line1}${landmark ? `, ${landmark}` : ''}, ${city} ${pincode}`,
      fulfilment,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'COD' : 'Paid',
      status: 'Placed',
      items: items.map((i) => ({
        name: i.name,
        variantLabel: i.variantLabel,
        qty: i.qty,
        unitPrice: i.price,
        image: i.image,
      })),
      subtotal,
      discount: couponDiscount,
      shippingFee,
      codFee,
      giftWrapFee: giftFee,
      total: grandTotal,
      giftMessage: giftWrap ? giftMessage : undefined,
      estimatedDelivery: eta,
      timeline: [
        {
          status: 'Placed',
          note:
            paymentMethod === 'cod'
              ? 'Order placed with Cash on Delivery'
              : `Prepaid order confirmed via ${paymentMethod.toUpperCase()}`,
          timestamp: 'Just now',
        },
      ],
    };

    setTimeout(() => {
      recordOrder(newOrder);
      clearCart();
      navigate(`/order/${num}/success`, { state: { order: newOrder } });
    }, 450);
  };

  const OrderSummaryBox = () => (
    <div className="space-y-4">
      <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.sku} className="flex items-center gap-3 text-sm">
            <div className="relative w-12 h-14 rounded-sm bg-ivory border border-hairline overflow-hidden shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-tulsi text-ivory text-[10px] font-semibold flex items-center justify-center">
                {item.qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-espresso truncate">{item.name}</p>
              <p className="text-xs text-walnut">{item.variantLabel}</p>
            </div>
            <span className="font-semibold font-tabular text-espresso">
              {formatINR(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="pt-3 border-t border-hairline space-y-2 text-sm">
        <div className="flex justify-between text-walnut">
          <span>Subtotal</span>
          <span className="font-tabular">{formatINR(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-tulsi">
            <span>Coupon discount</span>
            <span className="font-tabular">-{formatINR(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-walnut">
          <span>Delivery</span>
          <span className="font-tabular">
            {shippingFee === 0 ? 'Free' : formatINR(shippingFee)}
          </span>
        </div>
        {codFee > 0 && (
          <div className="flex justify-between text-walnut">
            <span>COD convenience fee</span>
            <span className="font-tabular">{formatINR(codFee)}</span>
          </div>
        )}
        {giftFee > 0 && (
          <div className="flex justify-between text-walnut">
            <span>Gift wrap</span>
            <span className="font-tabular">{formatINR(giftFee)}</span>
          </div>
        )}
        <div className="pt-3 border-t border-hairline flex justify-between items-baseline">
          <span className="font-playfair text-lg text-espresso">Total</span>
          <span className="font-playfair text-2xl font-medium text-espresso font-tabular">
            {formatINR(grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Secure Checkout | Varcham India</title>
        <meta name="description" content="Complete your Varcham India order with UPI, Card, Netbanking, Cash on Delivery, or Kolkata store pickup." />
      </Helmet>

      {/* Distraction-free Checkout Header */}
      <header className="h-16 bg-ivory border-b border-hairline">
        <div className="container h-full flex items-center justify-between">
          <Link to="/" aria-label="Return to Varcham home">
            <BrandLogo compact />
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-cinzel uppercase tracking-[0.2em] text-tulsi">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Mobile Collapsible Order Summary */}
      <div className="lg:hidden bg-parchment border-b border-hairline">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen((o) => !o)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-sm font-medium text-espresso"
        >
          <span className="inline-flex items-center gap-1.5 text-tulsi">
            {mobileSummaryOpen ? 'Hide' : 'Show'} order summary
            <ChevronDown className={cn('w-4 h-4 transition-transform', mobileSummaryOpen && 'rotate-180')} />
          </span>
          <span className="font-semibold text-base font-tabular">{formatINR(grandTotal)}</span>
        </button>
        {mobileSummaryOpen && (
          <div className="px-4 pb-5 pt-2 border-t border-hairline">
            <OrderSummaryBox />
          </div>
        )}
      </div>

      <section className="py-8 md:py-12 bg-ivory min-h-[calc(100vh-4rem)]">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 3-Step Flow */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step Progress Indicator */}
            <div className="flex items-center gap-2 text-xs font-cinzel uppercase tracking-[0.18em]">
              <span className={step >= 1 ? 'text-tulsi font-semibold' : 'text-walnut'}>1. Contact</span>
              <span className="text-gold">→</span>
              <span className={step >= 2 ? 'text-tulsi font-semibold' : 'text-walnut'}>2. Delivery</span>
              <span className="text-gold">→</span>
              <span className={step >= 3 ? 'text-tulsi font-semibold' : 'text-walnut'}>3. Payment</span>
            </div>

            {/* STEP 1: CONTACT */}
            <div className="rounded-md border border-hairline bg-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-xl text-espresso flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-tulsi text-ivory text-xs font-sans flex items-center justify-center">
                    1
                  </span>
                  Contact Details
                </h2>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-tulsi underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step > 1 ? (
                <p className="mt-2 text-sm text-walnut flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tulsi" />
                  <span>
                    +91 {phone} {email ? `· ${email}` : ''}
                  </span>
                </p>
              ) : (
                <form onSubmit={handleContinueStep1} className="mt-5 space-y-4">
                  <Input
                    label="Mobile Number (for order & delivery updates)"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    error={contactError}
                    required
                  />
                  <Input
                    label="Email Address (optional — for GST receipt)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                  />
                  <label className="flex items-start gap-2.5 text-xs text-walnut cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappUpdates}
                      onChange={(e) => setWhatsappUpdates(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-tulsi"
                    />
                    <span>
                      Send order updates &amp; dispatch tracking on WhatsApp. Only order updates — no spam.
                    </span>
                  </label>
                  <Button type="submit" className="w-full sm:w-auto">
                    Continue to Delivery
                  </Button>
                </form>
              )}
            </div>

            {/* STEP 2: DELIVERY */}
            <div className="rounded-md border border-hairline bg-white p-5 md:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-xl text-espresso flex items-center gap-2.5">
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full text-xs font-sans flex items-center justify-center',
                      step >= 2 ? 'bg-tulsi text-ivory' : 'bg-sandal text-walnut'
                    )}
                  >
                    2
                  </span>
                  Delivery Address &amp; Method
                </h2>
                {step > 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-tulsi underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step > 2 ? (
                <p className="mt-2 text-sm text-walnut flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tulsi" />
                  <span>
                    {fulfilment === 'pickup'
                      ? `Store Pickup — ${STORE_INFO.addressLine1}, Kolkata`
                      : `${fullName} · ${line1}, ${city} ${pincode}`}
                  </span>
                </p>
              ) : step === 2 ? (
                <form onSubmit={handleContinueStep2} className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                    <Input
                      label="Pincode"
                      inputMode="numeric"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      helperText={isKolkataPin ? 'Kolkata same-day eligible' : 'Pan-India courier eligible'}
                    />
                  </div>

                  {/* Delivery radio cards */}
                  <div className="space-y-2.5 pt-1">
                    <p className="text-[13px] font-medium text-walnut">Choose fulfilment</p>

                    <label
                      className={cn(
                        'flex items-start gap-3 p-3.5 rounded-sm border cursor-pointer transition-colors',
                        fulfilment === 'kolkata_same_day'
                          ? 'border-tulsi bg-parchment/50'
                          : 'border-hairline hover:bg-parchment/25',
                        !isKolkataPin && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <input
                        type="radio"
                        name="fulfilment"
                        disabled={!isKolkataPin}
                        checked={fulfilment === 'kolkata_same_day'}
                        onChange={() => setFulfilment('kolkata_same_day')}
                        className="mt-1 accent-tulsi"
                      />
                      <Truck className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm font-semibold text-espresso">
                          <span>Kolkata Same-Day Delivery</span>
                          <span className="text-tulsi font-tabular">
                            {subtotal >= STORE_INFO.freeKolkataThreshold
                              ? 'Free'
                              : formatINR(STORE_INFO.kolkataShippingFee)}
                          </span>
                        </div>
                        <p className="text-xs text-walnut mt-0.5">
                          Order before 2 pm for delivery today (Free above ₹499).
                        </p>
                      </div>
                    </label>

                    <label
                      className={cn(
                        'flex items-start gap-3 p-3.5 rounded-sm border cursor-pointer transition-colors',
                        fulfilment === 'pickup'
                          ? 'border-tulsi bg-parchment/50'
                          : 'border-hairline hover:bg-parchment/25'
                      )}
                    >
                      <input
                        type="radio"
                        name="fulfilment"
                        checked={fulfilment === 'pickup'}
                        onChange={() => setFulfilment('pickup')}
                        className="mt-1 accent-tulsi"
                      />
                      <Store className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm font-semibold text-espresso">
                          <span>Store Pickup — Phoolbagan, Kolkata</span>
                          <span className="text-tulsi">Free</span>
                        </div>
                        <p className="text-xs text-walnut mt-0.5">
                          Ready in 2 hours · {STORE_INFO.addressLine1}, behind VIP Market.
                        </p>
                      </div>
                    </label>

                    <label
                      className={cn(
                        'flex items-start gap-3 p-3.5 rounded-sm border cursor-pointer transition-colors',
                        fulfilment === 'courier'
                          ? 'border-tulsi bg-parchment/50'
                          : 'border-hairline hover:bg-parchment/25'
                      )}
                    >
                      <input
                        type="radio"
                        name="fulfilment"
                        checked={fulfilment === 'courier'}
                        onChange={() => setFulfilment('courier')}
                        className="mt-1 accent-tulsi"
                      />
                      <Package className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm font-semibold text-espresso">
                          <span>Standard Pan-India Courier</span>
                          <span className="text-tulsi font-tabular">
                            {subtotal >= STORE_INFO.freeIndiaThreshold
                              ? 'Free'
                              : formatINR(STORE_INFO.panIndiaShippingFee)}
                          </span>
                        </div>
                        <p className="text-xs text-walnut mt-0.5">
                          3–6 business days with tracking (Free above ₹999).
                        </p>
                      </div>
                    </label>
                  </div>

                  {fulfilment !== 'pickup' && (
                    <>
                      <Input
                        label="House / Flat No., Building & Street"
                        value={line1}
                        onChange={(e) => setLine1(e.target.value)}
                        placeholder="e.g. Block BE-14, Salt Lake Sector 1"
                        required
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Input
                          label="Landmark (optional)"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                        />
                        <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                        <Input
                          label="State"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {deliveryError && <p className="text-xs text-sindoor">{deliveryError}</p>}

                  <Button type="submit" className="w-full sm:w-auto">
                    Continue to Payment
                  </Button>
                </form>
              ) : null}
            </div>

            {/* STEP 3: PAYMENT */}
            <div className="rounded-md border border-hairline bg-white p-5 md:p-6">
              <h2 className="font-playfair text-xl text-espresso flex items-center gap-2.5">
                <span
                  className={cn(
                    'w-6 h-6 rounded-full text-xs font-sans flex items-center justify-center',
                    step === 3 ? 'bg-tulsi text-ivory' : 'bg-sandal text-walnut'
                  )}
                >
                  3
                </span>
                Payment Method
              </h2>

              {step === 3 && (
                <div className="mt-5 space-y-4">
                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'upi' as const,
                        title: 'UPI (GPay, PhonePe, Paytm)',
                        sub: 'Instant verification · No extra fee',
                      },
                      {
                        id: 'card' as const,
                        title: 'Credit / Debit Card',
                        sub: 'Visa, Mastercard, RuPay via Razorpay',
                      },
                      {
                        id: 'netbanking' as const,
                        title: 'Netbanking',
                        sub: 'HDFC, ICICI, SBI, Axis & 40+ banks',
                      },
                      {
                        id: 'cod' as const,
                        title: `Cash on Delivery (+${formatINR(STORE_INFO.codFee)})`,
                        sub: 'Pay by UPI instead and save ₹49',
                        disabled: fulfilment === 'pickup',
                      },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={cn(
                          'flex items-start gap-3 p-3.5 rounded-sm border cursor-pointer transition-colors',
                          paymentMethod === opt.id
                            ? 'border-tulsi bg-parchment/50'
                            : 'border-hairline hover:bg-parchment/25',
                          opt.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          disabled={opt.disabled}
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="mt-1 accent-tulsi"
                        />
                        <div>
                          <p className="text-sm font-semibold text-espresso">{opt.title}</p>
                          <p className="text-xs text-walnut">{opt.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    loading={placingOrder}
                    onClick={handlePlaceOrder}
                  >
                    {paymentMethod === 'cod'
                      ? `Place COD order — ${formatINR(grandTotal)}`
                      : `Pay ${formatINR(grandTotal)}`}
                  </Button>

                  <p className="text-center text-xs text-walnut">
                    Secure payments · Easy returns on damaged items · Real store in Kolkata (+91 90079 96100)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sticky Order Summary (Desktop) */}
          <aside className="hidden lg:block lg:col-span-5 sticky top-8 p-6 rounded-md border border-hairline bg-parchment/60">
            <h2 className="font-cinzel text-xs uppercase tracking-[0.22em] text-gold mb-4">
              Order Summary
            </h2>
            <OrderSummaryBox />
          </aside>
        </div>
      </section>
    </>
  );
}

