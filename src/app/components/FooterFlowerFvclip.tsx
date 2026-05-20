import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
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
}: {
  className?: string;
  style?: CSSProperties;
  variant?: "footer" | "hero";
  dense?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Detect touch/mobile once — stable across the component's lifetime.
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // On touch/mobile devices ping-pong scrubs `currentTime` in every rAF
    // tick — Safari mobile can't decode frames fast enough, causing freeze and
    // stutter. Use native loop there; ping-pong stays on desktop.
    const api = initFvclip(root, {
      videoSrc: flowerMp4,
      loop: true,
      pingPong: !isTouchDevice,
    });
    return () => api?.destroy();
  }, [isTouchDevice]);

  // On high-DPR mobile screens (iPhone DPR 3) a cap of 2 makes each glyph
  // render at 2/3 native pixel density → blurry dots. Raise cap to 3 on touch
  // devices; keep 2 on desktop where it's already sharp and saves GPU memory.
  const maxDpr = isTouchDevice ? "3" : "2";

  const isHero = variant === "hero";

  return (
    <div
      ref={rootRef}
      className={cn("fvclip h-full w-full", isHero && "fvclip--hero", className)}
      data-fvclip
      data-fvclip-max-dpr={maxDpr}
      data-fvclip-transparent={isHero ? "true" : undefined}
      data-fvclip-visibility={isHero ? "always" : undefined}
      data-fvclip-fit={isHero ? "cover-x" : undefined}
      data-fvclip-crop-zoom={isHero ? "1.55" : undefined}
      style={
        isHero
          ? ({ ...style, color: "#35180e", ["--fvclip-ink" as string]: "#35180e" } as CSSProperties)
          : style
      }
    >
      <div className="fvclip__inner h-full" aria-hidden>
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
