import { useId, useLayoutEffect, useMemo, useRef } from "react";

const DEFAULT_O_THRESHOLD = 900;

type OSlot = {
  el: SVGPathElement;
  origD: string;
  oCenterX: number;
  oCenterY: number;
  mode: "o" | "colon";
};

function pickRandomUniqueIndices(total: number, count: number): number[] {
  const arr = Array.from({ length: total }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j]!;
    arr[j] = t!;
  }
  return arr.slice(0, Math.min(count, total));
}

export type AnimatedSvgPatternProps = {
  svgRaw: string;
  /** Ak je v SVG clipPath s týmto id, nahradí sa unikátnym (viac inštancií v DOM). */
  clipPathIdFrom?: string;
  /** Cesta dlhšia ako prah = tvar „O“; kratšie = šablóny pre „:“ */
  oPathDLengthThreshold?: number;
  tickMs?: number;
  swapIntervalMs?: number;
  className?: string;
  /** Modifikátor layoutu: footer = centrovať, zarovnať k spodku */
  variant?: "hero" | "footer";
  preserveAspectRatio?: string;
};

/**
 * Inline SVG s twinkling fill-opacity a občasnou výmenou O ↔ : na bunkách O.
 */
export function AnimatedSvgPattern({
  svgRaw,
  clipPathIdFrom,
  oPathDLengthThreshold = DEFAULT_O_THRESHOLD,
  tickMs = 400,
  swapIntervalMs = 2400,
  className = "",
  variant = "hero",
  preserveAspectRatio = "xMaxYMid meet",
}: AnimatedSvgPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId().replace(/:/g, "");
  const uniqueClipId = `asp-${reactId}`;

  const svgMarkup = useMemo(() => {
    if (!clipPathIdFrom) return svgRaw;
    return svgRaw.replace(
      new RegExp(clipPathIdFrom, "g"),
      uniqueClipId,
    );
  }, [clipPathIdFrom, svgRaw, uniqueClipId]);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    root.innerHTML = svgMarkup;
    const svg = root.querySelector("svg");
    if (!svg) return;

    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("preserveAspectRatio", preserveAspectRatio);
    svg.classList.add("svg-pattern-anim-svg");

    const paths = Array.from(svg.querySelectorAll("path")) as SVGPathElement[];

    const colonTemplates = paths
      .map((p) => p.getAttribute("d") || "")
      .filter(
        (d) => d.length > 0 && d.length <= oPathDLengthThreshold,
      );

    const oSlots: OSlot[] = [];
    for (const p of paths) {
      const d = p.getAttribute("d") || "";
      if (d.length <= oPathDLengthThreshold) continue;
      const bb = p.getBBox();
      oSlots.push({
        el: p,
        origD: d,
        oCenterX: bb.x + bb.width / 2,
        oCenterY: bb.y + bb.height / 2,
        mode: "o",
      });
    }

    const showO = (s: OSlot) => {
      s.el.setAttribute("d", s.origD);
      s.el.removeAttribute("transform");
      s.mode = "o";
    };

    const showColon = (s: OSlot) => {
      if (colonTemplates.length === 0) return;
      if (s.mode === "colon") return;
      const t =
        colonTemplates[Math.floor(Math.random() * colonTemplates.length)]!;
      s.el.setAttribute("d", t);
      s.el.removeAttribute("transform");
      const bb = s.el.getBBox();
      const cx = bb.x + bb.width / 2;
      const cy = bb.y + bb.height / 2;
      s.el.setAttribute(
        "transform",
        `translate(${s.oCenterX - cx} ${s.oCenterY - cy})`,
      );
      s.mode = "colon";
    };

    const applyStatic = () => {
      oSlots.forEach(showO);
      paths.forEach((p) => {
        p.style.transition = "none";
        p.setAttribute("fill-opacity", "1");
      });
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let swapIntervalId: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      const n = paths.length;
      const dimN = 14 + Math.floor(Math.random() * 20);
      const upN = 14 + Math.floor(Math.random() * 20);
      const dimIdx = pickRandomUniqueIndices(n, dimN);
      const upIdx = pickRandomUniqueIndices(n, upN);

      for (const i of dimIdx) {
        paths[i]!.setAttribute(
          "fill-opacity",
          String(0.06 + Math.random() * 0.32),
        );
      }
      for (const i of upIdx) {
        paths[i]!.setAttribute(
          "fill-opacity",
          String(0.85 + Math.random() * 0.15),
        );
      }
    };

    const swapTick = () => {
      if (colonTemplates.length === 0) return;
      const asO = oSlots.filter((s) => s.mode === "o");
      const asColon = oSlots.filter((s) => s.mode === "colon");
      if (asO.length > 0) {
        const n = 1 + Math.floor(Math.random() * Math.min(3, asO.length));
        for (const i of pickRandomUniqueIndices(asO.length, n)) {
          showColon(asO[i]!);
        }
      }
      if (asColon.length > 0) {
        const m = 1 + Math.floor(Math.random() * Math.min(2, asColon.length));
        for (const j of pickRandomUniqueIndices(asColon.length, m)) {
          showO(asColon[j]!);
        }
      }
    };

    const start = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
      if (swapIntervalId !== undefined) {
        window.clearInterval(swapIntervalId);
        swapIntervalId = undefined;
      }
      if (mq.matches) {
        applyStatic();
        return;
      }
      paths.forEach((p) => {
        p.style.transition =
          "fill-opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
        p.setAttribute("fill-opacity", "1");
      });
      tick();
      intervalId = window.setInterval(tick, tickMs);
      swapIntervalId = window.setInterval(swapTick, swapIntervalMs);
    };

    start();
    mq.addEventListener("change", start);

    return () => {
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (swapIntervalId !== undefined) window.clearInterval(swapIntervalId);
      mq.removeEventListener("change", start);
    };
  }, [
    oPathDLengthThreshold,
    preserveAspectRatio,
    swapIntervalMs,
    svgMarkup,
    tickMs,
  ]);

  const rootClass =
    variant === "footer"
      ? "svg-pattern-anim-root svg-pattern-anim-root--footer"
      : "svg-pattern-anim-root";

  return (
    <div
      ref={containerRef}
      className={`${rootClass} min-h-0 ${className}`.trim()}
      aria-hidden
    />
  );
}
