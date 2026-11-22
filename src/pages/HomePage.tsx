import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  Store,
  CreditCard,
  Truck,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Star,
  Sparkles,
} from 'lucide-react';
import {
  getArticles,
  getCollections,
  getFeaturedProducts,
  getFestivals,
  getFestivalKit,
  getProducts,
  getReviews,
} from '@/lib/api';
import { STORE_INFO } from '@/data/store';
import { Article, Collection, Festival, Product, Review } from '@/types';
import { formatINR, getCountdownParts } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { BrandLogo, SectionHeader } from '@/components/BrandMark';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { SHOW_TRUST_STRIP } from '@/config/home';
import { GhantaGarland } from '@/components/GhantaGarland';

const ATTAR_FAMILIES: Array<'All' | 'Floral' | 'Woody' | 'Fresh' | 'Musky'> = [
  'All',
  'Floral',
  'Woody',
  'Fresh',
  'Musky',
];

export function HomePage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [attars, setAttars] = useState<Product[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [nextFestival, setNextFestival] = useState<Festival | null>(null);
  const [nextKitPrice, setNextKitPrice] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFamily, setSelectedFamily] = useState<'All' | 'Floral' | 'Woody' | 'Fresh' | 'Musky'>('All');
  const [selectedPujaSlug, setSelectedPujaSlug] = useState('satyanarayan-puja');
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  const [reminderInput, setReminderInput] = useState('');

  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    async function loadHome() {
      const [cols, feat, allProds, fests, revs, arts] = await Promise.all([
        getCollections(),
        getFeaturedProducts(),
        getProducts({ collection: 'attars-sacred-waters' }),
        getFestivals(),
        getReviews(),
        getArticles(),
      ]);

      if (!active) return;
      setCollections(cols);
      setBestsellers(feat.slice(0, 8));
      setAttars(allProds.filter((p) => Boolean(p.fragranceNotes)));
      setFestivals(fests);
      setReviews(revs.slice(0, 3));
      setArticles(arts.slice(0, 3));

      const dated = fests.find((f) => f.date && new Date(f.date).getTime() > Date.now()) ?? fests[0];
      if (dated) {
        setNextFestival(dated);
        const kit = await getFestivalKit(dated.slug);
        if (active && kit) setNextKitPrice(kit.discountedTotal);
      }
      setLoading(false);
    }
    loadHome();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!nextFestival?.date) {
      setCountdown(null);
      return;
    }
    const update = () => {
      const parts = getCountdownParts(nextFestival.date);
      if (parts) setCountdown({ days: parts.days, hours: parts.hours, minutes: parts.minutes });
    };
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, [nextFestival]);

  const filteredAttars =
    selectedFamily === 'All'
      ? attars.slice(0, 4)
      : attars.filter((a) => a.fragranceNotes?.family === selectedFamily).slice(0, 4);

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const step = 310;
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderInput.trim()) return;
    showToast({ message: 'Namaste — festival checklist reminders are now active.' });
    setReminderInput('');
  };

  return (
    <>
      <Helmet>
        <title>Varcham India | Puja Samagri, Attars &amp; Sandalwood, Kolkata</title>
        <meta
          name="description"
          content="Authentic puja essentials, attars, sandalwood malas and brass & marble diyas. Visit our Kolkata store or order online — same-day delivery in Kolkata."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'Varcham India',
            url: 'https://varcham.in',
            telephone: '+91-90079-96100',
            email: 'varchamindia@gmail.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'P-79 Swami Swarupananda Sarani, behind VIP Market, near Phoolbagan PS',
              addressLocality: 'Kolkata',
              addressRegion: 'WB',
              postalCode: '700054',
              addressCountry: 'IN',
            },
            openingHours: 'Mo-Su 10:00-20:30',
          })}
        </script>
      </Helmet>

      {/* 1. HERO with inset antique gold frame + watermark */}
      <section id="hero-section" className="relative bg-ivory overflow-hidden py-4 md:py-10">
        <div className="relative mx-3 md:mx-6 border border-gold/45 rounded-sm bg-ivory paper-grain overflow-hidden p-2 md:p-3">
          {/* Watermark logo behind hero desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:flex items-center justify-center opacity-[0.06]"
          >
            <BrandLogo variant="stacked" className="scale-[3.2]" />
          </div>

          <div className="container relative z-10 pt-5 px-4 pb-7 md:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* Copy (Mobile first order-1 / Desktop left order-1) */}
              <div className="order-1 lg:order-1 lg:col-span-7 relative z-10 space-y-4 md:space-y-5 text-center lg:text-left">
                {/* Mobile Watermark positioned behind copy text block only */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04] lg:hidden overflow-hidden -z-10"
                >
                  <BrandLogo variant="stacked" className="scale-[1.8] max-w-[260px]" />
                </div>

                <p className="font-cinzel text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                  NAMASTE · <span lang="hi">स्वागत है</span>
                </p>

                <h1 className="font-playfair text-[34px] leading-[40px] md:text-[56px] md:leading-[1.14] tracking-[-0.01em] text-espresso font-normal line-clamp-3 md:line-clamp-none">
                  {t('Every ritual, complete and pure.', 'हर पूजा हो संपूर्ण और पवित्र।')}
                </h1>

                <p className="font-playfair italic text-[16px] md:text-[20px] text-tulsi">
                  Rooted in Faith, Inspired by Divine
                </p>

                <p className="text-[15px] leading-[24px] md:text-[18px] md:leading-relaxed text-walnut max-w-[34ch] lg:max-w-xl mx-auto lg:mx-0">
                  Puja samagri, sandalwood, attars and sacred brass &amp; marble — curated in Kolkata, delivered to your mandir.
                </p>

                <div
                  id="hero-ctas"
                  className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3"
                >
                  <Button asChild size="default" className="h-12 md:h-14 w-full sm:w-auto text-xs uppercase tracking-[0.08em] bg-tulsi text-ivory hover:bg-tulsi-hover">
                    <Link to="/shop">Shop Puja Essentials</Link>
                  </Button>
                  <Button asChild variant="secondary" size="default" className="h-12 md:h-14 w-full sm:w-auto text-xs uppercase tracking-[0.08em]">
                    <Link to="/festivals">Find your festival kit</Link>
                  </Button>
                </div>
              </div>

              {/* Image (Mobile below CTAs order-2 / Desktop right order-2) */}
              <div className="order-2 lg:order-2 lg:col-span-5 relative flex justify-center mt-6 lg:mt-0">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 diya-glow animate-diya-breathe scale-105 pointer-events-none"
                />
                <div className="relative w-full max-w-[240px] lg:max-w-[420px] aspect-[4/5] lg:aspect-[3/4] max-h-[300px] lg:max-h-[68vh] mx-auto arch-mask overflow-hidden border border-gold/40 bg-parchment shadow-card">
                  <img
                    src="/images/hero-diya.jpg"
                    alt="Lit handcrafted antique brass diya on carved white marble chowki surrounded by marigolds"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP (Desktop only; 0px height on mobile per brand spec) */}
      {SHOW_TRUST_STRIP && (
        <section className="hidden md:block border-y border-hairline bg-parchment/50 py-7">
          <div className="container grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Authentic & Pure',
                sub: 'Checked for purity in Kolkata',
              },
              {
                icon: Store,
                title: 'Visit Our Kolkata Store',
                sub: 'P-79 Swami Swarupananda Sarani',
              },
              {
                icon: CreditCard,
                title: 'UPI & Cash on Delivery',
                sub: 'Razorpay & transparent COD',
              },
              {
                icon: Truck,
                title: 'Same-day Kolkata Delivery',
                sub: 'Order by 2 pm · Free ≥ ₹499',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <Icon className="w-7 h-7 text-gold stroke-[1.4] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-espresso leading-snug">{item.title}</p>
                    <p className="text-xs text-walnut mt-0.5">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Exactly ONE GhantaGarland between hero/trust strip and Shop by Collection */}
      <GhantaGarland variant="full" />

      {/* 3. SHOP BY COLLECTION (8 Mandir Arch Tiles) */}
      <section className="pt-6 pb-12 md:pt-10 md:pb-16 lg:pb-24 bg-ivory" data-reveal>
        <div className="container">
          <SectionHeader
            eyebrow="SHOP BY COLLECTION"
            title="Curated for every corner of your mandir"
            subtitle="277 store essentials organized into eight quiet collections — from ₹20 roli to heirloom marble."
          />

          <div className="mt-6 md:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {collections.map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug}`}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-full aspect-[3/4] arch-mask overflow-hidden border border-hairline bg-parchment transition-all duration-fast group-hover:shadow-card group-hover:border-gold/60">
                  <img
                    src={col.image}
                    alt={`${col.name} (${col.nameHi})`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-slow ease-temple group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-2 font-cinzel text-[11px] md:text-[13px] font-semibold uppercase tracking-[0.16em] text-espresso group-hover:text-tulsi transition-colors">
                  {col.name}
                </h3>
                <p className="text-[12px] text-walnut mt-0.5">{col.itemCount} essentials</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UPCOMING FESTIVAL COUNTDOWN BAND */}
      {nextFestival && (
        <section className="py-12 md:py-16 lg:py-24 bg-parchment border-b border-hairline" data-reveal>
          <div className="container">
            <div className="rounded-md border border-gold/40 bg-ivory p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 aspect-[4/3] arch-mask overflow-hidden bg-parchment border border-hairline">
                <img
                  src={nextFestival.heroImage}
                  alt={nextFestival.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-cinzel text-[11px] font-semibold uppercase tracking-[0.28em] text-sindoor">
                    Upcoming Festival Kit
                  </span>
                  <span className="text-xs text-walnut">· {nextFestival.dateLabel}</span>
                </div>

                <div>
                  <h2 className="font-playfair text-3xl md:text-4xl text-espresso">
                    {nextFestival.name}
                  </h2>
                  <p lang="hi" className="font-hindi text-lg text-walnut mt-0.5">
                    {nextFestival.nameHi}
                  </p>
                </div>

                {countdown && !countdown.days && !countdown.hours ? null : countdown ? (
                  <div className="inline-flex items-center gap-4 px-4 py-2 rounded-sm bg-parchment border border-hairline">
                    <div>
                      <span className="font-cinzel text-lg font-semibold text-tulsi font-tabular">
                        {countdown.days}
                      </span>
                      <span className="text-xs text-walnut ml-1">days</span>
                    </div>
                    <span className="text-gold">·</span>
                    <div>
                      <span className="font-cinzel text-lg font-semibold text-tulsi font-tabular">
                        {countdown.hours}
                      </span>
                      <span className="text-xs text-walnut ml-1">hrs left</span>
                    </div>
                    <span className="text-gold hidden sm:inline">·</span>
                    <span className="text-xs text-tulsi font-medium hidden sm:inline">
                      Save {nextFestival.kitDiscountPercent}% on full kit
                    </span>
                  </div>
                ) : null}

                <p className="text-[15px] text-walnut leading-relaxed max-w-2xl">
                  {nextFestival.shortStory}
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-4">
                  <Button asChild>
                    <Link to={`/festivals/${nextFestival.slug}`}>
                      Shop the complete kit
                      {nextKitPrice > 0 ? ` — ${formatINR(nextKitPrice)}` : ''}
                    </Link>
                  </Button>
                  <Link
                    to="/festivals"
                    className="text-sm font-medium text-gold hover:text-espresso underline underline-offset-4"
                  >
                    See all 7 festival kits
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. BESTSELLERS CAROUSEL */}
      <section className="py-12 md:py-16 lg:py-24 bg-parchment/55 border-y border-hairline" data-reveal>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <SectionHeader
              align="left"
              eyebrow="DEVOTED FAVOURITES"
              title="Most loved by Kolkata households"
            />
            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                aria-label="Scroll bestsellers left"
                className="hidden md:flex w-11 h-11 rounded-sm border border-hairline bg-ivory items-center justify-center text-espresso hover:bg-sandal"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                aria-label="Scroll bestsellers right"
                className="hidden md:flex w-11 h-11 rounded-sm border border-hairline bg-ivory items-center justify-center text-espresso hover:bg-sandal"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <Button asChild variant="secondary" size="sm">
                <Link to="/shop">Shop All</Link>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div
              ref={carouselRef}
              className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
            >
              {bestsellers.map((prod) => (
                <div
                  key={prod.id}
                  className="w-[72vw] sm:w-[46vw] md:w-[300px] shrink-0 snap-start"
                >
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. SANDALWOOD STORY SPLIT SECTION */}
      <section className="py-12 md:py-16 lg:py-24 bg-ivory" data-reveal>
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] max-w-md mx-auto arch-mask overflow-hidden border border-gold/40 bg-parchment shadow-card">
              <img
                src="/images/sandalwood-story.jpg"
                alt="Authenticated crimson red sandalwood 108-bead mala on carved wood tray"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6 space-y-5">
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              MUSEUM-GRADE
            </p>
            <h2 className="font-playfair text-3xl md:text-5xl text-espresso leading-tight">
              Sandalwood, as it was meant to be.
            </h2>
            <p className="text-base md:text-lg text-walnut leading-relaxed">
              True Rakta Chandan and white sandalwood carry unmistakable cool density, quiet grain, and zero synthetic dye. Hand-knotted in 6mm, 8mm, 9mm malas and 18mm wrist beads for lifelong sadhana.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/collections/sandalwood-malas-stones">
                  Explore malas &amp; bracelets
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/journal/identifying-real-red-sandalwood">
                  How to recognise real sandalwood →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PUJA KIT BUILDER TEASER (Tulsi Green Band) */}
      <section className="py-12 md:py-16 lg:py-20 bg-tulsi text-ivory" data-reveal>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-gold-light">
              COMPLETE IN ONE CLICK
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-ivory font-normal">
              Tell us the puja — we&apos;ll complete the list.
            </h2>
            <p className="text-ivory/80 text-base">
              Choose your upcoming ritual to inspect every samagri item, untick what you already keep at home, and save 10% on the complete kit.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-lg mx-auto">
              <select
                aria-label="Choose a puja or festival"
                value={selectedPujaSlug}
                onChange={(e) => setSelectedPujaSlug(e.target.value)}
                className="h-12 flex-1 rounded-sm bg-parchment text-espresso px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-gold-light"
              >
                {festivals.map((f) => (
                  <option key={f.slug} value={f.slug}>
                    {f.name}
                  </option>
                ))}
              </select>
              <Button
                variant="onDark"
                size="default"
                onClick={() => navigate(`/festivals/${selectedPujaSlug}`)}
              >
                <Sparkles className="w-4 h-4" /> Build my kit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ATTAR DISCOVERY */}
      <section className="py-12 md:py-16 lg:py-24 bg-ivory" data-reveal>
        <div className="container">
          <SectionHeader
            eyebrow="TRADITIONAL ATTARS"
            title="Alcohol-free fragrance for the mandir"
            subtitle="Pure Kannauj-style attars in 3ml and 6ml crystal vials. Filter by scent family to find yours."
          />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {ATTAR_FAMILIES.map((fam) => (
              <button
                key={fam}
                type="button"
                onClick={() => setSelectedFamily(fam)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] border transition-colors ${
                  selectedFamily === fam
                    ? 'bg-tulsi text-ivory border-tulsi'
                    : 'bg-parchment/70 text-walnut border-hairline hover:bg-sandal hover:text-espresso'
                }`}
              >
                {fam}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredAttars.map((attar) => (
              <ProductCard key={attar.id} product={attar} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. VISIT OUR STORE (Kolkata) */}
      <section className="py-12 md:py-16 lg:py-24 bg-parchment border-y border-hairline" data-reveal>
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="rounded-md overflow-hidden border border-hairline bg-ivory shadow-card">
              <img
                src="/images/store-kolkata.jpg"
                alt="Varcham India store shelves in Phoolbagan, Kolkata"
                loading="lazy"
                className="w-full aspect-video object-cover"
              />
            </div>
            <div className="p-4 rounded-sm bg-ivory border border-hairline flex items-center justify-between gap-4 text-xs text-walnut">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>Landmark: {STORE_INFO.addressLandmark}, Phoolbagan</span>
              </span>
              <span className="font-semibold text-tulsi shrink-0">Free Pickup</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              OUR KOLKATA HOME
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl text-espresso">
              Walk into our Phoolbagan boutique
            </h2>
            <p className="text-base text-walnut leading-relaxed">
              Unlike anonymous online marketplaces, every item on varcham.in comes directly from our shelves in East Kolkata — inspected, weighed, and packed by our store team.
            </p>

            <div className="space-y-2.5 text-sm text-espresso pt-1">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold mt-1 shrink-0" />
                <span>{STORE_INFO.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>{STORE_INFO.hours}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>{STORE_INFO.phoneDisplay}</span>
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link to="/visit">Get directions &amp; store view</Link>
              </Button>
              <Button asChild variant="secondary">
                <a href={STORE_INFO.phoneHref}>Call the store</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. REVIEWS */}
      <section className="py-12 md:py-16 lg:py-24 bg-ivory" data-reveal>
        <div className="container">
          <SectionHeader
            eyebrow="TRUSTED BY FAMILIES"
            title="Words from homes we serve"
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="p-6 rounded-md border border-hairline bg-parchment/40 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-gold text-gold" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="font-playfair italic text-lg text-espresso leading-snug">
                    &ldquo;{rev.body}&rdquo;
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-hairline flex items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-semibold text-espresso">{rev.customerName}</p>
                    <p className="text-walnut">{rev.city} · Verified purchase</p>
                  </div>
                  <Link
                    to={`/product/${rev.productSlug}`}
                    className="text-tulsi font-medium hover:underline text-right line-clamp-1 max-w-[140px]"
                  >
                    {rev.productName}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. JOURNAL */}
      <section className="py-12 md:py-16 lg:py-24 bg-parchment/50 border-t border-hairline" data-reveal>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <SectionHeader
              align="left"
              eyebrow="VARCHAM JOURNAL"
              title="Ritual notes & simple guides"
            />
            <Button asChild variant="secondary" size="sm" className="self-start md:self-end">
              <Link to="/journal">Read all guides</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <Link
                key={art.id}
                to={`/journal/${art.slug}`}
                className="group rounded-md border border-hairline bg-ivory overflow-hidden hover:shadow-card transition-all"
              >
                <div className="aspect-video overflow-hidden bg-parchment">
                  <img
                    src={art.image}
                    alt={art.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow ease-temple"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-cinzel uppercase tracking-[0.2em] text-gold">
                    <span>{art.topic}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-playfair text-xl text-espresso group-hover:text-tulsi transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-sm text-walnut line-clamp-2">{art.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FESTIVAL REMINDER BAND */}
      <section className="py-12 md:py-16 lg:py-20 bg-ivory border-t border-hairline" data-reveal>
        <div className="container max-w-2xl text-center space-y-5">
          <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            NEVER MISS A VRAT OR TITHI
          </p>
          <h2 className="font-playfair text-3xl text-espresso">
            Receive your puja checklist a week before each festival
          </h2>
          <p className="text-sm md:text-base text-walnut">
            Quiet, respectful reminders — at most four messages a month, zero clutter.
          </p>
          <form
            onSubmit={handleReminderSubmit}
            className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto"
          >
            <input
              type="text"
              value={reminderInput}
              onChange={(e) => setReminderInput(e.target.value)}
              placeholder="WhatsApp number or email"
              aria-label="WhatsApp number or email"
              className="h-12 flex-1 rounded-sm border border-hairline bg-white px-4 text-base text-espresso focus:outline-none focus:border-tulsi"
            />
            <Button type="submit">Remind me</Button>
          </form>
        </div>
      </section>
    </>
  );
}
