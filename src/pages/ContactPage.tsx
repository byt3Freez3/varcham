import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { STORE_CONTACT } from '@/data/pages';
import { sendContactMessage } from '@/lib/api';

const TOPICS = [
  'Order enquiry',
  'Product question',
  'Bulk & corporate',
  'Feedback',
  'Other',
];

export function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Please provide your name.';
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please enter at least 10 characters describing your requirement.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await sendContactMessage({
        name,
        phone,
        email,
        topic,
        message,
      });
      setSuccessRef(res.referenceId);
    } catch {
      setErrors({ form: 'Failed to send message. Please WhatsApp us directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setTopic(TOPICS[0]);
    setMessage('');
    setErrors({});
    setSuccessRef(null);
  };

  // Structured Data: LocalBusiness
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: STORE_CONTACT.name,
    image: 'https://varcham.in/images/store-kolkata.jpg',
    telephone: STORE_CONTACT.phone,
    email: STORE_CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: STORE_CONTACT.addressLine1,
      addressLocality: STORE_CONTACT.city,
      addressRegion: STORE_CONTACT.state,
      postalCode: STORE_CONTACT.pincode,
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '20:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '14:00',
      },
    ],
    url: 'https://varcham.in',
  };

  return (
    <div className="min-h-screen bg-ivory pb-24 md:pb-16">
      <Helmet>
        <title>Contact Us | Varcham India Phoolbagan Kolkata</title>
        <meta
          name="description"
          content="Speak with our Kolkata store team. Visit us behind VIP Market, Phoolbagan, call +91 90079 96100, or send an enquiry message."
        />
        <link rel="canonical" href="https://varcham.in/contact" />
        <meta property="og:title" content="Contact Us | Varcham India" />
        <meta
          property="og:description"
          content="Visit our Phoolbagan store, message on WhatsApp, or send an enquiry for ritual samagri or corporate orders."
        />
        <meta property="og:url" content="https://varcham.in/contact" />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="GET IN TOUCH"
        title="Contact Us"
        subline="We're here to help you prepare for every ritual."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Card: Store Contact & Map */}
            <div className="lg:col-span-5 bg-parchment rounded-[6px] border border-hairline p-6 md:p-8 space-y-6 shadow-xs">
              <div className="space-y-1">
                <p className="font-cinzel text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                  OUR FLAGSHIP BOUTIQUE
                </p>
                <h2 className="font-playfair text-2xl text-espresso font-semibold">
                  Phoolbagan, Kolkata
                </h2>
              </div>

              {/* Contact Details List */}
              <div className="space-y-4 text-sm text-espresso">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-espresso">Address</p>
                    <p className="text-walnut mt-0.5">{STORE_CONTACT.address}</p>
                    <p className="text-xs text-walnut/70 mt-0.5">
                      Landmark: {STORE_CONTACT.landmark} (3 min walk from Phoolbagan Metro)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-espresso">Store Desk &amp; Orders</p>
                    <a
                      href={STORE_CONTACT.phoneHref}
                      className="text-tulsi font-semibold hover:underline mt-0.5 block"
                    >
                      {STORE_CONTACT.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-tulsi shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-espresso">WhatsApp Support</p>
                    <a
                      href={STORE_CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-tulsi font-semibold hover:underline mt-0.5 inline-flex items-center gap-1"
                    >
                      Chat on WhatsApp <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-espresso">Email Address</p>
                    <a
                      href={`mailto:${STORE_CONTACT.email}`}
                      className="text-tulsi font-semibold hover:underline mt-0.5 block break-all"
                    >
                      {STORE_CONTACT.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-espresso">Store Hours</p>
                    <p className="text-walnut mt-0.5">{STORE_CONTACT.hours}</p>
                    <p className="text-xs text-walnut/70 mt-0.5">{STORE_CONTACT.hoursNote}</p>
                  </div>
                </div>
              </div>

              {/* GSTIN Placeholder */}
              <div className="pt-2 border-t border-hairline">
                <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-gold font-medium">
                  {STORE_CONTACT.gstin}
                </p>
              </div>

              {/* Social Icon Links */}
              <div className="pt-2 border-t border-hairline flex items-center gap-4 text-walnut">
                <span className="font-cinzel text-xs uppercase tracking-[0.14em] text-walnut/80">
                  Follow us:
                </span>
                <a
                  href={STORE_CONTACT.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white border border-hairline text-walnut hover:text-tulsi hover:border-tulsi transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={STORE_CONTACT.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white border border-hairline text-walnut hover:text-tulsi hover:border-tulsi transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={STORE_CONTACT.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white border border-hairline text-walnut hover:text-tulsi hover:border-tulsi transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>

              {/* Embedded Google Maps iframe */}
              <div className="pt-2">
                <div className="w-full h-[280px] rounded-[6px] overflow-hidden border border-hairline bg-white shadow-inner">
                  <iframe
                    title="Varcham India Store Location"
                    src={STORE_CONTACT.mapEmbedUrl}
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            {/* Right Card: Send Us a Message Form */}
            <div className="lg:col-span-7 bg-white rounded-[6px] border border-hairline p-6 md:p-8 shadow-xs space-y-6">
              <div className="space-y-1">
                <p className="font-cinzel text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                  DIRECT ENQUIRY
                </p>
                <h2 className="font-playfair text-2xl text-espresso font-semibold">
                  Send us a message
                </h2>
                <p className="text-sm text-walnut">
                  Have a question about an upcoming ritual, samagri verification, or corporate hamper? Drop us a note below.
                </p>
              </div>

              {/* Success Card */}
              {successRef ? (
                <div className="p-8 rounded-[6px] bg-parchment border border-hairline text-center space-y-4 animate-in fade-in-50 duration-200">
                  <CheckCircle2 className="w-12 h-12 text-tulsi mx-auto stroke-[1.5]" />
                  <div className="space-y-1.5">
                    <h3 className="font-playfair text-2xl text-espresso">
                      Message received
                    </h3>
                    <p className="text-sm text-walnut max-w-md mx-auto">
                      We usually reply within 2 working hours on WhatsApp or email.
                    </p>
                    <p className="font-mono text-xs font-semibold text-tulsi tracking-wider pt-2">
                      Reference ID: {successRef}
                    </p>
                  </div>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-sm bg-tulsi text-ivory text-xs uppercase tracking-[0.1em] font-semibold hover:bg-tulsi/90 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.form && (
                    <div className="p-3.5 rounded bg-sindoor/10 border border-sindoor/30 text-sindoor text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.form}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contactName"
                        className="block text-xs font-cinzel uppercase tracking-[0.12em] text-walnut font-medium"
                      >
                        Name <span className="text-sindoor">*</span>
                      </label>
                      <input
                        id="contactName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className={`w-full h-11 px-3.5 rounded-sm bg-parchment/30 border text-espresso text-sm placeholder:text-walnut/50 focus:outline-none focus:ring-1 focus:ring-tulsi ${
                          errors.name ? 'border-sindoor' : 'border-hairline'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[12px] text-sindoor">{errors.name}</p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contactPhone"
                        className="block text-xs font-cinzel uppercase tracking-[0.12em] text-walnut font-medium"
                      >
                        Mobile (10 digits) <span className="text-sindoor">*</span>
                      </label>
                      <input
                        id="contactPhone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="e.g. 9007996100"
                        className={`w-full h-11 px-3.5 rounded-sm bg-parchment/30 border text-espresso text-sm placeholder:text-walnut/50 focus:outline-none focus:ring-1 focus:ring-tulsi ${
                          errors.phone ? 'border-sindoor' : 'border-hairline'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[12px] text-sindoor">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contactEmail"
                        className="block text-xs font-cinzel uppercase tracking-[0.12em] text-walnut font-medium"
                      >
                        Email address <span className="text-walnut/60 text-[11px]">(optional)</span>
                      </label>
                      <input
                        id="contactEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className={`w-full h-11 px-3.5 rounded-sm bg-parchment/30 border text-espresso text-sm placeholder:text-walnut/50 focus:outline-none focus:ring-1 focus:ring-tulsi ${
                          errors.email ? 'border-sindoor' : 'border-hairline'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[12px] text-sindoor">{errors.email}</p>
                      )}
                    </div>

                    {/* Topic */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contactTopic"
                        className="block text-xs font-cinzel uppercase tracking-[0.12em] text-walnut font-medium"
                      >
                        Topic <span className="text-sindoor">*</span>
                      </label>
                      <select
                        id="contactTopic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-sm bg-parchment/30 border border-hairline text-espresso text-sm focus:outline-none focus:ring-1 focus:ring-tulsi"
                      >
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contactMessage"
                      className="block text-xs font-cinzel uppercase tracking-[0.12em] text-walnut font-medium"
                    >
                      Message (min 10 characters) <span className="text-sindoor">*</span>
                    </label>
                    <textarea
                      id="contactMessage"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please tell us about your requirement or question..."
                      className={`w-full p-3.5 rounded-sm bg-parchment/30 border text-espresso text-sm placeholder:text-walnut/50 focus:outline-none focus:ring-1 focus:ring-tulsi ${
                        errors.message ? 'border-sindoor' : 'border-hairline'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[12px] text-sindoor">{errors.message}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto px-8 h-12 rounded-sm bg-tulsi text-ivory font-semibold text-xs uppercase tracking-[0.12em] hover:bg-tulsi/90 transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Bar (screens < 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory border-t border-hairline p-3 flex gap-3 shadow-lg">
        <a
          href={STORE_CONTACT.phoneHref}
          className="flex-1 h-11 rounded-sm bg-parchment border border-hairline text-espresso font-semibold text-xs uppercase tracking-[0.08em] flex items-center justify-center gap-2 hover:bg-sandal transition-colors"
        >
          <Phone className="w-4 h-4 text-gold" />
          Call store
        </a>
        <a
          href={STORE_CONTACT.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 h-11 rounded-sm bg-tulsi text-ivory font-semibold text-xs uppercase tracking-[0.08em] flex items-center justify-center gap-2 hover:bg-tulsi/90 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp us
        </a>
      </div>
    </div>
  );
}
