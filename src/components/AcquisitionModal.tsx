import React, { useState } from 'react';
import type { Watch } from '../types/watch';
import { X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface AcquisitionModalProps {
  watch: Watch;
  isOpen: boolean;
  onClose: () => void;
}

export const AcquisitionModal: React.FC<AcquisitionModalProps> = ({
  watch,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Geneva',
    bespokeEngraving: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [allocationRef, setAllocationRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = `ORA-${Math.floor(100000 + Math.random() * 900000)}-${watch.specs.reference.replace(/[^A-Z0-9]/g, '')}`;
    setAllocationRef(refCode);
    setIsSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[9996] bg-[#050505]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#090909] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] bg-[#060606]">
          <div>
            <span className="font-serif text-xl tracking-[0.2em] text-luxury-ivory font-light">ORA GENÈVE</span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-champagne block mt-0.5">
              CONCIERGE D’ACQUISITION
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
            data-cursor="CLOSE"
            aria-label="Close acquisition modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/30 flex items-center justify-center mx-auto text-luxury-champagne">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase block mb-1">
                DEMANDE ENREGISTRÉE
              </span>
              <h3 className="font-serif text-3xl font-light text-luxury-ivory">
                Allocation Dossier Confirmed
              </h3>
              <p className="text-luxury-stone text-xs sm:text-sm font-sans font-light mt-3 max-w-md mx-auto leading-relaxed">
                Thank you, {formData.fullName || 'esteemed client'}. Your allocation inquiry for <span className="text-luxury-bone font-medium">{watch.name}</span> has been transferred to our private client director in Geneva.
              </p>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-sm max-w-sm mx-auto">
              <span className="font-mono text-[9px] tracking-widest text-luxury-stone/60 uppercase block">
                OFFICIAL REFERENCE DOSSIER
              </span>
              <span className="font-mono text-sm tracking-wider text-luxury-champagne font-medium mt-1 block">
                {allocationRef}
              </span>
            </div>

            <div className="text-center font-mono text-[9px] tracking-wider text-luxury-stone/60 pt-2">
              A PRIVATE HOROLOGICAL CONCIERGE WILL CONTACT YOU WITHIN 4 HOURS.
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-luxury-champagne text-black font-mono text-[10px] tracking-[0.25em] hover:bg-white transition-colors"
              data-cursor="RETURN"
            >
              RETURN TO ATELIER
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
            {/* Selected Watch Summary Badge */}
            <div className="flex items-center gap-4 p-4 bg-[#050505] border border-white/[0.06] rounded-sm">
              <div className="w-16 h-16 flex items-center justify-center p-1 bg-black/60 rounded">
                <img
                  src={watch.heroImage}
                  alt={watch.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="flex-1">
                <span className="font-mono text-[9px] tracking-widest text-luxury-champagne uppercase block">
                  SELECTED TIMEPIECE
                </span>
                <span className="font-serif text-xl font-light text-luxury-ivory block">
                  {watch.name} · {watch.specs.reference}
                </span>
                <span className="font-mono text-xs text-luxury-stone">
                  {watch.priceFormatted}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1.5">
                  CLIENT FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Charles Montgomery"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#050505] border border-white/[0.1] px-4 py-2.5 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1.5">
                    PRIVATE EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@domaine.ch"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-4 py-2.5 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1.5">
                    TELEPHONE (CONFIDENTIAL)
                  </label>
                  <input
                    type="tel"
                    placeholder="+41 22 819 00 00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#050505] border border-white/[0.1] px-4 py-2.5 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1.5">
                  PREFERRED ATELIER APPOINTMENT / DELIVERY LOCATION
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#050505] border border-white/[0.1] px-4 py-2.5 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne transition-colors"
                >
                  <option value="Geneva">Geneva Atelier (Rue du Rhône 42)</option>
                  <option value="Zurich">Zurich Private Salon (Bahnhofstrasse)</option>
                  <option value="Paris">Paris Place Vendôme</option>
                  <option value="London">London Mayfair</option>
                  <option value="New York">New York Madison Avenue</option>
                  <option value="Tokyo">Tokyo Ginza</option>
                  <option value="Worldwide">Worldwide Secured Armored Delivery</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1.5">
                  BESPOKE CASEBACK ENGRAVING (OPTIONAL)
                </label>
                <input
                  type="text"
                  maxLength={40}
                  placeholder="e.g. AD ASTRA PER ASPERA · 2026"
                  value={formData.bespokeEngraving}
                  onChange={(e) => setFormData({ ...formData, bespokeEngraving: e.target.value })}
                  className="w-full bg-[#050505] border border-white/[0.1] px-4 py-2.5 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 bg-luxury-champagne text-black font-mono text-[10px] tracking-[0.25em] hover:bg-white transition-colors flex items-center justify-center gap-2 font-medium"
                data-cursor="TRANSMIT"
              >
                <span>TRANSMIT ALLOCATION INQUIRY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-luxury-stone/50 font-mono text-[8px] tracking-widest">
                <ShieldCheck className="w-3 h-3 text-luxury-champagne" />
                <span>CONFIDENTIAL CLIENT PRIVACY · STRICT ALLOCATION POLICIES</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
