/**
 * ORA Haute Horlogerie — 240-Frame Canvas Rendering Engine
 * Generates and scrubs 240 discrete high-resolution frames of the Calibre 900 timepiece.
 */

export class FrameSequenceManager {
  private frames: ImageBitmap[] = [];
  private totalFrames: number = 240;
  private width: number = 1440;
  private height: number = 1080;

  constructor(totalFrames: number = 240) {
    this.totalFrames = totalFrames;
  }

  public async preloadAll(
    onProgress: (loaded: number, total: number) => void
  ): Promise<ImageBitmap[]> {
    const offscreen = document.createElement('canvas');
    offscreen.width = this.width;
    offscreen.height = this.height;
    const ctx = offscreen.getContext('2d', { alpha: false });

    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }

    // Render batch with micro-delays to prevent UI lockup and report true progress
    const batchSize = 12;
    for (let i = 0; i < this.totalFrames; i += batchSize) {
      const end = Math.min(i + batchSize, this.totalFrames);
      for (let f = i; f < end; f++) {
        const progress = f / (this.totalFrames - 1);
        this.renderWatchFrame(ctx, progress, f);
        const bitmap = await createImageBitmap(offscreen);
        this.frames.push(bitmap);
      }
      onProgress(this.frames.length, this.totalFrames);
      // Yield to main thread for smooth progress bar update
      await new Promise((r) => setTimeout(r, 4));
    }

    // Cleanup offscreen canvas dimensions for memory hygiene
    offscreen.width = 0;
    offscreen.height = 0;

    return this.frames;
  }

  public getFrame(index: number): ImageBitmap | null {
    const clampedIndex = Math.max(0, Math.min(this.frames.length - 1, Math.floor(index)));
    return this.frames[clampedIndex] || null;
  }

  public getFrameCount(): number {
    return this.frames.length;
  }

  public destroy(): void {
    this.frames.forEach((bitmap) => bitmap.close());
    this.frames = [];
  }

  /**
   * Procedural Haute Horlogerie Renderer
   * Renders the 4 chapters of the ORA Calibre 900 across progress 0.0 -> 1.0:
   * 0.0 - 0.25: Dramatic Silhouette & Light Sweep (0° yaw)
   * 0.25 - 0.50: 3D Yaw Rotation to 80° profile view
   * 0.50 - 0.75: Macro Zoom (scale up to 2.3x) onto hand-cut Guilloché and 22k Micro-Rotor
   * 0.75 - 1.00: Return zoom to settle dead center with warm amber reflection
   */
  private renderWatchFrame(
    ctx: CanvasRenderingContext2D,
    progress: number,
    frameIndex: number
  ): void {
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2;

    // Fill Cynical Black background (#171817)
    ctx.fillStyle = '#171817';
    ctx.fillRect(0, 0, w, h);

    // Compute transformations based on scroll progress
    let yaw = 0; // 0 to 75 degrees rotation
    let scale = 1.0;
    let lightAngle = Math.PI * 0.75;
    let cameraYOffset = 0;

    if (progress < 0.25) {
      // Chapter 1: Frontal silhouette with sweeping directional beam
      const p = progress / 0.25;
      yaw = 0;
      scale = 0.95 + p * 0.05;
      lightAngle = Math.PI * 0.4 + p * Math.PI * 0.6;
    } else if (progress < 0.5) {
      // Chapter 2: Rotate to profile view (yaw up to 76 deg)
      const p = (progress - 0.25) / 0.25;
      // Smooth step
      const easedP = p * p * (3 - 2 * p);
      yaw = easedP * 76;
      scale = 1.0 + easedP * 0.1;
      lightAngle = Math.PI + easedP * 0.5;
    } else if (progress < 0.75) {
      // Chapter 3: Return from profile and push in for macro close-up
      const p = (progress - 0.5) / 0.25;
      const easedP = p * p * (3 - 2 * p);
      yaw = (1 - easedP) * 76;
      scale = 1.1 + easedP * 1.15; // Zoom up to 2.25x
      cameraYOffset = easedP * 40;
      lightAngle = Math.PI * 1.5 - easedP * 0.4;
    } else {
      // Chapter 4: Zoom out to perfect center balance
      const p = (progress - 0.75) / 0.25;
      const easedP = p * p * (3 - 2 * p);
      yaw = 0;
      scale = 2.25 - easedP * 1.25;
      cameraYOffset = (1 - easedP) * 40;
      lightAngle = Math.PI * 1.1 + easedP * 0.3;
    }

    ctx.save();
    ctx.translate(cx, cy + cameraYOffset);

    // Perspective projection based on yaw
    const yawRad = (yaw * Math.PI) / 180;
    const cosYaw = Math.cos(yawRad);

    ctx.scale(cosYaw * scale, scale);

    const baseRadius = 260;

    // Draw Subtle Ground Shadow / Rim glow
    const shadowGrad = ctx.createRadialGradient(0, 0, baseRadius * 0.5, 0, 0, baseRadius * 1.6);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    shadowGrad.addColorStop(0.7, 'rgba(23, 24, 23, 0.4)');
    shadowGrad.addColorStop(1, 'rgba(23, 24, 23, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Integrated Titanium Lugs (Top and Bottom)
    this.drawLugs(ctx, baseRadius, lightAngle);

    // If yaw is significant, draw the 3D Case Profile Thickness
    if (yaw > 10) {
      this.drawCaseProfileSide(ctx, baseRadius, yaw, lightAngle);
    }

    // Outer Case Bezel (Grade 5 Titanium with Satin-Brushed & Mirror-Anglage chamfers)
    this.drawBezel(ctx, baseRadius, lightAngle, yaw);

    // Dial Surface & Hand-Turned Guilloché
    this.drawDial(ctx, baseRadius * 0.82, lightAngle, progress);

    // Dial Aperture / Calibre 900 Micro-Rotor & Balance Wheel
    this.drawMovementAperture(ctx, baseRadius * 0.82, progress, frameIndex);

    // Hour Markers & Minute Track
    this.drawHourIndices(ctx, baseRadius * 0.76, lightAngle);

    // Watch Hands (Faceted Dauphine Hands at 10:10:31)
    this.drawHands(ctx, baseRadius * 0.82, frameIndex);

    // Sapphire Crystal Reflection & Box Edge Glint
    this.drawSapphireReflection(ctx, baseRadius * 0.82, lightAngle, yaw);

    // Fluted Crown at 3 o'clock
    this.drawCrown(ctx, baseRadius, yaw, lightAngle);

    ctx.restore();
  }

  private drawLugs(ctx: CanvasRenderingContext2D, radius: number, lightAngle: number): void {
    ctx.save();
    // Top lug
    ctx.fillStyle = '#2a2b2a';
    ctx.strokeStyle = '#3c3b3a';
    ctx.lineWidth = 1.5;

    // Sculpted geometric lugs
    const drawLugPair = (sign: number) => {
      ctx.beginPath();
      ctx.moveTo(-radius * 0.48, sign * radius * 0.8);
      ctx.lineTo(-radius * 0.42, sign * (radius + 90));
      ctx.lineTo(radius * 0.42, sign * (radius + 90));
      ctx.lineTo(radius * 0.48, sign * radius * 0.8);
      ctx.closePath();

      // Shading
      const grad = ctx.createLinearGradient(
        -radius * 0.5,
        sign * (radius + 90),
        radius * 0.5,
        sign * radius * 0.8
      );
      grad.addColorStop(0, '#1c1d1c');
      grad.addColorStop(0.5, '#383a38');
      grad.addColorStop(1, '#202120');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.stroke();

      // Strap insertion recess
      ctx.fillStyle = '#141414';
      ctx.beginPath();
      ctx.rect(-radius * 0.38, sign * (radius + 30), radius * 0.76, sign * 55);
      ctx.fill();
    };

    drawLugPair(-1); // Top
    drawLugPair(1);  // Bottom
    ctx.restore();
  }

  private drawCaseProfileSide(
    ctx: CanvasRenderingContext2D,
    radius: number,
    yaw: number,
    lightAngle: number
  ): void {
    ctx.save();
    const caseThickness = 32 * Math.sin((yaw * Math.PI) / 180);
    const grad = ctx.createLinearGradient(0, -radius, 0, radius);
    grad.addColorStop(0, '#2d2e2d');
    grad.addColorStop(0.3, '#4a4d4a');
    grad.addColorStop(0.7, '#222322');
    grad.addColorStop(1, '#1b1c1b');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#585a5a';
    ctx.lineWidth = 1;

    // Draw extruded case cylinder
    ctx.beginPath();
    ctx.ellipse(caseThickness, 0, radius * 0.15, radius * 0.98, 0, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(0, radius * 0.98);
    ctx.ellipse(0, 0, radius * 0.1, radius * 0.98, 0, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  private drawBezel(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number,
    yaw: number
  ): void {
    ctx.save();

    // Outer stepped case ring
    const lx = Math.cos(lightAngle) * radius;
    const ly = Math.sin(lightAngle) * radius;
    const caseGrad = ctx.createRadialGradient(lx * 0.5, ly * 0.5, radius * 0.2, 0, 0, radius);
    caseGrad.addColorStop(0, '#5e615f');
    caseGrad.addColorStop(0.5, '#353735');
    caseGrad.addColorStop(0.85, '#222322');
    caseGrad.addColorStop(1, '#171817');

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = caseGrad;
    ctx.fill();
    ctx.strokeStyle = '#3c3b3a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mirror-polished chamfer ring (anglage)
    const anglageGrad = ctx.createLinearGradient(
      -radius * 0.7,
      -radius * 0.7,
      radius * 0.7,
      radius * 0.7
    );
    anglageGrad.addColorStop(0, '#2b2c2b');
    anglageGrad.addColorStop(0.4, '#8e918e');
    anglageGrad.addColorStop(0.5, '#d8d8d4');
    anglageGrad.addColorStop(0.6, '#3a3c3a');
    anglageGrad.addColorStop(1, '#1e1f1e');

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.93, 0, Math.PI * 2);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = anglageGrad;
    ctx.stroke();

    // Vertical satin-brushed bezel ring
    const bezelInnerRadius = radius * 0.85;
    const bezelGrad = ctx.createRadialGradient(0, 0, bezelInnerRadius, 0, 0, radius * 0.92);
    bezelGrad.addColorStop(0, '#1c1d1c');
    bezelGrad.addColorStop(0.8, '#2d2e2d');
    bezelGrad.addColorStop(1, '#3b3d3b');

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = bezelGrad;
    ctx.fill();

    ctx.restore();
  }

  private drawDial(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number,
    progress: number
  ): void {
    ctx.save();

    // Dark slate & cynical black dial base
    const dialGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    dialGrad.addColorStop(0, '#1e201e');
    dialGrad.addColorStop(0.6, '#181918');
    dialGrad.addColorStop(1, '#101110');

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = dialGrad;
    ctx.fill();
    ctx.strokeStyle = '#3c3b3a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Hand-Turned Guilloché "Clous de Paris" Pattern (Procedural concentric hobnail)
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = 'rgba(88, 90, 90, 0.22)';
    ctx.lineWidth = 0.75;

    const rings = 18;
    for (let r = 2; r < rings; r++) {
      const ringRadius = (radius * 0.88 * r) / rings;
      const count = Math.floor(r * 8.5);
      for (let i = 0; i < count; i++) {
        const theta = (i * Math.PI * 2) / count + (r % 2 === 0 ? 0.05 : 0);
        const x = Math.cos(theta) * ringRadius;
        const y = Math.sin(theta) * ringRadius;
        ctx.strokeRect(x - 1.2, y - 1.2, 2.4, 2.4);
      }
    }

    // Concentric Guilloché Ray Lines from center
    const rayCount = 48;
    for (let i = 0; i < rayCount; i++) {
      const theta = (i * Math.PI * 2) / rayCount;
      ctx.beginPath();
      ctx.moveTo(Math.cos(theta) * (radius * 0.35), Math.sin(theta) * (radius * 0.35));
      ctx.lineTo(Math.cos(theta) * (radius * 0.88), Math.sin(theta) * (radius * 0.88));
      ctx.stroke();
    }

    ctx.restore();

    // Atelier Wordmark & Origin
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d8d8d4';
    ctx.font = '600 13px Syne, sans-serif';
    ctx.fillText('ORA', 0, -radius * 0.44);

    ctx.font = '500 8px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#8d8d89';
    ctx.letterSpacing = '0.2em';
    ctx.fillText('GENÈVE', 0, -radius * 0.36);

    ctx.fillText('CALIBRE 900', 0, radius * 0.46);
    ctx.font = '400 7px JetBrains Mono, monospace';
    ctx.fillText('SWISS MADE', 0, radius * 0.78);

    ctx.restore();
  }

  private drawMovementAperture(
    ctx: CanvasRenderingContext2D,
    dialRadius: number,
    progress: number,
    frameIndex: number
  ): void {
    ctx.save();

    // Cutout at 6 o'clock showcasing Calibre 900 Micro-Rotor and Escapement
    const apertureCenterY = dialRadius * 0.15;
    const apertureRadius = dialRadius * 0.32;

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, apertureCenterY, apertureRadius, 0, Math.PI * 2);
    ctx.clip();

    // Movement Background with Côtes de Genève (Geneva Stripes)
    ctx.fillStyle = '#1b1d1c';
    ctx.fillRect(
      -apertureRadius,
      apertureCenterY - apertureRadius,
      apertureRadius * 2,
      apertureRadius * 2
    );

    // Geneva Stripes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 4;
    for (let x = -apertureRadius; x <= apertureRadius; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, apertureCenterY - apertureRadius);
      ctx.lineTo(x, apertureCenterY + apertureRadius);
      ctx.stroke();
    }

    // 22K Solid Gold Micro-Rotor (Horological Amber #d4af37 accent)
    const rotorAngle = ((frameIndex * 2.8) % 360) * (Math.PI / 180);
    ctx.save();
    ctx.translate(0, apertureCenterY);
    ctx.rotate(rotorAngle);

    // Micro-Rotor Semi-Circle
    ctx.beginPath();
    ctx.arc(0, 0, apertureRadius * 0.85, 0, Math.PI);
    ctx.lineTo(0, 0);
    ctx.closePath();

    const goldGrad = ctx.createLinearGradient(
      -apertureRadius,
      0,
      apertureRadius,
      apertureRadius
    );
    goldGrad.addColorStop(0, '#9e7e22');
    goldGrad.addColorStop(0.4, '#d4af37'); // Horological Amber
    goldGrad.addColorStop(0.7, '#f3d978');
    goldGrad.addColorStop(1, '#876915');

    ctx.fillStyle = goldGrad;
    ctx.fill();
    ctx.strokeStyle = '#5c4812';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Rotor Engraving
    ctx.fillStyle = '#42330a';
    ctx.font = '600 6px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('22K AU · 28800 A/h', 0, apertureRadius * 0.45);

    // Rotor Center Ball Bearing
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#3c3b3a';
    ctx.fill();
    ctx.stroke();

    // Central Ruby Jewel
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#9c1c44'; // Synthetic ruby
    ctx.fill();

    ctx.restore();

    ctx.restore(); // end clip

    // Beveled Aperture Frame Rim (Anglage ring)
    ctx.beginPath();
    ctx.arc(0, apertureCenterY, apertureRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#585a5a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, apertureCenterY, apertureRadius - 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = '#232423';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  private drawHourIndices(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number
  ): void {
    ctx.save();

    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Faceted applied titanium baton markers
      const isCard = i % 3 === 0;
      const w = isCard ? 4 : 2.5;
      const h = isCard ? 18 : 12;

      // Facet 1 (Light side)
      ctx.fillStyle = '#d8d8d4';
      ctx.fillRect(-w / 2, -h / 2, w / 2, h);

      // Facet 2 (Shadow side)
      ctx.fillStyle = '#6d6f6f';
      ctx.fillRect(0, -h / 2, w / 2, h);

      ctx.restore();
    }

    // Outer Minute Rail track (60 ticks)
    ctx.strokeStyle = 'rgba(141, 141, 137, 0.4)';
    ctx.lineWidth = 1;
    const minRadius = radius * 1.05;

    for (let m = 0; m < 60; m++) {
      if (m % 5 === 0) continue;
      const angle = (m * Math.PI) / 30;
      const x1 = Math.cos(angle) * minRadius;
      const y1 = Math.sin(angle) * minRadius;
      const x2 = Math.cos(angle) * (minRadius + 4);
      const y2 = Math.sin(angle) * (minRadius + 4);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawHands(
    ctx: CanvasRenderingContext2D,
    radius: number,
    frameIndex: number
  ): void {
    ctx.save();

    // Traditional aesthetic showcase time: 10:10:31
    const hourAngle = (10 + 10 / 60) * ((Math.PI * 2) / 12) - Math.PI / 2;
    const minuteAngle = 10.5 * ((Math.PI * 2) / 60) - Math.PI / 2;

    // Sweeping second hand driven smoothly across frames (28,800 vph sweep)
    const secondOffset = (frameIndex / 240) * 12;
    const secondAngle = (31 + secondOffset) * ((Math.PI * 2) / 60) - Math.PI / 2;

    // Helper for faceted dauphine hand
    const drawFacetedHand = (
      angle: number,
      length: number,
      width: number,
      hasCounterweight: boolean = false
    ) => {
      ctx.save();
      ctx.rotate(angle);

      // Light facet
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -width);
      ctx.lineTo(length, 0);
      ctx.closePath();
      ctx.fillStyle = '#d8d8d4';
      ctx.fill();

      // Dark facet
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, width);
      ctx.lineTo(length, 0);
      ctx.closePath();
      ctx.fillStyle = '#585a5a';
      ctx.fill();

      if (hasCounterweight) {
        ctx.beginPath();
        ctx.moveTo(0, -width * 0.7);
        ctx.lineTo(-length * 0.22, 0);
        ctx.lineTo(0, width * 0.7);
        ctx.closePath();
        ctx.fillStyle = '#3c3b3a';
        ctx.fill();
      }

      ctx.restore();
    };

    // Hour Hand
    drawFacetedHand(hourAngle, radius * 0.54, 5.5, true);

    // Minute Hand
    drawFacetedHand(minuteAngle, radius * 0.8, 4.5, true);

    // Second Hand (Ultra-fine blued needle with counterweight)
    ctx.save();
    ctx.rotate(secondAngle);

    ctx.strokeStyle = '#d8d8d4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.2, 0);
    ctx.lineTo(radius * 0.88, 0);
    ctx.stroke();

    // Second hand counter-weight disc
    ctx.beginPath();
    ctx.arc(-radius * 0.12, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37'; // Amber tip
    ctx.fill();

    ctx.restore();

    // Central Hand Pinion Cap (Polished steel cap)
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#1e1f1e';
    ctx.fill();
    ctx.strokeStyle = '#8d8d89';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  private drawSapphireReflection(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number,
    yaw: number
  ): void {
    ctx.save();

    // Curved Anti-Reflective Sapphire highlight
    const glintGrad = ctx.createLinearGradient(
      -radius,
      -radius,
      radius * 0.8,
      radius * 0.8
    );
    glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    glintGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.03)');
    glintGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0.14)');
    glintGrad.addColorStop(0.52, 'rgba(255, 255, 255, 0.02)');
    glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
    ctx.fillStyle = glintGrad;
    ctx.fill();

    ctx.restore();
  }

  private drawCrown(
    ctx: CanvasRenderingContext2D,
    radius: number,
    yaw: number,
    lightAngle: number
  ): void {
    // Crown at 3 o'clock position (x = radius)
    ctx.save();
    const cosYaw = Math.cos((yaw * Math.PI) / 180);
    const crownX = radius * 0.98;
    const crownY = 0;

    ctx.translate(crownX, crownY);

    const crownW = 16;
    const crownH = 28;

    // Fluted knurling on crown
    const crownGrad = ctx.createLinearGradient(0, -crownH / 2, 0, crownH / 2);
    crownGrad.addColorStop(0, '#2d2e2d');
    crownGrad.addColorStop(0.5, '#5e615f');
    crownGrad.addColorStop(1, '#1b1c1b');

    ctx.fillStyle = crownGrad;
    ctx.fillRect(0, -crownH / 2, crownW, crownH);

    // Micro-grooves
    ctx.strokeStyle = '#171817';
    ctx.lineWidth = 1;
    for (let y = -crownH / 2 + 3; y < crownH / 2; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(crownW, y);
      ctx.stroke();
    }

    // Polished crown cap
    ctx.beginPath();
    ctx.arc(crownW, 0, 4, -Math.PI / 2, Math.PI / 2);
    ctx.fillStyle = '#8d8d89';
    ctx.fill();

    ctx.restore();
  }
}

/**
 * High-precision Mechanical Movement Sound Synthesizer (Web Audio API)
 * Simulates the 28,800 vibrations per hour (8 beats per second / 4Hz)
 * pallet fork impulse and balance roller tick of a Geneva escapement.
 */
export class HorologyAudioSynth {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = true;
  private intervalId: number | null = null;

  public init(): void {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public toggleMute(): boolean {
    this.init();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startTicking();
    } else {
      this.stopTicking();
    }
    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private startTicking(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    // 28,800 vph = 8 ticks per second = 125ms interval
    this.intervalId = window.setInterval(() => {
      this.playEscapementTick();
    }, 125);
  }

  private stopTicking(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playEscapementTick(): void {
    if (!this.audioCtx || this.isMuted) return;

    try {
      const now = this.audioCtx.currentTime;

      // Ultra-short metallic transient click
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);

      filter.type = 'bandpass';
      filter.frequency.value = 3200;
      filter.Q.value = 6;

      // Very subtle volume (discrete luxury feel)
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public destroy(): void {
    this.stopTicking();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
