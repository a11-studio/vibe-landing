import { useEffect, useRef } from "react";
import { mountHeroAsciiLayer } from "@/app/components/heroAsciiLayer";
import imgHeroAsciiMobileMask from "@/assets/hero-ascii-mobile-mask.png";
import imgWidget4 from "@/imports/widget4.webp";
import { cn } from "@/app/components/ui/utils";

type HeroAsciiPatternProps = {
  className?: string;
};

/**
 * ASCII wave — vzorkuje `widget4.png` (rovnaký pomer ako hero `image.png`); canvas je inset-0 ako `<img>`
 * a vzorka používa object-cover, takže efekt drží krok s responzívnym pozadím 1:1.
 */
export function HeroAsciiPattern({ className }: HeroAsciiPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    return mountHeroAsciiLayer({
      container,
      canvas,
      imageSrc: imgWidget4,
      mobileImageSrc: imgHeroAsciiMobileMask,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-[2] overflow-hidden [isolation:isolate]",
        className,
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="pointer-events-none block h-full w-full" />
    </div>
  );
}
