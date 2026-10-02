import React from 'react';

export const CraftsmanshipSection: React.FC = () => {
  const craftDisciplines = [
    {
      num: '01',
      title: 'ANGLAGE & POLISSAGE',
      subtitle: 'The Art of Hand-Bevelled Chamfers',
      text: 'Every interior and exterior bridge angle is chamfered to a precise 45-degree bevel, then polished by hand using gentian wood pegs and diamond paste until it reflects light without distortion.',
      image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1800&q=90',
    },
    {
      num: '02',
      title: 'GUILLOCHAGE AU TOUR',
      subtitle: 'Line by Line Engine Turning',
      text: 'On historic manually operated rose engines dating to the 1920s, our master guillocheurs carve concentric barleycorn and clous de Paris textures directly into solid gold and platinum dials.',
      image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=1800&q=90',
    },
    {
      num: '03',
      title: 'RÉGLAGE CHRONOMÉTRIQUE',
      subtitle: 'Poised in Six Positions',
      text: 'Regulating the oscillator requires steady hands and decades of experience. The Breguet overcoil hairspring is pinned to the stud with microscopic precision to guarantee chronometric stability across extreme thermal shifts.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1800&q=90',
    },
  ];

  return (
    <section
      id="craftsmanship"
      className="relative w-full bg-[#060606] text-[#F5F2EA] py-32 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background Ambience */}
      <div 
        className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full bg-luxury-champagne/[0.015] blur-[180px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* Header with Major Editorial Quote */}
      <div className="max-w-7xl mx-auto border-b border-white/[0.08] pb-16 mb-24">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-[1px] bg-luxury-champagne" />
          <span className="font-mono text-[10px] tracking-[0.35em] text-luxury-champagne uppercase">
            MÉTIERS D’ART · GENÈVE ATELIER
          </span>
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-luxury-ivory max-w-4xl">
          THE ART OF CRAFT
        </h2>

        <div className="mt-10 pt-8 border-t border-white/[0.05] max-w-3xl">
          <blockquote className="font-serif text-2xl sm:text-4xl italic font-light text-luxury-stone tracking-wide leading-snug">
            “EVERY DETAIL HAS A PURPOSE.”
          </blockquote>
          <p className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne/80 mt-4 uppercase">
            — ATELIER DE HAUTE HORLOGERIE ORA, GENEVA
          </p>
        </div>
      </div>

      {/* Full-bleed Craftsmanship Editorial Panels */}
      <div className="max-w-7xl mx-auto flex flex-col gap-24 sm:gap-36">
        {craftDisciplines.map((item, index) => {
          const isEven = index % 2 === 1;
          return (
            <div
              key={item.num}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-14 items-center group`}
            >
              {/* Image Column */}
              <div
                className={`lg:col-span-7 relative overflow-hidden bg-[#0B0B0B] border border-white/[0.08] group-hover:border-luxury-champagne/30 transition-all duration-700 ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-6 font-mono text-[9px] tracking-widest text-white/50">
                    DISCIPLINE 0{index + 1}
                  </div>
                </div>
              </div>

              {/* Text Editorial Column */}
              <div
                className={`lg:col-span-5 flex flex-col justify-center space-y-6 ${
                  isEven ? 'lg:order-1 lg:pr-6' : 'lg:order-2 lg:pl-6'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-luxury-champagne uppercase block">
                    CHAPTER {item.num}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-light text-luxury-ivory mt-2">
                    {item.title}
                  </h3>
                  <p className="font-serif italic text-lg text-luxury-stone mt-1">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-luxury-stone/80 text-sm sm:text-base font-sans font-light leading-relaxed">
                  {item.text}
                </p>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-luxury-stone/60 font-mono text-[9px] tracking-widest">
                  <span>ATELIER HAND-FINISH</span>
                  <span>100% SWISS MADE</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
