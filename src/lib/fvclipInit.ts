/**
 * ASCII-style video clip (fvclip) — ported from ASCII-efect/flower.html.
 * Renders hidden &lt;video&gt; frames to dual canvases (base + glyph overlay).
 */

export type FvclipApi = {
  root: HTMLElement;
  setVideoSrc: (src: string) => void;
  relayout: () => void;
  /** 0–1 = čas videa pri scroll-driven režime */
  setScrollProgress: (p: number) => void;
  destroy: () => void;
};

export type InitFvclipOptions = {
  /** Overrides data-fvclip-src */
  videoSrc?: string;
  /** Default true unless scrollDriven */
  loop?: boolean;
  /** Čas videa riadi scroll (žiadny autoplay / rAF loop) */
  scrollDriven?: boolean;
};

function qs(root: HTMLElement, name: string): HTMLInputElement | null {
  return root.querySelector(`[data-fv="${name}"]`);
}

export function initFvclip(
  root: HTMLElement | null,
  options: InitFvclipOptions = {}
): FvclipApi | null {
  if (!root) return null;

  const loopVideo = options.scrollDriven ? false : options.loop !== false;
  const scrollDriven = options.scrollDriven === true;
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

  const state: {
    media: HTMLVideoElement | null;
    displaySize: { w: number; h: number };
    dpr: number;
    asciiCells: Array<{ cx: number; cy: number; char: string; localOpacity: number }>;
  } = {
    media: null,
    displaySize: { w: 800, h: 450 },
    dpr: 1,
    asciiCells: [],
  };

  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
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
    if (destroyed || scrollDriven) return;
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

  function videoPreviewTick(): void {
    if (destroyed) return;
    if (!state.media || state.media.readyState < 2) {
      stopVideoPreviewLoop();
      return;
    }
    renderCanvas();
    videoPreviewRaf = requestAnimationFrame(videoPreviewTick);
  }

  function clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }

  function smooth01(t: number): number {
    const x = clamp(t, 0, 1);
    return x * x * (3 - 2 * x);
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
    let w = Math.min(iw, targetW);
    w = Math.max(1, w);
    const h = Math.max(1, Math.round(ih * (w / iw)));
    state.displaySize.w = w;
    state.displaySize.h = h;
    sampleCanvas.width = w;
    sampleCanvas.height = h;
  }

  function drawPlaceholder(context: CanvasRenderingContext2D): void {
    const theme = readTheme();
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const FONT_STACK = readFonts();
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
    const theme = readTheme();
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

  function overlayToneAdjust(L: number): number {
    const c = numInput(els.contrast, 1.74);
    const b = numInput(els.brightness, -46);
    let x = L / 255;
    x = (x - 0.5) * c + 0.5;
    return clamp(x * 255 + b, 0, 255);
  }

  /** Spojitý index 0…3 medzi . : o O — pre crossfade namiesto ostrých skokov. */
  function toneToContinuousGlyphIndex(L_adj: number, edgeNorm: number, edgeInfl: number): number {
    const t = L_adj / 255;
    const e = edgeNorm;
    const boost = e * edgeInfl * 0.42;
    const tone = clamp(t + boost, 0, 1);
    const a = 0.11;
    const b = 0.26;
    const c = 0.62;
    if (tone <= a) return a > 1e-6 ? (tone / a) * 1 : 0;
    if (tone <= b) return 1 + (tone - a) / (b - a);
    if (tone <= c) return 2 + (tone - b) / (c - b);
    return 3;
  }

  function glyphLayersForToneIndex(idx: number): Array<{ ch: string; alpha: number }> {
    const glyphs = [".", ":", "o", "O"] as const;
    const i0 = clamp(Math.floor(idx), 0, 3);
    const i1 = clamp(Math.ceil(idx), 0, 3);
    if (i0 === i1) return [{ ch: glyphs[i0]!, alpha: 1 }];
    const f = smooth01(idx - i0);
    return [
      { ch: glyphs[i0]!, alpha: 1 - f },
      { ch: glyphs[i1]!, alpha: f },
    ];
  }

  function cellHash(gx: number, gy: number): number {
    let n = gx * 374761393 + gy * 668265263;
    n = (n ^ (n >>> 13)) * 1274126177;
    return (n >>> 0) / 4294967296;
  }

  function sampleOverlayData(): typeof state.asciiCells {
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const cells: typeof state.asciiCells = [];
    if (!state.media || w < 1) {
      state.asciiCells = cells;
      return cells;
    }
    // Počas seeku môže readyState klesnúť — nevymaž overlay (inak zmiznú všetky glyfy).
    if (state.media.readyState < 2) {
      if (scrollDriven && state.asciiCells.length > 0) {
        return state.asciiCells;
      }
      state.asciiCells = cells;
      return cells;
    }

    sampleCtx.setTransform(1, 0, 0, 1, 0, 0);
    sampleCtx.clearRect(0, 0, w, h);
    sampleCtx.imageSmoothingEnabled = true;
    sampleCtx.imageSmoothingQuality = "high";
    sampleCtx.filter = "none";
    sampleCtx.drawImage(state.media, 0, 0, w, h);

    const id = sampleCtx.getImageData(0, 0, w, h);
    const data = id.data;

    const cell = parseInt(els.gridSize?.value || "14", 10);
    const density = numInput(els.density, 0.67);
    const bInf = numInput(els.brightnessInfluence, 0.7);
    const eInf = numInput(els.edgeInfluence, 0.42);

    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);

    let gx: number;
    let gy: number;
    let cx: number;
    let cy: number;
    let L: number;
    let Lx: number;
    let Ly: number;
    let edge: number;
    let L_adj: number;
    let darkScore: number;
    let combined: number;
    let thresh: number;
    let placeRoll: number;
    const edgeInfl = numInput(els.edgeInfluence, 0.42);

    const exclusionOn = els.colorExclusionEnabled?.checked ?? false;
    const onlyOn = els.colorOnlyEnabled?.checked ?? false;

    for (gy = 0; gy < rows; gy++) {
      for (gx = 0; gx < cols; gx++) {
        cx = gx * cell + cell * 0.5;
        cy = gy * cell + cell * 0.5;
        if (cx >= w || cy >= h) continue;

        L = luminanceAt(data, w, h, cx, cy);
        Lx = luminanceAt(data, w, h, cx + 1, cy) - luminanceAt(data, w, h, cx - 1, cy);
        Ly = luminanceAt(data, w, h, cx, cy + 1) - luminanceAt(data, w, h, cx, cy - 1);
        edge = Math.sqrt(Lx * Lx + Ly * Ly) / 255;

        L_adj = overlayToneAdjust(L);

        darkScore = 1 - L / 255;
        combined = darkScore * bInf + edge * eInf;
        thresh = 0.1 + (1 - density) * 0.4;
        placeRoll = cellHash(gx, gy);

        if (combined < thresh) continue;
        if (placeRoll > density) continue;

        if (exclusionOn && els.excludeColor) {
          const exRgb = hexToRgb(els.excludeColor.value);
          const px = rgbAt(data, w, h, cx, cy);
          const dist = colorDistance(px.r, px.g, px.b, exRgb.r, exRgb.g, exRgb.b);
          const tol = numInput(els.colorTolerance, 50);
          const soft = numInput(els.colorSoftness, 40);
          const allow = getColorExclusionAllow(dist, tol, soft);
          if (allow <= 0) continue;
          if (allow < 1 && cellHash(gx + 901, gy + 503) > allow) continue;
        }

        if (onlyOn && els.onlyColor) {
          const onlyRgb = hexToRgb(els.onlyColor.value);
          const pxOnly = rgbAt(data, w, h, cx, cy);
          const distOnly = colorDistance(
            pxOnly.r,
            pxOnly.g,
            pxOnly.b,
            onlyRgb.r,
            onlyRgb.g,
            onlyRgb.b
          );
          const tolOnly = numInput(els.onlyColorTolerance, 48);
          const softOnly = numInput(els.onlyColorSoftness, 42);
          const allowOnly = getColorInclusionAllow(distOnly, tolOnly, softOnly);
          if (allowOnly <= 0) continue;
          if (allowOnly < 1 && cellHash(gx + 337, gy + 619) > allowOnly) continue;
        }

        const toneIdx = toneToContinuousGlyphIndex(L_adj, edge, edgeInfl);
        const layers = glyphLayersForToneIndex(toneIdx);

        const toneVis = L_adj / 255;
        const baseOp = 0.88 + 0.12 * (1 - Math.abs(0.5 - toneVis));
        for (let li = 0; li < layers.length; li++) {
          const layer = layers[li]!;
          if (layer.alpha < 0.02) continue;
          cells.push({
            cx,
            cy,
            char: layer.ch,
            localOpacity: baseOp * layer.alpha,
          });
        }
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
    const theme = readTheme();
    const FONT_STACK = readFonts();
    const w = state.displaySize.w;
    const h = state.displaySize.h;
    const opacity = numInput(els.overlayOpacity, 1);
    const scale = numInput(els.charScale, 0.81);
    const cell = parseInt(els.gridSize?.value || "14", 10);
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
    state.media = null;
    const v = els.srcVideo;
    ensureVideoSilent(v);
    v.playsInline = true;
    v.loop = loopVideo;
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
      ensureVideoSilent(v);
      if (scrollDriven) {
        v.pause();
        v.currentTime = 0;
        renderCanvas();
        return;
      }
      renderCanvas();
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
    if (scrollDriven) {
      stopVideoPreviewLoop();
      els.srcVideo.pause();
      return;
    }
    ensureVideoSilent(els.srcVideo);
    startVideoPreviewLoop();
  }
  function onPause(): void {
    stopVideoPreviewLoop();
    renderCanvas();
  }
  function onEnded(): void {
    stopVideoPreviewLoop();
    renderCanvas();
  }

  els.srcVideo.addEventListener("play", onPlay);
  els.srcVideo.addEventListener("pause", onPause);
  els.srcVideo.addEventListener("ended", onEnded);

  function onReduceMotion(): void {
    if (scrollDriven) {
      stopVideoPreviewLoop();
      els.srcVideo.pause();
      renderCanvas();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.srcVideo.pause();
      stopVideoPreviewLoop();
    } else {
      ensureVideoSilent(els.srcVideo);
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
    resizeObserver = new ResizeObserver(scheduleLayoutApply);
    resizeObserver.observe(root);
  }
  window.addEventListener("resize", scheduleLayoutApply);

  layoutTargetW = readLayoutTargetWidth();
  state.displaySize.w = Math.max(320, layoutTargetW);
  state.displaySize.h = Math.round((state.displaySize.w * 9) / 16);

  let scrollSeekToken = 0;

  if (defaultVideoSrc) loadVideo(defaultVideoSrc);
  else renderCanvas();

  function applyScrollProgress(p: number): void {
    if (destroyed || !scrollDriven) return;
    const v = els.srcVideo;
    if (!state.media || v.readyState < 1) return;
    const d = v.duration;
    if (!Number.isFinite(d) || d <= 0) return;
    stopVideoPreviewLoop();
    v.pause();
    const t = clamp(p, 0, 1) * d;

    const renderAfterSeek = (): void => {
      if (destroyed) return;
      renderCanvas();
    };

    if (Math.abs(v.currentTime - t) < 0.001) {
      renderAfterSeek();
      return;
    }

    const token = ++scrollSeekToken;

    const tryRenderIfCurrent = (): void => {
      if (destroyed || token !== scrollSeekToken) return;
      renderCanvas();
    };

    const onSeeked = (): void => {
      tryRenderIfCurrent();
    };
    v.addEventListener("seeked", onSeeked, { once: true });
    v.currentTime = t;

    // Počas rýchleho scrollu sa `seeked` často oneskorí alebo sa starý handler zruší;
    // bez medzirendrov canvas stojí až do konca seekingu. Taháme frame hneď po seeku.
    type VWithRvfc = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: DOMHighResTimeStampCallback) => number;
    };
    const rvfc = (v as VWithRvfc).requestVideoFrameCallback;
    if (typeof rvfc === "function") {
      rvfc.call(v, () => {
        tryRenderIfCurrent();
      });
    }

    requestAnimationFrame(() => {
      tryRenderIfCurrent();
      requestAnimationFrame(tryRenderIfCurrent);
    });

    window.setTimeout(() => {
      if (destroyed || token !== scrollSeekToken) return;
      tryRenderIfCurrent();
    }, 120);
  }

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
    setScrollProgress(p: number) {
      applyScrollProgress(p);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stopVideoPreviewLoop();
      if (layoutDebounceTimer) {
        clearTimeout(layoutDebounceTimer);
        layoutDebounceTimer = null;
      }
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
      if (mqReduce?.removeEventListener) {
        mqReduce.removeEventListener("change", onReduceMotion);
      } else if (mqReduce?.removeListener) {
        mqReduce.removeListener(onReduceMotion);
      }
      state.media = null;
    },
  };
}
