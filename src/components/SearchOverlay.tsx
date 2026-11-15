import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { Product } from '@/types';

const POPULAR_TERMS = [
  'kapur',
  'chandan attar',
  'akhand diya',
  'red sandalwood mala',
  'marble diya',
  'ganga jal',
];

export function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const list = await getProducts({ query });
      setResults(list.slice(0, 6));
      setLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-espresso/40 backdrop-blur-[2px] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Search Varcham catalog"
    >
      <div className="bg-ivory border-b border-hairline shadow-card">
        <div className="container py-5 md:py-7">
          <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
            <Search className="w-5 h-5 text-gold shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search samagri, attar, diya, sandalwood, kapur..."
              className="w-full h-12 bg-transparent text-lg md:text-xl font-playfair text-espresso placeholder:text-walnut/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="w-11 h-11 flex items-center justify-center rounded-sm text-espresso hover:bg-sandal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-cinzel text-[11px] uppercase tracking-[0.22em] text-gold mr-1">
              Popular:
            </span>
            {POPULAR_TERMS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-3 py-1.5 rounded-full bg-parchment border border-hairline text-xs text-walnut hover:bg-sandal hover:text-espresso transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {query.trim() && (
            <div className="mt-6 pt-5 border-t border-hairline">
              {loading ? (
                <p className="text-sm text-walnut">Searching Varcham shelves...</p>
              ) : results.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-cinzel uppercase tracking-[0.2em] text-gold">
                      Matching Essentials
                    </p>
                    <Link
                      to={`/search?q=${encodeURIComponent(query.trim())}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-tulsi hover:underline"
                    >
                      View all results <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2.5 rounded-md border border-hairline bg-parchment/40 hover:bg-parchment transition-colors"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-14 h-16 object-cover rounded-sm bg-parchment shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-playfair text-sm font-medium text-espresso truncate">
                            {item.name}
                          </p>
                          <p lang="hi" className="text-xs text-walnut truncate">
                            {item.nameHi}
                          </p>
                          <p className="text-sm font-semibold font-tabular text-tulsi mt-0.5">
                            {formatINR(item.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-4 text-sm text-walnut">
                  We couldn&apos;t find &ldquo;{query}&rdquo;. Try a Hindi name (e.g. &ldquo;kapur&rdquo;) or{' '}
                  <a
                    href="https://wa.me/919007996100"
                    target="_blank"
                    rel="noreferrer"
                    className="text-tulsi font-medium underline"
                  >
                    ask our store on WhatsApp
                  </a>
                  .
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}

