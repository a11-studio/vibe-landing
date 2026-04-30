import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/app/components/ui/utils";
import flowerMp4 from "@/assets/flower.mp4";
import { initFvclip } from "@/lib/fvclipInit";

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function viewportHeight(): number {
  return window.visualViewport?.height ?? window.innerHeight;
}

/**
 * Horný okraj elementu v dokumente (funguje aj pri `position: sticky`, kde
 * getBoundingClientRect + scrollY klame počas „nalepenia“).
 */
function layoutTopInDocument(el: HTMLElement): number {
  let top = 0;
  let n: HTMLElement | null = el;
  while (n) {
    top += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * Časť animácie z normálneho scrollu (zvyšok po zaseknutí dole = koliesko, bez tailu v DOM).
 */
const FOOTER_FLOWER_SCROLL_SHARE = 0.82;
const FOOTER_FLOWER_WHEEL_SENSITIVITY = 2800;
/** 0…1 — ako rýchlo smooth progress dobehne k cieľu (vyššie = menej „glide“). */
const FOOTER_FLOWER_PROGRESS_SMOOTH = 0.2;
const FOOTER_FLOWER_PROGRESS_EPS = 0.001;

function readFooterScrollRaw(footer: HTMLElement): {
  scrollY: number;
  maxScroll: number;
  raw: number;
} {
  const vh = viewportHeight();
  const scrollY = window.scrollY;
  const scrollRoot = document.scrollingElement ?? document.documentElement;
  const maxScroll = Math.max(0, scrollRoot.scrollHeight - vh);
  const topDoc = layoutTopInDocument(footer);
  const yEnter = topDoc - vh;
  const span = maxScroll - yEnter;
  let raw = 0;
  if (span > 8) raw = clamp((scrollY - yEnter) / span, 0, 1);
  else raw = scrollY >= maxScroll - 0.5 ? 1 : 0;
  return { scrollY, maxScroll, raw };
}

function combinedFooterFlowerProgress(footer: HTMLElement, wheelAccum01: number): number {
  const { raw } = readFooterScrollRaw(footer);
  const scrollPart = raw * FOOTER_FLOWER_SCROLL_SHARE;
  const wheelPart = wheelAccum01 * (1 - FOOTER_FLOWER_SCROLL_SHARE);
  return clamp(scrollPart + wheelPart, 0, 1);
}

/** Footer dekorácia: ASCII „kvety“ z flower.mp4; čas videa viazaný na scroll. */
export function FooterFlowerFvclip({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const footer = root.closest("footer");
    if (!footer) return;

    const api = initFvclip(root, {
      videoSrc: flowerMp4,
      scrollDriven: true,
      loop: false,
    });
    if (!api) return;

    const video = root.querySelector<HTMLVideoElement>(".fvclip__film");

    /** 0…1 – dokončenie animácie kolieskom keď je stránka na spodku (žiadny tail v layoute). */
    let wheelAccum01 = 0;

    let targetProgress = 0;
    let smoothProgress = 0;
    let smoothRaf = 0;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

    const pumpSmoothProgress = () => {
      smoothRaf = 0;
      if (reduceMotion) {
        smoothProgress = targetProgress;
        api.setScrollProgress(smoothProgress);
        return;
      }
      smoothProgress += (targetProgress - smoothProgress) * FOOTER_FLOWER_PROGRESS_SMOOTH;
      if (Math.abs(targetProgress - smoothProgress) < FOOTER_FLOWER_PROGRESS_EPS) {
        smoothProgress = targetProgress;
      }
      api.setScrollProgress(smoothProgress);
      if (Math.abs(targetProgress - smoothProgress) > FOOTER_FLOWER_PROGRESS_EPS) {
        smoothRaf = requestAnimationFrame(pumpSmoothProgress);
      }
    };

    const ensureSmoothProgress = () => {
      if (reduceMotion) {
        smoothProgress = targetProgress;
        api.setScrollProgress(smoothProgress);
        return;
      }
      if (!smoothRaf) smoothRaf = requestAnimationFrame(pumpSmoothProgress);
    };

    let rafId = 0;
    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const { scrollY, maxScroll } = readFooterScrollRaw(footer);
        if (scrollY < maxScroll - 8) wheelAccum01 = 0;
        targetProgress = combinedFooterFlowerProgress(footer, wheelAccum01);
        ensureSmoothProgress();
      });
    };

    const wheelDeltaToPixels = (e: WheelEvent): number => {
      const vh = viewportHeight();
      let d = e.deltaY;
      if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) d *= 16;
      else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) d *= vh;
      return d;
    };

    const onWheelCapture = (e: WheelEvent) => {
      const { scrollY, maxScroll } = readFooterScrollRaw(footer);
      const atBottom = scrollY >= maxScroll - 2;
      if (!atBottom) return;

      const p = combinedFooterFlowerProgress(footer, wheelAccum01);
      const dy = wheelDeltaToPixels(e);

      if (dy > 0 && p < 0.999) {
        e.preventDefault();
        wheelAccum01 = clamp(wheelAccum01 + dy / FOOTER_FLOWER_WHEEL_SENSITIVITY, 0, 1);
        targetProgress = combinedFooterFlowerProgress(footer, wheelAccum01);
        ensureSmoothProgress();
        return;
      }
      if (dy < 0 && wheelAccum01 > 0) {
        e.preventDefault();
        wheelAccum01 = clamp(wheelAccum01 + dy / FOOTER_FLOWER_WHEEL_SENSITIVITY, 0, 1);
        targetProgress = combinedFooterFlowerProgress(footer, wheelAccum01);
        ensureSmoothProgress();
      }
    };

    video?.addEventListener("loadeddata", onScrollOrResize, { once: true });

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("wheel", onWheelCapture, { passive: false, capture: true });
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onScrollOrResize);
    vv?.addEventListener("scroll", onScrollOrResize);
    targetProgress = combinedFooterFlowerProgress(footer, wheelAccum01);
    smoothProgress = targetProgress;
    api.setScrollProgress(smoothProgress);
    onScrollOrResize();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("wheel", onWheelCapture, { capture: true });
      vv?.removeEventListener("resize", onScrollOrResize);
      vv?.removeEventListener("scroll", onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
      if (smoothRaf) cancelAnimationFrame(smoothRaf);
      api.destroy();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("fvclip h-full w-full", className)}
      data-fvclip
      data-fvclip-max-dpr="2"
      style={style}
    >
      <div className="fvclip__inner h-full" aria-hidden>
        <div className="fvclip__stage">
          <video
            className="fvclip__film"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            autoPlay={false}
            aria-hidden
          />
          <canvas className="fvclip__plate fvclip__plate--under" width={16} height={16} />
          <canvas className="fvclip__plate fvclip__plate--glyphs" width={16} height={16} />
        </div>
      </div>

      <div className="fvclip__tuning" hidden>
        <input data-fv="contrast" type="hidden" value="1.74" />
        <input data-fv="brightness" type="hidden" value="-46" />
        <input data-fv="density" type="hidden" value="0.67" />
        <input data-fv="gridSize" type="hidden" value="14" />
        <input data-fv="overlayOpacity" type="hidden" value="1" />
        <input data-fv="charScale" type="hidden" value="0.81" />
        <input data-fv="brightnessInfluence" type="hidden" value="0.7" />
        <input data-fv="edgeInfluence" type="hidden" value="0.42" />
        <input data-fv="colorExclusionEnabled" type="checkbox" defaultChecked />
        <input data-fv="excludeColor" type="color" defaultValue="#5dade2" />
        <input data-fv="colorTolerance" type="hidden" value="50" />
        <input data-fv="colorSoftness" type="hidden" value="40" />
        <input data-fv="colorOnlyEnabled" type="checkbox" />
        <input data-fv="onlyColor" type="color" defaultValue="#c9a87c" />
        <input data-fv="onlyColorTolerance" type="hidden" value="48" />
        <input data-fv="onlyColorSoftness" type="hidden" value="42" />
      </div>
    </div>
  );
}
