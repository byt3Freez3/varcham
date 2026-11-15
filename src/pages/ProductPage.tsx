import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Bell,
} from 'lucide-react';
import {
  checkPincode,
  getProductBySlug,
  getRelatedLowPriceAddOns,
  getRelatedProducts,
  getReviews,
  PincodeCheckResult,
} from '@/lib/api';
import { Product, ProductVariant, Review } from '@/types';
import { formatINR, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | undefined>();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const [crossSells, setCrossSells] = useState<Product[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<PincodeCheckResult | null>(null);
  const [addedBtn, setAddedBtn] = useState(false);

  // Desktop zoom lens state
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  // Mobile sticky bar visibility via IntersectionObserver on main CTA
  const mainCtaRef = useRef<HTMLDivElement>(null);
  const [showStickyMobileBar, setShowStickyMobileBar] = useState(false);

  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    async function load() {
      if (!slug) return;
      setLoading(true);
      setActiveImageIdx(0);
      setQty(1);
      const found = await getProductBySlug(slug);
      if (!active) return;
      setProduct(found);

      if (found) {
        const paramV = searchParams.get('v');
        const matchedV = found.variants.find(
          (v) => v.label.toLowerCase() === paramV?.toLowerCase()
        );
        setSelectedVariant(matchedV ?? found.variants[0]);

        const [adds, rels, revs] = await Promise.all([
          getRelatedLowPriceAddOns(found.id),
          getRelatedProducts(found),
          getReviews(found.id),
        ]);
        if (!active) return;
        setCrossSells(adds);
        setRelated(rels);
        setReviews(revs);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setShowStickyMobileBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [product, loading]);

  if (loading) {
    return (
      <div className="container py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <Skeleton className="aspect-[4/5] w-full" />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-12 w-full mt-6" />
        </div>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-playfair text-3xl text-espresso">Product not found</h1>
        <Button asChild>
          <Link to="/shop">Browse Shop</Link>
        </Button>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const outOfStock = !product.inStock || selectedVariant.stock === 0;

  const handleVariantChange = (v: ProductVariant) => {
    setSelectedVariant(v);
    setSearchParams({ v: v.label }, { replace: true });
  };

  const handleAddToCart = () => {
    if (outOfStock) {
      showToast({ message: `We'll message you once ${product.name} restocks.` });
      return;
    }
    addItem(product, selectedVariant, qty, true);
    setAddedBtn(true);
    setTimeout(() => setAddedBtn(false), 1200);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem(product, selectedVariant, qty, false);
    navigate('/checkout');
  };

  const handlePincodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await checkPincode(pincode);
    setPincodeResult(res);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Varcham India</title>
        <meta
          name="description"
          content={`${product.name} — ${product.description} ₹${selectedVariant.price}. Same-day Kolkata delivery from Varcham India.`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            sku: selectedVariant.sku,
            brand: { '@type': 'Brand', name: product.brand },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: selectedVariant.price,
              availability: outOfStock
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
            },
          })}
        </script>
      </Helmet>

      <section className="py-6 md:py-12 bg-ivory pb-24 md:pb-16">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-walnut flex items-center gap-1.5 mb-6">
            <Link to="/" className="hover:text-tulsi">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <Link to={`/collections/${product.collection}`} className="hover:text-tulsi">
              {product.collectionName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold hidden md:inline" />
            <span className="hidden md:inline text-espresso font-medium truncate">
              {product.name}
            </span>
          </nav>

          {/* Main 2-Col PDP */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Gallery 55% (7 cols) */}
            <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
              {/* Vertical Thumbnails Desktop */}
              {product.images.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 shrink-0">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      aria-label={`View image ${idx + 1}`}
                      className={cn(
                        'w-16 h-20 md:w-20 md:h-24 rounded-sm overflow-hidden border bg-parchment shrink-0 transition-all',
                        activeImageIdx === idx
                          ? 'border-tulsi ring-1 ring-tulsi'
                          : 'border-hairline opacity-75 hover:opacity-100'
                      )}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main 4:5 Stage with hover 2x zoom */}
              <div
                className="relative flex-1 aspect-[4/5] rounded-md border border-hairline bg-parchment overflow-hidden cursor-zoom-in"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPos({ x, y, active: true });
                }}
                onMouseLeave={() => setZoomPos((p) => ({ ...p, active: false }))}
              >
                <img
                  src={product.images[activeImageIdx] ?? product.images[0]}
                  alt={`${product.name} (${product.nameHi})`}
                  style={
                    zoomPos.active
                      ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          transform: 'scale(1.85)',
                        }
                      : undefined
                  }
                  className={cn(
                    'w-full h-full object-cover transition-transform duration-fast',
                    outOfStock && 'opacity-65'
                  )}
                />
              </div>
            </div>

            {/* Right Buy Box 45% (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <Link
                  to={`/collections/${product.collection}`}
                  className="font-cinzel text-[11px] font-semibold uppercase tracking-[0.28em] text-gold hover:text-tulsi"
                >
                  {product.collectionName}
                </Link>
                <h1 className="font-playfair text-3xl md:text-[34px] leading-tight text-espresso mt-1.5">
                  {product.name}
                </h1>
                <p lang="hi" className="font-hindi text-lg text-walnut mt-1">
                  {product.nameHi}
                </p>

                {/* Rating */}
                <div className="mt-2.5 flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" aria-hidden="true" />
                    ))}
                  </div>
                  <span className="font-medium text-espresso font-tabular">{product.rating.toFixed(1)}</span>
                  <span className="text-walnut">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-2 border-t border-hairline">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-espresso font-tabular">
                    {formatINR(selectedVariant.price)}
                  </span>
                  {selectedVariant.compareAtPrice && (
                    <span className="text-base text-walnut/70 line-through font-tabular">
                      {formatINR(selectedVariant.compareAtPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-walnut mt-0.5">
                  Inclusive of all taxes · Spec: {product.dimensionsOrWeight}
                </p>
              </div>

              {/* Variants */}
              {product.variants.length > 1 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-walnut">
                    Select Size / Pack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const active = v.sku === selectedVariant.sku;
                      return (
                        <button
                          key={v.sku}
                          type="button"
                          onClick={() => handleVariantChange(v)}
                          className={cn(
                            'px-4 h-10 rounded-sm border text-sm font-medium transition-colors',
                            v.stock === 0 && 'line-through opacity-50',
                            active
                              ? 'border-tulsi bg-sandal text-espresso font-semibold'
                              : 'border-hairline bg-white text-walnut hover:border-walnut'
                          )}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Primary CTAs */}
              <div ref={mainCtaRef} className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-hairline rounded-sm bg-white h-12">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-11 h-full flex items-center justify-center text-espresso hover:bg-sandal"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold font-tabular">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(selectedVariant.stock || 1, q + 1))}
                      aria-label="Increase quantity"
                      className="w-11 h-full flex items-center justify-center text-espresso hover:bg-sandal"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {outOfStock ? (
                    <Button
                      variant="secondary"
                      size="lg"
                      className="flex-1 h-12"
                      onClick={handleAddToCart}
                    >
                      <Bell className="w-4 h-4" /> Notify when back
                    </Button>
                  ) : (
                    <Button size="lg" className="flex-1 h-12" onClick={handleAddToCart}>
                      {addedBtn ? (
                        <>
                          <Check className="w-4 h-4" /> Added ✓
                        </>
                      ) : (
                        'Add to Cart'
                      )}
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="w-12 h-12 rounded-sm border border-hairline bg-white flex items-center justify-center hover:border-gold transition-colors"
                  >
                    <Heart
                      className={cn(
                        'w-5 h-5 stroke-[1.6]',
                        wishlisted ? 'fill-gold text-gold' : 'text-espresso'
                      )}
                    />
                  </button>
                </div>

                {!outOfStock && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full h-12"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                )}

                {selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
                  <p className="text-xs text-walnut font-medium">
                    Only {selectedVariant.stock} left at our Phoolbagan store
                  </p>
                )}
              </div>

              {/* Pincode Checker */}
              <div className="p-4 rounded-sm bg-parchment/55 border border-hairline space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-espresso">
                  Check Delivery Date
                </p>
                <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit pincode (e.g. 700054)"
                    className="flex-1 h-10 rounded-sm border border-hairline bg-white px-3 text-sm text-espresso focus:outline-none focus:border-tulsi"
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    Check
                  </Button>
                </form>
                {pincodeResult && (
                  <p
                    className={cn(
                      'text-xs font-medium',
                      pincodeResult.valid ? 'text-tulsi' : 'text-sindoor'
                    )}
                  >
                    {pincodeResult.etaText}
                  </p>
                )}
              </div>

              {/* 3 Trust Lines */}
              <div className="space-y-2.5 pt-2 text-sm text-walnut border-t border-hairline">
                <p className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span>Authentic &amp; pure — sourced and checked in Kolkata</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-gold shrink-0" />
                  <span>Same-day in Kolkata / 3–6 days across India</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-gold shrink-0" />
                  <span>Damaged on arrival? Free no-questions replacement</span>
                </p>
              </div>

              {/* Accordions */}
              <Accordion type="single" collapsible defaultValue="desc" className="pt-2 border-t border-hairline">
                <AccordionItem value="desc">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>{product.description}</AccordionContent>
                </AccordionItem>

                <AccordionItem value="ritual">
                  <AccordionTrigger>Ritual Use</AccordionTrigger>
                  <AccordionContent>{product.ritualUse}</AccordionContent>
                </AccordionItem>

                <AccordionItem value="care">
                  <AccordionTrigger>Material &amp; Care</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-medium text-espresso mb-1">{product.material}</p>
                    <p>{product.careInstructions}</p>
                  </AccordionContent>
                </AccordionItem>

                {product.fragranceNotes && (
                  <AccordionItem value="fragrance">
                    <AccordionTrigger>Fragrance Notes</AccordionTrigger>
                    <AccordionContent className="space-y-1.5">
                      <p>
                        <strong className="text-espresso">Family:</strong> {product.fragranceNotes.family}
                      </p>
                      <p>
                        <strong className="text-espresso">Top:</strong> {product.fragranceNotes.top}
                      </p>
                      <p>
                        <strong className="text-espresso">Heart:</strong> {product.fragranceNotes.heart}
                      </p>
                      <p>
                        <strong className="text-espresso">Base:</strong> {product.fragranceNotes.base}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="shipping">
                  <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
                  <AccordionContent>
                    Kolkata orders placed before 2 pm qualify for same-day delivery (free ≥ ₹499) or free store pickup at Phoolbagan. Pan-India shipping takes 3–6 business days (free ≥ ₹999). Fragile marble &amp; clay items are double-wrapped; any transit breakage is replaced free within 48 hours of delivery.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Complete the ritual (3 low-price cross-sells) */}
          {crossSells.length > 0 && (
            <div className="mt-16 pt-12 border-t border-hairline">
              <div className="mb-6">
                <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold">
                  PAIRS NATURALLY WITH
                </p>
                <h2 className="font-playfair text-2xl md:text-3xl text-espresso mt-1">
                  Complete the ritual
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {crossSells.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-md border border-hairline bg-parchment/45 flex items-center justify-between gap-3"
                  >
                    <Link to={`/product/${item.slug}`} className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-14 h-16 object-cover rounded-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-playfair text-sm font-medium text-espresso truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-walnut truncate">{item.nameHi}</p>
                        <p className="text-sm font-semibold font-tabular text-tulsi mt-0.5">
                          {formatINR(item.price)}
                        </p>
                      </div>
                    </Link>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => addItem(item, item.variants[0], 1, true)}
                    >
                      + Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          {reviews.length > 0 && (
            <div className="mt-16 pt-12 border-t border-hairline">
              <h2 className="font-playfair text-2xl md:text-3xl text-espresso mb-6">
                Devotee Reviews
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-md border border-hairline bg-parchment/35 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-gold text-gold" />
                        ))}
                      </div>
                      <span className="text-xs text-tulsi font-medium">Verified purchase</span>
                    </div>
                    <p className="font-playfair text-lg text-espresso">{rev.title}</p>
                    <p className="text-sm text-walnut leading-relaxed">{rev.body}</p>
                    <p className="text-xs text-walnut/80 pt-1">
                      {rev.customerName} · {rev.city}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* You may also like */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-hairline">
              <h2 className="font-playfair text-2xl md:text-3xl text-espresso mb-6">
                You may also like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Sticky Bottom Add-to-Cart Bar */}
      {showStickyMobileBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-ivory border-t border-hairline px-4 py-3 flex items-center justify-between gap-3 shadow-card">
          <div>
            <p className="text-xs text-walnut truncate max-w-[140px]">{product.name}</p>
            <p className="text-lg font-semibold font-tabular text-espresso">
              {formatINR(selectedVariant.price)}
            </p>
          </div>
          <Button
            size="lg"
            className="flex-1 h-12"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            {outOfStock ? 'Out of stock' : addedBtn ? 'Added ✓' : 'Add to Cart'}
          </Button>
        </div>
      )}
    </>
  );
}
