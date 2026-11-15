import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  subline?: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageHero({ eyebrow, title, subline, breadcrumbs }: PageHeroProps) {
  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `https://varcham.in${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumbs)}</script>
      </Helmet>

      {/* Hero Tulsi Band */}
      <section className="relative w-full bg-tulsi overflow-hidden h-[160px] md:h-[220px] flex items-center justify-center">
        {/* Inset Gold-light Frame: 1px, inset 12px */}
        <div
          aria-hidden="true"
          className="absolute inset-3 md:inset-3 border border-gold-light/40 pointer-events-none"
        />

        {/* Content */}
        <div className="container relative z-10 text-center px-4 max-w-4xl space-y-1.5 md:space-y-2.5">
          <p className="font-cinzel text-[11px] md:text-xs uppercase tracking-[0.28em] text-gold-light font-medium">
            {eyebrow}
          </p>
          <h1 className="font-playfair text-[30px] md:text-[44px] leading-tight tracking-[-0.01em] text-ivory font-normal">
            {title}
          </h1>
          {subline && (
            <p className="font-playfair italic text-xs md:text-sm text-gold-light/95 max-w-2xl mx-auto line-clamp-2 md:line-clamp-none">
              {subline}
            </p>
          )}
        </div>
      </section>

      {/* Breadcrumb Strip on Parchment */}
      <nav
        aria-label="Breadcrumb"
        className="w-full bg-parchment border-b border-hairline py-2.5 px-4"
      >
        <div className="container max-w-5xl flex items-center gap-1.5 text-[13px] font-sans">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={idx} className="inline-flex items-center gap-1.5">
                {idx > 0 && <span className="text-walnut/60 font-serif">›</span>}
                {crumb.href && !isLast ? (
                  <Link
                    to={crumb.href}
                    className="text-walnut hover:text-tulsi transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-espresso font-semibold" aria-current={isLast ? 'page' : undefined}>
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </nav>
    </>
  );
}
