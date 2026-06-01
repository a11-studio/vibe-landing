import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { LayoutContainer } from "@/app/components/layout";
import { useInView } from "@/app/hooks/useInView";
import { cn } from "@/app/components/ui/utils";

const MIN_OPACITY = 0.3;
const MAX_OPACITY = 1;
/** Zrýchlené vyplnenie — scroll progress sa „stlačí“ do kratšieho pásma. */
const FILL_PROGRESS_BOOST = 1.85;
/** Prvých ~15 % scrollu cez sekciu ešte bez fillu (už vidíš hornú časť textu). */
const SCROLL_FILL_START = 0.15;

const MANIFESTO_BLOCKS = [
  {
    lines: [
      ["The", "old", "workflow", "was", "fragmented:"],
      ["designers", "designed,", "developers", "rebuilt,", "and"],
      ["quality", "disappeared", "somewhere", "in", "the", "middle."],
    ],
  },
  {
    lines: [
      ["We", "believe", "modern", "product", "teams", "should"],
      ["work", "differently."],
    ],
    /** „work“ + „differently.“ — jeden krok vyplnenia, na druhom riadku vždy spolu. */
    closingTailWordCount: 2,
  },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function scrollToFillProgress(scroll: number) {
  return clamp((scroll - SCROLL_FILL_START) / (1 - SCROLL_FILL_START), 0, 1);
}

function wordOpacity(progress: number, index: number, total: number) {
  const boosted = clamp(scrollToFillProgress(progress) * FILL_PROGRESS_BOOST, 0, 1);
  if (total <= 1) {
    return MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * boosted;
  }
  const local = boosted * total - index;
  const eased = clamp(local, 0, 1);
  return MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * eased;
}

function ManifestoWord({
  word,
  opacity,
  trailingSpace,
}: {
  word: string;
  opacity: number;
  trailingSpace?: boolean;
}) {
  return (
    <span
      className="transition-opacity duration-100 motion-reduce:transition-none"
      style={{ opacity }}
    >
      {word}
      {trailingSpace ? "\u00a0" : null}
    </span>
  );
}

const TEXT_STYLE = {
  fontSize: "clamp(26px, 2.08vw, 40px)",
  letterSpacing: "-0.03em",
  lineHeight: 1.3,
} as const;

/**
 * Tmavá scroll sekcia — text sa pri scrolli postupne „vyplní“ z ~30 % na 100 % opacity.
 * Figma 668:88.
 */
export function ServicesManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { inView } = useInView({
    elementRef: sectionRef,
    threshold: 0.12,
    once: false,
  });
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0);

  const totalWords = useMemo(() => {
    let count = 0;
    MANIFESTO_BLOCKS.forEach((block) => {
      block.lines.forEach((line) => {
        count += line.length;
      });
      if ("closingTailWordCount" in block && block.closingTailWordCount > 1) {
        count -= block.closingTailWordCount - 1;
      }
    });
    return count;
  }, []);

  const globalIndexByKey = useMemo(() => {
    const map = new Map<string, number>();
    let globalIndex = 0;
    MANIFESTO_BLOCKS.forEach((block, blockIndex) => {
      block.lines.forEach((line, lineIndex) => {
        const isLastLine = lineIndex === block.lines.length - 1;
        const tailCount =
          "closingTailWordCount" in block && isLastLine ? block.closingTailWordCount : 0;
        const tailStart = tailCount > 0 ? line.length - tailCount : -1;

        line.forEach((_word, wordIndex) => {
          if (tailCount > 0 && wordIndex >= tailStart) {
            map.set(`${blockIndex}-${lineIndex}-${wordIndex}`, globalIndex);
            if (wordIndex === tailStart + tailCount - 1) globalIndex++;
            return;
          }
          map.set(`${blockIndex}-${lineIndex}-${wordIndex}`, globalIndex++);
        });
      });
    });
    return map;
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    /** Fill až keď je sekcia výrazne v obraze (nie hneď pri vstupe). */
    offset: ["start 0.62", "end 0.22"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reducedMotion) return;
    if (!inView) {
      setProgress(value >= 1 ? 1 : 0);
      return;
    }
    setProgress(scrollToFillProgress(value));
  });

  useLayoutEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }
    if (inView) {
      setProgress(scrollToFillProgress(scrollYProgress.get()));
    }
  }, [reducedMotion, inView, scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      data-scroll-section
      className="relative w-full overflow-x-clip bg-[#1c1310] text-white"
      aria-label="Our approach to product teams"
    >
      <div className="flex w-full min-h-svh items-center">
        <LayoutContainer
          className="w-full"
          style={{
            paddingTop: "clamp(48px, 8vw, 96px)",
            paddingBottom: "clamp(48px, 8vw, 96px)",
          }}
        >
          <div className="services-manifesto__wrapper font-medium text-left">
            {MANIFESTO_BLOCKS.map((block, blockIndex) => (
              <div key={blockIndex} className={cn(blockIndex > 0 && "mt-[1.3em]")}>
                {block.lines.map((line, lineIndex) => {
                  const isLastLine = lineIndex === block.lines.length - 1;
                  const tailCount =
                    "closingTailWordCount" in block && isLastLine
                      ? block.closingTailWordCount
                      : 0;
                  const tailStart = tailCount > 0 ? line.length - tailCount : -1;
                  const leadWords = tailStart > 0 ? line.slice(0, tailStart) : line;
                  const tailWords = tailStart > 0 ? line.slice(tailStart) : [];

                  return (
                    <p
                      key={lineIndex}
                      className={cn(
                        "m-0 text-left text-pretty",
                        tailCount === 0 && "[overflow-wrap:anywhere]",
                      )}
                      style={TEXT_STYLE}
                    >
                      {leadWords.map((word, wordIndex) => {
                        const globalIndex =
                          globalIndexByKey.get(`${blockIndex}-${lineIndex}-${wordIndex}`) ?? 0;
                        return (
                          <ManifestoWord
                            key={wordIndex}
                            word={word}
                            opacity={wordOpacity(progress, globalIndex, totalWords)}
                            trailingSpace
                          />
                        );
                      })}
                      {tailWords.length > 0 ? (
                        <span className="whitespace-nowrap">
                          {tailWords.map((word, offset) => {
                            const wordIndex = tailStart + offset;
                            const globalIndex =
                              globalIndexByKey.get(`${blockIndex}-${lineIndex}-${wordIndex}`) ??
                              0;
                            return (
                              <ManifestoWord
                                key={wordIndex}
                                word={word}
                                opacity={wordOpacity(progress, globalIndex, totalWords)}
                                trailingSpace={offset < tailWords.length - 1}
                              />
                            );
                          })}
                        </span>
                      ) : null}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </LayoutContainer>
      </div>
    </section>
  );
}
