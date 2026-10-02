/**
 * ORA Haute Horlogerie & Rolex Sky-Dweller Canvas Rendering Engine
 * Generates and scrubs 240 discrete high-resolution frames of the Rolex Sky-Dweller Mint Green timepiece.
 */

export class FrameSequenceManager {
  private frames: ImageBitmap[] = [];
  private totalFrames: number = 240;
  private width: number = 1440;
  private height: number = 1080;
  private customImage: HTMLImageElement | null = null;

  constructor(totalFrames: number = 240) {
    this.totalFrames = totalFrames;
  }

  public getCustomImage(): HTMLImageElement | null {
    return this.customImage;
  }

  public async setCustomImage(
    img: HTMLImageElement | null,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    this.customImage = img;
    this.frames.forEach((bitmap) => bitmap.close());
    this.frames = [];

    const offscreen = document.createElement('canvas');
    offscreen.width = this.width;
    offscreen.height = this.height;
    const ctx = offscreen.getContext('2d', { alpha: false });
    if (!ctx) return;

    const batchSize = 12;
    for (let i = 0; i < this.totalFrames; i += batchSize) {
      const end = Math.min(i + batchSize, this.totalFrames);
      for (let f = i; f < end; f++) {
        const progress = f / (this.totalFrames - 1);
        this.renderWatchFrame(ctx, progress, f);
        const bitmap = await createImageBitmap(offscreen);
        this.frames.push(bitmap);
      }
      onProgress?.(this.frames.length, this.totalFrames);
      await new Promise((r) => setTimeout(r, 4));
    }

    offscreen.width = 0;
    offscreen.height = 0;
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
      await new Promise((r) => setTimeout(r, 4));
    }

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
   * Procedural Sky-Dweller Mint Green 240-Frame Engine
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

    // Subtle atmospheric cloud aura (matching user image's high-altitude sky theme)
    const skyAura = ctx.createRadialGradient(cx, cy, 100, cx, cy, 680);
    skyAura.addColorStop(0, 'rgba(40, 68, 62, 0.16)');
    skyAura.addColorStop(0.5, 'rgba(28, 42, 38, 0.08)');
    skyAura.addColorStop(1, 'rgba(23, 24, 23, 0)');
    ctx.fillStyle = skyAura;
    ctx.fillRect(0, 0, w, h);

    // Compute transformations based on scroll progress
    let yaw = 0;
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
      // Chapter 2: Rotate to profile view
      const p = (progress - 0.25) / 0.25;
      const easedP = p * p * (3 - 2 * p);
      yaw = easedP * 72;
      scale = 1.0 + easedP * 0.08;
      lightAngle = Math.PI + easedP * 0.5;
    } else if (progress < 0.75) {
      // Chapter 3: Macro Zoom onto Mint Green Dial & 24h Disc
      const p = (progress - 0.5) / 0.25;
      const easedP = p * p * (3 - 2 * p);
      yaw = (1 - easedP) * 72;
      scale = 1.08 + easedP * 1.18; // Up to 2.26x
      cameraYOffset = easedP * 30;
      lightAngle = Math.PI * 1.5 - easedP * 0.4;
    } else {
      // Chapter 4: Zoom out to perfect center balance
      const p = (progress - 0.75) / 0.25;
      const easedP = p * p * (3 - 2 * p);
      yaw = 0;
      scale = 2.26 - easedP * 1.26;
      cameraYOffset = (1 - easedP) * 30;
      lightAngle = Math.PI * 1.1 + easedP * 0.3;
    }

    ctx.save();
    ctx.translate(cx, cy + cameraYOffset);

    // Perspective projection based on yaw
    const yawRad = (yaw * Math.PI) / 180;
    const cosYaw = Math.cos(yawRad);

    ctx.scale(cosYaw * scale, scale);

    const baseRadius = 240;

    // Ground shadow
    const shadowGrad = ctx.createRadialGradient(0, 0, baseRadius * 0.5, 0, 0, baseRadius * 1.6);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
    shadowGrad.addColorStop(0.7, 'rgba(23, 24, 23, 0.45)');
    shadowGrad.addColorStop(1, 'rgba(23, 24, 23, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    if (this.customImage) {
      // Custom Uploaded Watch Image
      const img = this.customImage;
      const targetDiameter = baseRadius * 2.15;
      const imgAspect = img.width / img.height;
      let drawW = targetDiameter;
      let drawH = targetDiameter;

      if (imgAspect > 1) {
        drawH = targetDiameter / imgAspect;
      } else {
        drawW = targetDiameter * imgAspect;
      }

      ctx.save();
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      const lx = Math.cos(lightAngle) * (drawW * 0.6);
      const ly = Math.sin(lightAngle) * (drawH * 0.6);
      const lightGrad = ctx.createLinearGradient(-lx, -ly, lx, ly);
      lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
      lightGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0)');
      lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');

      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = lightGrad;
      ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      this.drawSapphireReflection(ctx, baseRadius * 0.98, lightAngle, yaw);
    } else {
      // Exact Rolex Sky-Dweller Mint Green Dial Rendering
      // Oyster Bracelet (Solid 3-piece links)
      this.drawOysterBracelet(ctx, baseRadius, lightAngle);

      // Oystersteel Mid-Case & Lugs
      this.drawOysterCase(ctx, baseRadius, lightAngle, yaw);

      // 18ct White Gold Fluted Ring Command Bezel
      this.drawFlutedBezel(ctx, baseRadius, lightAngle);

      // Mint Green Sunray Dial
      this.drawMintGreenDial(ctx, baseRadius * 0.82, lightAngle);

      // Off-centre 24-Hour Disc (Dual Time Zone)
      this.draw24HourDisc(ctx, baseRadius * 0.82, frameIndex);

      // Saros Annual Calendar month apertures (August red at 8 o'clock)
      this.drawSarosMonthApertures(ctx, baseRadius * 0.78);

      // Date Window with Cyclops Magnifying Lens at 3 o'clock
      this.drawDateAndCyclops(ctx, baseRadius * 0.82);

      // Chromalight Baton Hour Markers & Minutes track
      this.drawHourIndices(ctx, baseRadius * 0.78, lightAngle);

      // White Gold Hands with Chromalight Lume
      this.drawHands(ctx, baseRadius * 0.82, frameIndex);

      // Sapphire Crystal Reflection & Glint
      this.drawSapphireReflection(ctx, baseRadius * 0.82, lightAngle, yaw);

      // Twinlock Crown at 3 o'clock
      this.drawTwinlockCrown(ctx, baseRadius, yaw, lightAngle);
    }

    ctx.restore();
  }

  private drawOysterBracelet(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number
  ): void {
    ctx.save();

    const drawSection = (sign: number) => {
      const topY = sign * (radius * 0.88);
      const bottomY = sign * (radius + 150);
      const spanW = radius * 0.94;
      const centerW = radius * 0.44;

      // Outer Brushed Oyster Links
      const outerGrad = ctx.createLinearGradient(-spanW / 2, 0, spanW / 2, 0);
      outerGrad.addColorStop(0, '#565958');
      outerGrad.addColorStop(0.3, '#7d807e');
      outerGrad.addColorStop(0.7, '#606361');
      outerGrad.addColorStop(1, '#474948');

      ctx.fillStyle = outerGrad;
      ctx.strokeStyle = '#323433';
      ctx.lineWidth = 1;

      // Link outline
      ctx.beginPath();
      ctx.rect(-spanW / 2, Math.min(topY, bottomY), spanW, Math.abs(bottomY - topY));
      ctx.fill();
      ctx.stroke();

      // Mirror-Polished Center Links
      const centerGrad = ctx.createLinearGradient(-centerW / 2, 0, centerW / 2, 0);
      centerGrad.addColorStop(0, '#757877');
      centerGrad.addColorStop(0.3, '#c2c6c4');
      centerGrad.addColorStop(0.5, '#f0f3f2'); // Mirror highlight
      centerGrad.addColorStop(0.7, '#9ba09e');
      centerGrad.addColorStop(1, '#666a68');

      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.rect(-centerW / 2, Math.min(topY, bottomY), centerW, Math.abs(bottomY - topY));
      ctx.fill();
      ctx.stroke();

      // Horizontal Link Segment Dividers
      ctx.strokeStyle = '#2b2c2c';
      ctx.lineWidth = 1.5;
      for (let step = 1; step <= 3; step++) {
        const y = topY + sign * step * 42;
        ctx.beginPath();
        ctx.moveTo(-spanW / 2, y);
        ctx.lineTo(spanW / 2, y);
        ctx.stroke();
      }
    };

    drawSection(-1); // Top bracelet
    drawSection(1);  // Bottom bracelet
    ctx.restore();
  }

  private drawOysterCase(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number,
    yaw: number
  ): void {
    ctx.save();

    // Sculptural Oyster Case with curved chamfers
    const caseGrad = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius);
    caseGrad.addColorStop(0, '#8a8d8c');
    caseGrad.addColorStop(0.6, '#646866');
    caseGrad.addColorStop(0.9, '#434645');
    caseGrad.addColorStop(1, '#2d302f');

    ctx.fillStyle = caseGrad;
    ctx.strokeStyle = '#434645';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.99, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Side profile thickness if yawing
    if (yaw > 8) {
      const thickness = 34 * Math.sin((yaw * Math.PI) / 180);
      ctx.fillStyle = '#3c3f3e';
      ctx.beginPath();
      ctx.ellipse(thickness, 0, radius * 0.14, radius * 0.98, 0, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(0, radius * 0.98);
      ctx.ellipse(0, 0, radius * 0.1, radius * 0.98, 0, Math.PI / 2, -Math.PI / 2, true);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  private drawFlutedBezel(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number
  ): void {
    ctx.save();

    const bezelOuter = radius * 0.96;
    const bezelInner = radius * 0.83;

    // 18ct White Gold Fluted Bezel (60 triangular fluted ridges)
    const flutes = 60;
    for (let i = 0; i < flutes; i++) {
      const theta1 = (i * Math.PI * 2) / flutes;
      const theta2 = ((i + 1) * Math.PI * 2) / flutes;
      const thetaMid = (theta1 + theta2) / 2;

      // Triangular facet 1 (Light reflection side)
      ctx.beginPath();
      ctx.moveTo(Math.cos(theta1) * bezelInner, Math.sin(theta1) * bezelInner);
      ctx.lineTo(Math.cos(thetaMid) * bezelOuter, Math.sin(thetaMid) * bezelOuter);
      ctx.lineTo(Math.cos(thetaMid) * bezelInner, Math.sin(thetaMid) * bezelInner);
      ctx.closePath();

      const lightDist = Math.cos(thetaMid - lightAngle);
      const isLit = lightDist > 0;
      ctx.fillStyle = isLit
        ? `rgb(${Math.floor(200 + lightDist * 55)}, ${Math.floor(205 + lightDist * 50)}, ${Math.floor(210 + lightDist * 45)})`
        : '#4d504f';
      ctx.fill();

      // Triangular facet 2 (Shadow side)
      ctx.beginPath();
      ctx.moveTo(Math.cos(thetaMid) * bezelInner, Math.sin(thetaMid) * bezelInner);
      ctx.lineTo(Math.cos(thetaMid) * bezelOuter, Math.sin(thetaMid) * bezelOuter);
      ctx.lineTo(Math.cos(theta2) * bezelInner, Math.sin(theta2) * bezelInner);
      ctx.closePath();

      ctx.fillStyle = isLit ? '#8e9290' : '#282a29';
      ctx.fill();
    }

    // Inner Polished Rehaut Ring
    ctx.beginPath();
    ctx.arc(0, 0, bezelInner, 0, Math.PI * 2);
    ctx.strokeStyle = '#9ca09e';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }

  private drawMintGreenDial(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number
  ): void {
    ctx.save();

    // Radiant Mint Green Sunray Dial Base
    const dialGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    dialGrad.addColorStop(0, '#2e614d'); // Bright mint green center
    dialGrad.addColorStop(0.5, '#224a3a');
    dialGrad.addColorStop(0.85, '#173629');
    dialGrad.addColorStop(1, '#0e2319'); // Deep olive green perimeter

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = dialGrad;
    ctx.fill();

    // 120 Sunburst radial reflection lines
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 90; i++) {
      const angle = (i * Math.PI * 2) / 90;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.stroke();
    }
    ctx.restore();

    // Rolex Coronet (5-point crown) at 12 o'clock
    ctx.save();
    ctx.translate(0, -radius * 0.58);
    ctx.fillStyle = '#ffffff';

    // 5 Crown Points
    const pts = [
      { x: -14, y: -9 },
      { x: -7, y: -13 },
      { x: 0, y: -15 },
      { x: 7, y: -13 },
      { x: 14, y: -9 },
    ];
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Crown base arc
    ctx.beginPath();
    ctx.moveTo(-13, -7);
    ctx.lineTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(13, -7);
    ctx.lineTo(0, -3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Brand Inscriptions
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Syne, sans-serif';
    ctx.fillText('ROLEX', 0, -radius * 0.44);

    ctx.font = '600 7px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#d8d8d4';
    ctx.fillText('OYSTER PERPETUAL', 0, -radius * 0.36);

    ctx.fillText('SKY-DWELLER', 0, -radius * 0.28);

    ctx.font = '500 5.5px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#9aa19d';
    ctx.fillText('SUPERLATIVE CHRONOMETER', 0, radius * 0.65);
    ctx.fillText('OFFICIALLY CERTIFIED', 0, radius * 0.73);

    ctx.font = '400 5px JetBrains Mono, monospace';
    ctx.fillText('SWISS   MADE', 0, radius * 0.88);

    ctx.restore();
  }

  private draw24HourDisc(
    ctx: CanvasRenderingContext2D,
    dialRadius: number,
    frameIndex: number
  ): void {
    ctx.save();

    // Off-centre 24-Hour Ring offset towards 6 o'clock
    const centerY = dialRadius * 0.12;
    const ringRadius = dialRadius * 0.46;

    // Disc background (white/silver ring with black numerals)
    ctx.beginPath();
    ctx.arc(0, centerY, ringRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#e8ecea';
    ctx.fill();
    ctx.strokeStyle = '#9ca29f';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner dial cutout of the 24-hour disc
    ctx.beginPath();
    ctx.arc(0, centerY, ringRadius * 0.72, 0, Math.PI * 2);
    ctx.fillStyle = '#1c4233'; // Mint green center
    ctx.fill();
    ctx.stroke();

    // 24-Hour Numerals (even hours 2, 4, 6... 24)
    ctx.save();
    ctx.translate(0, centerY);
    const rotation = ((frameIndex * 0.2) % 360) * (Math.PI / 180);
    ctx.rotate(rotation);

    ctx.fillStyle = '#1b1d1c';
    ctx.font = '600 7px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const hours = ['24', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'];
    hours.forEach((h, idx) => {
      const angle = (idx * Math.PI * 2) / 12 - Math.PI / 2;
      const x = Math.cos(angle) * (ringRadius * 0.86);
      const y = Math.sin(angle) * (ringRadius * 0.86);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(h, 0, 0);
      ctx.restore();
    });
    ctx.restore();

    // Fixed Inverted Red Reference Triangle at 12 o'clock of 24h disc
    ctx.beginPath();
    const triY = centerY - ringRadius * 0.88;
    ctx.moveTo(0, triY + 8);
    ctx.lineTo(-5, triY);
    ctx.lineTo(5, triY);
    ctx.closePath();
    ctx.fillStyle = '#d92534'; // Vivid red
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  private drawSarosMonthApertures(
    ctx: CanvasRenderingContext2D,
    radius: number
  ): void {
    ctx.save();

    // 12 rectangular apertures at the perimeter of each hour marker
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x = Math.cos(angle) * (radius * 1.02);
      const y = Math.sin(angle) * (radius * 1.02);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Aperture box
      ctx.fillStyle = '#0f241a';
      ctx.strokeStyle = '#434645';
      ctx.lineWidth = 0.8;
      ctx.fillRect(-2, -4, 4, 8);
      ctx.strokeRect(-2, -4, 4, 8);

      // Month of August (8 o'clock = i === 4) filled in deep red!
      if (i === 4) {
        ctx.fillStyle = '#d92534';
        ctx.fillRect(-1.5, -3.5, 3, 7);
      }

      ctx.restore();
    }

    ctx.restore();
  }

  private drawDateAndCyclops(
    ctx: CanvasRenderingContext2D,
    radius: number
  ): void {
    ctx.save();

    // Date Window at 3 o'clock
    const dateX = radius * 0.68;
    const dateY = 0;

    // White Date Aperture
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(dateX - 12, dateY - 10, 24, 20);
    ctx.strokeStyle = '#9ca09e';
    ctx.lineWidth = 1;
    ctx.strokeRect(dateX - 12, dateY - 10, 24, 20);

    // Date Numeral "28"
    ctx.fillStyle = '#111211';
    ctx.font = '700 13px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('28', dateX, dateY);

    // Convex Cyclops Magnifying Lens
    const cyclopsGrad = ctx.createLinearGradient(
      dateX - 16,
      dateY - 14,
      dateX + 16,
      dateY + 14
    );
    cyclopsGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    cyclopsGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
    cyclopsGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.3)');
    cyclopsGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');

    ctx.beginPath();
    ctx.ellipse(dateX, dateY, 17, 13, 0, 0, Math.PI * 2);
    ctx.fillStyle = cyclopsGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.2;
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
      if (i === 3) continue; // Skip 3 o'clock for Date window

      const angle = (i * Math.PI) / 6;
      const x = Math.cos(angle) * (radius * 0.94);
      const y = Math.sin(angle) * (radius * 0.94);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const w = 4.5;
      const h = 18;

      // 18ct White Gold border
      ctx.fillStyle = '#c5c9c7';
      ctx.fillRect(-w / 2, -h / 2, w, h);

      // Chromalight white luminescent center
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-w / 2 + 0.8, -h / 2 + 1, w - 1.6, h - 2);

      ctx.restore();
    }

    // Minute Track (60 ticks)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    const minR = radius * 0.98;
    for (let m = 0; m < 60; m++) {
      const angle = (m * Math.PI) / 30;
      const x1 = Math.cos(angle) * minR;
      const y1 = Math.sin(angle) * minR;
      const x2 = Math.cos(angle) * (minR + 3);
      const y2 = Math.sin(angle) * (minR + 3);

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

    // Aesthetic 10:10:31 showcase time
    const hourAngle = (10 + 10 / 60) * ((Math.PI * 2) / 12) - Math.PI / 2;
    const minuteAngle = 10.5 * ((Math.PI * 2) / 60) - Math.PI / 2;

    const secondOffset = (frameIndex / 240) * 12;
    const secondAngle = (31 + secondOffset) * ((Math.PI * 2) / 60) - Math.PI / 2;

    const drawBatonHand = (angle: number, length: number, width: number) => {
      ctx.save();
      ctx.rotate(angle);

      // White gold hand body
      ctx.fillStyle = '#c5c9c7';
      ctx.fillRect(0, -width / 2, length, width);

      // White Chromalight luminescent strip
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(length * 0.3, -width / 2 + 1, length * 0.65, width - 2);

      ctx.restore();
    };

    // Hour hand
    drawBatonHand(hourAngle, radius * 0.52, 6);

    // Minute hand
    drawBatonHand(minuteAngle, radius * 0.8, 4.5);

    // Seconds Hand (Polished needle with counterweight)
    ctx.save();
    ctx.rotate(secondAngle);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.22, 0);
    ctx.lineTo(radius * 0.88, 0);
    ctx.stroke();

    // Central pinion cap
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  private drawSapphireReflection(
    ctx: CanvasRenderingContext2D,
    radius: number,
    lightAngle: number,
    yaw: number
  ): void {
    ctx.save();

    const glintGrad = ctx.createLinearGradient(
      -radius,
      -radius,
      radius * 0.8,
      radius * 0.8
    );
    glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    glintGrad.addColorStop(0.38, 'rgba(255, 255, 255, 0.03)');
    glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.16)');
    glintGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.02)');
    glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
    ctx.fillStyle = glintGrad;
    ctx.fill();

    ctx.restore();
  }

  private drawTwinlockCrown(
    ctx: CanvasRenderingContext2D,
    radius: number,
    yaw: number,
    lightAngle: number
  ): void {
    ctx.save();
    const crownX = radius * 0.98;
    ctx.translate(crownX, 0);

    const crownW = 16;
    const crownH = 26;

    const crownGrad = ctx.createLinearGradient(0, -crownH / 2, 0, crownH / 2);
    crownGrad.addColorStop(0, '#565958');
    crownGrad.addColorStop(0.5, '#c5c9c7');
    crownGrad.addColorStop(1, '#3b3d3c');

    ctx.fillStyle = crownGrad;
    ctx.fillRect(0, -crownH / 2, crownW, crownH);

    // Crown fluting
    ctx.strokeStyle = '#222322';
    ctx.lineWidth = 1;
    for (let y = -crownH / 2 + 2; y < crownH / 2; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(crownW, y);
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * 28,800 vph Mechanical Movement Sound Synthesizer
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
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);

      filter.type = 'bandpass';
      filter.frequency.value = 3200;
      filter.Q.value = 6;

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
