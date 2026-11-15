import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Star, Check, Bell } from 'lucide-react';
import { BadgeType, Product, ProductVariant } from '@/types';
import { formatINR, cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

function getBadgeStyle(badge: BadgeType) {
  switch (badge) {
    case 'bestseller':
      return { label: 'Bestseller', className: 'border border-gold bg-ivory text-gold' };
    case 'new':
      return { label: 'New', className: 'bg-tulsi text-ivory' };
    case 'festival-essential':
      return { label: 'Festival Essential', className: 'border border-sindoor bg-ivory text-sindoor' };
    case 'low-stock':
      return { label: 'Low stock', className: 'bg-parchment/95 text-walnut' };
  }
}

export function ProductCard({ product }: { product: Product }) {
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [variantSheetOpen, setVariantSheetOpen] = useState(false);

  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const wishlisted = isWishlisted(product.id);
  const primaryBadge = product.badges[0];
  const hasMultipleVariants = product.variants.length > 1;
  const secondImage = product.images[1] ?? product.images[0];

  const handleQuickAdd = (variant?: ProductVariant) => {
    const v = variant ?? product.variants[0];
    if (!product.inStock || v.stock === 0) {
      showToast({
        message: `We'll notify you as soon as ${product.name} is back in Kolkata stock.`,
      });
      return;
    }
    addItem(product, v, 1, true);
    setAddedFeedback(true);
    setVariantSheetOpen(false);
    setTimeout(() => setAddedFeedback(false), 1200);
  };

  return (
    <>
      <article className="group relative flex flex-col rounded-md border border-hairline bg-ivory overflow-hidden transition-all duration-fast ease-temple hover:-translate-y-0.5 hover:shadow-card">
        {/* Image Well */}
        <div className="relative aspect-[4/5] bg-parchment overflow-hidden">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={product.images[0]}
              alt={`${product.name} (${product.nameHi})`}
              loading="lazy"
              className={cn(
                'w-full h-full object-cover transition-opacity duration-base ease-standard',
                !product.inStock && 'opacity-60',
                secondImage !== product.images[0] && 'group-hover:opacity-0'
              )}
            />
            {secondImage !== product.images[0] && (
              <img
                src={secondImage}
                alt={`${product.name} detail view`}
                loading="lazy"
                className={cn(
                  'absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-base ease-standard group-hover:opacity-100',
                  !product.inStock && 'group-hover:opacity-60'
                )}
              />
            )}
          </Link>

          {/* Top-left badge */}
          {!product.inStock ? (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-sandal text-walnut text-[11px] font-medium">
              Out of stock
            </span>
          ) : primaryBadge ? (
            <span
              className={cn(
                'absolute top-3 left-3 px-2.5 py-0.5 rounded-sm text-[11px] font-medium tracking-wide',
                getBadgeStyle(primaryBadge).className
              )}
            >
              {getBadgeStyle(primaryBadge).label}
            </span>
          ) : null}

          {/* Top-right wishlist */}
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className="absolute top-1.5 right-1.5 w-11 h-11 flex items-center justify-center rounded-full text-espresso/80 hover:text-gold transition-transform duration-fast active:scale-110"
          >
            <Heart
              className={cn(
                'w-5 h-5 stroke-[1.6] transition-colors',
                wishlisted ? 'fill-gold text-gold' : 'fill-ivory/70 text-espresso'
              )}
            />
          </button>

          {/* Desktop hover slide-up CTA */}
          {product.inStock ? (
            <div className="hidden md:block absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-fast ease-temple">
              {hasMultipleVariants ? (
                <button
                  type="button"
                  onClick={() => setVariantSheetOpen(true)}
                  className="w-full h-10 rounded-sm bg-tulsi text-ivory text-xs font-semibold uppercase tracking-[0.08em] hover:bg-tulsi-hover shadow-sm"
                >
                  Choose size
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleQuickAdd()}
                  className="w-full h-10 rounded-sm bg-tulsi text-ivory text-xs font-semibold uppercase tracking-[0.08em] hover:bg-tulsi-hover shadow-sm flex items-center justify-center gap-1.5"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Added ✓
                    </>
                  ) : (
                    'Add to cart'
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="hidden md:block absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-fast ease-temple">
              <button
                type="button"
                onClick={() => handleQuickAdd()}
                className="w-full h-10 rounded-sm bg-ivory border border-espresso text-espresso text-xs font-semibold uppercase tracking-[0.08em] hover:bg-sandal flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" /> Notify me
              </button>
            </div>
          )}

          {/* Mobile always-visible quick add "+" button */}
          <button
            type="button"
            onClick={() => (hasMultipleVariants && product.inStock ? setVariantSheetOpen(true) : handleQuickAdd())}
            aria-label={product.inStock ? `Quick add ${product.name}` : `Notify when ${product.name} restocks`}
            className={cn(
              'md:hidden absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border',
              product.inStock
                ? 'bg-tulsi text-ivory border-tulsi'
                : 'bg-ivory text-espresso border-hairline'
            )}
          >
            {product.inStock ? (
              addedFeedback ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />
            ) : (
              <Bell className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Info block */}
        <div className="p-3.5 md:p-4 flex flex-col flex-1 justify-between">
          <div>
            {product.brand === 'Herbaa' && (
              <span className="inline-block mb-1 px-2 py-0.5 rounded-sm bg-parchment text-[10px] font-cinzel uppercase tracking-[0.18em] text-walnut">
                Herbaa
              </span>
            )}
            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="font-playfair text-[16px] md:text-[18px] font-medium leading-snug text-espresso line-clamp-2 group-hover:text-tulsi transition-colors">
                {product.name}
              </h3>
            </Link>
            <p lang="hi" className="text-[12px] md:text-[13px] text-walnut mt-0.5 truncate">
              {product.nameHi}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-hairline/70 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-jakarta font-semibold text-base text-espresso font-tabular">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-walnut/70 line-through font-tabular">
                  {formatINR(product.compareAtPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-walnut">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" aria-hidden="true" />
              <span className="font-medium font-tabular">{product.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </article>

      {/* Variant selector sheet/modal for multi-variant quick add */}
      {variantSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-espresso/40 flex items-end md:items-center justify-center p-0 md:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Choose option for ${product.name}`}
        >
          <div className="w-full md:max-w-md bg-ivory rounded-t-lg md:rounded-md border border-hairline p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-gold">
                  Choose Variant
                </p>
                <h4 className="font-playfair text-xl text-espresso mt-0.5">{product.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setVariantSheetOpen(false)}
                className="text-sm text-walnut hover:text-espresso px-2 py-1"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              {product.variants.map((v) => (
                <button
                  key={v.sku}
                  type="button"
                  disabled={v.stock === 0}
                  onClick={() => handleQuickAdd(v)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-sm border border-hairline bg-parchment/40 hover:bg-sandal hover:border-tulsi transition-colors disabled:opacity-50"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-espresso">{v.label}</p>
                    <p className="text-xs text-walnut">
                      {v.stock === 0 ? 'Out of stock' : v.stock <= 5 ? `Only ${v.stock} left` : 'In stock'}
                    </p>
                  </div>
                  <span className="font-semibold text-sm font-tabular text-tulsi">
                    {formatINR(v.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

