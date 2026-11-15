import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, ArrowUpDown, X, ChevronRight } from 'lucide-react';
import { getCollectionBySlug, getCollections, getFestivals, getProducts } from '@/lib/api';
import { BrandName, Collection, Festival, MaterialType, Product } from '@/types';
import { formatINR } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LotusGlyph } from '@/components/BrandMark';

const MATERIAL_OPTIONS: { value: MaterialType; label: string }[] = [
  { value: 'brass', label: 'Solid Brass' },
  { value: 'marble', label: 'Makrana Marble' },
  { value: 'clay', label: 'Terracotta Clay' },
  { value: 'ceramic', label: 'Glazed Ceramic' },
  { value: 'sandalwood', label: 'Sandalwood' },
  { value: 'stone', label: 'Sacred Stones' },
  { value: 'botanical', label: 'Herbs & Attars' },
];

export function ShopPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [collection, setCollection] = useState<Collection | undefined>();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCollection, setSelectedCollection] = useState<string>(slug || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    searchParams.get('sub') || ''
  );
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialType[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<BrandName | ''>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [visibleCount, setVisibleCount] = useState(24);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  useEffect(() => {
    setSelectedCollection(slug || '');
    setSelectedSubcategory(searchParams.get('sub') || '');
  }, [slug, searchParams]);

  useEffect(() => {
    Promise.all([getCollections(), getFestivals()]).then(([cols, fests]) => {
      setCollections(cols);
      setFestivals(fests);
    });
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const [colData, prods] = await Promise.all([
        slug ? getCollectionBySlug(slug) : Promise.resolve(undefined),
        getProducts({
          collection: selectedCollection || undefined,
          subcategory: selectedSubcategory || undefined,
          maxPrice,
          materials: selectedMaterials,
          festival: selectedFestival || undefined,
          brand: selectedBrand || undefined,
          inStockOnly,
          sort: sortBy,
        }),
      ]);
      if (!active) return;
      setCollection(colData);
      setProducts(prods);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [
    slug,
    selectedCollection,
    selectedSubcategory,
    maxPrice,
    selectedMaterials,
    selectedFestival,
    selectedBrand,
    inStockOnly,
    sortBy,
  ]);

  const toggleMaterial = (mat: MaterialType) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const clearAllFilters = () => {
    if (!slug) setSelectedCollection('');
    setSelectedSubcategory('');
    setMaxPrice(3500);
    setSelectedMaterials([]);
    setSelectedFestival('');
    setSelectedBrand('');
    setInStockOnly(false);
    setSearchParams({});
  };

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (!slug && selectedCollection) {
      const found = collections.find((c) => c.slug === selectedCollection);
      chips.push({
        key: 'col',
        label: found?.name || selectedCollection,
        onRemove: () => setSelectedCollection(''),
      });
    }
    if (selectedSubcategory) {
      chips.push({
        key: 'sub',
        label: selectedSubcategory,
        onRemove: () => {
          setSelectedSubcategory('');
          setSearchParams({});
        },
      });
    }
    if (maxPrice < 3500) {
      chips.push({
        key: 'price',
        label: `Under ${formatINR(maxPrice)}`,
        onRemove: () => setMaxPrice(3500),
      });
    }
    selectedMaterials.forEach((m) => {
      chips.push({
        key: `mat-${m}`,
        label: MATERIAL_OPTIONS.find((o) => o.value === m)?.label || m,
        onRemove: () => toggleMaterial(m),
      });
    });
    if (selectedFestival) {
      const f = festivals.find((x) => x.slug === selectedFestival);
      chips.push({
        key: 'fest',
        label: f?.name || selectedFestival,
        onRemove: () => setSelectedFestival(''),
      });
    }
    if (selectedBrand) {
      chips.push({
        key: 'brand',
        label: selectedBrand,
        onRemove: () => setSelectedBrand(''),
      });
    }
    if (inStockOnly) {
      chips.push({
        key: 'stock',
        label: 'In stock only',
        onRemove: () => setInStockOnly(false),
      });
    }
    return chips;
  }, [
    slug,
    selectedCollection,
    selectedSubcategory,
    maxPrice,
    selectedMaterials,
    selectedFestival,
    selectedBrand,
    inStockOnly,
    collections,
    festivals,
    setSearchParams,
  ]);

  const pageTitle = collection
    ? `${collection.name} Online | Varcham India Kolkata`
    : 'Shop All Puja Essentials | Varcham India';
  const pageDesc = collection
    ? `Shop ${collection.name} — ${collection.description} Same-day Kolkata delivery & pan-India courier.`
    : 'Browse authentic puja samagri, attars, brass & marble diyas, sandalwood malas, and Herbaa wellness.';

  const FilterControls = () => (
    <div className="space-y-6">
      {!slug && (
        <div>
          <h3 className="font-jakarta text-xs font-semibold uppercase tracking-[0.12em] text-espresso mb-3">
            Collection
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-walnut cursor-pointer">
              <input
                type="radio"
                name="collection"
                checked={selectedCollection === ''}
                onChange={() => setSelectedCollection('')}
                className="accent-tulsi"
              />
              <span>All Collections</span>
            </label>
            {collections.map((c) => (
              <label key={c.slug} className="flex items-center gap-2 text-sm text-walnut cursor-pointer">
                <input
                  type="radio"
                  name="collection"
                  checked={selectedCollection === c.slug}
                  onChange={() => setSelectedCollection(c.slug)}
                  className="accent-tulsi"
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="pt-4 border-t border-hairline">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-jakarta text-xs font-semibold uppercase tracking-[0.12em] text-espresso">
            Max Price
          </h3>
          <span className="text-xs font-semibold text-tulsi font-tabular">
            {formatINR(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={3500}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full accent-tulsi"
        />
      </div>

      {/* Material */}
      <div className="pt-4 border-t border-hairline">
        <h3 className="font-jakarta text-xs font-semibold uppercase tracking-[0.12em] text-espresso mb-3">
          Material &amp; Craft
        </h3>
        <div className="space-y-2">
          {MATERIAL_OPTIONS.map((mat) => (
            <label key={mat.value} className="flex items-center gap-2.5 text-sm text-walnut cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMaterials.includes(mat.value)}
                onChange={() => toggleMaterial(mat.value)}
                className="h-4 w-4 accent-tulsi rounded-sm"
              />
              <span>{mat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Festival */}
      <div className="pt-4 border-t border-hairline">
        <h3 className="font-jakarta text-xs font-semibold uppercase tracking-[0.12em] text-espresso mb-2.5">
          Puja / Festival
        </h3>
        <select
          value={selectedFestival}
          onChange={(e) => setSelectedFestival(e.target.value)}
          aria-label="Filter by festival"
          className="w-full h-10 rounded-sm border border-hairline bg-white px-3 text-sm text-espresso"
        >
          <option value="">All Festivals</option>
          {festivals.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="pt-4 border-t border-hairline">
        <h3 className="font-jakarta text-xs font-semibold uppercase tracking-[0.12em] text-espresso mb-3">
          Brand
        </h3>
        <div className="flex gap-2">
          {(['', 'Varcham', 'Herbaa'] as const).map((b) => (
            <button
              key={b || 'all'}
              type="button"
              onClick={() => setSelectedBrand(b)}
              className={`px-3 py-1.5 rounded-sm border text-xs font-medium ${
                selectedBrand === b
                  ? 'border-tulsi bg-tulsi text-ivory'
                  : 'border-hairline bg-white text-walnut hover:bg-sandal'
              }`}
            >
              {b || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="pt-4 border-t border-hairline">
        <label className="flex items-center justify-between text-sm text-espresso cursor-pointer">
          <span className="font-medium">In stock only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 accent-tulsi"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Helmet>

      {/* Collection / Shop Banner */}
      <section className="bg-parchment border-b border-hairline py-8 md:py-12">
        <div className="container">
          <nav aria-label="Breadcrumb" className="text-xs text-walnut flex items-center gap-1.5 mb-4">
            <Link to="/" className="hover:text-tulsi">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            {collection ? (
              <>
                <Link to="/shop" className="hover:text-tulsi">
                  Shop
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                <span className="text-espresso font-medium">{collection.name}</span>
              </>
            ) : (
              <span className="text-espresso font-medium">Shop All Essentials</span>
            )}
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2.5">
              <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                {collection ? collection.name.toUpperCase() : 'VARCHAM CATALOG'}
              </p>
              <h1 className="font-playfair text-3xl md:text-5xl text-espresso">
                {collection ? collection.headline : 'Every sacred essential under one roof'}
              </h1>
              <p className="text-base text-walnut max-w-2xl">
                {collection
                  ? collection.description
                  : 'Authentic samagri, hand-poured brass & marble, museum-grade sandalwood, and alcohol-free attars.'}
              </p>

              {/* Sub-category chips */}
              {collection && (
                <div className="pt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedSubcategory === ''
                        ? 'bg-tulsi text-ivory border-tulsi'
                        : 'bg-ivory text-walnut border-hairline hover:bg-sandal'
                    }`}
                  >
                    All {collection.name}
                  </button>
                  {collection.subcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selectedSubcategory === sub
                          ? 'bg-tulsi text-ivory border-tulsi'
                          : 'bg-ivory text-walnut border-hairline hover:bg-sandal'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {collection && (
              <div className="hidden md:flex md:col-span-4 justify-end">
                <div className="w-44 aspect-[3/4] arch-mask overflow-hidden border border-gold/40 bg-ivory">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <section className="py-8 md:py-14 bg-ivory">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 pr-2">
            <div className="sticky top-24 p-5 rounded-md border border-hairline bg-parchment/40">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-hairline">
                <h2 className="font-cinzel text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                  Filter Essentials
                </h2>
                {activeChips.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs text-tulsi hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <FilterControls />
            </div>
          </aside>

          {/* Right Grid Column */}
          <div className="lg:col-span-9 space-y-5">
            {/* Toolbar */}
            <div className="sticky top-14 md:static z-20 bg-ivory py-2.5 border-b border-hairline flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-espresso">
                  Showing <span className="font-semibold font-tabular">{products.length}</span> essentials
                </p>
                <p className="text-xs text-tulsi">Ships same day in Kolkata before 2 pm</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 h-10 px-3.5 rounded-sm border border-hairline bg-parchment/60 text-xs font-semibold uppercase tracking-wider text-espresso"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gold" /> Filter
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSortOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 h-10 px-3.5 rounded-sm border border-hairline bg-parchment/60 text-xs font-semibold uppercase tracking-wider text-espresso"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-gold" /> Sort
                </button>

                <select
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="hidden lg:block h-10 rounded-sm border border-hairline bg-white px-3 text-sm text-espresso focus:outline-none focus:border-tulsi"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sandal text-xs font-medium text-espresso hover:bg-parchment"
                  >
                    <span>{chip.label}</span>
                    <X className="w-3 h-3 text-walnut" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-tulsi font-medium underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center rounded-md border border-hairline bg-parchment/40 px-4">
                <LotusGlyph className="w-10 h-10 text-gold mx-auto mb-3" />
                <h2 className="font-playfair text-2xl text-espresso">Nothing matches yet</h2>
                <p className="text-sm text-walnut mt-1.5">
                  Try removing a filter or widening your price range.
                </p>
                <Button onClick={clearAllFilters} className="mt-5">
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {products.slice(0, visibleCount).map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
                {products.length > visibleCount && (
                  <div className="pt-6 text-center">
                    <Button
                      variant="secondary"
                      onClick={() => setVisibleCount((c) => c + 24)}
                    >
                      Load more essentials
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Bottom Collection SEO Copy */}
            {collection && (
              <div className="mt-12 pt-8 border-t border-hairline text-sm text-walnut leading-relaxed">
                <h2 className="font-playfair text-xl text-espresso mb-2">
                  About {collection.name} at Varcham India
                </h2>
                <p>{collection.seoCopy}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-espresso/40">
          <div className="bg-ivory rounded-t-xl border-t border-hairline max-h-[85vh] flex flex-col">
            <div className="w-12 h-1 bg-hairline rounded-full mx-auto mt-3 mb-1" />
            <div className="px-5 py-3 border-b border-hairline flex items-center justify-between">
              <h3 className="font-playfair text-xl text-espresso">Filters</h3>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-medium text-tulsi"
              >
                Clear all
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterControls />
            </div>
            <div className="p-4 border-t border-hairline bg-parchment/50">
              <Button
                className="w-full"
                size="lg"
                onClick={() => setMobileFilterOpen(false)}
              >
                Show {products.length} products
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {mobileSortOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-espresso/40">
          <div className="bg-ivory rounded-t-xl border-t border-hairline p-5 space-y-3">
            <div className="w-12 h-1 bg-hairline rounded-full mx-auto mb-2" />
            <h3 className="font-playfair text-xl text-espresso">Sort essentials</h3>
            {[
              { value: 'featured', label: 'Featured' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
              { value: 'newest', label: 'Newest Arrivals' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSortBy(opt.value as typeof sortBy);
                  setMobileSortOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-sm border text-sm font-medium ${
                  sortBy === opt.value
                    ? 'border-tulsi bg-parchment text-tulsi'
                    : 'border-hairline text-espresso'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

