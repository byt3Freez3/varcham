import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, MessageCircle, Search, ArrowRight } from 'lucide-react';
import { getArticleBySlug, getArticles, getProducts } from '@/lib/api';
import { STORE_INFO } from '@/data/store';
import { FAQS } from '@/data/faq';
import { Article, Product } from '@/types';
import { SectionHeader, LotusGlyph } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/context/ToastContext';

/* === 1. OUR STORY === */
export function OurStoryPage() {
  return (
    <>
      <Helmet>
        <title>Our Story &amp; Purity Promise | Varcham India</title>
        <meta name="description" content="Why Varcham exists, our Purity Promise, and how we curate 277 authentic puja essentials from Phoolbagan, Kolkata." />
      </Helmet>

      <article className="py-12 md:py-20 bg-ivory">
        <div className="container max-w-[720px] space-y-8">
          <SectionHeader
            eyebrow="ROOTED IN FAITH, INSPIRED BY DIVINE"
            title="Why we built Varcham India"
          />

          <div className="aspect-[16/10] arch-mask overflow-hidden border border-gold/40 bg-parchment">
            <img
              src="/images/store-kolkata.jpg"
              alt="Shelves inside Varcham India flagship store in Phoolbagan, Kolkata"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-5 text-base leading-relaxed text-espresso">
            <p className="first-letter:font-playfair first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-tulsi">
              Every festival in a Kolkata household begins the same way: a handwritten list on ruled paper, three stops across crowded lanes, and the quiet uncertainty of whether the camphor will smoke or the sandalwood is genuine. Varcham — meaning radiance and divine lustre — was created so you never have to compromise between purity and convenience.
            </p>
            <p className="text-walnut">
              From our neighbourhood boutique behind VIP Market near Phoolbagan Police Station, we stock 277 authentic essentials: ₹20 packets of unbroken akshat and roli, hand-painted Rajasthani vrat patas, alcohol-free Kannauj-style attars, heirloom Makrana marble diyas, and museum-grade Rakta Chandan malas.
            </p>

            <div className="p-6 rounded-md border border-gold/45 bg-parchment/60 space-y-3 my-8">
              <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold">
                OUR WRITTEN PURITY PROMISE
              </p>
              <ul className="space-y-2 text-sm text-espresso">
                <li>• Honest naming: exact weights, ml, material, and Hindi names on every label.</li>
                <li>• Zero alcohol in all attars; zero chemical accelerants in temple incense.</li>
                <li>• Every festival kit hand-checked by our store team prior to dispatch.</li>
                <li>• Free replacement within 48 hours if fragile marble or clay arrives damaged.</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/shop">Shop the collection</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/visit">Visit our Phoolbagan store</Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}

/* === 2. VISIT OUR STORE === */
export function VisitStorePage() {
  return (
    <>
      <Helmet>
        <title>Visit Our Kolkata Store | Varcham India</title>
        <meta name="description" content="Visit Varcham India at P-79 Swami Swarupananda Sarani, behind VIP Market, near Phoolbagan PS, Kolkata 700054." />
      </Helmet>

      <section className="py-12 md:py-20 bg-ivory">
        <div className="container space-y-12">
          <SectionHeader
            eyebrow="OUR NEIGHBOURHOOD BOUTIQUE"
            title="Visit Varcham in Phoolbagan, Kolkata"
            subtitle="Smell our traditional attars in person, examine Makrana marble diyas, or pick up your online order free."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-md overflow-hidden border border-hairline bg-parchment shadow-card">
                <img
                  src="/images/store-kolkata.jpg"
                  alt="Interior shelving at Varcham India, Phoolbagan"
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['/images/col-brass-marble.jpg', '/images/col-attars.jpg', '/images/sandalwood-story.jpg'].map(
                  (src, idx) => (
                    <div key={idx} className="aspect-square rounded-sm overflow-hidden border border-hairline bg-parchment">
                      <img src={src} alt="Varcham showcase detail" className="w-full h-full object-cover" />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 p-6 md:p-8 rounded-md border border-hairline bg-parchment/50">
              <div className="space-y-4 text-sm text-espresso">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-walnut mt-0.5">{STORE_INFO.fullAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Store Hours</p>
                    <p className="text-walnut mt-0.5">{STORE_INFO.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Store Desk</p>
                    <a href={STORE_INFO.phoneHref} className="text-tulsi font-medium hover:underline">
                      {STORE_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              {/* Clean Map Landmark Box */}
              <div className="p-4 rounded-sm bg-ivory border border-hairline space-y-2">
                <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-gold">
                  MAP LANDMARK
                </p>
                <p className="text-xs text-walnut leading-relaxed">
                  3 minutes walk from Phoolbagan Metro Station · Directly behind VIP Market, near Phoolbagan Police Station, Kolkata 700054.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button asChild>
                  <a
                    href="https://maps.google.com/?q=P-79+Swami+Swarupananda+Sarani+Kolkata+700054"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a href={STORE_INFO.phoneHref}>Call Store</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* === 3. JOURNAL LIST & ARTICLE === */
export function JournalListPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  return (
    <>
      <Helmet>
        <title>Varcham Journal | Ritual Guides &amp; Craft Notes</title>
        <meta name="description" content="Practical ritual guides from Varcham India — Akhand Diya setup, Karwa Chauth checklist, recognising pure Red Sandalwood, and attar use." />
      </Helmet>

      <section className="py-12 md:py-20 bg-ivory">
        <div className="container">
          <SectionHeader
            eyebrow="VARCHAM JOURNAL"
            title="Ritual guides &amp; craft notes"
            subtitle="Clear, unhurried answers written by our Phoolbagan store team."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <Link
                key={art.id}
                to={`/journal/${art.slug}`}
                className="group rounded-md border border-hairline bg-parchment/35 overflow-hidden hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video overflow-hidden bg-parchment">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow ease-temple"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-gold">
                      {art.topic} · {art.readTime}
                    </p>
                    <h2 className="font-playfair text-xl text-espresso group-hover:text-tulsi transition-colors">
                      {art.title}
                    </h2>
                    <p lang="hi" className="text-xs text-walnut">{art.titleHi}</p>
                    <p className="text-sm text-walnut line-clamp-3 pt-1">{art.excerpt}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 text-xs font-semibold text-tulsi inline-flex items-center gap-1">
                  Read guide <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function JournalArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | undefined>();
  const [relatedProds, setRelatedProds] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const art = await getArticleBySlug(slug);
      setArticle(art);
      if (art) {
        const all = await getProducts();
        setRelatedProds(all.filter((p) => art.relatedProductSlugs.includes(p.slug)));
      }
    }
    load();
  }, [slug]);

  if (!article) {
    return (
      <div className="container py-20 text-center">
        <p className="text-walnut">Loading guide...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Varcham Journal</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <article className="py-12 md:py-20 bg-ivory">
        <div className="container max-w-[720px] space-y-6">
          <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold">
            {article.topic} · {article.readTime} · {article.date}
          </p>
          <h1 className="font-playfair text-3xl md:text-5xl text-espresso leading-tight">
            {article.title}
          </h1>
          <p lang="hi" className="font-hindi text-lg text-walnut">
            {article.titleHi}
          </p>
          <div className="aspect-video rounded-md overflow-hidden border border-hairline bg-parchment">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-5 text-base leading-relaxed text-espresso pt-2">
            {article.content.map((para, idx) => (
              <p key={idx} className={idx === 0 ? 'first-letter:font-playfair first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-tulsi' : 'text-walnut'}>
                {para}
              </p>
            ))}
          </div>
        </div>

        {relatedProds.length > 0 && (
          <div className="container max-w-4xl mt-16 pt-10 border-t border-hairline">
            <h2 className="font-playfair text-2xl text-espresso mb-6">Mentioned in this guide</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {relatedProds.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

/* === 4. CONTACT === */
export function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast({ message: 'Message received — our Kolkata store team will reply shortly.' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Varcham India</title>
        <meta name="description" content="Call +91 90079 96100, message on WhatsApp, or visit Varcham India at Phoolbagan, Kolkata 700054." />
      </Helmet>

      <section className="py-12 md:py-20 bg-ivory">
        <div className="container max-w-4xl space-y-12">
          <SectionHeader
            eyebrow="WE ARE HERE TO HELP"
            title="Speak with our Kolkata store team"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-4 p-6 rounded-md border border-hairline bg-parchment/50 text-sm">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" />
                <span>{STORE_INFO.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={STORE_INFO.phoneHref} className="text-tulsi font-medium">{STORE_INFO.phoneDisplay}</a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${STORE_INFO.email}`} className="text-tulsi font-medium">{STORE_INFO.email}</a>
              </p>
              <Button asChild className="w-full mt-2">
                <a href={STORE_INFO.whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="md:col-span-7 p-6 rounded-md border border-hairline bg-white">
              {sent ? (
                <div className="py-8 text-center space-y-2">
                  <p className="font-playfair text-2xl text-tulsi">Namaste, {name} ji.</p>
                  <p className="text-sm text-walnut">We&apos;ve received your note and will reach out soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input label="Mobile / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  <div>
                    <label className="block text-[13px] font-medium text-walnut mb-1.5">How can we help?</label>
                    <textarea
                      rows={4}
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      required
                      className="w-full rounded-sm border border-hairline bg-white p-3.5 text-sm text-espresso focus:outline-none focus:border-tulsi"
                    />
                  </div>
                  <Button type="submit">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* === 5. FAQ === */
export function FaqPage() {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Varcham India</title>
        <meta name="description" content="Answers on Kolkata same-day delivery, store pickup, alcohol-free attars, fragile item replacement, and festival kits." />
      </Helmet>

      <section className="py-12 md:py-20 bg-ivory">
        <div className="container max-w-[720px] space-y-10">
          <SectionHeader eyebrow="CLEAR ANSWERS" title="Frequently asked questions" />

          <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-hairline">
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left normal-case font-playfair text-lg tracking-normal">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}

/* === 6. POLICIES === */
const POLICY_DOCS: Record<string, { title: string; body: string[] }> = {
  shipping: {
    title: 'Shipping & Delivery Policy',
    body: [
      'Kolkata Local Same-Day Delivery: Available across 700xxx pincodes on orders placed before 2:00 PM IST. Free for orders ₹499 and above (₹49 below ₹499).',
      'Free Store Pickup: Collect within 2 hours at P-79 Swami Swarupananda Sarani, behind VIP Market, near Phoolbagan PS, Kolkata 700054 between 10:00 AM and 8:30 PM.',
      'Pan-India Shipping: Dispatched within 24 hours via Shiprocket courier partners (3–6 business days). Free above ₹999 (₹79 below ₹999).',
    ],
  },
  returns: {
    title: 'Returns & Damaged Replacement Policy',
    body: [
      'For sacred hygiene reasons, opened puja samagri, attars, and consumables cannot be returned once unsealed.',
      'Fragile Guarantee: If marble, clay, ceramic, or glass Akhand diyas arrive damaged, share an unboxing photo on +91 90079 96100 (WhatsApp) or varchamindia@gmail.com within 48 hours for an immediate free replacement or full refund.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect only your name, phone number, email, and delivery address strictly to pack, dispatch, and notify you about your Varcham orders.',
      'WhatsApp festival reminders and updates are completely opt-in and can be turned off any time from your account or by replying STOP.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      'All prices on varcham.in are listed in Indian Rupees (INR) inclusive of applicable GST.',
      'Operated by Varcham India, P-79 Swami Swarupananda Sarani, Kolkata 700054.',
    ],
  },
};

export function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = POLICY_DOCS[slug || 'shipping'] ?? POLICY_DOCS.shipping;

  return (
    <>
      <Helmet>
        <title>{doc.title} | Varcham India</title>
        <meta name="description" content={`${doc.title} for Varcham India Kolkata.`} />
      </Helmet>

      <section className="py-12 md:py-20 bg-ivory">
        <div className="container max-w-[720px] space-y-6">
          <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-gold">STORE POLICIES</p>
          <h1 className="font-playfair text-3xl md:text-4xl text-espresso">{doc.title}</h1>
          <div className="space-y-4 text-walnut leading-relaxed pt-2 border-t border-hairline">
            {doc.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* === 7. 404 PAGE === */
export function NotFoundPage() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Page Not Found | Varcham India</title>
      </Helmet>
      <section className="py-20 bg-ivory">
        <div className="container max-w-lg text-center space-y-5">
          <LotusGlyph className="w-12 h-12 text-gold mx-auto" />
          <p className="font-cinzel text-xs uppercase tracking-[0.28em] text-gold">404</p>
          <h1 className="font-playfair text-3xl md:text-4xl text-espresso">
            This path isn&apos;t on our map yet.
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
            className="flex gap-2 pt-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search puja items..."
                className="w-full h-11 rounded-sm border border-hairline bg-white pl-10 pr-3 text-sm"
              />
            </div>
            <Button type="submit" size="sm">Search</Button>
          </form>
          <div>
            <Button asChild variant="secondary">
              <Link to="/">Return home</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

