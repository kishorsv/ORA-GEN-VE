import React, { useState } from 'react';
import type { WatchModel } from '../types/database';
import { createInquiry } from '../services/inquiries';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

interface InquiryModalProps {
  watch: WatchModel | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  watch,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Geneva Atelier (Rue du Rhône 42)',
    bespokeEngraving: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refCode, setRefCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createInquiry({
        watch_id: watch?.id,
        watch_name: watch ? `${watch.name} · ${watch.specs?.reference || ''}` : 'Bespoke Atelier Commission',
        client_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bespoke_engraving: formData.bespokeEngraving,
        message: formData.message,
      });

      setRefCode(result.reference_code);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting inquiry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9996] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#070707] border border-white/[0.08] shadow-2xl shadow-black rounded-sm overflow-hidden my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/[0.08] bg-[#050505]">
          <div>
            <span className="font-serif text-xl tracking-[0.2em] text-luxury-ivory font-light">
              ORA GENÈVE
            </span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-luxury-champagne block mt-0.5">
              REQUEST INFORMATION & ALLOCATION
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-luxury-stone hover:text-luxury-ivory transition-colors"
            data-cursor="CLOSE"
            aria-label="Close inquiry modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {isSuccess ? (
          /* Confirmation Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-luxury-champagne/10 border border-luxury-champagne/30 flex items-center justify-center mx-auto text-luxury-champagne">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase block mb-1">
                DEMANDE ENREGISTRÉE DANS LA BASE DE DONNÉES
              </span>
              <h3 className="font-serif text-3xl font-light text-luxury-ivory">
                Your request has been received.
              </h3>
              <p className="text-luxury-stone text-xs sm:text-sm font-sans font-light mt-3 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-luxury-ivory">{formData.name}</span>. Your allocation inquiry has been stored securely and dispatched to our private client director in Geneva.
              </p>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-sm max-w-sm mx-auto">
              <span className="font-mono text-[9px] tracking-widest text-luxury-stone/60 uppercase block">
                OFFICIAL DOSSIER CODE
              </span>
              <span className="font-mono text-sm tracking-wider text-luxury-champagne font-medium mt-1 block">
                {refCode}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-luxury-stone/60 font-mono text-[9px] tracking-wider pt-2">
              <Clock className="w-3.5 h-3.5 text-luxury-champagne" />
              <span>A PRIVATE CONCIERGE WILL CONTACT YOU WITHIN 4 HOURS.</span>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 bg-luxury-champagne text-black font-mono text-[10px] tracking-[0.25em] hover:bg-white transition-colors"
              data-cursor="RETURN"
            >
              RETURN TO ATELIER
            </button>
          </div>
        ) : (
          /* Inquiry Form */
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-5">
            {/* Watch Card summary if watch selected */}
            {watch && (
              <div className="flex items-center gap-4 p-4 bg-[#050505] border border-white/[0.06] rounded-sm">
                <div className="w-14 h-14 flex items-center justify-center p-1 bg-black/60 rounded border border-white/[0.04]">
                  <img
                    src={watch.hero_image}
                    alt={watch.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-mono text-[9px] tracking-widest text-luxury-champagne uppercase block">
                    TIMEPIECE OF INTEREST
                  </span>
                  <span className="font-serif text-lg font-light text-luxury-ivory block">
                    {watch.name} · {watch.specs?.reference}
                  </span>
                  <span className="font-mono text-xs text-luxury-stone">
                    {watch.formattedPrice}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1.5">
                  CLIENT FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Charles Montgomery"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    TELEPHONE (OPTIONAL)
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
                  PREFERRED SALON APPOINTMENT / DELIVERY
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#050505] border border-white/[0.1] px-4 py-2.5 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne transition-colors"
                >
                  <option value="Geneva Atelier (Rue du Rhône 42)">Geneva Atelier (Rue du Rhône 42)</option>
                  <option value="Zurich Private Salon (Bahnhofstrasse)">Zurich Private Salon (Bahnhofstrasse)</option>
                  <option value="Paris Place Vendôme">Paris Place Vendôme</option>
                  <option value="London Mayfair">London Mayfair</option>
                  <option value="New York Madison Avenue">New York Madison Avenue</option>
                  <option value="Tokyo Ginza">Tokyo Ginza</option>
                  <option value="Worldwide Secured Armored Delivery">Worldwide Secured Armored Delivery</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-widest text-luxury-stone/80 uppercase block mb-1.5">
                  MESSAGE / HOROLOGICAL INQUIRY
                </label>
                <textarea
                  rows={2}
                  placeholder="Inquire regarding complication, delivery timeline, or private viewing..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#050505] border border-white/[0.1] px-4 py-2.5 text-xs text-luxury-ivory font-sans focus:outline-none focus:border-luxury-champagne transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-luxury-champagne text-black font-mono text-[10px] tracking-[0.25em] hover:bg-white transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                data-cursor="TRANSMIT"
              >
                <span>{isSubmitting ? 'TRANSMITTING TO DATABASE...' : 'TRANSMIT ALLOCATION INQUIRY'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-luxury-stone/50 font-mono text-[8px] tracking-widest">
                <ShieldCheck className="w-3 h-3 text-luxury-champagne" />
                <span>CONFIDENTIAL CLIENT PRIVACY · DIRECT SUPABASE AUDIT LOG</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
