import { useEffect, useRef } from "react";
import { mountHeroAsciiLayer } from "@/app/components/heroAsciiLayer";
import imgWidget3 from "@/imports/widget3.png";
import { cn } from "@/app/components/ui/utils";

type HeroAsciiPatternProps = {
  className?: string;
};

/**
 * ASCII wave — `widget3.png` má rovnaké rozmery ako hero `image.png`; canvas je inset-0 ako hero `<img>`
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
      imageSrc: imgWidget3,
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
