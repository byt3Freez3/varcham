import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronRight,
  Download,
  Minus,
  Plus,
  Check,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { getFestivalKit, getFestivals, HydratedFestivalKit } from '@/lib/api';
import { Festival } from '@/types';
import { formatINR, getCountdownParts } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';

export function FestivalKitPage() {
  const { slug } = useParams<{ slug: string }>();
  const [kit, setKit] = useState<HydratedFestivalKit | undefined>();
  const [otherFestivals, setOtherFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  const { addMultipleItems } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    async function load() {
      if (!slug) return;
      setLoading(true);
      const [kitData, allFests] = await Promise.all([getFestivalKit(slug), getFestivals()]);
      if (!active) return;

      setKit(kitData);
      setOtherFestivals(allFests.filter((f) => f.slug !== slug).slice(0, 3));

      if (kitData) {
        const initSel: Record<string, boolean> = {};
        const initQty: Record<string, number> = {};
        kitData.items.forEach((row) => {
          initSel[row.product.id] = row.product.inStock && !row.isOptional;
          initQty[row.product.id] = row.qty;
        });
        setSelectedMap(initSel);
        setQtyMap(initQty);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const { selectedRows, mrpTotal, savings, finalTotal } = useMemo(() => {
    if (!kit) return { selectedRows: [], mrpTotal: 0, savings: 0, finalTotal: 0 };
    const rows = kit.items.filter((row) => selectedMap[row.product.id] && row.product.inStock);
    const mrp = rows.reduce((sum, r) => sum + r.product.price * (qtyMap[r.product.id] ?? r.qty), 0);
    const save = Math.round((mrp * kit.festival.kitDiscountPercent) / 100);
    return {
      selectedRows: rows,
      mrpTotal: mrp,
      savings: save,
      finalTotal: mrp - save,
    };
  }, [kit, selectedMap, qtyMap]);

  if (loading) {
    return (
      <div className="container py-16">
        <p className="text-walnut">Preparing your samagri checklist...</p>
      </div>
    );
  }

  if (!kit) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-playfair text-3xl">Festival kit not found</h1>
        <Button asChild>
          <Link to="/festivals">Browse all festivals</Link>
        </Button>
      </div>
    );
  }

  const { festival } = kit;
  const countdown = festival.date ? getCountdownParts(festival.date) : null;

  const handleAddKit = () => {
    if (selectedRows.length === 0) return;
    addMultipleItems(
      selectedRows.map((row) => ({
        product: row.product,
        variant: row.product.variants[0],
        qty: qtyMap[row.product.id] ?? row.qty,
      })),
      festival.kitDiscountPercent
    );
  };

  const handleDownloadChecklist = () => {
    const lines = [
      `Varcham India — ${festival.name} (${festival.nameHi})`,
      `Store: P-79 Swami Swarupananda Sarani, Phoolbagan, Kolkata 700054 · +91 90079 96100`,
      '',
      'PUJA SAMAGRI CHECKLIST:',
      ...kit.items.map(
        (r) =>
          `[ ] ${r.product.name} (${r.product.nameHi}) × ${qtyMap[r.product.id] ?? r.qty} — ₹${
            r.product.price * (qtyMap[r.product.id] ?? r.qty)
          }`
      ),
      '',
      `Kit Total (${festival.kitDiscountPercent}% savings): ₹${finalTotal}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${festival.slug}-samagri-checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({ message: 'Checklist downloaded to your device.' });
  };

  return (
    <>
      <Helmet>
        <title>{festival.name} Puja Samagri Kit | Varcham India</title>
        <meta
          name="description"
          content={`Everything for ${festival.name} puja in one kit. Untick items you already have and save ${festival.kitDiscountPercent}% with Varcham India Kolkata.`}
        />
      </Helmet>

      {/* Top Ritual Header */}
      <section className="bg-parchment border-b border-hairline py-8 md:py-12">
        <div className="container">
          <nav aria-label="Breadcrumb" className="text-xs text-walnut flex items-center gap-1.5 mb-5">
            <Link to="/" className="hover:text-tulsi">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <Link to="/festivals" className="hover:text-tulsi">
              Festivals
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gold" />
            <span className="text-espresso font-medium">{festival.name}</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-cinzel text-xs font-semibold uppercase tracking-[0.28em] text-gold">
                {festival.dateLabel}
              </span>
              {countdown && !countdown.isPast && (
                <span className="px-2.5 py-0.5 rounded-full bg-ivory border border-gold/40 text-xs font-medium text-tulsi">
                  {countdown.days} days · {countdown.hours} hrs left
                </span>
              )}
            </div>
            <h1 className="font-playfair text-3xl md:text-5xl text-espresso">{festival.name}</h1>
            <p lang="hi" className="font-hindi text-xl text-walnut">
              {festival.nameHi}
            </p>
            <p className="text-base text-walnut leading-relaxed pt-1">{festival.shortStory}</p>
          </div>
        </div>
      </section>

      {/* Checklist + Sticky Summary */}
      <section className="py-10 md:py-14 bg-ivory pb-28 md:pb-16">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Checklist */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-md border border-hairline bg-ivory overflow-hidden">
              <div className="px-5 py-4 bg-parchment/60 border-b border-hairline flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-playfair text-xl text-espresso">
                    What this puja needs
                  </h2>
                  <p className="text-xs text-walnut">
                    Already have some items? Just untick them — total updates live.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadChecklist}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-espresso"
                >
                  <Download className="w-4 h-4" /> Download checklist
                </button>
              </div>

              <ul className="divide-y divide-hairline">
                {kit.items.map((row) => {
                  const checked = Boolean(selectedMap[row.product.id]);
                  const qty = qtyMap[row.product.id] ?? row.qty;

                  return (
                    <li
                      key={row.product.id}
                      className={`p-4 md:px-5 flex items-center gap-3 md:gap-4 transition-colors ${
                        !checked ? 'bg-parchment/25 opacity-70' : 'bg-ivory'
                      }`}
                    >
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        disabled={!row.product.inStock}
                        onClick={() =>
                          setSelectedMap((prev) => ({
                            ...prev,
                            [row.product.id]: !prev[row.product.id],
                          }))
                        }
                        className={`w-6 h-6 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-tulsi border-tulsi text-gold-light'
                            : 'bg-white border-walnut/40'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </button>

                      <Link
                        to={`/product/${row.product.slug}`}
                        className="w-14 h-14 rounded-sm bg-parchment border border-hairline overflow-hidden shrink-0"
                      >
                        <img
                          src={row.product.images[0]}
                          alt={row.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/product/${row.product.slug}`}
                            className="font-playfair text-base font-medium text-espresso hover:text-tulsi truncate"
                          >
                            {row.product.name}
                          </Link>
                          {row.isOptional && (
                            <span className="px-2 py-0.5 rounded-sm bg-parchment text-[10px] font-cinzel uppercase tracking-wider text-walnut shrink-0">
                              Optional
                            </span>
                          )}
                        </div>
                        <p lang="hi" className="text-xs text-walnut">
                          {row.product.nameHi}
                        </p>
                        {row.note && (
                          <p className="text-xs text-walnut/80 mt-0.5">{row.note}</p>
                        )}
                      </div>

                      {/* Stepper */}
                      <div className="inline-flex items-center border border-hairline rounded-sm bg-white h-9 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setQtyMap((prev) => ({
                              ...prev,
                              [row.product.id]: Math.max(1, (prev[row.product.id] ?? row.qty) - 1),
                            }))
                          }
                          aria-label={`Decrease ${row.product.name} quantity`}
                          className="w-8 h-full flex items-center justify-center text-espresso hover:bg-sandal"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold font-tabular">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQtyMap((prev) => ({
                              ...prev,
                              [row.product.id]: (prev[row.product.id] ?? row.qty) + 1,
                            }))
                          }
                          aria-label={`Increase ${row.product.name} quantity`}
                          className="w-8 h-full flex items-center justify-center text-espresso hover:bg-sandal"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[64px]">
                        <span className="text-sm font-semibold font-tabular text-espresso">
                          {formatINR(row.product.price * qty)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* How to Perform */}
            <div className="p-6 rounded-md border border-hairline bg-parchment/40 space-y-4">
              <h2 className="font-playfair text-2xl text-espresso">
                How to perform the ritual
              </h2>
              <ol className="space-y-3">
                {festival.howToSteps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-walnut leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-tulsi text-ivory text-xs font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sticky Right Summary (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="p-6 rounded-md border border-gold/45 bg-parchment/60 space-y-4">
              <p className="font-cinzel text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                YOUR PUJA THALI SUMMARY
              </p>

              <div className="space-y-2 text-sm border-b border-hairline pb-4">
                <div className="flex justify-between text-walnut">
                  <span>Selected items ({selectedRows.length})</span>
                  <span className="font-tabular">{formatINR(mrpTotal)}</span>
                </div>
                <div className="flex justify-between text-tulsi font-medium">
                  <span>Kit savings ({festival.kitDiscountPercent}%)</span>
                  <span className="font-tabular">-{formatINR(savings)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-espresso pt-2 border-t border-hairline">
                  <span>Kit Total</span>
                  <span className="font-tabular">{formatINR(finalTotal)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={selectedRows.length === 0}
                onClick={handleAddKit}
              >
                {selectedRows.length === 0
                  ? 'Select at least one item'
                  : `Add complete kit — save ${festival.kitDiscountPercent}%`}
              </Button>

              <div className="space-y-2 pt-2 text-xs text-walnut">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <span>Order before 2 pm for same-day Kolkata dispatch.</span>
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span>Every item checked &amp; packed by our Phoolbagan team.</span>
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Related festivals */}
        {otherFestivals.length > 0 && (
          <div className="container mt-14 pt-10 border-t border-hairline">
            <h2 className="font-playfair text-2xl text-espresso mb-6">Other Puja &amp; Festival Kits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otherFestivals.map((f) => (
                <Link
                  key={f.id}
                  to={`/festivals/${f.slug}`}
                  className="p-4 rounded-md border border-hairline bg-parchment/40 hover:shadow-card transition-all flex items-center gap-4"
                >
                  <img
                    src={f.heroImage}
                    alt={f.name}
                    className="w-16 h-20 object-cover rounded-sm shrink-0"
                  />
                  <div>
                    <p className="font-playfair text-base text-espresso">{f.name}</p>
                    <p className="text-xs text-walnut mt-0.5">{f.dateLabel}</p>
                    <span className="inline-block text-xs font-semibold text-tulsi mt-1">
                      Open checklist →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Mobile Sticky Kit Bar */}
      <div className="fixed bottom-16 inset-x-0 z-30 lg:hidden bg-ivory border-t border-hairline px-4 py-3 flex items-center justify-between gap-3 shadow-card">
        <div>
          <p className="text-xs text-tulsi font-medium">
            Save {formatINR(savings)} ({selectedRows.length} items)
          </p>
          <p className="text-lg font-semibold font-tabular text-espresso">{formatINR(finalTotal)}</p>
        </div>
        <Button
          size="lg"
          disabled={selectedRows.length === 0}
          onClick={handleAddKit}
        >
          Add Kit to Thali
        </Button>
      </div>
    </>
  );
}

