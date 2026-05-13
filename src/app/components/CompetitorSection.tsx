import type { CSSProperties, ReactNode } from "react";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import imgHeroTexture from "@/imports/image.webp";
import svgPaths from "@/imports/Footer/svg-39tshfia8v";
import { LayoutContainer } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import { useInView } from "@/app/hooks/useInView";

/** Pozadie sekcie — Figma 622:25440 */
const SECTION_BG = "#27140d";

const H_RULE_INTRO_DELAY_MS = 240;
const H_RULE_STAGGER_MS = 85;
const H_RULE_DRAW_MS = 700;

function VibeLogoWhite() {
  return (
    <svg width="51" height="24" viewBox="0 0 50.3951 24" fill="none" aria-hidden>
      <path d={svgPaths.p2641c400} fill="white" />
      <path d={svgPaths.p11b87d00} fill="white" />
      <path d={svgPaths.p2bd5b200} fill="white" />
      <path d={svgPaths.pdd8c00} fill="white" />
    </svg>
  );
}

/** Rám okolo stĺpca Vibe — ten istý obrázok ako hero; jemná rotácia textúry (theme.css). */
function VibeColumnFrame({ children }: { children: ReactNode }) {
  return (
    <div className="competitor-vibe-frame h-full min-h-full">
      <div
        className="competitor-vibe-frame__orbit"
        style={{ backgroundImage: `url(${imgHeroTexture})` }}
        aria-hidden
      />
      <div
        className="relative z-[1] m-[2px] flex min-h-0 flex-1 flex-col rounded-[12px]"
        style={{ backgroundColor: SECTION_BG }}
      >
        {children}
      </div>
    </div>
  );
}

function CheckMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={9}
      viewBox="0 0 12 9"
      fill="none"
      className="inline-block shrink-0"
      aria-hidden
    >
      <path
        d="M0 4.35795L1.10795 3.22727L3.98295 6.0625L10.0682 0L11.1932 1.13068L3.98295 8.3125L0 4.35795Z"
        fill="#9BBA36"
      />
    </svg>
  );
}

/**
 * Jedna souvislá horizontálna čiara — po `reveal` sa „nakreslí“ zľava doprava.
 * `.competitor-h-rule__bar` — neskôr možno rozšíriť o motion/react.
 */
function CompetitorHRule({
  lineIndex,
  reveal,
  reducedMotion,
}: {
  lineIndex: number;
  reveal: boolean;
  reducedMotion: boolean;
}) {
  const delayMs = reducedMotion ? 0 : H_RULE_INTRO_DELAY_MS + lineIndex * H_RULE_STAGGER_MS;
  const durationMs = reducedMotion ? 0 : H_RULE_DRAW_MS;

  return (
    <div
      className="competitor-h-rule relative z-[15] h-px w-full overflow-hidden"
      aria-hidden
    >
      <div
        className="competitor-h-rule__bar h-full w-full origin-left bg-white/10"
        style={{
          transform: reveal ? "scaleX(1)" : "scaleX(0)",
          transitionProperty: "transform",
          transitionDuration: `${durationMs}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: `${delayMs}ms`,
        }}
      />
    </div>
  );
}

export type CompetitorRow = {
  label: string;
  vibe: string;
  agency: string;
};

const COMPETITOR_ROWS: CompetitorRow[] = [
  {
    label: "Seniority",
    vibe: "Senior only",
    agency: "Mixed with juniors",
  },
  {
    label: "Flexibility",
    vibe: "Per project",
    agency: "Fixed package",
  },
  {
    label: "Speed to output",
    vibe: "Weeks (coded)",
    agency: "Months (decks)",
  },
  {
    label: "Cost structure",
    vibe: "Pay for need",
    agency: "Overhead + bloat",
  },
];

const cellLabel: CSSProperties = {
  fontWeight: 400,
  fontSize: "clamp(12px, 3.4vw, 15px)",
  color: "rgba(255, 255, 255, 0.5)",
  letterSpacing: "-0.45px",
  lineHeight: "normal",
};

const cellValue: CSSProperties = {
  fontWeight: 500,
  fontSize: "clamp(12px, 3.4vw, 15px)",
  color: "#ffffff",
  letterSpacing: "-0.45px",
  lineHeight: 1.15,
};

/**
 * Figma 622:25478 — porovnanie: jeden stĺpec Vibe (rám), souvislé horizontálne čiary,
 * po vstupe do viewportu kreslenie zľava doprava so staggerom.
 */
export function CompetitorSection() {
  const tableShellRef = useRef<HTMLDivElement>(null);
  const { inView } = useInView({
    threshold: 0.32,
    once: true,
    elementRef: tableShellRef,
  });
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const lineReveal = reducedMotion || inView;

  return (
    <section
      id="competitor"
      data-scroll-section
      className="relative min-h-svh w-full text-white"
      style={{ backgroundColor: SECTION_BG }}
    >
      <LayoutContainer
        className="max-md:px-3"
        style={{
          paddingTop: "clamp(72px, 9vw, 140px)",
          paddingBottom: "clamp(72px, 9vw, 140px)",
        }}
      >
        <header className="mx-auto min-w-0 max-w-[920px] text-center">
          <p
            className="m-0 px-[clamp(2px,0.25vw,6px)] uppercase"
            style={{
              fontWeight: 500,
              fontSize: "clamp(12px, 0.95vw, 18px)",
              color: "var(--logos-intro)",
              letterSpacing: "0.12em",
              lineHeight: "normal",
              marginBottom: "clamp(10px, 1.2vw, 18px)",
            }}
          >
            Competitor advantage
          </p>
          <RevealHeadline
            lines={["So why companies choose us?"]}
            wrapperClassName="competitor-section-headline"
            className="m-0 text-center text-white"
            style={{
              fontWeight: 500,
              fontSize: "clamp(28px, 3.2vw, 48px)",
              letterSpacing: "-3px",
              lineHeight: "normal",
              color: "#ffffff",
              margin: 0,
            }}
          />
        </header>

        <div className="mx-auto mt-[clamp(40px,6vw,72px)] max-w-[1220px] overflow-x-auto">
          <div ref={tableShellRef} className="relative w-full min-w-0">
            {/* Rám Vibe: stĺpce 5–7 (3/12 šírky), vertikálne cez hlavičku + dátové riadky; čiary z-[15] sú navrchu. */}
            <div
              className="pointer-events-none absolute left-0 top-0 z-[1] w-[calc(100%*7/12)] md:left-[calc(100%*4/12)] md:w-[calc(100%*3/12)]"
              style={{ bottom: 0 }}
            >
              <div className="pointer-events-auto h-full">
                <VibeColumnFrame>
                  <div className="flex h-full min-h-full flex-col">
                    <div className="flex shrink-0 justify-center px-4 pb-8 pt-8 md:px-5 md:pb-10 md:pt-10">
                      <span className="inline-flex" aria-label="Vibe">
                        <VibeLogoWhite />
                      </span>
                    </div>
                    {COMPETITOR_ROWS.map((row) => (
                      <div
                        key={row.label}
                      className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-1 py-6 md:flex-row md:gap-3.5 md:px-4 md:py-10"
                      >
                        <span style={cellValue}>{row.vibe}</span>
                        <CheckMark />
                      </div>
                    ))}
                  </div>
                </VibeColumnFrame>
              </div>
            </div>

            <div className="relative z-[2] flex flex-col">
              <div className="grid grid-cols-12">
                <div className="col-span-2 min-w-0 max-md:hidden" aria-hidden />
                <div className="col-span-2 min-w-0 max-md:hidden" aria-hidden />
                <div
                  className="col-span-3 min-w-0 max-md:col-span-7"
                  style={{ minHeight: "clamp(96px, 12vw, 112px)" }}
                  aria-hidden
                />
                <div
                    className="col-span-3 flex min-w-0 max-w-full items-end justify-center pb-6 text-center font-medium max-md:col-span-5 md:pb-10"
                  style={{
                    fontSize: "clamp(18px, 5vw, 24px)",
                    color: "#ffffff",
                    letterSpacing: "-0.72px",
                    lineHeight: "normal",
                  }}
                >
                  Agency
                </div>
                <div className="col-span-2 min-w-0 max-md:hidden" aria-hidden />
              </div>

              <div className="grid grid-cols-12">
                <div className="col-span-2 max-md:hidden" aria-hidden />
                <div className="col-span-8 max-md:col-span-12">
                  <CompetitorHRule
                    lineIndex={0}
                    reveal={lineReveal}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div className="col-span-2 max-md:hidden" aria-hidden />
              </div>

              {COMPETITOR_ROWS.map((row, rowIndex) => (
                <Fragment key={row.label}>
                  <div
                    className="competitor-table__row grid grid-cols-12 items-stretch"
                    data-competitor-row-index={rowIndex}
                  >
                    <div className="col-span-2 min-w-0 max-md:hidden" aria-hidden />
                    <div
                      className="col-span-2 hidden min-w-0 max-w-full items-center break-words py-8 md:flex md:py-10"
                      style={cellLabel}
                    >
                      {row.label}
                    </div>
                    <div
                      className="col-span-3 min-w-0 py-6 max-md:col-span-7 md:py-10"
                      aria-hidden
                    />
                    <div
                      className="col-span-3 flex min-w-0 max-w-full items-center justify-center px-1 py-6 text-center max-md:col-span-5 max-md:break-words md:col-span-3 md:px-0 md:py-10"
                      style={cellValue}
                    >
                      {row.agency}
                    </div>
                    <div className="col-span-2 min-w-0 max-md:hidden" aria-hidden />
                  </div>
                  {rowIndex < COMPETITOR_ROWS.length - 1 ? (
                    <div className="grid grid-cols-12">
                      <div className="col-span-2 max-md:hidden" aria-hidden />
                      <div className="col-span-8 max-md:col-span-12">
                        <CompetitorHRule
                          lineIndex={rowIndex + 1}
                          reveal={lineReveal}
                          reducedMotion={reducedMotion}
                        />
                      </div>
                      <div className="col-span-2 max-md:hidden" aria-hidden />
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </LayoutContainer>
    </section>
  );
}
