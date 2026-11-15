import React from 'react';
import { PageHero, BreadcrumbItem } from '@/components/PageHero';
import { STORE_CONTACT } from '@/data/pages';
import { MessageCircle, Mail } from 'lucide-react';

export interface PolicyLayoutProps {
  eyebrow?: string;
  title: string;
  subline?: string;
  lastUpdated: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
}

export function PolicyAddressBlock() {
  return (
    <div className="bg-parchment border border-hairline rounded-[6px] p-4 md:p-5 text-[14px] leading-relaxed text-espresso space-y-1.5 my-4">
      <p className="font-semibold text-espresso">{STORE_CONTACT.name}</p>
      <p className="text-walnut">{STORE_CONTACT.address}</p>
      <p className="text-walnut">
        Phone: <a href={STORE_CONTACT.phoneHref} className="text-tulsi hover:underline font-medium">{STORE_CONTACT.phone}</a>
        {' · '}
        Email: <a href={`mailto:${STORE_CONTACT.email}`} className="text-tulsi hover:underline font-medium">{STORE_CONTACT.email}</a>
      </p>
      <p className="text-xs text-walnut">
        Hours: {STORE_CONTACT.hours} <span className="text-walnut/70 text-[11px]">{STORE_CONTACT.hoursNote}</span>
      </p>
      <p className="font-cinzel text-[11px] tracking-[0.2em] text-gold pt-1">
        {STORE_CONTACT.gstin}
      </p>
    </div>
  );
}

export function PolicyNoteCallout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="bg-parchment p-4 md:p-5 rounded-r-[4px] border-l-[3px] border-gold text-[15px] leading-relaxed text-espresso my-6">
      <p className="font-cinzel text-[11px] uppercase tracking-[0.2em] text-gold mb-1 font-semibold">
        NOTE
      </p>
      <div className="text-walnut text-[14px] leading-relaxed">{children}</div>
    </aside>
  );
}

export function PolicyHeading2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-playfair text-[24px] text-espresso leading-snug mt-10 mb-4 after:content-[''] after:block after:w-12 after:h-[1px] after:bg-gold after:mt-2.5">
      {children}
    </h2>
  );
}

export function PolicyHeading3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-sans font-semibold text-[14px] uppercase tracking-[0.08em] text-gold mt-6 mb-2.5">
      {children}
    </h3>
  );
}

export function PolicyDiamondList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5 my-4 text-[15px] leading-relaxed text-espresso">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className="text-gold text-[10px] mt-1.5 shrink-0 select-none">◆</span>
          <span className="text-espresso leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PolicyHelpStrip() {
  return (
    <section className="mt-14 pt-8 border-t border-hairline">
      <div className="bg-parchment rounded-[6px] border border-hairline p-6 md:p-8 text-center space-y-4">
        <p className="font-playfair text-xl text-espresso">
          Still have a question?
        </p>
        <p className="text-sm text-walnut max-w-md mx-auto">
          WhatsApp <a href={STORE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="text-tulsi font-semibold hover:underline">{STORE_CONTACT.whatsapp}</a> or write to{' '}
          <a href={`mailto:${STORE_CONTACT.email}`} className="text-tulsi font-semibold hover:underline">{STORE_CONTACT.email}</a>.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={STORE_CONTACT.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-tulsi text-tulsi hover:bg-tulsi hover:text-ivory text-xs uppercase tracking-[0.1em] font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp us
          </a>
          <a
            href={`mailto:${STORE_CONTACT.email}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-gold text-walnut hover:bg-gold hover:text-ivory text-xs uppercase tracking-[0.1em] font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email us
          </a>
        </div>
      </div>
    </section>
  );
}

export function PolicyLayout({
  eyebrow = 'POLICY',
  title,
  subline,
  lastUpdated,
  breadcrumbs,
  children,
}: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory">
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subline={subline}
        breadcrumbs={breadcrumbs}
      />

      <article className="py-10 md:py-16">
        <div className="container max-w-[720px] px-4 font-sans text-espresso text-[16px] leading-[26px]">
          <div className="pb-6 border-b border-hairline text-[13px] text-walnut">
            Last updated: <span className="font-medium text-espresso">{lastUpdated}</span>
          </div>

          <div className="pt-6 space-y-4">
            {children}
          </div>

          <PolicyHelpStrip />
        </div>
      </article>
    </div>
  );
}
