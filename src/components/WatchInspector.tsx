import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles, Clock, Shield } from 'lucide-react';
import { ViewAngle } from '../types/watch';

interface WatchInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onOpenAcquisition: () => void;
}

export const WatchInspector: React.FC<WatchInspectorProps> = ({
  isOpen,
  onClose,
  isAudioActive,
  onToggleAudio,
  onOpenAcquisition,
}) => {
  const [viewAngle, setViewAngle] = useState<ViewAngle>('dial');
  const [powerReserveHours, setPowerReserveHours] = useState<number>(64);
  const [isWinding, setIsWinding] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Keyboard close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Real-time 4Hz mechanical movement simulation in Inspector Canvas
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#171817';
      ctx.fillRect(0, 0, w, h);

      const radius = Math.min(w, h) * 0.42;

      ctx.save();
      ctx.translate(cx, cy);

      if (viewAngle === 'dial') {
        // Dial Face Rendering
        renderInspectorDial(ctx, radius, elapsed);
      } else if (viewAngle === 'profile') {
        // 8.2mm Profile View
        renderInspectorProfile(ctx, radius);
      } else if (viewAngle === 'movement') {
        // Exhibition Caseback
        renderInspectorMovement(ctx, radius, elapsed);
      }

      ctx.restore();

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isOpen, viewAngle, powerReserveHours]);

  const handleWindCrown = () => {
    setIsWinding(true);
    setPowerReserveHours((prev) => Math.min(70, prev + 6));
    setTimeout(() => setIsWinding(false), 250);
  };

  const renderInspectorDial = (
    ctx: CanvasRenderingContext2D,
    radius: number,
    elapsed: number
  ) => {
    // Outer Titanium Case Bezel
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#222322';
    ctx.fill();
    ctx.strokeStyle = '#3c3b3a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Mirror polished bezel chamfer
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.94, 0, Math.PI * 2);
    ctx.strokeStyle = '#8d8d89';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dial background
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.88, 0, Math.PI * 2);
    ctx.fillStyle = '#161716';
    ctx.fill();

    // Hand Guilloché rosette pattern
    ctx.strokeStyle = 'rgba(88, 90, 90, 0.35)';
    ctx.lineWidth = 0.8;
    for (let r = 1; r < 14; r++) {
      const ringRad = (radius * 0.82 * r) / 14;
      ctx.beginPath();
      ctx.arc(0, 0, ringRad, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Hour Indices
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.save();
      ctx.rotate(angle);
      ctx.fillStyle = '#d8d8d4';
      ctx.fillRect(-2, -radius * 0.82, 4, 16);
      ctx.restore();
    }

    // Power Reserve Sub-Arc at 9 o'clock
    const prAngleStart = Math.PI * 0.8;
    const prAngleEnd = Math.PI * 1.2;
    const prFillRatio = powerReserveHours / 70;
    const currentPrAngle = prAngleStart + (prAngleEnd - prAngleStart) * prFillRatio;

    ctx.beginPath();
    ctx.arc(-radius * 0.45, 0, 24, prAngleStart, prAngleEnd);
    ctx.strokeStyle = '#3c3b3a';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-radius * 0.45, 0, 24, prAngleStart, currentPrAngle);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Power Reserve label
    ctx.fillStyle = '#8d8d89';
    ctx.font = '500 7px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('70H RESERVE', -radius * 0.45, 12);

    // Atelier Brand
    ctx.fillStyle = '#d8d8d4';
    ctx.font = '600 14px Syne';
    ctx.textAlign = 'center';
    ctx.fillText('ORA', 0, -radius * 0.4);
    ctx.fillStyle = '#8d8d89';
    ctx.font = '500 8px Plus Jakarta Sans';
    ctx.fillText('GENÈVE', 0, -radius * 0.3);

    // Hands calculation
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

    const hourAngle = (hours + minutes / 60) * (Math.PI / 6) - Math.PI / 2;
    const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30) - Math.PI / 2;
    // 4Hz / 8 beats per second mechanical step sweep
    const mechanicalSeconds = Math.floor(seconds * 8) / 8;
    const secondAngle = mechanicalSeconds * (Math.PI / 30) - Math.PI / 2;

    // Hour hand
    ctx.save();
    ctx.rotate(hourAngle);
    ctx.fillStyle = '#d8d8d4';
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(radius * 0.5, 0);
    ctx.lineTo(0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Minute hand
    ctx.save();
    ctx.rotate(minuteAngle);
    ctx.fillStyle = '#d8d8d4';
    ctx.beginPath();
    ctx.moveTo(0, -3.5);
    ctx.lineTo(radius * 0.72, 0);
    ctx.lineTo(0, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Sweeping second hand
    ctx.save();
    ctx.rotate(secondAngle);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.2, 0);
    ctx.lineTo(radius * 0.8, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.restore();
  };

  const renderInspectorProfile = (
    ctx: CanvasRenderingContext2D,
    radius: number
  ) => {
    // 8.2mm Profile view representation
    const caseWidth = radius * 1.8;
    const caseHeight = 44; // Scale corresponding to 8.2mm

    // Titanium Mid-Case
    ctx.fillStyle = '#262726';
    ctx.strokeStyle = '#585a5a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-caseWidth / 2, -caseHeight / 2, caseWidth, caseHeight, [6, 6, 6, 6]);
    ctx.fill();
    ctx.stroke();

    // Top Box Sapphire Crystal dome
    ctx.beginPath();
    ctx.moveTo(-caseWidth * 0.44, -caseHeight / 2);
    ctx.quadraticCurveTo(0, -caseHeight / 2 - 14, caseWidth * 0.44, -caseHeight / 2);
    ctx.strokeStyle = 'rgba(216, 216, 212, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fluted crown on right
    ctx.fillStyle = '#3c3b3a';
    ctx.fillRect(caseWidth / 2, -10, 14, 20);
    ctx.strokeStyle = '#8d8d89';
    ctx.strokeRect(caseWidth / 2, -10, 14, 20);

    // Callout dimensions
    ctx.fillStyle = '#d4af37';
    ctx.font = '500 11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('← 39.0 MM DIAMETER →', 0, 60);
    ctx.fillText('8.2 MM PROFILE', 0, -50);
  };

  const renderInspectorMovement = (
    ctx: CanvasRenderingContext2D,
    radius: number,
    elapsed: number
  ) => {
    // Exhibition Caseback with Calibre 900 movement
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1d1c';
    ctx.fill();
    ctx.strokeStyle = '#3c3b3a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Caseback engraving ring
    ctx.fillStyle = '#6d6f6f';
    ctx.font = '400 8px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('ATELIER ORA GENÈVE · NO. 042/100 · TITANIUM GRADE 5 · 50M', 0, -radius * 0.88);

    // Sapphire viewing window
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
    ctx.fillStyle = '#151615';
    ctx.fill();
    ctx.strokeStyle = '#585a5a';
    ctx.stroke();

    // Geneva Stripes (Côtes de Genève)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 6;
    for (let x = -radius * 0.8; x <= radius * 0.8; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, -radius * 0.8);
      ctx.lineTo(x, radius * 0.8);
      ctx.stroke();
    }

    // Oscillating Micro-Rotor in 22k Gold
    const rotorAngle = (elapsed * 1.5) % (Math.PI * 2);
    ctx.save();
    ctx.translate(radius * 0.25, -radius * 0.15);
    ctx.rotate(rotorAngle);

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.42, 0, Math.PI);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.strokeStyle = '#876915';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#3a2e0a';
    ctx.font = '600 7px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('22K GOLD · ORA 900', 0, radius * 0.22);
    ctx.restore();

    // Variable Inertia Balance Wheel oscillating at 4Hz
    const balanceAngle = Math.sin(elapsed * Math.PI * 8) * 0.8;
    ctx.save();
    ctx.translate(-radius * 0.3, radius * 0.2);
    ctx.rotate(balanceAngle);

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.strokeStyle = '#8d8d89';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-radius * 0.3, 0);
    ctx.lineTo(radius * 0.3, 0);
    ctx.moveTo(0, -radius * 0.3);
    ctx.lineTo(0, radius * 0.3);
    ctx.stroke();

    // Central ruby jewel
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#9c1c44';
    ctx.fill();
    ctx.restore();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#171817]/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-none">
      <div className="hairline-border bg-[#141514] w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-6 border-b border-[#3c3b3a]">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-mono">
              Live Horological Telemetry
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-[#d8d8d4] font-display">
              CALIBRE 900 VIRTUAL INSPECTOR
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleAudio}
              className="p-2 border border-[#3c3b3a] text-[#8d8d89] hover:text-[#d8d8d4] transition-colors cursor-pointer"
              title={isAudioActive ? 'Mute Escapement' : 'Listen to Escapement'}
            >
              {isAudioActive ? (
                <Volume2 className="w-4 h-4 text-[#d4af37]" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 border border-[#3c3b3a] text-[#8d8d89] hover:text-[#d8d8d4] transition-colors cursor-pointer"
              aria-label="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Canvas Viewport (7 cols) */}
          <div className="lg:col-span-7 p-6 flex flex-col items-center justify-center bg-[#171817] hairline-r border-[#3c3b3a] min-h-[380px]">
            <canvas
              ref={canvasRef}
              width={640}
              height={640}
              className="w-full max-w-[420px] aspect-square select-none pointer-events-none"
            />
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#6d6f6f]">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span>LIVE FREQUENCY: 28,800 VPH (4.0 HZ SWEEP)</span>
            </div>
          </div>

          {/* Interactive Controls & Telemetry (5 cols) */}
          <div className="lg:col-span-5 p-6 md:p-8 space-y-6 flex flex-col justify-between bg-[#191a19]">
            <div className="space-y-6">
              {/* View Angle Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#8d8d89] font-mono">
                  Select Perspective
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setViewAngle('dial')}
                    className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                      viewAngle === 'dial'
                        ? 'border-[#d4af37] bg-[#222322] text-[#d8d8d4]'
                        : 'border-[#3c3b3a] text-[#8d8d89] hover:text-[#d8d8d4]'
                    }`}
                  >
                    Dial Face
                  </button>
                  <button
                    onClick={() => setViewAngle('profile')}
                    className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                      viewAngle === 'profile'
                        ? 'border-[#d4af37] bg-[#222322] text-[#d8d8d4]'
                        : 'border-[#3c3b3a] text-[#8d8d89] hover:text-[#d8d8d4]'
                    }`}
                  >
                    8.2mm Case
                  </button>
                  <button
                    onClick={() => setViewAngle('movement')}
                    className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                      viewAngle === 'movement'
                        ? 'border-[#d4af37] bg-[#222322] text-[#d8d8d4]'
                        : 'border-[#3c3b3a] text-[#8d8d89] hover:text-[#d8d8d4]'
                    }`}
                  >
                    Movement
                  </button>
                </div>
              </div>

              {/* Crown Winding Action */}
              <div className="p-4 hairline-border bg-[#141514] space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8d8d89]">MAINSPRING TENSION</span>
                  <span className="text-[#d4af37] font-semibold tabular-nums">
                    {powerReserveHours} / 70 HOURS
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#252625] border border-[#3c3b3a]">
                  <div
                    className="h-full bg-[#d4af37] transition-all duration-300"
                    style={{ width: `${(powerReserveHours / 70) * 100}%` }}
                  />
                </div>
                <button
                  onClick={handleWindCrown}
                  className={`w-full py-2.5 px-4 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border border-[#3c3b3a] hover:border-[#d4af37] text-[#d8d8d4] ${
                    isWinding ? 'bg-[#3c3b3a]' : 'bg-[#191a19]'
                  }`}
                >
                  {isWinding ? 'Winding Mainspring...' : 'Turn Crown to Wind (+6h)'}
                </button>
              </div>

              {/* Live Technical Metrics */}
              <div className="space-y-2 font-mono text-xs text-[#8d8d89]">
                <div className="flex justify-between py-1 border-b border-[#2d2e2d]">
                  <span>AMPLITUDE</span>
                  <span className="text-[#d8d8d4] tabular-nums">312° (OPTIMAL)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2d2e2d]">
                  <span>BEAT ERROR</span>
                  <span className="text-[#d8d8d4] tabular-nums">0.1 MS</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2d2e2d]">
                  <span>DAILY RATE</span>
                  <span className="text-[#d8d8d4] tabular-nums">+0.8 S/DAY</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>SWISS LEVER</span>
                  <span className="text-[#d8d8d4]">SILICON BALANCE</span>
                </div>
              </div>
            </div>

            {/* Acquisition Link in Inspector */}
            <div className="pt-4 border-t border-[#3c3b3a] space-y-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenAcquisition();
                }}
                className="w-full py-3.5 px-6 text-xs font-semibold tracking-widest uppercase bg-[#d4af37] text-[#171817] hover:bg-[#e4bf47] transition-colors cursor-pointer"
              >
                Proceed to Allocation · $18,400 USD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
