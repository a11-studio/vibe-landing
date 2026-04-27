import type { CSSProperties } from "react";
import { cn } from "@/app/components/ui/utils";
import { useInView } from "@/app/hooks/useInView";

/** s medzi logickými riadkami; medzi slovami v riadku (jemny stagger). */
const LINE_STAGGER_S = 0.12;
const WORD_STAGGER_S = 0.05;

function splitLineIntoWords(text: string): string[] {
  const t = text.trim();
  if (t.length === 0) {
    return [];
  }
  return t.split(/\s+/).filter(Boolean);
}

type RevealHeadlineProps = {
  as?: "h1" | "h2" | "h3" | "p";
  /** Každý reťazec = jeden logický riadok nadpisu. */
  lines: string[];
  className?: string;
  style?: CSSProperties;
  lineClassNames?: string[];
  /** Trieda na obal s refom — napr. `inline-block shrink-0` v ľinke, `min-w-0 flex-1` pri flex riadku. */
  wrapperClassName?: string;
  /**
   * Ak je zadané, nepoužíva sa interný IntersectionObserver (rodič meria jedným refom
   * napr. nadpis + opis v hero).
   */
  inView?: boolean;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  /**
   * `true` (default): každé slovo vlastná maska, postupné oneskorenie v rámci riadka.
   * `false`: jedna maska na riadok.
   */
  splitWords?: boolean;
  /** `false` = statický text, bez masky a scroll revealu. */
  animated?: boolean;
  /** Pripočíta sa k staggeru slov/riadkov (napr. druhý blok v hero po nadpise). */
  staggerBaseDelayS?: number;
};

export function RevealHeadline({
  as = "h2",
  lines,
  className,
  style,
  lineClassNames,
  wrapperClassName,
  inView: inViewProp,
  once = true,
  threshold = 0.2,
  rootMargin = "0px",
  splitWords = true,
  animated = true,
  staggerBaseDelayS = 0,
}: RevealHeadlineProps) {
  const { ref, inView: internalInView } = useInView<HTMLDivElement>({
    once,
    threshold,
    rootMargin,
    disabled: inViewProp !== undefined || !animated,
  });
  const inView = inViewProp !== undefined ? inViewProp : internalInView;
  const Tag = as;

  if (!animated) {
    return (
      <div className={wrapperClassName}>
        <Tag className={className} style={style}>
          {lines.map((line, i) => (
            <span key={i}>
              {i > 0 ? <br /> : null}
              {lineClassNames?.[i] != null && lineClassNames[i] !== "" ? (
                <span className={lineClassNames[i]}>{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </Tag>
      </div>
    );
  }

  return (
    <div
      ref={inViewProp !== undefined ? undefined : ref}
      className={cn(
        "reveal-headline",
        inView && "reveal-headline--visible",
        !splitWords && "reveal-headline--no-split",
        wrapperClassName
      )}
    >
      <Tag className={className} style={style}>
        {lines.map((line, i) => {
          const words = splitLineIntoWords(line);

          if (!splitWords || words.length <= 1) {
            const delayS = staggerBaseDelayS + i * LINE_STAGGER_S;
            return (
              <span key={i} className="reveal-headline__mask">
                <span
                  className="reveal-headline__line"
                  style={{ animationDelay: `${delayS}s` }}
                >
                  {lineClassNames?.[i] != null && lineClassNames[i] !== "" ? (
                    <span className={lineClassNames[i]}>{line}</span>
                  ) : (
                    line
                  )}
                </span>
              </span>
            );
          }

          return (
            <span key={i} className="reveal-line-group block w-full min-w-0">
              <span
                className={cn("reveal-line-words inline max-w-full", lineClassNames?.[i])}
              >
                {words.map((word, wi) => {
                  const delayS =
                    staggerBaseDelayS + i * LINE_STAGGER_S + wi * WORD_STAGGER_S;
                  return (
                    <span key={wi}>
                      {wi > 0 ? " " : null}
                      <span className="reveal-headline__mask reveal-headline__mask--inline">
                        <span
                          className="reveal-headline__line"
                          style={{ animationDelay: `${delayS}s` }}
                        >
                          {word}
                        </span>
                      </span>
                    </span>
                  );
                })}
              </span>
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
