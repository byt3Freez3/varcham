import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { STORE_INFO } from '@/data/store';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const list = await getProducts({ query });
      if (!active) return;
      setResults(list);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query}` : 'Search'} | Varcham India</title>
        <meta name="description" content="Search authentic puja samagri, attars, brass & marble diyas, and sandalwood malas at Varcham India." />
      </Helmet>

      <section className="py-10 md:py-16 bg-ivory">
        <div className="container space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <p className="font-cinzel text-xs uppercase tracking-[0.28em] text-gold">
              SEARCH OUR SHELVES
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl text-espresso">
              {query ? `Results for “${query}”` : 'Find any puja essential'}
            </h1>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try kapur, kesar chandan, marble diya..."
                  className="w-full h-12 rounded-sm border border-hairline bg-white pl-10 pr-4 text-base text-espresso focus:outline-none focus:border-tulsi"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-14 text-center rounded-md border border-hairline bg-parchment/45 max-w-xl mx-auto px-6 space-y-3">
              <h2 className="font-playfair text-2xl text-espresso">
                We couldn&apos;t find &ldquo;{query}&rdquo;
              </h2>
              <p className="text-sm text-walnut">
                Try a Hindi name (e.g. &ldquo;kapur&rdquo;, &ldquo;roli&rdquo;) or ask us directly on WhatsApp — our store team stocks over 277 items.
              </p>
              <Button asChild variant="secondary" className="mt-2">
                <a href={STORE_INFO.whatsappUrl} target="_blank" rel="noreferrer">
                  Ask us on WhatsApp
                </a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

