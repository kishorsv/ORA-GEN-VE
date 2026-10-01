import React, { useState } from 'react';
import { Compass, ShieldCheck, Zap, Layers, Sparkles, Sliders } from 'lucide-react';

interface BentoGridProps {
  onOpenInspector: () => void;
  onOpenAcquisition: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  onOpenInspector,
  onOpenAcquisition,
}) => {
  const [activeTab, setActiveTab] = useState<'movement' | 'case' | 'finishing'>('movement');

  return (
    <section className="relative bg-[#171817] text-[#d8d8d4] py-24 px-6 md:px-12 border-t border-[#3c3b3a]">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono">
            Haute Horlogerie · Engineering Dossier
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.04em] text-[#d8d8d4] font-display">
            CRAFTSMANSHIP BEYOND COMPROMISE
          </h2>
          <p className="text-sm md:text-base text-[#8d8d89] leading-relaxed">
            Every millimeter of the ORA Calibre 900 represents a rejection of modern mass automation. Conceived, machined, and hand-finished within our Geneva atelier.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Large Featured Card (8 cols) — The Micro-Rotor Calibre */}
          <div
            id="calibre"
            className="md:col-span-8 hairline-border bg-[#191a19] p-8 md:p-12 flex flex-col justify-between group hover:border-[#585a5a] transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#6d6f6f]">
                <span>01. KINEMATIC INTEGRITY</span>
                <span>GENEVA CALIBRE 900</span>
              </div>
              <h3 className="text-2xl md:text-4xl font-semibold text-[#d8d8d4] font-display">
                DECENTRALIZED 22K GOLD MICRO-ROTOR
              </h3>
              <p className="text-sm text-[#8d8d89] leading-relaxed max-w-xl">
                Traditional central rotors add up to 2.5mm of dead thickness to a watch movement. By embedding a high-inertia 22K solid yellow gold micro-rotor directly within the bridge architecture, the Calibre 900 achieves an astonishing 8.2mm profile while generating 70 continuous hours of autonomous chronometric torque.
              </p>
            </div>

            {/* Micro-rotor Architectural Blueprint Illustration */}
            <div className="my-8 py-6 hairline-border bg-[#141514] flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 500 240"
                className="w-full max-w-md h-auto text-[#6d6f6f] select-none"
                fill="none"
              >
                {/* Movement baseplate outline */}
                <circle cx="250" cy="120" r="100" stroke="#3c3b3a" strokeWidth="1.5" />
                <circle cx="250" cy="120" r="92" stroke="#252625" strokeDasharray="4 4" />

                {/* Geneva Stripes lines */}
                {[-70, -50, -30, -10, 10, 30, 50, 70].map((offset) => (
                  <line
                    key={offset}
                    x1={250 + offset}
                    y1="30"
                    x2={250 + offset}
                    y2="210"
                    stroke="#222322"
                    strokeWidth="2"
                  />
                ))}

                {/* 22K Rotor Sector */}
                <path
                  d="M 250 120 L 320 80 A 85 85 0 0 1 320 160 Z"
                  fill="#d4af37"
                  fillOpacity="0.85"
                  stroke="#876915"
                  strokeWidth="1.5"
                />
                <circle cx="250" cy="120" r="14" fill="#2d2e2d" stroke="#585a5a" />
                <circle cx="250" cy="120" r="5" fill="#9c1c44" />

                {/* Balance Wheel */}
                <circle cx="190" cy="120" r="32" stroke="#8d8d89" strokeWidth="1" />
                <line x1="190" y1="88" x2="190" y2="152" stroke="#8d8d89" />
                <line x1="158" y1="120" x2="222" y2="120" stroke="#8d8d89" />

                {/* Technical Callout Lines */}
                <line x1="320" y1="80" x2="380" y2="50" stroke="#585a5a" strokeWidth="0.75" />
                <text x="385" y="54" fill="#d4af37" fontSize="10" fontFamily="JetBrains Mono">
                  22K AU OSCILLATING MASS
                </text>

                <line x1="190" y1="88" x2="120" y2="50" stroke="#585a5a" strokeWidth="0.75" />
                <text x="50" y="54" fill="#8d8d89" fontSize="10" fontFamily="JetBrains Mono">
                  VARIABLE INERTIA BALANCE
                </text>
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#3c3b3a] text-xs font-mono text-[#8d8d89]">
              <div className="flex items-center gap-4">
                <span>FREQUENCY: 28,800 VPH (4 HZ)</span>
                <span>·</span>
                <span>AUTONOMY: 70 HOURS</span>
              </div>
              <button
                onClick={onOpenInspector}
                className="text-[#d4af37] hover:text-[#e4bf47] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Examine Movement In 3D</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 2: Medium Card (4 cols) — Hand-Cut Guilloché */}
          <div
            id="guilloche"
            className="md:col-span-4 hairline-border bg-[#191a19] p-8 flex flex-col justify-between group hover:border-[#585a5a] transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#6d6f6f]">
                <span>02. MÉTIERS D'ART</span>
                <span>CLOUS DE PARIS</span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-[#d8d8d4] font-display">
                14 HOURS PER DIAL
              </h3>
              <p className="text-xs md:text-sm text-[#8d8d89] leading-relaxed">
                Cut into 925 sterling silver using a restored 1924 rose-engine lathe. Each hobnail pyramid is cut manually at micro-tolerances. One slip ruinous to the entire silver blank.
              </p>
            </div>

            {/* Rose Engine Geometric Rosette Diagram */}
            <div className="my-6 py-6 hairline-border bg-[#141514] flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-36 h-36 text-[#585a5a]" fill="none">
                <circle cx="100" cy="100" r="90" stroke="#3c3b3a" strokeWidth="1" />
                <circle cx="100" cy="100" r="60" stroke="#3c3b3a" strokeWidth="0.75" />
                <circle cx="100" cy="100" r="30" stroke="#3c3b3a" strokeWidth="0.75" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * Math.PI) / 12;
                  return (
                    <line
                      key={i}
                      x1={100 + Math.cos(angle) * 30}
                      y1={100 + Math.sin(angle) * 30}
                      x2={100 + Math.cos(angle) * 90}
                      y2={100 + Math.sin(angle) * 90}
                      stroke={i % 2 === 0 ? '#6d6f6f' : '#3c3b3a'}
                      strokeWidth="1"
                    />
                  );
                })}
                <circle cx="100" cy="100" r="4" fill="#d4af37" />
              </svg>
            </div>

            <div className="text-xs font-mono text-[#6d6f6f] pt-4 border-t border-[#3c3b3a]">
              MATERIAL: SOLID STERLING SILVER 925
            </div>
          </div>

          {/* Card 3: Medium Card (4 cols) — Grade 5 Titanium Monocoque */}
          <div className="md:col-span-4 hairline-border bg-[#191a19] p-8 flex flex-col justify-between group hover:border-[#585a5a] transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#6d6f6f]">
                <span>03. METALLURGY</span>
                <span>GRADE 5 TITANIUM</span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-[#d8d8d4] font-display">
                FEATHERWEIGHT STRENGTH
              </h3>
              <p className="text-xs md:text-sm text-[#8d8d89] leading-relaxed">
                Titanium Grade 5 (Ti-6Al-4V) offers twice the tensile strength of stainless steel at 45% less weight. Hand-polished mirror anglage along the flanks transitions seamlessly into longitudinal satin brushwork.
              </p>
            </div>

            <div className="my-6 space-y-3 font-mono text-xs text-[#8d8d89]">
              <div className="flex justify-between py-1.5 border-b border-[#2d2e2d]">
                <span>CASE DIAMETER</span>
                <span className="text-[#d8d8d4] tabular-nums">39.0 MM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2d2e2d]">
                <span>TOTAL THICKNESS</span>
                <span className="text-[#d8d8d4] tabular-nums">8.2 MM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#2d2e2d]">
                <span>LUG-TO-LUG SPAN</span>
                <span className="text-[#d8d8d4] tabular-nums">46.5 MM</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>WATER RESISTANCE</span>
                <span className="text-[#d8d8d4] tabular-nums">50 METERS (5 ATM)</span>
              </div>
            </div>

            <div className="text-xs font-mono text-[#6d6f6f] pt-4 border-t border-[#3c3b3a]">
              FINISH: HAND-POLISHED ANGLAGE CHAMFERS
            </div>
          </div>

          {/* Card 4: Wide Card (8 cols) — Hand Finishing & Anglage */}
          <div className="md:col-span-8 hairline-border bg-[#191a19] p-8 md:p-12 flex flex-col justify-between group hover:border-[#585a5a] transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#6d6f6f]">
                <span>04. FINISHING STANDARDS</span>
                <span>POINÇON TRADITIONNEL</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-[#d8d8d4] font-display">
                INTERNAL ANGLES & GENTIAN WOOD POLISHING
              </h3>
              <p className="text-sm text-[#8d8d89] leading-relaxed max-w-xl">
                Every steel lever, bridge flank, and screw head undergoes black polishing (poli noir) using diamond paste on natural elder pith and Swiss gentian wood. Sharp internal corners—the definitive hallmark of genuine hand finishing that no CNC milling machine can reproduce—are chiseled with hand burnishers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 pt-4 border-t border-[#3c3b3a]">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#6d6f6f]">JEWELS</div>
                <div className="text-xl font-semibold text-[#d8d8d4] font-display tabular-nums">31</div>
                <div className="text-[11px] text-[#8d8d89]">Synthetic rubies</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#6d6f6f]">PARTS</div>
                <div className="text-xl font-semibold text-[#d8d8d4] font-display tabular-nums">184</div>
                <div className="text-[11px] text-[#8d8d89]">Hand-beveled</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#6d6f6f]">TOLERANCE</div>
                <div className="text-xl font-semibold text-[#d8d8d4] font-display tabular-nums">±2 SEC</div>
                <div className="text-[11px] text-[#8d8d89]">Daily deviation</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#6d6f6f]">WARRANTY</div>
                <div className="text-xl font-semibold text-[#d8d8d4] font-display tabular-nums">5 YRS</div>
                <div className="text-[11px] text-[#8d8d89]">Manufacture backing</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#3c3b3a] text-xs font-mono text-[#6d6f6f]">
              <span>ASSEMBLY: 1 WATCHMAKER / 1 TIMEPIECE</span>
              <span className="text-[#d4af37]">GENEVA CERTIFIED</span>
            </div>
          </div>
        </div>

        {/* Minimalist Data Matrix / Technical Specifications Table */}
        <div id="specifications" className="space-y-6 pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#3c3b3a]">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono">
                Technical Matrix
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-[#d8d8d4] font-display">
                FULL CHRONOMETRIC SPECIFICATIONS
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('movement')}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'movement'
                    ? 'bg-[#3c3b3a] text-[#d8d8d4]'
                    : 'text-[#8d8d89] hover:text-[#d8d8d4]'
                }`}
              >
                Movement
              </button>
              <button
                onClick={() => setActiveTab('case')}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'case'
                    ? 'bg-[#3c3b3a] text-[#d8d8d4]'
                    : 'text-[#8d8d89] hover:text-[#d8d8d4]'
                }`}
              >
                Case & Glass
              </button>
              <button
                onClick={() => setActiveTab('finishing')}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'finishing'
                    ? 'bg-[#3c3b3a] text-[#d8d8d4]'
                    : 'text-[#8d8d89] hover:text-[#d8d8d4]'
                }`}
              >
                Finishing
              </button>
            </div>
          </div>

          <div className="hairline-border bg-[#191a19] overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[#3c3b3a] text-[#6d6f6f] uppercase bg-[#141514]">
                <tr>
                  <th className="py-3.5 px-6">Specification Parameter</th>
                  <th className="py-3.5 px-6">Metric Value</th>
                  <th className="py-3.5 px-6 hidden sm:table-cell">Technical Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2b2a] text-[#8d8d89]">
                {activeTab === 'movement' && (
                  <>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Calibre Designation</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Atelier ORA Calibre 900</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">In-house mechanical automatic</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Oscillating Winding Mass</td>
                      <td className="py-3.5 px-6 text-[#d4af37]">22K Solid Gold Micro-Rotor</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Bi-directional ceramic ball bearing</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Frequency & Escapement</td>
                      <td className="py-3.5 px-6 tabular-nums">28,800 vph (4.0 Hz)</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Swiss lever with silicon hairspring</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Autonomous Power Reserve</td>
                      <td className="py-3.5 px-6 tabular-nums">70 Hours</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Single high-elasticity mainspring barrel</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Jewel Count & Parts</td>
                      <td className="py-3.5 px-6 tabular-nums">31 Rubies · 184 Components</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">All bridges hand-beveled</td>
                    </tr>
                  </>
                )}

                {activeTab === 'case' && (
                  <>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Case Diameter & Thickness</td>
                      <td className="py-3.5 px-6 tabular-nums">39.0 mm × 8.2 mm</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Ultra-thin architectural geometry</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Material Composition</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Grade 5 Titanium (Ti-6Al-4V)</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Biocompatible & hypoallergenic</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Front & Back Crystals</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Double-Domed Box Sapphire</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">7-layer anti-reflective coating</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Crown Architecture</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Fluted with micro-knurling</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Double O-ring gasket seal</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Static Water Resistance</td>
                      <td className="py-3.5 px-6 tabular-nums">50 Meters (5 ATM / 165 Feet)</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">ISO 22810 chronometric standard</td>
                    </tr>
                  </>
                )}

                {activeTab === 'finishing' && (
                  <>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Dial Engine Turning</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Clous de Paris Hand Guilloché</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Manual 1924 rose-engine lathe</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Bridge Decoration</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Côtes de Genève & Perlage</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Hand-applied wooden peg graining</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Edge Chamfering</td>
                      <td className="py-3.5 px-6 text-[#d4af37]">Polished Anglage</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Gentian wood finish with diamond paste</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 text-[#d8d8d4] font-medium">Screws & Pinions</td>
                      <td className="py-3.5 px-6 text-[#d8d8d4]">Black Polished (Poli Noir)</td>
                      <td className="py-3.5 px-6 hidden sm:table-cell text-[#6d6f6f]">Optically flat mirror surface</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
