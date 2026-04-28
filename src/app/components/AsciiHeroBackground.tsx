import { useEffect, useRef } from "react";

const FONT_FAMILY = '"Roboto Mono", Menlo, Monaco, Consolas, ui-monospace, monospace';

type AsciiParams = {
  contrast: number;
  brightness: number;
  density: number;
  gridSize: number;
  overlayOpacity: number;
  charScale: number;
  brightnessInfluence: number;
  edgeInfluence: number;
  colorExclusionEnabled: boolean;
  excludeColor: string;
  colorTolerance: number;
  colorSoftness: number;
  colorOnlyEnabled: boolean;
  onlyColor: string;
  onlyColorTolerance: number;
  onlyColorSoftness: number;
};

const DEFAULT_PARAMS: AsciiParams = {
  contrast: 0.96,
  brightness: -100,
  density: 0.67,
  gridSize: 16,
  overlayOpacity: 1,
  charScale: 0.81,
  brightnessInfluence: 0.7,
  edgeInfluence: 0.42,
  colorExclusionEnabled: true,
  excludeColor: "#5ab163",
  colorTolerance: 50,
  colorSoftness: 40,
  colorOnlyEnabled: true,
  onlyColor: "#c4ad3e",
  onlyColorTolerance: 78,
  onlyColorSoftness: 85,
};

type AsciiCell = { cx: number; cy: number; char: string; localOpacity: number };

const CONTRAST_LIVE_AMP = 0.2;
const CONTRAST_LIVE_PERIOD_MS = 6000;
const BRIGHTNESS_LIVE_AMP = 10;
const BRIGHTNESS_LIVE_PERIOD_MS = 4500;
const DENSITY_LIVE_AMP = 0.05;
const DENSITY_LIVE_PERIOD_MS = 6000;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
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

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
  if (!m) return { r: 90, g: 177, b: 99 };
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

function overlayToneAdjust(L: number, p: AsciiParams) {
  const c = p.contrast;
  const b = p.brightness;
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

type DisplayState = {
  image: HTMLImageElement | null;
  displaySize: { w: number; h: number };
  dpr: number;
  asciiCells: AsciiCell[];
};

function getBackingDpr() {
  return Math.min(typeof window !== "undefined" && window.devicePixelRatio ? window.devicePixelRatio : 1, 3);
}

/** ASCII hero podľa widget.html — base fotka + overlay znakov; živé jemné pulzovanie kontrastu/jasu/hustoty. */
export function AsciiHeroBackground({ imageSrc }: { imageSrc: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasBaseRef = useRef<HTMLCanvasElement>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef<AsciiParams>({ ...DEFAULT_PARAMS });
  const stateRef = useRef<DisplayState>({
    image: null,
    displaySize: { w: 800, h: 450 },
    dpr: 1,
    asciiCells: [],
  });
  const liveAnimRef = useRef({
    active: false,
    baseContrast: DEFAULT_PARAMS.contrast,
    baseBrightness: DEFAULT_PARAMS.brightness,
    baseDensity: DEFAULT_PARAMS.density,
    rafId: 0,
    startMs: 0,
  });
  const layoutDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    paramsRef.current = { ...DEFAULT_PARAMS };
    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    if (!sampleCtx) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ctxBase: CanvasRenderingContext2D | null = null;
    let ctxOverlay: CanvasRenderingContext2D | null = null;

    const syncContexts = () => {
      ctxBase = canvasBaseRef.current?.getContext("2d", { alpha: false }) ?? null;
      ctxOverlay = canvasOverlayRef.current?.getContext("2d", { alpha: true }) ?? null;
    };

    const readContainerSize = () => {
      const el = containerRef.current;
      const cw = Math.max(1, Math.floor(el?.clientWidth ?? document.documentElement.clientWidth));
      const ch = Math.max(1, Math.floor(el?.clientHeight ?? window.innerHeight));
      return { cw, ch };
    };

    const fitCanvasToImage = () => {
      const img = stateRef.current.image;
      if (!img || img.naturalWidth < 1) return;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const { cw, ch } = readContainerSize();
      const rImg = iw / ih;
      const rBox = cw / ch;
      let w: number;
      let h: number;
      if (rBox > rImg) {
        w = cw;
        h = Math.max(1, Math.ceil(cw / rImg));
      } else {
        h = ch;
        w = Math.max(1, Math.ceil(ch * rImg));
      }
      stateRef.current.displaySize = { w, h };
      sampleCanvas.width = w;
      sampleCanvas.height = h;
    };

    const configurePreviewCanvases = () => {
      syncContexts();
      if (!ctxBase || !ctxOverlay) return;
      const w = stateRef.current.displaySize.w;
      const h = stateRef.current.displaySize.h;
      const dpr = getBackingDpr();
      stateRef.current.dpr = dpr;
      const bw = Math.max(1, Math.round(w * dpr));
      const bh = Math.max(1, Math.round(h * dpr));
      const els = [canvasBaseRef.current, canvasOverlayRef.current];
      for (const el of els) {
        if (!el) continue;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.width = bw;
        el.height = bh;
      }
      syncContexts();
      if (!ctxBase || !ctxOverlay) return;
      ctxBase.setTransform(1, 0, 0, 1, 0, 0);
      ctxOverlay.setTransform(1, 0, 0, 1, 0, 0);
      ctxBase.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxOverlay.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxBase.imageSmoothingEnabled = true;
      ctxBase.imageSmoothingQuality = "high";
      ctxOverlay.imageSmoothingEnabled = true;
    };

    const drawPlaceholder = (context: CanvasRenderingContext2D) => {
      const w = stateRef.current.displaySize.w;
      const h = stateRef.current.displaySize.h;
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      context.filter = "none";
      context.imageSmoothingEnabled = true;
      context.clearRect(0, 0, w, h);
      context.fillStyle = "#101014";
      context.fillRect(0, 0, w, h);
      context.fillStyle = "#4d4a54";
      context.font = `400 13px ${FONT_FAMILY}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("Loading…", w / 2, h / 2);
    };

    const drawBaseImage = (context: CanvasRenderingContext2D) => {
      const w = stateRef.current.displaySize.w;
      const h = stateRef.current.displaySize.h;
      const im = stateRef.current.image;
      if (!im || w < 1) return;
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = 1;
      context.filter = "none";
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.clearRect(0, 0, w, h);
      context.drawImage(im, 0, 0, w, h);
    };

    const sampleOverlayData = (): AsciiCell[] => {
      const p = paramsRef.current;
      const w = stateRef.current.displaySize.w;
      const h = stateRef.current.displaySize.h;
      const cells: AsciiCell[] = [];
      const im = stateRef.current.image;
      if (!im || w < 1) {
        stateRef.current.asciiCells = cells;
        return cells;
      }

      sampleCtx.setTransform(1, 0, 0, 1, 0, 0);
      sampleCtx.clearRect(0, 0, w, h);
      sampleCtx.imageSmoothingEnabled = true;
      sampleCtx.imageSmoothingQuality = "high";
      sampleCtx.filter = "none";
      sampleCtx.drawImage(im, 0, 0, w, h);

      const id = sampleCtx.getImageData(0, 0, w, h);
      const data = id.data;

      const cell = p.gridSize;
      const density = p.density;
      const bInf = p.brightnessInfluence;
      const eInf = p.edgeInfluence;
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const cx = gx * cell + cell * 0.5;
          const cy = gy * cell + cell * 0.5;
          if (cx >= w || cy >= h) continue;

          const L = luminanceAt(data, w, h, cx, cy);
          const Lx = luminanceAt(data, w, h, cx + 1, cy) - luminanceAt(data, w, h, cx - 1, cy);
          const Ly = luminanceAt(data, w, h, cx, cy + 1) - luminanceAt(data, w, h, cx, cy - 1);
          const edge = Math.sqrt(Lx * Lx + Ly * Ly) / 255;

          const L_adj = overlayToneAdjust(L, p);

          const darkScore = 1 - L / 255;
          const combined = darkScore * bInf + edge * eInf;
          const thresh = 0.1 + (1 - density) * 0.4;
          const placeRoll = cellHash(gx, gy);

          if (combined < thresh) continue;
          if (placeRoll > density) continue;

          if (p.colorExclusionEnabled) {
            const exRgb = hexToRgb(p.excludeColor);
            const px = rgbAt(data, w, h, cx, cy);
            const dist = colorDistance(px.r, px.g, px.b, exRgb.r, exRgb.g, exRgb.b);
            const allow = getColorExclusionAllow(dist, p.colorTolerance, p.colorSoftness);
            if (allow <= 0) continue;
            if (allow < 1 && cellHash(gx + 901, gy + 503) > allow) continue;
          }

          if (p.colorOnlyEnabled) {
            const onlyRgb = hexToRgb(p.onlyColor);
            const pxOnly = rgbAt(data, w, h, cx, cy);
            const distOnly = colorDistance(
              pxOnly.r,
              pxOnly.g,
              pxOnly.b,
              onlyRgb.r,
              onlyRgb.g,
              onlyRgb.b,
            );
            const allowOnly = getColorInclusionAllow(distOnly, p.onlyColorTolerance, p.onlyColorSoftness);
            if (allowOnly <= 0) continue;
            if (allowOnly < 1 && cellHash(gx + 337, gy + 619) > allowOnly) continue;
          }

          const ch = mapCellToGlyph(L_adj, edge, p.edgeInfluence);

          const toneVis = L_adj / 255;
          cells.push({
            cx,
            cy,
            char: ch,
            localOpacity: 0.88 + 0.12 * (1 - Math.abs(0.5 - toneVis)),
          });
        }
      }

      stateRef.current.asciiCells = cells;
      return cells;
    };

    const snapGlyphPosition = (x: number, y: number) => ({
      x: Math.round(x),
      y: Math.round(y),
    });

    const renderOverlayText = (context: CanvasRenderingContext2D, cells: AsciiCell[]) => {
      const p = paramsRef.current;
      const w = stateRef.current.displaySize.w;
      const h = stateRef.current.displaySize.h;
      const opacity = p.overlayOpacity;
      const scale = p.charScale;
      const cell = p.gridSize;
      const fontSize = Math.max(7, cell * scale * 1.02);

      context.save();
      context.clearRect(0, 0, w, h);
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `500 ${fontSize}px ${FONT_FAMILY}`;

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i]!;
        const pt = snapGlyphPosition(c.cx, c.cy);
        context.globalAlpha = opacity * c.localOpacity;
        context.fillText(c.char, pt.x, pt.y);
      }
      context.restore();
    };

    const renderCanvas = () => {
      syncContexts();
      if (!ctxBase || !ctxOverlay) return;
      configurePreviewCanvases();
      syncContexts();
      if (!ctxBase || !ctxOverlay) return;
      if (!stateRef.current.image) {
        drawPlaceholder(ctxBase);
        ctxOverlay.clearRect(0, 0, stateRef.current.displaySize.w, stateRef.current.displaySize.h);
        return;
      }
      drawBaseImage(ctxBase);
      const cells = sampleOverlayData();
      renderOverlayText(ctxOverlay, cells);
    };

    const scheduleLayoutApply = () => {
      if (layoutDebounceRef.current) clearTimeout(layoutDebounceRef.current);
      layoutDebounceRef.current = setTimeout(() => {
        layoutDebounceRef.current = null;
        if (stateRef.current.image) {
          fitCanvasToImage();
          renderCanvas();
        }
      }, 80);
    };

    const cancelLiveAnimRaf = () => {
      if (liveAnimRef.current.rafId) {
        cancelAnimationFrame(liveAnimRef.current.rafId);
        liveAnimRef.current.rafId = 0;
      }
    };

    const tickLiveAnim = () => {
      if (!liveAnimRef.current.active || prefersReducedMotion) return;
      const t = performance.now() - liveAnimRef.current.startMs;
      const sC = Math.sin((2 * Math.PI * t) / CONTRAST_LIVE_PERIOD_MS);
      const sB = Math.sin((2 * Math.PI * t) / BRIGHTNESS_LIVE_PERIOD_MS);
      const sD = Math.sin((2 * Math.PI * t) / DENSITY_LIVE_PERIOD_MS);

      const p = paramsRef.current;
      const rawC = liveAnimRef.current.baseContrast + CONTRAST_LIVE_AMP * sC;
      p.contrast = Math.round(clamp(rawC, 0.5, 2.4) / 0.02) * 0.02;

      const rawB = liveAnimRef.current.baseBrightness + BRIGHTNESS_LIVE_AMP * sB;
      p.brightness = Math.round(clamp(rawB, -100, 100));

      const rawD = liveAnimRef.current.baseDensity + DENSITY_LIVE_AMP * sD;
      p.density = Math.round(clamp(rawD, 0.02, 0.95) / 0.01) * 0.01;

      if (stateRef.current.image) renderCanvas();
      liveAnimRef.current.rafId = requestAnimationFrame(tickLiveAnim);
    };

    const startLiveAnim = () => {
      if (prefersReducedMotion) return;
      cancelLiveAnimRaf();
      const p = paramsRef.current;
      liveAnimRef.current.baseContrast = p.contrast;
      liveAnimRef.current.baseBrightness = p.brightness;
      liveAnimRef.current.baseDensity = p.density;
      liveAnimRef.current.startMs = performance.now();
      liveAnimRef.current.active = true;
      liveAnimRef.current.rafId = requestAnimationFrame(tickLiveAnim);
    };

    const loadHeaderImage = (src: string) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        stateRef.current.image = img;
        fitCanvasToImage();
        renderCanvas();
      };
      img.onerror = () => {
        stateRef.current.image = null;
        const { cw } = readContainerSize();
        stateRef.current.displaySize = {
          w: Math.max(320, cw),
          h: Math.round((Math.max(320, cw) * 9) / 16),
        };
        renderCanvas();
      };
      img.src = src;
    };

    const ro =
      containerRef.current && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => scheduleLayoutApply())
        : null;
    if (containerRef.current && ro) ro.observe(containerRef.current);

    window.addEventListener("resize", scheduleLayoutApply);

    loadHeaderImage(imageSrc);
    /* prvý layout – kontajner môže mať ešte 0 výšku */
    requestAnimationFrame(() => {
      if (stateRef.current.image) {
        fitCanvasToImage();
        renderCanvas();
      }
    });
    startLiveAnim();

    return () => {
      cancelLiveAnimRaf();
      liveAnimRef.current.active = false;
      if (layoutDebounceRef.current) clearTimeout(layoutDebounceRef.current);
      ro?.disconnect();
      window.removeEventListener("resize", scheduleLayoutApply);
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0a0a0c]"
      aria-hidden
    >
      <div className="absolute left-1/2 top-1/2 w-max max-w-none -translate-x-1/2 -translate-y-1/2 [&_canvas]:block">
        <div className="relative">
          <canvas ref={canvasBaseRef} className="bg-[#0a0a0c]" />
          <canvas
            ref={canvasOverlayRef}
            className="pointer-events-none absolute left-0 top-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
