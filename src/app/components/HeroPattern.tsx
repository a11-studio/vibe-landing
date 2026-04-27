import { AnimatedSvgPattern } from "@/app/components/AnimatedSvgPattern";
import patternSvgRaw from "@/imports/Pattern.svg?raw";

type HeroPatternProps = {
  /** Interval medzi zmenami náhodných pathov (ms) — iná hodnota = iná fáza vs. druhý pás */
  tickMs?: number;
  className?: string;
};

/**
 * Hero dekoratívny pattern (Pattern.svg).
 */
export function HeroPattern({ tickMs = 400, className = "" }: HeroPatternProps) {
  return (
    <AnimatedSvgPattern
      svgRaw={patternSvgRaw}
      clipPathIdFrom="clip0_601_20893"
      tickMs={tickMs}
      variant="hero"
      preserveAspectRatio="xMaxYMid meet"
      className={`h-full w-auto max-w-full ${className}`.trim()}
    />
  );
}
