/**
 * ASCII-style video clip (fvclip) — ported from ASCII-efect/flower.html.
 * Renders hidden &lt;video&gt; frames to dual canvases (base + glyph overlay).
 */

export type FvclipApi = {
  root: HTMLElement;
  setVideoSrc: (src: string) => void;
  relayout: () => void;
  destroy: () => void;
};

export type InitFvclipOptions = {
  /** Overrides data-fvclip-src */
  videoSrc?: string;
  /** Default true for ambient footer */
  loop?: boolean;
  /**
   * When true: play forward, then scrub `currentTime` backward at ~1× speed, then forward again — endless „ping‑pong“.
   * Disables native `video.loop` (reverse playback via negative `playbackRate` is not reliable cross‑browser).
   */
  pingPong?: boolean;
};

/**
 * Sampling canvas width is capped here — the ASCII grid has a ~9–14 px cell,
 * so anything wider just wastes pixels in `drawImage` + `getImageData` without
 * adding visual detail. Caps the per‑frame CPU cost on wide viewports.
 */
const MAX_SAMPLE_WIDTH = 480;
/**
 * Visible canvas width is capped to keep the ASCII silhouette at a sensible
 * size on very large viewports (was previously capped implicitly by the
 * source video's native resolution).
 */
const MAX_DISPLAY_WIDTH = 1280;

function qs(root: HTMLElement, name: string): HTMLInputElement | null {
  return root.querySelector(`[data-fv="${name}"]`);
}

export function initFvclip(
  root: HTMLElement | null,
  options: InitFvclipOptions = {}
): FvclipApi | null {
  if (!root) return null;

  const loopVideo = options.loop !== false;
  const pingPongLoop = options.pingPong === true;
  const defaultVideoSrc =
    options.videoSrc ||
    root.getAttribute("data-fvclip-src") ||
    root.getAttribute("data-video-src") ||
    "";

  const els = {
    canvasBase: root.querySelector<HTMLCanvasElement>(".fvclip__plate--under"),
    canvasOverlay: root.querySelector<HTMLCanvasElement>(".fvclip__plate--glyphs"),
    srcVideo: root.querySelector<HTMLVideoElement>(".fvclip__film"),
    contrast: qs(root, "contrast"),
    brightness: qs(root, "brightness"),
    density: qs(root, "density"),
    gridSize: qs(root, "gridSize"),
    overlayOpacity: qs(root, "overlayOpacity"),
    charScale: qs(root, "charScale"),
    brightnessInfluence: qs(root, "brightnessInfluence"),
    edgeInfluence: qs(root, "edgeInfluence"),
    colorExclusionEnabled: qs(root, "colorExclusionEnabled"),
    excludeColor: qs(root, "excludeColor"),
    colorTolerance: qs(root, "colorTolerance"),
    colorSoftness: qs(root, "colorSoftness"),
    colorOnlyEnabled: qs(root, "colorOnlyEnabled"),
    onlyColor: qs(root, "onlyColor"),
    onlyColorTolerance: qs(root, "onlyColorTolerance"),
    onlyColorSoftness: qs(root, "onlyColorSoftness"),
  };

  if (!els.canvasBase || !els.canvasOverlay || !els.srcVideo) return null;

  let resizeObserver: ResizeObserver | null = null;
  let layoutTargetW = 0;
  let layoutDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let videoPreviewRaf: number | null = null;
  let destroyed = false;
  /** Ping‑pong: manual backward scrub in RAF after `ended`. */
  let playbackReverse = false;
  let reverseLastTs = 0;
  /** Chvíľa po `play()` od začiatku zlep — readyState môže klesnúť; držíme RAF + fallback snímok. */
  let pendingForwardWarmup = false;

  function readFonts(): string {
    const cs = getComputedStyle(root);
    const ff = cs.fontFamily;
    if (ff && ff.trim()) return ff;
    return "Inter, system-ui, sans-serif";
  }

  function readTheme(): { field: string; glyph: string } {
    const cs = getComputedStyle(root);
    const field = (cs.getPropertyValue("--fvclip-field") || "").trim();
    const glyph = (cs.getPropertyValue("--fvclip-ink") || "").trim();
    return {
      field: field || "#000000",
      glyph: glyph || "#ffffff",
    };
  }

  function getTheme(): { field: string; glyph: string } {
    if (!cachedTheme) cachedTheme = readTheme();
    return cachedTheme;
  }

  function getFonts(): string {
    if (!cachedFonts) cachedFonts = readFonts();
    return cachedFonts;
  }

  function invalidateStyles(): void {
    cachedTheme = null;
    cachedFonts = null;
  }

  const state: {
    media: HTMLVideoElement | null;
    /** Size of the visible canvases in CSS pixels — drives layout. */
    displaySize: { w: number; h: number };
    /** Size of the in‑memory sampling canvas — drives per‑frame CPU cost. */
    sampleSize: { w: number; h: number };
    dpr: number;
    asciiCells: Array<{ cx: number; cy: number; char: string; localOpacity: number }>;
  } = {
    media: null,
    displaySize: { w: 800, h: 450 },
    sampleSize: { w: 800, h: 450 },
    dpr: 1,
    asciiCells: [],
  };

  /**
   * Cached layout fingerprint — used to skip the expensive canvas re-size dance
   * in `configurePreviewCanvases()` when nothing actually changed since the
   * previous frame.
   */
  let lastAppliedW = 0;
  let lastAppliedH = 0;
  let lastAppliedDpr = 0;
  /**
   * Cached visual styles. `getComputedStyle()` is surprisingly expensive, so
   * the renderer reads it once at startup and again only on relayout / theme
   * changes — not on every frame.
   */
  let cachedTheme: { field: string; glyph: string } | null = null;
  let cachedFonts: string | null = null;
  /**
   * Cached tuning parameters. The hidden `<input data-fv="…">` values are
   * essentially constants after mount; reading + parsing them on every cell
   * was the second-biggest hotspot in the sampling loop.
   */
  type Tuning = {
    contrast: number;
    brightness: number;
    density: number;
    gridSize: number;
    overlayOpacity: number;
    charScale: number;
    brightnessInfluence: number;
    edgeInfluence: number;
    colorExclusionEnabled: boolean;
    excludeRgb: { r: number; g: number; b: number };
    colorTolerance: number;
    colorSoftness: number;
    colorOnlyEnabled: boolean;
    onlyRgb: { r: number; g: number; b: number };
    onlyColorTolerance: number;
    onlyColorSoftness: number;
  };
  let cachedTuning: Tuning | null = null;
  /** True when IntersectionObserver reports the footer fully off-screen. */
  let offscreen = false;

  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
  const lastFrameCanvas = document.createElement("canvas");
  const lastFrameCtx = lastFrameCanvas.getContext("2d");
  const ctxBase = els.canvasBase.getContext("2d", { alpha: false });
  const ctxOverlay = els.canvasOverlay.getContext("2d", { alpha: true });

  if (!sampleCtx || !ctxBase || !ctxOverlay) return null;

  function readLayoutTargetWidth(): number {
    const r = root.getBoundingClientRect();
    return Math.max(1, Math.floor(r.width));
  }

  function scheduleLayoutApply(): void {
    if (destroyed) return;
    if (layoutDebounceTimer) clearTimeout(layoutDebounceTimer);
    layoutDebounceTimer = setTimeout(() => {
      layoutDebounceTimer = null;
      layoutTargetW = readLayoutTargetWidth();
      if (state.media && state.media.videoWidth > 0) {
        fitCanvasToMedia();
        renderCanvas();
      }
    }, 80);
  }

  function startVideoPreviewLoop(): void {
    if (destroyed) return;
    if (offscreen) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    stopVideoPreviewLoop();
    videoPreviewRaf = requestAnimationFrame(videoPreviewTick);
  }

  function stopVideoPreviewLoop(): void {
    if (videoPreviewRaf != null) {
      cancelAnimationFrame(videoPreviewRaf);
      videoPreviewRaf = null;
    }
  }

  function videoPreviewTick(time: number): void {
    if (destroyed) return;
    const v = state.media;
    if (!v) {
      stopVideoPreviewLoop();
      return;
    }
    const nearEnd =
      pingPongLoop &&
      !playbackReverse &&
      Number.isFinite(v.duration) &&
      v.duration > 0 &&
      v.currentTime >= v.duration - 0.08;
    const allowLowReady =
      pingPongLoop && (playbackReverse || v.ended || pendingForwardWarmup || nearEnd);
    if (v.readyState < 2 && !allowLowReady) {
      stopVideoPreviewLoop();
      return;
    }
    if (pingPongLoop && playbackReverse) {
      if (reverseLastTs <= 0) {
        reverseLastTs = time;
      } else {
        const dt = (time - reverseLastTs) / 1000;
        reverseLastTs = time;
        const next = v.currentTime - dt;
        if (next <= 0.001) {
          v.currentTime = 0;
          playbackReverse = false;
          reverseLastTs = 0;
          pendingForwardWarmup = true;
          renderCanvas();
          void v.play();
          startVideoPreviewLoop();
          return;
        }
        v.currentTime = next;
      }
    }
    renderCanvas();
    if (pingPongLoop && pendingForwardWarmup && v.readyState >= 2) {
      pendingForwardWarmup = false;
    }
    videoPreviewRaf = requestAnimationFrame(videoPreviewTick);
  }

  function clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }

  function getBackingDpr(): number {
    let cap = parseFloat(
      root.getAttribute("data-fvclip-max-dpr") || root.getAttribute("data-max-dpr") || "2.5"
    );
    if (!cap || cap < 1) cap = 2.5;
    const dpr = typeof window !== "undefined" && window.devicePixelRatio ? window.devicePixelRatio : 1;
    return Math.min(dpr, cap);
  }

  function configurePreviewCanvases(): void {
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const dpr = getBackingDpr();
    state.dpr = dpr;

    if (w === lastAppliedW && h === lastAppliedH && dpr === lastAppliedDpr) {
      return;
    }
    lastAppliedW = w;
    lastAppliedH = h;
    lastAppliedDpr = dpr;

    const bw = Math.max(1, Math.round(w * dpr));
    const bh = Math.max(1, Math.round(h * dpr));

    for (const el of [els.canvasBase, els.canvasOverlay]) {
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.width = bw;
      el.height = bh;
    }

    ctxBase.setTransform(1, 0, 0, 1, 0, 0);
    ctxOverlay.setTransform(1, 0, 0, 1, 0, 0);
    ctxBase.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxOverlay.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctxBase.imageSmoothingEnabled = true;
    ctxBase.imageSmoothingQuality = "high";
    ctxOverlay.imageSmoothingEnabled = true;
  }

  function fitCanvasToMedia(): void {
    const v = state.media;
    if (!v) return;
    const iw = v.videoWidth;
    const ih = v.videoHeight;
    if (iw < 1 || ih < 1) return;
    const targetW = layoutTargetW || readLayoutTargetWidth();
    const displayW = Math.max(1, Math.min(targetW, MAX_DISPLAY_WIDTH));
    const displayH = Math.max(1, Math.round(ih * (displayW / iw)));
    const sampleW = Math.max(1, Math.min(displayW, iw, MAX_SAMPLE_WIDTH));
    const sampleH = Math.max(1, Math.round(ih * (sampleW / iw)));
    state.displaySize.w = displayW;
    state.displaySize.h = displayH;
    state.sampleSize.w = sampleW;
    state.sampleSize.h = sampleH;
    if (sampleCanvas.width !== sampleW) sampleCanvas.width = sampleW;
    if (sampleCanvas.height !== sampleH) sampleCanvas.height = sampleH;
  }

  function drawPlaceholder(context: CanvasRenderingContext2D): void {
    const theme = getTheme();
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const FONT_STACK = getFonts();
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.filter = "none";
    context.imageSmoothingEnabled = true;
    context.clearRect(0, 0, w, h);
    context.fillStyle = theme.field;
    context.fillRect(0, 0, w, h);
    context.fillStyle = "#6a6770";
    context.font = `400 13px ${FONT_STACK}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Loading video…", w / 2, h / 2);
  }

  function drawBaseImage(context: CanvasRenderingContext2D): void {
    const theme = getTheme();
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    if (!state.media || w < 1) return;
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.filter = "none";
    context.imageSmoothingEnabled = true;
    context.clearRect(0, 0, w, h);
    context.fillStyle = theme.field;
    context.fillRect(0, 0, w, h);
  }

  function luminanceAt(data: Uint8ClampedArray, w: number, h: number, x: number, y: number): number {
    x = clamp(Math.floor(x), 0, w - 1);
    y = clamp(Math.floor(y), 0, h - 1);
    const idx = (y * w + x) * 4;
    const r = data[idx]!;
    const g = data[idx + 1]!;
    const b = data[idx + 2]!;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function rgbAt(
    data: Uint8ClampedArray,
    w: number,
    h: number,
    x: number,
    y: number
  ): { r: number; g: number; b: number } {
    x = clamp(Math.floor(x), 0, w - 1);
    y = clamp(Math.floor(y), 0, h - 1);
    const idx = (y * w + x) * 4;
    return { r: data[idx]!, g: data[idx + 1]!, b: data[idx + 2]! };
  }

  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
    if (!m) return { r: 93, g: 173, b: 226 };
    return { r: parseInt(m[1]!, 16), g: parseInt(m[2]!, 16), b: parseInt(m[3]!, 16) };
  }

  function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function getColorExclusionAllow(distance: number, tolerance: number, softness: number): number {
    const tol = Math.max(0, tolerance);
    const soft = Math.max(0, softness);
    if (distance <= tol) return 0;
    if (soft <= 0) return 1;
    const end = tol + soft;
    if (distance >= end) return 1;
    return (distance - tol) / soft;
  }

  function getColorInclusionAllow(distance: number, tolerance: number, softness: number): number {
    const tol = Math.max(0, tolerance);
    const soft = Math.max(0, softness);
    if (distance <= tol) return 1;
    if (soft <= 0) return 0;
    const end = tol + soft;
    if (distance >= end) return 0;
    return 1 - (distance - tol) / soft;
  }

  function numInput(el: HTMLInputElement | null, fallback: number): number {
    if (!el) return fallback;
    const v = parseFloat(el.value, 10);
    return Number.isFinite(v) ? v : fallback;
  }

  function readTuning(): Tuning {
    return {
      contrast: numInput(els.contrast, 1.74),
      brightness: numInput(els.brightness, -46),
      density: numInput(els.density, 0.67),
      gridSize: parseInt(els.gridSize?.value || "14", 10) || 14,
      overlayOpacity: numInput(els.overlayOpacity, 1),
      charScale: numInput(els.charScale, 0.81),
      brightnessInfluence: numInput(els.brightnessInfluence, 0.7),
      edgeInfluence: numInput(els.edgeInfluence, 0.42),
      colorExclusionEnabled: els.colorExclusionEnabled?.checked ?? false,
      excludeRgb: hexToRgb(els.excludeColor?.value || "#5dade2"),
      colorTolerance: numInput(els.colorTolerance, 50),
      colorSoftness: numInput(els.colorSoftness, 40),
      colorOnlyEnabled: els.colorOnlyEnabled?.checked ?? false,
      onlyRgb: hexToRgb(els.onlyColor?.value || "#c9a87c"),
      onlyColorTolerance: numInput(els.onlyColorTolerance, 48),
      onlyColorSoftness: numInput(els.onlyColorSoftness, 42),
    };
  }

  function getTuning(): Tuning {
    if (!cachedTuning) cachedTuning = readTuning();
    return cachedTuning;
  }

  function invalidateTuning(): void {
    cachedTuning = null;
  }

  function overlayToneAdjust(L: number, contrast: number, brightness: number): number {
    let x = L / 255;
    x = (x - 0.5) * contrast + 0.5;
    return clamp(x * 255 + brightness, 0, 255);
  }

  function mapCellToGlyph(L_adj: number, edgeNorm: number, edgeInfl: number): string {
    const t = L_adj / 255;
    const e = edgeNorm;
    const boost = e * edgeInfl * 0.42;
    const tone = clamp(t + boost, 0, 1);

    if (tone < 0.11) return ".";
    if (tone < 0.26) return ":";
    if (tone < 0.62) return "o";
    return "O";
  }

  function cellHash(gx: number, gy: number): number {
    let n = gx * 374761393 + gy * 668265263;
    n = (n ^ (n >>> 13)) * 1274126177;
    return (n >>> 0) / 4294967296;
  }

  function sampleOverlayData(): typeof state.asciiCells {
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const sw = state.sampleSize.w;
    const sh = state.sampleSize.h;
    const cells: typeof state.asciiCells = [];
    if (!state.media || w < 1 || sw < 1) {
      state.asciiCells = cells;
      return cells;
    }
    const v = state.media;
    const nearEnd =
      pingPongLoop &&
      !playbackReverse &&
      Number.isFinite(v.duration) &&
      v.duration > 0 &&
      v.currentTime >= v.duration - 0.08;
    const weakSample =
      pingPongLoop &&
      (playbackReverse || v.ended || pendingForwardWarmup || nearEnd) &&
      v.videoWidth > 0 &&
      (v.readyState >= 1 || pendingForwardWarmup);
    const staleOk =
      Boolean(lastFrameCtx) &&
      weakSample &&
      lastFrameCanvas.width === sw &&
      lastFrameCanvas.height === sh;
    if (v.readyState < 2 && !weakSample) {
      state.asciiCells = cells;
      return cells;
    }

    sampleCtx.setTransform(1, 0, 0, 1, 0, 0);
    sampleCtx.clearRect(0, 0, sw, sh);
    // We're downscaling for analysis only — high-quality smoothing would
    // burn CPU on something the user never sees. "low" is enough for the
    // luminance / edge heuristics.
    sampleCtx.imageSmoothingEnabled = true;
    sampleCtx.imageSmoothingQuality = "low";
    sampleCtx.filter = "none";

    let drew = false;
    if (v.readyState >= 2) {
      sampleCtx.drawImage(v, 0, 0, sw, sh);
      drew = true;
      if (lastFrameCtx) {
        if (lastFrameCanvas.width !== sw || lastFrameCanvas.height !== sh) {
          lastFrameCanvas.width = sw;
          lastFrameCanvas.height = sh;
        }
        lastFrameCtx.drawImage(sampleCanvas, 0, 0);
      }
    } else if (weakSample) {
      try {
        sampleCtx.drawImage(v, 0, 0, sw, sh);
        drew = true;
      } catch {
        /* decode / buffer ešte nie je kresliteľný */
      }
      if (!drew && staleOk) {
        sampleCtx.drawImage(lastFrameCanvas, 0, 0);
        drew = true;
      } else if (drew && lastFrameCtx) {
        if (lastFrameCanvas.width !== sw || lastFrameCanvas.height !== sh) {
          lastFrameCanvas.width = sw;
          lastFrameCanvas.height = sh;
        }
        lastFrameCtx.drawImage(sampleCanvas, 0, 0);
      }
    }

    if (!drew) {
      state.asciiCells = cells;
      return cells;
    }

    const id = sampleCtx.getImageData(0, 0, sw, sh);
    const data = id.data;

    const t = getTuning();
    const cell = t.gridSize;
    const density = t.density;
    const bInf = t.brightnessInfluence;
    const eInf = t.edgeInfluence;
    const edgeInfl = eInf;
    const thresh = 0.1 + (1 - density) * 0.4;

    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const sScale = sw / w;

    const exclusionOn = t.colorExclusionEnabled;
    const onlyOn = t.colorOnlyEnabled;
    const exRgb = t.excludeRgb;
    const exTol = t.colorTolerance;
    const exSoft = t.colorSoftness;
    const onlyRgb = t.onlyRgb;
    const onlyTol = t.onlyColorTolerance;
    const onlySoft = t.onlyColorSoftness;
    const contrast = t.contrast;
    const brightness = t.brightness;

    let gx: number;
    let gy: number;
    let cx: number;
    let cy: number;
    let sx: number;
    let sy: number;
    let L: number;
    let Lx: number;
    let Ly: number;
    let edge: number;
    let L_adj: number;
    let darkScore: number;
    let combined: number;
    let placeRoll: number;
    let ch: string;

    for (gy = 0; gy < rows; gy++) {
      for (gx = 0; gx < cols; gx++) {
        cx = gx * cell + cell * 0.5;
        cy = gy * cell + cell * 0.5;
        if (cx >= w || cy >= h) continue;
        sx = cx * sScale;
        sy = cy * sScale;

        L = luminanceAt(data, sw, sh, sx, sy);
        Lx = luminanceAt(data, sw, sh, sx + 1, sy) - luminanceAt(data, sw, sh, sx - 1, sy);
        Ly = luminanceAt(data, sw, sh, sx, sy + 1) - luminanceAt(data, sw, sh, sx, sy - 1);
        edge = Math.sqrt(Lx * Lx + Ly * Ly) / 255;

        L_adj = overlayToneAdjust(L, contrast, brightness);

        darkScore = 1 - L / 255;
        combined = darkScore * bInf + edge * eInf;
        placeRoll = cellHash(gx, gy);

        if (combined < thresh) continue;
        if (placeRoll > density) continue;

        if (exclusionOn) {
          const px = rgbAt(data, sw, sh, sx, sy);
          const dist = colorDistance(px.r, px.g, px.b, exRgb.r, exRgb.g, exRgb.b);
          const allow = getColorExclusionAllow(dist, exTol, exSoft);
          if (allow <= 0) continue;
          if (allow < 1 && cellHash(gx + 901, gy + 503) > allow) continue;
        }

        if (onlyOn) {
          const pxOnly = rgbAt(data, sw, sh, sx, sy);
          const distOnly = colorDistance(
            pxOnly.r,
            pxOnly.g,
            pxOnly.b,
            onlyRgb.r,
            onlyRgb.g,
            onlyRgb.b
          );
          const allowOnly = getColorInclusionAllow(distOnly, onlyTol, onlySoft);
          if (allowOnly <= 0) continue;
          if (allowOnly < 1 && cellHash(gx + 337, gy + 619) > allowOnly) continue;
        }

        ch = mapCellToGlyph(L_adj, edge, edgeInfl);

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

  function snapGlyphPosition(x: number, y: number): { x: number; y: number } {
    return { x: Math.round(x), y: Math.round(y) };
  }

  function renderOverlayText(
    context: CanvasRenderingContext2D,
    cells: typeof state.asciiCells
  ): void {
    const theme = getTheme();
    const FONT_STACK = getFonts();
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const t = getTuning();
    const opacity = t.overlayOpacity;
    const scale = t.charScale;
    const cell = t.gridSize;
    const fontSize = Math.max(7, cell * scale * 1.02);

    context.save();
    context.clearRect(0, 0, w, h);
    context.fillStyle = theme.glyph;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `500 ${fontSize}px ${FONT_STACK}`;

    for (let i = 0; i < cells.length; i++) {
      const p = snapGlyphPosition(cells[i]!.cx, cells[i]!.cy);
      context.globalAlpha = opacity * cells[i]!.localOpacity;
      context.fillText(cells[i]!.char, p.x, p.y);
    }
    context.restore();
  }

  function renderCanvas(): void {
    if (destroyed) return;
    configurePreviewCanvases();
    if (!state.media || state.media.videoWidth < 1) {
      drawPlaceholder(ctxBase);
      ctxOverlay.clearRect(0, 0, state.displaySize.w, state.displaySize.h);
      return;
    }
    drawBaseImage(ctxBase);
    const cells = sampleOverlayData();
    renderOverlayText(ctxOverlay, cells);
  }

  function ensureVideoSilent(v: HTMLVideoElement): void {
    v.defaultMuted = true;
    v.muted = true;
    v.volume = 0;
  }

  function loadVideo(src: string): void {
    if (destroyed) return;
    stopVideoPreviewLoop();
    playbackReverse = false;
    reverseLastTs = 0;
    pendingForwardWarmup = false;
    lastFrameCanvas.width = 0;
    lastFrameCanvas.height = 0;
    state.media = null;
    const v = els.srcVideo;
    ensureVideoSilent(v);
    v.playsInline = true;
    v.loop = loopVideo && !pingPongLoop;
    v.pause();
    v.removeAttribute("src");
    v.load();

    v.onerror = () => {
      if (destroyed) return;
      layoutTargetW = readLayoutTargetWidth();
      state.displaySize.w = Math.max(320, layoutTargetW);
      state.displaySize.h = Math.round((state.displaySize.w * 9) / 16);
      state.media = null;
      renderCanvas();
    };

    v.onloadedmetadata = () => {
      if (destroyed) return;
      state.media = v;
      layoutTargetW = readLayoutTargetWidth();
      fitCanvasToMedia();
      renderCanvas();
      ensureVideoSilent(v);
      const playAttempt = v.play();
      if (playAttempt && typeof playAttempt.then === "function") {
        playAttempt
          .then(() => {
            startVideoPreviewLoop();
          })
          .catch(() => {
            startVideoPreviewLoop();
          });
      } else {
        startVideoPreviewLoop();
      }
    };

    v.src = src;
    v.load();
  }

  function onPlay(): void {
    ensureVideoSilent(els.srcVideo);
    startVideoPreviewLoop();
  }
  function onPause(): void {
    if (pingPongLoop && els.srcVideo.ended) {
      renderCanvas();
      return;
    }
    stopVideoPreviewLoop();
    renderCanvas();
  }
  function onEnded(): void {
    if (pingPongLoop) {
      playbackReverse = true;
      reverseLastTs = 0;
      startVideoPreviewLoop();
      renderCanvas();
      return;
    }
    stopVideoPreviewLoop();
    renderCanvas();
  }

  els.srcVideo.addEventListener("play", onPlay);
  els.srcVideo.addEventListener("pause", onPause);
  els.srcVideo.addEventListener("ended", onEnded);

  function onReduceMotion(): void {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.srcVideo.pause();
      stopVideoPreviewLoop();
      playbackReverse = false;
      reverseLastTs = 0;
      pendingForwardWarmup = false;
    } else {
      ensureVideoSilent(els.srcVideo);
      playbackReverse = false;
      reverseLastTs = 0;
      pendingForwardWarmup = false;
      void els.srcVideo.play();
      startVideoPreviewLoop();
    }
    renderCanvas();
  }

  const mqReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (mqReduce?.addEventListener) {
    mqReduce.addEventListener("change", onReduceMotion);
  } else if (mqReduce?.addListener) {
    mqReduce.addListener(onReduceMotion);
  }

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      // Styles (CSS vars, computed font stack) often shift in tandem with
      // layout changes — re-read them on the next paint instead of every frame.
      invalidateStyles();
      scheduleLayoutApply();
    });
    resizeObserver.observe(root);
  }
  window.addEventListener("resize", scheduleLayoutApply);

  // Pause work entirely when the footer is offscreen. The flower pattern lives
  // at the bottom of long pages and most users never scroll all the way down;
  // running the sampling pipeline that whole time is wasted CPU.
  let visibilityObserver: IntersectionObserver | null = null;
  function applyVisibility(visible: boolean): void {
    const wasOffscreen = offscreen;
    offscreen = !visible;
    if (offscreen && !wasOffscreen) {
      stopVideoPreviewLoop();
      try {
        els.srcVideo.pause();
      } catch {
        /* play() may not have resolved yet */
      }
    } else if (!offscreen && wasOffscreen) {
      if (!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        ensureVideoSilent(els.srcVideo);
        const p = els.srcVideo.play();
        if (p && typeof p.then === "function") p.catch(() => {});
      }
      startVideoPreviewLoop();
    }
  }
  if (typeof IntersectionObserver !== "undefined") {
    visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          applyVisibility(entry.isIntersecting);
        }
      },
      // 200 px buffer so the warmup happens just before the user scrolls in.
      { rootMargin: "200px 0px", threshold: 0 }
    );
    visibilityObserver.observe(root);
  }

  // Web font may resolve after init — re-render so glyphs snap to the
  // intended Inter typeface instead of the system fallback.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready.then(() => {
      if (destroyed) return;
      invalidateStyles();
      renderCanvas();
    });
  }

  layoutTargetW = readLayoutTargetWidth();
  state.displaySize.w = Math.max(320, layoutTargetW);
  state.displaySize.h = Math.round((state.displaySize.w * 9) / 16);
  state.sampleSize.w = Math.min(state.displaySize.w, MAX_SAMPLE_WIDTH);
  state.sampleSize.h = Math.round((state.sampleSize.w * 9) / 16);

  if (defaultVideoSrc) loadVideo(defaultVideoSrc);
  else renderCanvas();

  return {
    root,
    setVideoSrc(src) {
      if (destroyed) return;
      loadVideo(src || defaultVideoSrc);
    },
    relayout() {
      if (destroyed) return;
      layoutTargetW = readLayoutTargetWidth();
      if (state.media && state.media.videoWidth > 0) {
        fitCanvasToMedia();
        renderCanvas();
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stopVideoPreviewLoop();
      if (layoutDebounceTimer) {
        clearTimeout(layoutDebounceTimer);
        layoutDebounceTimer = null;
      }
      playbackReverse = false;
      reverseLastTs = 0;
      pendingForwardWarmup = false;
      lastFrameCanvas.width = 0;
      lastFrameCanvas.height = 0;
      els.srcVideo.pause();
      els.srcVideo.removeAttribute("src");
      els.srcVideo.load();
      els.srcVideo.removeEventListener("play", onPlay);
      els.srcVideo.removeEventListener("pause", onPause);
      els.srcVideo.removeEventListener("ended", onEnded);
      window.removeEventListener("resize", scheduleLayoutApply);
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      if (visibilityObserver) {
        visibilityObserver.disconnect();
        visibilityObserver = null;
      }
      if (mqReduce?.removeEventListener) {
        mqReduce.removeEventListener("change", onReduceMotion);
      } else if (mqReduce?.removeListener) {
        mqReduce.removeListener(onReduceMotion);
      }
      state.media = null;
    },
  };
}
