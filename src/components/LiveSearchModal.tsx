import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import type { WatchModel } from '../types/database';
import { fetchWatches } from '../services/watches';

interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWatch: (watch: WatchModel) => void;
}

export const LiveSearchModal: React.FC<LiveSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectWatch,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WatchModel[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      loadInitial();
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const loadInitial = async () => {
    setLoading(true);
    const data = await fetchWatches();
    setResults(data);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const filtered = await fetchWatches({ searchQuery: val });
      setResults(filtered);
      setLoading(false);
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] bg-[#050505]/95 backdrop-blur-2xl flex items-start justify-center pt-20 sm:pt-28 px-4 pb-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#090909] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.08] bg-[#070707]">
          <Search className="w-5 h-5 text-luxury-champagne flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search by watch name, calibre, collection, or material..."
            className="w-full bg-transparent text-sm sm:text-base text-luxury-ivory font-serif tracking-wide placeholder:text-luxury-stone/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                loadInitial();
              }}
              className="p-1 text-luxury-stone hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-mono tracking-widest text-luxury-stone/70 hover:text-luxury-ivory px-2 py-1 border border-white/[0.06] rounded"
          >
            ESC
          </button>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/[0.04] bg-[#050505] overflow-x-auto text-[9px] font-mono tracking-wider text-luxury-stone/70">
          <span className="text-white/40 uppercase">SUGGESTIONS:</span>
          {['Titanium', 'Rose Gold', 'Calibre 900', 'Skeleton', 'Platinum', 'Chronographe'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                fetchWatches({ searchQuery: tag }).then(setResults);
              }}
              className="px-2.5 py-0.5 bg-white/[0.03] hover:bg-luxury-champagne/10 hover:text-luxury-champagne border border-white/[0.06] rounded-full transition-colors whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          {loading ? (
            <div className="py-12 text-center font-mono text-[10px] tracking-widest text-luxury-stone/60">
              SEARCHING ATELIER DATABASE...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif italic text-lg text-luxury-stone">
                No timepieces match "{query}"
              </p>
              <p className="font-mono text-[9px] tracking-widest text-luxury-stone/50">
                TRY SEARCHING FOR TITANIUM, ROSE GOLD, OR CALIBRE 900
              </p>
            </div>
          ) : (
            results.map((watch) => (
              <div
                key={watch.id}
                onClick={() => {
                  onSelectWatch(watch);
                  onClose();
                }}
                className="group flex items-center justify-between p-4 bg-[#050505] hover:bg-[#0D0D0D] border border-white/[0.05] hover:border-luxury-champagne/30 rounded-sm cursor-pointer transition-all duration-300"
                data-cursor="EXAMINE"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black/80 p-1 flex items-center justify-center rounded border border-white/[0.04] flex-shrink-0">
                    <img
                      src={watch.hero_image}
                      alt={watch.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] tracking-wider text-luxury-champagne uppercase">
                        {watch.collection}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="font-mono text-[9px] tracking-wider text-luxury-stone/60">
                        {watch.specs?.reference || 'GENEVA'}
                      </span>
                    </div>
                    <h4 className="font-serif text-xl font-light text-luxury-ivory group-hover:text-luxury-champagne transition-colors">
                      {watch.name}
                    </h4>
                    <p className="font-sans text-xs text-luxury-stone/70 font-light truncate max-w-md">
                      {watch.specs?.case_material} · {watch.specs?.diameter} · {watch.specs?.movement}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-4">
                  <span className="font-mono text-sm text-luxury-champagne block">
                    {watch.formattedPrice}
                  </span>
                  <span className="font-mono text-[9px] text-luxury-stone/60 uppercase">
                    {watch.availability}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
