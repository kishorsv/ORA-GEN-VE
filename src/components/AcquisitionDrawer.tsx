import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, Clock } from 'lucide-react';
import { WatchConfig } from '../types/watch';

interface AcquisitionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcquisitionDrawer: React.FC<AcquisitionDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<WatchConfig>({
    caseFinish: 'raw-titanium',
    strap: 'vulcanized-rubber',
    engraving: '',
  });

  const [step, setStep] = useState<'configure' | 'checkout' | 'confirmed'>('configure');
  const [collectorName, setCollectorName] = useState('');
  const [collectorEmail, setCollectorEmail] = useState('');
  const [collectorCity, setCollectorCity] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  if (!isOpen) return null;

  const basePrice = 18400;
  const braceletUpgrade = config.strap === 'titanium-mesh' ? 1200 : 0;
  const totalPrice = basePrice + braceletUpgrade;

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedOrder = `ORA-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
    setOrderNumber(generatedOrder);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171817]/90 flex justify-end backdrop-blur-none">
      <div className="w-full max-w-xl h-full bg-[#171817] hairline-l border-[#3c3b3a] flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-[#3c3b3a] flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono">
              Bespoke Allocation Concierge
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#d8d8d4] font-display">
              ORA CALIBRE 900 ACQUISITION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-[#3c3b3a] text-[#8d8d89] hover:text-[#d8d8d4] transition-colors cursor-pointer"
            aria-label="Close Acquisition Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on step */}
        <div className="p-6 md:p-8 flex-1 space-y-8">
          {step === 'configure' && (
            <div className="space-y-8">
              {/* Product Summary Header */}
              <div className="flex justify-between items-baseline border-b border-[#2d2e2d] pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#d8d8d4]">Atelier ORA · Series 01</h3>
                  <p className="text-xs text-[#8d8d89] font-mono">Allocation 042 of 100 · Swiss Made</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-[#d8d8d4] font-mono tabular-nums">
                    ${totalPrice.toLocaleString()} USD
                  </div>
                  <div className="text-xs text-[#6d6f6f] font-mono">CHF {(totalPrice * 0.91).toFixed(0)}</div>
                </div>
              </div>

              {/* Case Metallurgy */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-[#8d8d89] font-mono block">
                  1. Select Metallurgy & Case Finish
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfig({ ...config, caseFinish: 'raw-titanium' })}
                    className={`p-4 text-left border transition-all cursor-pointer ${
                      config.caseFinish === 'raw-titanium'
                        ? 'border-[#d4af37] bg-[#222322]'
                        : 'border-[#3c3b3a] bg-[#191a19] hover:border-[#585a5a]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#d8d8d4]">Grade 5 Titanium</div>
                    <div className="text-[11px] text-[#8d8d89] mt-1">Satin-brushed with hand-polished anglage chamfers</div>
                  </button>

                  <button
                    onClick={() => setConfig({ ...config, caseFinish: 'monolithic-dlc' })}
                    className={`p-4 text-left border transition-all cursor-pointer ${
                      config.caseFinish === 'monolithic-dlc'
                        ? 'border-[#d4af37] bg-[#222322]'
                        : 'border-[#3c3b3a] bg-[#191a19] hover:border-[#585a5a]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#d8d8d4]">Monolithic DLC Black</div>
                    <div className="text-[11px] text-[#8d8d89] mt-1">Diamond-Like Carbon coating, 4500 Vickers hardness</div>
                  </button>
                </div>
              </div>

              {/* Strap Choice */}
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-wider text-[#8d8d89] font-mono block">
                  2. Select Hand-Fitted Strap
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setConfig({ ...config, strap: 'vulcanized-rubber' })}
                    className={`w-full p-3.5 flex items-center justify-between border transition-all cursor-pointer ${
                      config.strap === 'vulcanized-rubber'
                        ? 'border-[#d4af37] bg-[#222322]'
                        : 'border-[#3c3b3a] bg-[#191a19] hover:border-[#585a5a]'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-xs font-medium text-[#d8d8d4]">Anthracite Vulcanized FKM Rubber</div>
                      <div className="text-[11px] text-[#8d8d89]">Sweatproof, saltwater-resistant micro-perforated</div>
                    </div>
                    <span className="text-xs font-mono text-[#8d8d89]">Included</span>
                  </button>

                  <button
                    onClick={() => setConfig({ ...config, strap: 'stitched-suede' })}
                    className={`w-full p-3.5 flex items-center justify-between border transition-all cursor-pointer ${
                      config.strap === 'stitched-suede'
                        ? 'border-[#d4af37] bg-[#222322]'
                        : 'border-[#3c3b3a] bg-[#191a19] hover:border-[#585a5a]'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-xs font-medium text-[#d8d8d4]">Charcoal Hand-Stitched Suede Calfskin</div>
                      <div className="text-[11px] text-[#8d8d89]">Tanned in Saint-Étienne, silk saddle stitching</div>
                    </div>
                    <span className="text-xs font-mono text-[#8d8d89]">Included</span>
                  </button>

                  <button
                    onClick={() => setConfig({ ...config, strap: 'titanium-mesh' })}
                    className={`w-full p-3.5 flex items-center justify-between border transition-all cursor-pointer ${
                      config.strap === 'titanium-mesh'
                        ? 'border-[#d4af37] bg-[#222322]'
                        : 'border-[#3c3b3a] bg-[#191a19] hover:border-[#585a5a]'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-xs font-medium text-[#d8d8d4]">Sculpted Grade 5 Titanium Link Bracelet</div>
                      <div className="text-[11px] text-[#8d8d89]">Integrated butterfly clasp with micro-extension</div>
                    </div>
                    <span className="text-xs font-mono text-[#d4af37]">+$1,200</span>
                  </button>
                </div>
              </div>

              {/* Custom Caseback Engraving */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-wider text-[#8d8d89] font-mono">
                    3. Caseback Personalized Engraving (Optional)
                  </label>
                  <span className="text-[11px] text-[#6d6f6f] font-mono">Max 18 chars</span>
                </div>
                <input
                  type="text"
                  maxLength={18}
                  value={config.engraving}
                  onChange={(e) => setConfig({ ...config, engraving: e.target.value.toUpperCase() })}
                  placeholder="E.G. A.V. · GENÈVE 2026"
                  className="w-full bg-[#191a19] border border-[#3c3b3a] focus:border-[#d4af37] px-4 py-2.5 text-xs text-[#d8d8d4] font-mono uppercase tracking-widest outline-none transition-colors"
                />
              </div>

              {/* Guarantees */}
              <div className="p-4 bg-[#141514] hairline-border space-y-2 text-xs text-[#8d8d89]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>5-Year International Atelier Manufacture Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>White-Glove Armored Courier Delivery (Fully Insured)</span>
                </div>
              </div>
            </div>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleConfirmReservation} className="space-y-6">
              <div className="border-b border-[#2d2e2d] pb-4">
                <h3 className="text-lg font-semibold text-[#d8d8d4]">Collector Reservation Dossier</h3>
                <p className="text-xs text-[#8d8d89]">Please provide your contact details for Swiss concierge allocation.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#8d8d89] font-mono block mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    placeholder="E.g. Alexandre Vance"
                    className="w-full bg-[#191a19] border border-[#3c3b3a] focus:border-[#d4af37] px-4 py-2.5 text-xs text-[#d8d8d4] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#8d8d89] font-mono block mb-1.5">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    required
                    value={collectorEmail}
                    onChange={(e) => setCollectorEmail(e.target.value)}
                    placeholder="collector@residence.com"
                    className="w-full bg-[#191a19] border border-[#3c3b3a] focus:border-[#d4af37] px-4 py-2.5 text-xs text-[#d8d8d4] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#8d8d89] font-mono block mb-1.5">
                    Delivery City & Destination Country
                  </label>
                  <input
                    type="text"
                    required
                    value={collectorCity}
                    onChange={(e) => setCollectorCity(e.target.value)}
                    placeholder="Geneva, Switzerland / London, UK"
                    className="w-full bg-[#191a19] border border-[#3c3b3a] focus:border-[#d4af37] px-4 py-2.5 text-xs text-[#d8d8d4] outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#141514] hairline-border space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#8d8d89]">
                  <span>BASE TIMEPIECE</span>
                  <span className="text-[#d8d8d4]">${basePrice.toLocaleString()}</span>
                </div>
                {braceletUpgrade > 0 && (
                  <div className="flex justify-between text-[#8d8d89]">
                    <span>TITANIUM LINK BRACELET</span>
                    <span className="text-[#d4af37]">+$1,200</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8d8d89]">
                  <span>ARMORED COURIER</span>
                  <span className="text-[#d8d8d4]">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#3c3b3a] text-sm font-semibold text-[#d8d8d4]">
                  <span>TOTAL ALLOCATION VALUE</span>
                  <span className="text-[#d4af37]">${totalPrice.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('configure')}
                  className="py-3.5 px-5 border border-[#3c3b3a] text-xs font-mono text-[#8d8d89] hover:text-[#d8d8d4] transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 text-xs font-semibold tracking-widest uppercase bg-[#d4af37] text-[#171817] hover:bg-[#e4bf47] transition-colors cursor-pointer"
                >
                  Submit Reservation Request
                </button>
              </div>
            </form>
          )}

          {step === 'confirmed' && (
            <div className="space-y-6 text-center py-6">
              <div className="w-14 h-14 mx-auto rounded-full border border-[#d4af37] flex items-center justify-center text-[#d4af37]">
                <Check className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono">
                  Reservation Certified
                </div>
                <h3 className="text-2xl font-semibold text-[#d8d8d4] font-display">
                  ALLOCATION REGISTERED
                </h3>
                <p className="text-xs text-[#8d8d89] max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="text-[#d8d8d4] font-medium">{collectorName || 'Collector'}</span>. Your priority request for Atelier ORA Calibre 900 has been recorded under reference:
                </p>
              </div>

              <div className="p-4 bg-[#141514] hairline-border max-w-xs mx-auto text-center font-mono">
                <div className="text-[11px] text-[#6d6f6f]">OFFICIAL DOSSIER NUMBER</div>
                <div className="text-base font-bold text-[#d4af37] mt-1">{orderNumber}</div>
                <div className="text-[10px] text-[#8d8d89] mt-1">GENEVA ATELIER REGISTER</div>
              </div>

              <p className="text-xs text-[#6d6f6f] leading-relaxed max-w-md mx-auto">
                Our Private Client Concierge will contact you at <span className="text-[#d8d8d4]">{collectorEmail}</span> within 24 hours to coordinate secure escrow deposit and tailored wrist sizing.
              </p>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="py-3 px-8 text-xs font-mono uppercase tracking-wider border border-[#3c3b3a] text-[#d8d8d4] hover:border-[#d4af37] transition-colors cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions for Configure step */}
        {step === 'configure' && (
          <div className="p-6 md:p-8 border-t border-[#3c3b3a] space-y-3 bg-[#191a19]">
            <button
              onClick={() => setStep('checkout')}
              className="w-full py-4 px-8 text-xs font-semibold tracking-widest uppercase bg-[#d4af37] text-[#171817] hover:bg-[#e4bf47] transition-colors cursor-pointer"
            >
              Reserve Piece No. 042 · ${totalPrice.toLocaleString()} USD
            </button>
            <div className="text-center text-[11px] text-[#6d6f6f] font-mono">
              Zero upfront commitment · Direct inspection upon Geneva delivery
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
