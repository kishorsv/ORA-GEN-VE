import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ApiErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ApiErrorState: React.FC<ApiErrorStateProps> = ({
  message = 'Unable to load the collection.',
  onRetry,
}) => {
  return (
    <div className="py-20 px-6 text-center max-w-md mx-auto space-y-4">
      <div className="w-12 h-12 rounded-full border border-rose-500/30 bg-rose-950/20 text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6 stroke-[1.5]" />
      </div>

      <h3 className="font-serif text-2xl font-light text-luxury-ivory">
        {message}
      </h3>

      <p className="font-sans text-xs text-luxury-stone font-light">
        The connection to the Geneva atelier database encountered an issue. Please verify your connection or retry.
      </p>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-luxury-champagne/10 border border-luxury-champagne/40 text-luxury-champagne hover:bg-luxury-champagne hover:text-black font-mono text-[10px] tracking-[0.25em] transition-all"
        data-cursor="CLICK"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>RETRY CONNECTION</span>
      </button>
    </div>
  );
};
