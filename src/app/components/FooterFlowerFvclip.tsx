import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/app/components/ui/utils";
import flowerMp4 from "@/assets/flower.mp4";
import { initFvclip } from "@/lib/fvclipInit";

/** Footer / hero dekorácia: ASCII „kvety“ z flower.mp4 (flower.html fvclip). */
export function FooterFlowerFvclip({
  className,
  style,
  variant = "footer",
  /** Hustejšia mriežka + vyššia pravdepodobnosť bodu — lepšia čitateľnosť tvaru na úzkych displejoch. */
  dense = false,
  /** Safari/iOS: druhý canvas na stránke môže byť rozmazaný — oneskoríme init. */
  initDelayMs = 0,
  /** Mobilný footer — vždy renderovať (IO + 0 výška ho skrývali). */
  mobileFooter = false,
}: {
  className?: string;
  style?: CSSProperties;
  variant?: "footer" | "hero";
  dense?: boolean;
  initDelayMs?: number;
  mobileFooter?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Detect touch/mobile once — stable across the component's lifetime.
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  useLayoutEffect(() => {
    if (initDelayMs > 0) return;
    const root = rootRef.current;
    if (!root) return;
    const api = initFvclip(root, {
      videoSrc: flowerMp4,
      loop: true,
      pingPong: !isTouchDevice,
    });
    const raf = requestAnimationFrame(() => api?.relayout());
    return () => {
      cancelAnimationFrame(raf);
      api?.destroy();
    };
  }, [isTouchDevice, initDelayMs]);

  useEffect(() => {
    if (initDelayMs <= 0) return;
    const root = rootRef.current;
    if (!root) return;
    let api: ReturnType<typeof initFvclip> | null = null;
    const timer = window.setTimeout(() => {
      api = initFvclip(root, {
        videoSrc: flowerMp4,
        loop: true,
        pingPong: !isTouchDevice,
      });
      requestAnimationFrame(() => api?.relayout());
    }, initDelayMs);
    return () => {
      window.clearTimeout(timer);
      api?.destroy();
    };
  }, [isTouchDevice, initDelayMs]);

  // On high-DPR mobile screens (iPhone DPR 3) a cap of 2 makes each glyph
  // render at 2/3 native pixel density → blurry dots. Raise cap to 3 on touch
  // devices; keep 2 on desktop where it's already sharp and saves GPU memory.
  const maxDpr = isTouchDevice ? "3" : "2";
  const maxSampleWidth = isTouchDevice ? "960" : undefined;

  const isHero = variant === "hero";

  return (
    <div
      ref={rootRef}
      className={cn("fvclip w-full", isHero && "fvclip--hero h-full", className)}
      data-fvclip
      data-fvclip-max-dpr={maxDpr}
      data-fvclip-max-sample-width={maxSampleWidth}
      data-fvclip-transparent={isHero ? "true" : undefined}
      data-fvclip-visibility={isHero || mobileFooter ? "always" : undefined}
      data-fvclip-fit={isHero ? "cover-x" : undefined}
      data-fvclip-crop-zoom={isHero ? "1.55" : undefined}
      style={
        isHero
          ? ({ ...style, color: "#35180e", ["--fvclip-ink" as string]: "#35180e" } as CSSProperties)
          : style
      }
    >
      <div className={cn("fvclip__inner", isHero && "h-full")} aria-hidden>
        <div className="fvclip__stage">
          <video
            className="fvclip__film"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden
          />
          <canvas className="fvclip__plate fvclip__plate--under" width={16} height={16} />
          <canvas className="fvclip__plate fvclip__plate--glyphs" width={16} height={16} />
        </div>
      </div>

      <div className="fvclip__tuning" hidden>
        <input data-fv="contrast" type="hidden" value={isHero ? "1.72" : "1.74"} />
        <input data-fv="brightness" type="hidden" value={isHero ? "-42" : "-46"} />
        <input data-fv="density" type="hidden" value={isHero ? "0.76" : dense ? "0.88" : "0.67"} />
        <input data-fv="gridSize" type="hidden" value={isHero ? "11" : dense ? "9" : "14"} />
        <input data-fv="overlayOpacity" type="hidden" value="1" />
        <input data-fv="charScale" type="hidden" value={isHero ? "0.79" : dense ? "0.72" : "0.81"} />
        <input data-fv="brightnessInfluence" type="hidden" value={isHero ? "0.72" : dense ? "0.78" : "0.7"} />
        <input data-fv="edgeInfluence" type="hidden" value={isHero ? "0.48" : dense ? "0.48" : "0.42"} />
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
