import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Share2, Copy, Check, MessageCircle, Clock, Calendar } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { ARTICLES, ARTICLE_CATEGORIES } from '@/data/articles';
import { Article, Product } from '@/types';
import { getArticleBySlug, getProducts } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { useToast } from '@/context/ToastContext';

/* =====================================================================
   JOURNAL LIST PAGE (/journal)
   ===================================================================== */
export function JournalListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredArticles =
    selectedCategory === 'All'
      ? ARTICLES
      : ARTICLES.filter((art) => art.topic.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-ivory">
      <Helmet>
        <title>Varcham Journal | Guides, Rituals &amp; Mandir Stories</title>
        <meta
          name="description"
          content="Practical Vedic guides, puja preparation checklists, and authentic craftsmanship notes written by our Phoolbagan store team."
        />
        <link rel="canonical" href="https://varcham.in/journal" />
        <meta property="og:title" content="Varcham Journal | Guides, Rituals & Mandir Stories" />
        <meta
          property="og:description"
          content="Guides, rituals and stories from the mandir. Learn how to set up an Akhand Diya, care for brass and marble, and choose sacred attars."
        />
        <meta property="og:url" content="https://varcham.in/journal" />
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="JOURNAL"
        title="Varcham Journal"
        subline="Guides, rituals and stories from the mandir."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Journal' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container max-w-6xl px-4 space-y-10">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {ARTICLE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-cinzel tracking-[0.08em] uppercase transition-all ${
                    isActive
                      ? 'bg-tulsi text-ivory font-semibold shadow-xs'
                      : 'bg-parchment text-walnut hover:bg-sandal border border-hairline'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 3-column Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                className="group bg-white rounded-b-[6px] rounded-t-[20px] border border-hairline overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* 16:9 Image with Mandir-Arch top corners */}
                  <div className="aspect-[16/9] w-full overflow-hidden bg-parchment relative rounded-t-[20px]">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-cinzel tracking-[0.1em] uppercase bg-parchment/95 text-walnut font-medium border border-hairline shadow-xs">
                        {art.topic}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-walnut">
                      <span>{art.date}</span>
                      <span>·</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h2 className="font-playfair text-xl text-espresso group-hover:text-tulsi transition-colors leading-snug">
                      <Link to={`/journal/${art.slug}`}>{art.title}</Link>
                    </h2>

                    <p className="text-sm text-walnut line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer read link */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    to={`/journal/${art.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-tulsi hover:text-gold transition-colors"
                  >
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* =====================================================================
   JOURNAL ARTICLE DETAIL PAGE (/journal/:slug)
   ===================================================================== */
export function JournalArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | undefined>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      const found = await getArticleBySlug(slug);
      setArticle(found);
      if (found) {
        const prods = await getProducts();
        const related = prods.filter((p) => found.relatedProductSlugs.includes(p.slug));
        setRelatedProducts(related);
      }
    }
    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center py-20">
        <p className="text-walnut font-playfair text-lg">Loading ritual guide...</p>
      </div>
    );
  }

  const articleUrl = `https://varcham.in/journal/${article.slug}`;

  // Structured Data: Schema.org Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: `https://varcham.in${article.image}`,
    datePublished: '2026-11-04T09:00:00+05:30',
    dateModified: '2026-11-10T10:00:00+05:30',
    author: {
      '@type': 'Organization',
      name: 'Varcham Store Team, Phoolbagan',
      url: 'https://varcham.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Varcham India',
      logo: {
        '@type': 'ImageObject',
        url: 'https://varcham.in/images/store-kolkata.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast({ message: 'Guide link copied to clipboard.' });
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${article.title} — Varcham Journal\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Helmet>
        <title>{article.title} | Varcham Journal</title>
        <meta name="description" content={article.excerpt} />
        <link rel="canonical" href={articleUrl} />
        <meta property="og:title" content={`${article.title} | Varcham Journal`} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={`https://varcham.in${article.image}`} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow={article.topic.toUpperCase()}
        title={article.title}
        subline={article.excerpt}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Journal', href: '/journal' },
          { label: article.title },
        ]}
      />

      {/* 720px Reading Column */}
      <article className="py-12 md:py-16">
        <div className="container max-w-[720px] px-4 space-y-8 font-sans text-espresso text-[16px] leading-[27px]">
          {/* Metadata bar */}
          <div className="pb-6 border-b border-hairline flex flex-wrap items-center justify-between gap-4 text-xs text-walnut">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-espresso">Written by Varcham Store Team, Phoolbagan</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                {article.date}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gold" />
                {article.readTime}
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-parchment hover:bg-sandal border border-hairline text-tulsi text-xs font-medium transition-colors"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-parchment hover:bg-sandal border border-hairline text-walnut text-xs font-medium transition-colors"
                title="Copy link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-tulsi" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Hero Article Image */}
          <div className="aspect-[16/9] w-full rounded-[6px] overflow-hidden border border-hairline bg-parchment shadow-xs">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hindi sub-heading */}
          {article.titleHi && (
            <p lang="hi" className="font-hindi text-xl text-walnut/90 font-medium italic">
              {article.titleHi}
            </p>
          )}

          {/* Body with Drop Cap on First Paragraph */}
          <div className="space-y-6 pt-2">
            {article.content.map((paragraph, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? 'first-letter:font-playfair first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-tulsi text-espresso'
                    : 'text-walnut'
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Author Signoff Box */}
          <div className="mt-10 p-6 rounded-[6px] bg-parchment border border-hairline space-y-2">
            <p className="font-cinzel text-xs uppercase tracking-[0.2em] text-gold font-semibold">
              ABOUT THE AUTHOR
            </p>
            <p className="font-playfair text-lg text-espresso">
              Written by Varcham Store Team, Phoolbagan
            </p>
            <p className="text-xs text-walnut leading-relaxed">
              Curated by our temple craft specialists behind VIP Market, Kolkata. Every guide is reviewed with practicing purohits for authentic ritual compliance.
            </p>
          </div>

          {/* Social share footer */}
          <div className="pt-6 border-t border-hairline flex items-center justify-between">
            <span className="font-cinzel text-xs uppercase tracking-[0.14em] text-walnut">
              Share this guide
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="px-3.5 py-2 rounded-sm bg-tulsi text-ivory text-xs uppercase tracking-[0.1em] font-semibold hover:bg-tulsi/90 transition-colors inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                Share on WhatsApp
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-sm bg-parchment border border-hairline text-espresso text-xs uppercase tracking-[0.1em] font-semibold hover:bg-sandal transition-colors inline-flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4 text-gold" />
                {copied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        {/* In-article "Shop the items in this guide" product strip */}
        {relatedProducts.length > 0 && (
          <section className="container max-w-5xl mt-16 pt-12 border-t border-hairline px-4 space-y-8">
            <div className="text-center space-y-1.5">
              <p className="font-cinzel text-xs uppercase tracking-[0.22em] text-gold font-semibold">
                RECOMMENDED SAMAGRI
              </p>
              <h2 className="font-playfair text-2xl md:text-3xl text-espresso">
                Shop the items in this guide
              </h2>
              <p className="text-sm text-walnut">
                Mandir-ready essentials mentioned above, available with same-day Kolkata delivery.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
