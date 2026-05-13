/**
 * ASCII wave — canvas = celý hero kontajner (inset-0), vzorkovanie ako CSS object-cover,
 * aby sedelo 1:1 s `<img class="object-cover">` keď má zdroj rovnaké rozmery ako hero bitmapa.
 */

const FONT_FAMILY = 'Inter, ui-sans-serif, system-ui, sans-serif';

/**
 * Vlnové vzorkovanie — rovnaký strop posunu (`WAVE_OFF_MAX_FACTOR`); vyššie frekvencie, rýchlosť
 * a tretia harmonická pridávajú výraznejšiu vlnitosti / život v rámci kruhu.
 */
const WAVE = {
  speed1: 0.68,
  speed2: 0.52,
  /** Pomalšia tretia vrstva — iný rytmus bez rozšírenia dosahu (orezáva sa na offCap). */
  speed3: 0.33,
  kx1: 0.018,
  ky1: 0.02,
  kx2: 0.023,
  ky2: 0.017,
  kx3: 0.031,
  ky3: 0.027,
  blend: 0.46,
  /** Príspevok tretej vlny voči `amp` pred orezaním. */
  tertiary: 0.2,
} as const;

/** Základ amplitúdy; výsledok vždy oreže `offCapPx`. */
const WAVE_AMP_FRAC = 0.024;
/** Max. posun vzorky od stredu bunky = `gridSize * tento faktor` (drží „izoláciu“ pri znakoch). */
const WAVE_OFF_MAX_FACTOR = 0.48;

/** Hodnoty z widget3 (#ah-param-store + checkboxy) */
const PARAMS = {
  colorExclusionEnabled: true,
  excludeColor: "#000000",
  colorTolerance: 50,
  colorSoftness: 40,
  colorOnlyEnabled: true,
  onlyColor: "#cfcfcf",
  onlyColorTolerance: 163,
  onlyColorSoftness: 93,
  contrast: 0.7,
  brightness: -100,
  density: 0.93,
  gridSize: 14,
  overlayOpacity: 1,
  charScale: 0.89,
  brightnessInfluence: 0.72,
  edgeInfluence: 0.02,
} as const;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function getBackingDpr() {
  return Math.min(typeof window !== "undefined" && window.devicePixelRatio ? window.devicePixelRatio : 1, 3);
}

function getAsciiObjectPositionX(w: number) {
  // On narrow phones the cover crop hides the active wave too far to the side.
  // Pull the sampled source toward the visual center of the mobile hero.
  if (w < 500) return 0.68;
  if (w < 640) return 0.6;
  return 0.5;
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (iw < 1 || ih < 1) return;
  const isMobileMaskSource = ih > iw;
  const mobileContainNudge = isMobileMaskSource ? 1 : w < 500 ? 0.76 : w < 640 ? 0.86 : 1;
  const scale = Math.max(w / iw, h / ih) * mobileContainNudge;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = isMobileMaskSource ? (w - dw) / 2 : (w - dw) * getAsciiObjectPositionX(w);
  const dy = (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function luminanceAt(data: Uint8ClampedArray, w: number, h: number, x: number, y: number) {
  x = clamp(Math.floor(x), 0, w - 1);
  y = clamp(Math.floor(y), 0, h - 1);
  const idx = (y * w + x) * 4;
  const r = data[idx]!;
  const g = data[idx + 1]!;
  const b = data[idx + 2]!;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rgbAt(data: Uint8ClampedArray, w: number, h: number, x: number, y: number) {
  x = clamp(Math.floor(x), 0, w - 1);
  y = clamp(Math.floor(y), 0, h - 1);
  const idx = (y * w + x) * 4;
  return { r: data[idx]!, g: data[idx + 1]!, b: data[idx + 2]! };
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
  if (!m) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(m[1]!, 16), g: parseInt(m[2]!, 16), b: parseInt(m[3]!, 16) };
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function getColorExclusionAllow(distance: number, tolerance: number, softness: number) {
  const tol = Math.max(0, tolerance);
  const soft = Math.max(0, softness);
  if (distance <= tol) return 0;
  if (soft <= 0) return 1;
  const end = tol + soft;
  if (distance >= end) return 1;
  return (distance - tol) / soft;
}

function getColorInclusionAllow(distance: number, tolerance: number, softness: number) {
  const tol = Math.max(0, tolerance);
  const soft = Math.max(0, softness);
  if (distance <= tol) return 1;
  if (soft <= 0) return 0;
  const end = tol + soft;
  if (distance >= end) return 0;
  return 1 - (distance - tol) / soft;
}

function overlayToneAdjust(L: number) {
  const c = PARAMS.contrast;
  const b = PARAMS.brightness;
  let x = L / 255;
  x = (x - 0.5) * c + 0.5;
  return clamp(x * 255 + b, 0, 255);
}

function mapCellToGlyph(L_adj: number, edgeNorm: number, edgeInfl: number) {
  const t = L_adj / 255;
  const e = edgeNorm;
  const boost = e * edgeInfl * 0.42;
  const tone = clamp(t + boost, 0, 1);
  if (tone < 0.11) return ".";
  if (tone < 0.26) return ":";
  if (tone < 0.62) return "o";
  return "O";
}

function cellHash(gx: number, gy: number) {
  let n = gx * 374761393 + gy * 668265263;
  n = (n ^ (n >>> 13)) * 1274126177;
  return (n >>> 0) / 4294967296;
}

export function mountHeroAsciiLayer(options: {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  imageSrc: string;
  mobileImageSrc?: string;
}): () => void {
  const { container, canvas } = options;

  let layoutDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let animRafId: number | null = null;
  let imageRequestId = 0;
  let animRunning = false;
  let resizeObserver: ResizeObserver | null = null;
  const motionMql =
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  let destroyed = false;

  const state: {
    image: HTMLImageElement | null;
    imageSrc: string | null;
    displaySize: { w: number; h: number };
    asciiCells: Array<{ cx: number; cy: number; char: string; localOpacity: number }>;
    waveTimeMs: number;
  } = {
    image: null,
    imageSrc: null,
    displaySize: { w: 800, h: 450 },
    asciiCells: [],
    waveTimeMs: 0,
  };

  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!sampleCtx || !ctx) {
    return () => {};
  }

  function prefersReducedMotion() {
    return motionMql?.matches ?? false;
  }

  function getActiveImageSrc() {
    return options.mobileImageSrc && state.displaySize.w < 640 ? options.mobileImageSrc : options.imageSrc;
  }

  function syncDisplayToContainer() {
    const r = container.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width));
    const h = Math.max(1, Math.floor(r.height));
    state.displaySize.w = w;
    state.displaySize.h = h;
    sampleCanvas.width = w;
    sampleCanvas.height = h;
  }

  function scheduleLayoutApply() {
    if (layoutDebounceTimer) clearTimeout(layoutDebounceTimer);
    layoutDebounceTimer = setTimeout(() => {
      layoutDebounceTimer = null;
      syncDisplayToContainer();
      ensureActiveImage();
      renderCanvas();
    }, 80);
  }

  function onWindowResize() {
    scheduleLayoutApply();
  }

  function onVisibilityChange() {
    if (document.hidden) stopWaveAnim();
    else if (state.image && !prefersReducedMotion()) startWaveAnim();
  }

  function onReducedMotionChange() {
    if (prefersReducedMotion()) {
      stopWaveAnim();
      state.waveTimeMs = 0;
      if (state.image) renderCanvas();
    } else if (state.image && !document.hidden) startWaveAnim();
  }

  function configureCanvas() {
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const dpr = getBackingDpr();
    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = bw;
    canvas.height = bh;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  function waveSampleXY(cx: number, cy: number, w: number, h: number, offCapPx: number) {
    const t = state.waveTimeMs * 0.001;
    let amp = Math.min(w, h) * WAVE_AMP_FRAC;
    amp = Math.min(amp, offCapPx);
    const wv = WAVE;
    const cross = cy * 0.007 + cx * 0.0045;
    const p1 = wv.speed1 * t + cx * wv.kx1 + cy * wv.ky1;
    const p2 = wv.speed2 * t - cx * wv.kx2 + cy * wv.ky2;
    const q1 = wv.speed2 * 0.9 * t + cx * wv.ky1 * 0.85 - cy * wv.kx1;
    const q2 = wv.speed1 * 1.1 * t + cx * wv.kx2 * 0.7 + cy * wv.ky2 * 1.05;
    const p3 = wv.speed3 * t + cx * wv.kx3 + cy * wv.ky3;
    const ter = wv.tertiary;
    let sx =
      cx +
      amp * Math.sin(p1) +
      amp * wv.blend * Math.sin(p2 + cross) +
      amp * ter * Math.sin(p3 + cross * 0.5);
    let sy =
      cy +
      amp * Math.cos(q1) +
      amp * wv.blend * Math.cos(q2 - cross) +
      amp * ter * Math.cos(p3 * 0.91 - cross);
    const dx = sx - cx;
    const dy = sy - cy;
    const len = Math.hypot(dx, dy);
    if (len > offCapPx && len > 1e-6) {
      const s = offCapPx / len;
      sx = cx + dx * s;
      sy = cy + dy * s;
    }
    return {
      sx: clamp(sx, 0, w - 1),
      sy: clamp(sy, 0, h - 1),
    };
  }

  function sampleOverlayData() {
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const cells: typeof state.asciiCells = [];
    const img = state.image;
    if (!img || w < 1) {
      state.asciiCells = cells;
      return cells;
    }

    sampleCtx.setTransform(1, 0, 0, 1, 0, 0);
    sampleCtx.clearRect(0, 0, w, h);
    sampleCtx.imageSmoothingEnabled = true;
    sampleCtx.imageSmoothingQuality = "high";
    drawImageCover(sampleCtx, img, w, h);

    const id = sampleCtx.getImageData(0, 0, w, h);
    const data = id.data;

    const cell = PARAMS.gridSize;
    const offCapPx = cell * WAVE_OFF_MAX_FACTOR;
    const density = PARAMS.density;
    const bInf = PARAMS.brightnessInfluence;
    const eInf = PARAMS.edgeInfluence;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const edgeInfl = PARAMS.edgeInfluence;

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const cx = gx * cell + cell * 0.5;
        const cy = gy * cell + cell * 0.5;
        if (cx >= w || cy >= h) continue;

        const wpt = waveSampleXY(cx, cy, w, h, offCapPx);
        const sx = wpt.sx;
        const sy = wpt.sy;

        const L = luminanceAt(data, w, h, sx, sy);
        const Lx = luminanceAt(data, w, h, sx + 1, sy) - luminanceAt(data, w, h, sx - 1, sy);
        const Ly = luminanceAt(data, w, h, sx, sy + 1) - luminanceAt(data, w, h, sx, sy - 1);
        const edge = Math.sqrt(Lx * Lx + Ly * Ly) / 255;
        const L_adj = overlayToneAdjust(L);
        const darkScore = 1 - L / 255;
        const combined = darkScore * bInf + edge * eInf;
        const thresh = 0.1 + (1 - density) * 0.4;
        const placeRoll = cellHash(gx, gy);
        if (combined < thresh) continue;
        if (placeRoll > density) continue;

        if (PARAMS.colorExclusionEnabled) {
          const exRgb = hexToRgb(PARAMS.excludeColor);
          const px = rgbAt(data, w, h, sx, sy);
          const dist = colorDistance(px.r, px.g, px.b, exRgb.r, exRgb.g, exRgb.b);
          const allow = getColorExclusionAllow(dist, PARAMS.colorTolerance, PARAMS.colorSoftness);
          if (allow <= 0) continue;
          if (allow < 1 && cellHash(gx + 901, gy + 503) > allow) continue;
        }

        if (PARAMS.colorOnlyEnabled) {
          const onlyRgb = hexToRgb(PARAMS.onlyColor);
          const pxOnly = rgbAt(data, w, h, sx, sy);
          const distOnly = colorDistance(
            pxOnly.r,
            pxOnly.g,
            pxOnly.b,
            onlyRgb.r,
            onlyRgb.g,
            onlyRgb.b,
          );
          const allowOnly = getColorInclusionAllow(distOnly, PARAMS.onlyColorTolerance, PARAMS.onlyColorSoftness);
          if (allowOnly <= 0) continue;
          if (allowOnly < 1 && cellHash(gx + 337, gy + 619) > allowOnly) continue;
        }

        const ch = mapCellToGlyph(L_adj, edge, edgeInfl);
        const toneVis = L_adj / 255;
        cells.push({
          cx,
          cy,
          char: ch,
          localOpacity: 0.88 + 0.12 * (1 - Math.abs(0.5 - toneVis)),
        });
      }
    }

    state.asciiCells = cells;
    return cells;
  }

  function renderOverlayText(context: CanvasRenderingContext2D, cells: typeof state.asciiCells) {
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const opacity = PARAMS.overlayOpacity;
    const scale = PARAMS.charScale;
    const cell = PARAMS.gridSize;
    const fontSize = Math.max(7, cell * scale * 1.02);

    context.save();
    context.clearRect(0, 0, w, h);
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `500 ${fontSize}px ${FONT_FAMILY}`;

    for (let i = 0; i < cells.length; i++) {
      const p = cells[i]!;
      const x = Math.round(p.cx);
      const y = Math.round(p.cy);
      context.globalAlpha = opacity * p.localOpacity;
      context.fillText(p.char, x, y);
    }
    context.restore();
  }

  function renderCanvas() {
    configureCanvas();
    if (!state.image) {
      ctx.clearRect(0, 0, state.displaySize.w, state.displaySize.h);
      return;
    }
    const cells = sampleOverlayData();
    renderOverlayText(ctx, cells);
  }

  function tickWave() {
    if (!animRunning) return;
    animRafId = requestAnimationFrame(tickWave);
    if (!state.image) return;
    state.waveTimeMs = performance.now();
    renderCanvas();
  }

  function startWaveAnim() {
    if (prefersReducedMotion() || destroyed) return;
    animRunning = true;
    if (animRafId == null) tickWave();
  }

  function stopWaveAnim() {
    animRunning = false;
    if (animRafId != null) {
      cancelAnimationFrame(animRafId);
      animRafId = null;
    }
  }

  function ensureActiveImage() {
    const src = getActiveImageSrc();
    if (state.imageSrc !== src) loadHeaderImage(src);
  }

  function loadHeaderImage(src: string) {
    const requestId = ++imageRequestId;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (destroyed || requestId !== imageRequestId) return;
      state.image = img;
      state.imageSrc = src;
      syncDisplayToContainer();
      state.waveTimeMs = prefersReducedMotion() ? 0 : performance.now();
      renderCanvas();
      if (!prefersReducedMotion()) startWaveAnim();
    };
    img.onerror = () => {
      if (destroyed || requestId !== imageRequestId) return;
      state.image = null;
      state.imageSrc = null;
      stopWaveAnim();
      syncDisplayToContainer();
      renderCanvas();
    };
    img.src = src;
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    stopWaveAnim();
    if (layoutDebounceTimer) {
      clearTimeout(layoutDebounceTimer);
      layoutDebounceTimer = null;
    }
    resizeObserver?.disconnect();
    resizeObserver = null;
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("resize", onWindowResize);
    if (motionMql?.removeEventListener) motionMql.removeEventListener("change", onReducedMotionChange);
    else if (motionMql && "removeListener" in motionMql) (motionMql as MediaQueryList).removeListener(onReducedMotionChange);
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("resize", onWindowResize);
  if (motionMql?.addEventListener) motionMql.addEventListener("change", onReducedMotionChange);
  else if (motionMql && "addListener" in motionMql) (motionMql as MediaQueryList).addListener(onReducedMotionChange);

  resizeObserver = new ResizeObserver(() => scheduleLayoutApply());
  resizeObserver.observe(container);

  syncDisplayToContainer();
  state.waveTimeMs = prefersReducedMotion() ? 0 : performance.now();
  loadHeaderImage(getActiveImageSrc());
  renderCanvas();

  return destroy;
}
