import React from 'react';
import type { WatchModel } from '../types/database';
import { X, Heart, ArrowUpRight, Trash2 } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteWatches: WatchModel[];
  onSelectWatch: (watch: WatchModel) => void;
  onRemoveFavorite: (id: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favoriteWatches,
  onSelectWatch,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9997] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#070707] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] bg-[#050505]">
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-luxury-champagne fill-luxury-champagne" />
            <span className="font-serif text-xl tracking-[0.2em] text-luxury-ivory font-light">
              CURATED FAVORITES ({favoriteWatches.length})
            </span>
          </div>

          <button onClick={onClose} className="p-1.5 text-luxury-stone hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {favoriteWatches.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif italic text-lg text-luxury-stone font-light">
                No timepieces curated in your favorites yet.
              </p>
              <p className="font-mono text-[9px] tracking-widest text-luxury-stone/50">
                CLICK THE HEART ICON ON ANY TIMEPIECE TO BOOKMARK
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteWatches.map((watch) => (
                <div
                  key={watch.id}
                  className="flex items-center justify-between p-4 bg-[#050505] border border-white/[0.05] hover:border-luxury-champagne/30 rounded-sm transition-all"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer flex-1"
                    onClick={() => {
                      onSelectWatch(watch);
                      onClose();
                    }}
                  >
                    <div className="w-14 h-14 bg-black p-1 flex items-center justify-center rounded border border-white/[0.04]">
                      <img
                        src={watch.hero_image}
                        alt={watch.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[8px] tracking-widest text-luxury-champagne uppercase block">
                        {watch.collection}
                      </span>
                      <h4 className="font-serif text-lg text-luxury-ivory font-light">
                        {watch.name}
                      </h4>
                      <span className="font-mono text-xs text-luxury-stone">
                        {watch.formattedPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        onSelectWatch(watch);
                        onClose();
                      }}
                      className="px-3 py-1.5 border border-luxury-champagne/30 text-luxury-champagne hover:bg-luxury-champagne hover:text-black font-mono text-[9px] tracking-widest transition-colors flex items-center gap-1"
                    >
                      <span>EXAMINE</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(watch.id)}
                      className="p-1.5 text-luxury-stone hover:text-rose-400"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
