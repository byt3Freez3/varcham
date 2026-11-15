import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles,
  PackageCheck,
  Store,
  ShieldCheck,
  ScrollText,
  Clock,
  CreditCard,
  RefreshCw,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { OUR_STORY_PAGE } from '@/data/pages';
import { FAQS } from '@/data/faq';

export function OurStoryPage() {
  const p = OUR_STORY_PAGE;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Structured Data: FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // Structured Data: Organization Schema
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Varcham India',
    url: 'https://varcham.in',
    logo: 'https://varcham.in/images/store-kolkata.jpg',
    description: p.hero.subline,
    telephone: '+91 90079 96100',
    email: 'varchamindia@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'P-79 Swami Swarupananda Sarani, behind VIP Market, near Phoolbagan PS',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      postalCode: '700054',
      addressCountry: 'IN',
    },
  };

  const guidesIcons = [ShieldCheck, ScrollText, Store];

  const whyShopIcons = [
    Sparkles, // gold
    PackageCheck, // tulsi
    Clock, // gold
    CreditCard, // tulsi
    RefreshCw, // gold
    MessageCircle, // tulsi
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Helmet>
        <title>Our Story &amp; Written Purity Promise | Varcham India</title>
        <meta
          name="description"
          content="From a neighbourhood shop in Phoolbagan to a mandir-ready store for every home. Discover our written purity promise, Kolkata same-day delivery, and ritual curation."
        />
        <link rel="canonical" href="https://varcham.in/our-story" />
        <meta property="og:title" content="Our Story | Varcham India" />
        <meta property="og:description" content={p.hero.subline} />
        <meta property="og:image" content="https://varcham.in/images/store-kolkata.jpg" />
        <meta property="og:url" content="https://varcham.in/our-story" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>

      {/* Page Hero */}
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        subline={p.hero.subline}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Our Story' },
        ]}
      />

      {/* a) "The Varcham Promise" */}
      <section className="py-14 md:py-20 bg-ivory border-b border-hairline">
        <div className="container max-w-5xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-5 text-espresso leading-relaxed">
              <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                {p.promise.eyebrow}
              </p>
              <h2 className="font-playfair text-2xl md:text-3xl text-espresso">
                {p.promise.title}
              </h2>
              <div className="space-y-4 text-walnut text-[15px] md:text-[16px] leading-[27px]">
                {p.promise.paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'first-letter:font-playfair first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-tulsi text-espresso'
                        : ''
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Store Photo in Mandir-Arch Mask */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-[4/5] arch-mask overflow-hidden border border-gold/40 bg-parchment shadow-md">
                <img
                  src={p.promise.image}
                  alt={p.promise.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border border-gold/30 arch-mask pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* b) Stats band on parchment */}
      <section className="py-10 md:py-14 bg-parchment border-b border-hairline">
        <div className="container max-w-5xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {p.stats.map((stat, idx) => {
              const Icon = [Sparkles, PackageCheck, Store][idx];
              return (
                <div
                  key={idx}
                  className="bg-ivory/80 rounded-[4px] p-6 border border-hairline text-center space-y-2 shadow-xs"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-parchment border border-gold/40 text-gold mb-1">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <p className="font-playfair text-2xl md:text-3xl text-espresso font-semibold">
                    {stat.value}
                  </p>
                  <p className="font-cinzel text-xs uppercase tracking-[0.14em] text-gold font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xs text-walnut">{stat.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* c) "What guides us" */}
      <section className="py-14 md:py-20 bg-ivory border-b border-hairline">
        <div className="container max-w-5xl px-4 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              OUR PILLARS
            </p>
            <h2 className="font-playfair text-2xl md:text-3xl text-espresso">
              What guides our daily work
            </h2>
            <p className="text-sm text-walnut">
              Three steadfast commitments that keep our shelves pure and your family's prayers complete.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {p.guides.map((card, idx) => {
              const Icon = guidesIcons[idx];
              return (
                <div
                  key={idx}
                  className="bg-parchment/40 rounded-[6px] border border-hairline p-7 text-center space-y-3.5 hover:bg-parchment/70 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-parchment border border-gold text-gold mx-auto">
                    <Icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="font-playfair text-lg text-espresso font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-walnut leading-relaxed">
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* d) "Why shop with Varcham" - 6 cards in 3×2 grid, alternating gold and tulsi */}
      <section className="py-14 md:py-20 bg-parchment border-b border-hairline">
        <div className="container max-w-5xl px-4 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              EXPERIENCE THE DIFFERENCE
            </p>
            <h2 className="font-playfair text-2xl md:text-3xl text-espresso">
              Why families choose Varcham India
            </h2>
            <p className="text-sm text-walnut">
              Everything you need for traditional rituals, backed by honest weights, modern convenience, and local warmth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.whyShop.map((item, idx) => {
              const Icon = whyShopIcons[idx];
              const isGold = item.iconColor === 'gold';
              return (
                <div
                  key={idx}
                  className="bg-ivory rounded-[6px] border border-hairline p-6 space-y-3 hover:border-gold/50 transition-colors shadow-xs"
                >
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full border ${
                      isGold
                        ? 'bg-parchment border-gold/40 text-gold'
                        : 'bg-tulsi/10 border-tulsi/40 text-tulsi'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="font-playfair text-base md:text-lg text-espresso font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-walnut leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* e) "Frequently asked questions" - 10 questions accordion */}
      <section className="py-14 md:py-20 bg-ivory border-b border-hairline">
        <div className="container max-w-[760px] px-4 space-y-10">
          <div className="text-center space-y-2">
            <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              QUESTIONS &amp; ANSWERS
            </p>
            <h2 className="font-playfair text-2xl md:text-3xl text-espresso">
              Frequently asked questions
            </h2>
            <p className="text-sm text-walnut">
              Clear answers regarding our purity promise, Kolkata same-day delivery, and sacred articles.
            </p>
          </div>

          <div className="divide-y divide-hairline border-y border-hairline">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.id} className="py-4 md:py-5">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 focus:outline-none group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-playfair text-[16px] md:text-[17px] text-espresso group-hover:text-tulsi transition-colors font-medium">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gold shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-3 pr-6 text-[14px] md:text-[15px] text-walnut leading-relaxed animate-in fade-in-50 duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* f) CTA band in tulsi */}
      <section className="py-14 md:py-16 bg-tulsi text-center text-ivory relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-3 border border-gold-light/30 pointer-events-none"
        />
        <div className="container max-w-2xl px-4 relative z-10 space-y-3.5">
          <h2 className="font-playfair text-2xl md:text-3xl text-ivory font-normal">
            {p.cta.title}
          </h2>
          <p className="font-playfair italic text-sm md:text-base text-gold-light max-w-xl mx-auto">
            {p.cta.subline}
          </p>
          <div className="pt-3">
            <Link
              to={p.cta.buttonLink}
              className="inline-block px-7 py-3 rounded-sm bg-ivory text-espresso hover:bg-gold-light font-semibold text-xs uppercase tracking-[0.12em] transition-colors shadow-sm"
            >
              {p.cta.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
