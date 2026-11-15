import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, MessageCircle } from 'lucide-react';
import { submitBulkEnquiry } from '@/lib/api';
import { STORE_INFO } from '@/data/store';
import { formatINR } from '@/lib/utils';
import { SectionHeader } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TIERS = [
  {
    name: 'Shubh Hamper',
    nameHi: 'शुभ उपहार',
    price: 499,
    minQty: 'Min 25 boxes',
    contents: [
      'Marble Diya with Brass Cavity Round',
      'Kapur Dhela 25g + Akhand Bati',
      'Roli & Moli Twist',
      'Printed gold-border blessing card',
    ],
  },
  {
    name: 'Mangal Brass & Wellness',
    nameHi: 'मंगल पीतल भेंट',
    price: 999,
    minQty: 'Min 20 boxes',
    featured: true,
    contents: [
      'Brass Aakhand Diya or Brass Lotus Diya',
      'Herbaa Havan Cup Guggal (Box of 12)',
      'Kesar Chandan Attar (3ml)',
      'Custom company logo belly-band',
    ],
  },
  {
    name: 'Divya Heirloom Box',
    nameHi: 'दिव्य उत्सव संग्रह',
    price: 1999,
    minQty: 'Min 10 boxes',
    contents: [
      'Herbaa 4-Aromatic Gift Box or Brass Jali Lobandan',
      'Marble Lotus Diya with Brass Cavity',
      'Oudh Attar (6ml) & Dev Agar Agarbatti',
      'Foil-stamped ivory presentation sleeve',
    ],
  },
];

export function GiftingPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('50');
  const [budget, setBudget] = useState('999');
  const [neededBy, setNeededBy] = useState('');
  const [gstin, setGstin] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBulkEnquiry({
      name,
      company,
      phone,
      email,
      quantity: Number(quantity) || 25,
      budgetPerUnit: Number(budget) || 999,
      neededBy: neededBy || '2026-11-30',
      gstin: gstin || undefined,
      message,
    });
    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Corporate &amp; Bulk Diwali Gifting | Varcham India</title>
        <meta
          name="description"
          content="Curated brass, marble, sandalwood, and Herbaa Diwali gifting hampers in Kolkata with GST invoicing and custom branding."
        />
      </Helmet>

      {/* Hero */}
      <section className="py-12 md:py-20 bg-parchment border-b border-hairline">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              CORPORATE &amp; WEDDING BHAJI
            </p>
            <h1 className="font-playfair text-4xl md:text-5xl text-espresso leading-tight">
              Gifts that carry blessings.
            </h1>
            <p className="text-base md:text-lg text-walnut leading-relaxed">
              Offer clients, teams, and family guests sacred brass, Makrana marble, and pure aromatics instead of forgettable dry-fruit boxes. Complete GST invoices and pan-India dispatch from Kolkata.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild>
                <a href="#enquiry-form">Request a quote</a>
              </Button>
              <Button asChild variant="secondary">
                <a href={STORE_INFO.whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="w-4 h-4" /> WhatsApp gifting desk
                </a>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-md overflow-hidden border border-gold/40 shadow-card">
              <img
                src="/images/gifting-hampers.jpg"
                alt="Ivory handmade-paper festive hampers tied with tulsi green ribbons"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-14 md:py-20 bg-ivory">
        <div className="container">
          <SectionHeader
            eyebrow="CURATED HAMPER TIERS"
            title="Three starting edits — bespoke to your budget"
            subtitle="Indicative per-unit prices for bulk orders; every box can be tailored at our Phoolbagan store."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-md border p-6 flex flex-col justify-between space-y-6 ${
                  tier.featured
                    ? 'border-tulsi bg-parchment/70 shadow-card'
                    : 'border-hairline bg-ivory'
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <p className="font-cinzel text-xs uppercase tracking-[0.2em] text-gold">
                      {tier.minQty}
                    </p>
                    <h2 className="font-playfair text-2xl text-espresso mt-1">{tier.name}</h2>
                    <p lang="hi" className="text-sm text-walnut">{tier.nameHi}</p>
                  </div>
                  <p className="font-playfair text-3xl text-tulsi font-tabular">
                    {formatINR(tier.price)}
                    <span className="text-xs font-sans text-walnut font-normal ml-1">/ box</span>
                  </p>
                  <ul className="space-y-2.5 pt-2 border-t border-hairline text-sm text-walnut">
                    {tier.contents.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-tulsi shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={tier.featured ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => {
                    setBudget(String(tier.price));
                    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Choose {tier.name}
                </Button>
              </div>
            ))}
          </div>

          {/* 4-step process strip */}
          <div className="mt-14 p-6 md:p-8 rounded-md border border-hairline bg-parchment/45 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { step: '01', title: 'Share requirement', desc: 'Quantity, budget & city' },
              { step: '02', title: 'Sample check', desc: 'Inspect at store or courier' },
              { step: '03', title: 'Custom branding', desc: 'Logo sleeve & blessing card' },
              { step: '04', title: 'GST & dispatch', desc: 'Kolkata fleet or pan-India' },
            ].map((p) => (
              <div key={p.step}>
                <p className="font-cinzel text-xs text-gold font-semibold">{p.step}</p>
                <p className="font-playfair text-lg text-espresso mt-1">{p.title}</p>
                <p className="text-xs text-walnut mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="py-14 md:py-20 bg-parchment/50 border-t border-hairline">
        <div className="container max-w-3xl">
          <SectionHeader
            eyebrow="REQUEST A QUOTE"
            title="Tell us what you are celebrating"
          />

          <div className="mt-10 rounded-md border border-hairline bg-white p-6 md:p-8">
            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <h3 className="font-playfair text-2xl text-tulsi">
                  Thank you — we&apos;ll call within one working day.
                </h3>
                <p className="text-sm text-walnut">
                  Our Kolkata gifting desk has saved your requirement. Need urgent quotes? Call {STORE_INFO.phoneDisplay}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input label="Company / Family Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Phone / WhatsApp" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Approx. Quantity" type="number" min={10} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  <Input label="Budget per Box (₹)" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
                  <Input label="Needed By Date" type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} />
                </div>
                <Input label="GSTIN (optional, for B2B tax invoice)" value={gstin} onChange={(e) => setGstin(e.target.value)} />
                <div>
                  <label className="block text-[13px] font-medium text-walnut mb-1.5">
                    Notes or preferred items
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Let us know preferred brass/Herbaa items, custom card text, or multi-city shipping..."
                    className="w-full rounded-sm border border-hairline bg-white p-3.5 text-sm text-espresso focus:outline-none focus:border-tulsi"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Request Quote
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

