import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowRight } from 'lucide-react';
import { getFestivalKit, getFestivals } from '@/lib/api';
import { Festival } from '@/types';
import { formatINR, getCountdownParts } from '@/lib/utils';
import { SectionHeader } from '@/components/BrandMark';
import { Button } from '@/components/ui/button';

export function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [kitPrices, setKitPrices] = useState<Record<string, { price: number; count: number }>>({});

  useEffect(() => {
    async function load() {
      const list = await getFestivals();
      setFestivals(list);
      const priceMap: Record<string, { price: number; count: number }> = {};
      await Promise.all(
        list.map(async (f) => {
          const kit = await getFestivalKit(f.slug);
          if (kit) {
            priceMap[f.slug] = { price: kit.discountedTotal, count: kit.items.length };
          }
        })
      );
      setKitPrices(priceMap);
    }
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>Festival Samagri Kits | Varcham India</title>
        <meta
          name="description"
          content="Complete puja samagri checklists in one click — Karwa Chauth, Hoi Ashtami, Dev Uthani Ekadashi, Chhath Puja, Diwali Lakshmi Puja, Satyanarayan & Griha Pravesh."
        />
      </Helmet>

      <section className="py-12 md:py-20 bg-ivory">
        <div className="container">
          <SectionHeader
            eyebrow="COMPLETE SAMAGRI CHECKLISTS"
            title="Every festival thali, checked by our store team"
            subtitle="Open any ritual kit, untick items you already keep at home, and save 10% on everything else in one click."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map((fest) => {
              const countdown = fest.date ? getCountdownParts(fest.date) : null;
              const info = kitPrices[fest.slug];

              return (
                <article
                  key={fest.id}
                  className="rounded-md border border-hairline bg-parchment/45 overflow-hidden flex flex-col justify-between hover:shadow-card transition-all"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-parchment">
                      <img
                        src={fest.heroImage}
                        alt={fest.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-cinzel text-[11px] uppercase tracking-[0.2em] text-gold">
                          <Calendar className="w-3.5 h-3.5" />
                          {fest.dateLabel}
                        </span>
                        {countdown && !countdown.isPast && (
                          <span className="px-2.5 py-0.5 rounded-full bg-ivory border border-gold/40 text-[11px] font-medium text-tulsi">
                            In {countdown.days}d
                          </span>
                        )}
                      </div>

                      <div>
                        <h2 className="font-playfair text-2xl text-espresso">{fest.name}</h2>
                        <p lang="hi" className="text-sm text-walnut mt-0.5">
                          {fest.nameHi}
                        </p>
                      </div>

                      <p className="text-sm text-walnut leading-relaxed line-clamp-3">
                        {fest.shortStory}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-hairline/70 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-walnut">
                        {info ? `${info.count} items · Save ${fest.kitDiscountPercent}%` : 'Complete kit'}
                      </p>
                      {info && (
                        <p className="text-lg font-semibold font-tabular text-tulsi">
                          {formatINR(info.price)}
                        </p>
                      )}
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/festivals/${fest.slug}`}>
                        View kit <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

