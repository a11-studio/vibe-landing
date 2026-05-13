import { useEffect, useLayoutEffect, useRef, useState } from "react";
import imgImage2Mobile2 from "@/imports/MainContainer-2/d3cc047f1a595cb3f0387d0955e6730e6c665758.webp";
import imgIconImage     from "@/imports/MainContainer-2/c6085f260fd9c0ba4788039a74aabfe2a7c5edce.webp";
import imgProfileImage  from "@/imports/MainContainer-2/99e69596bfd47f32feaf8f5fa9b959e58b0a5201.webp";
import imgProfileImage1 from "@/imports/MainContainer-2/7cdfc9cdb7fbe3d70aa2bee8d0424356fd95b0d6.webp";
import imgProfileImage2 from "@/imports/MainContainer-2/99cf73b51a4c59b3d9120e0891819b22ba7a2ac9.webp";
import imgProfileImage3 from "@/imports/MainContainer-2/791ff24325ad83485e0f9e7f0ccd0f68b2c07f3d.png";
import { LayoutContainer } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import { useInView } from "@/app/hooks/useInView";

const STAT_COUNT_MS = 1500;
/** Kreslenie vertikálnej čiary po vstupe bannera do viewportu + pauza. */
const STAT_LINE_DRAW_MS = 950;
/** Počítadlo — spustí sa skôr (menší priesečník, bez pauzy). */
const STAT_COUNT_INVIEW_THRESHOLD = 0.22;
/** Čiara — až keď je banner výraznejšie vo viewporte + STAT_LINE_START_DELAY_MS. */
const STAT_BANNER_INVIEW_THRESHOLD = 0.58;
/** Po tom, čo je banner „v strede záujmu“, ešte krátka pauza, aby bolo kreslenie čiary viditeľné. */
const STAT_LINE_START_DELAY_MS = 650;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

type TeamStatFormat = "millions" | "plus" | "days";

/** Vertikálna čiara — po `reveal` sa „nakreslí“ zhora nadol (výška 0 % → 100 %). */
function TeamStatAccentLine({
  reveal,
  reducedMotion,
}: {
  reveal: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="pointer-events-none relative hidden w-px shrink-0 self-stretch overflow-hidden md:block"
      style={{ minHeight: 1 }}
      aria-hidden
    >
      <div
        className="absolute left-0 top-0 w-full bg-[rgba(1,52,57,0.2)]"
        style={{
          height: reveal ? "100%" : "0%",
          transition: reducedMotion
            ? "none"
            : `height ${STAT_LINE_DRAW_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </div>
  );
}

function TeamStatMobileTopLine({
  reveal,
  reducedMotion,
}: {
  reveal: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="pointer-events-none h-px w-full overflow-hidden md:hidden"
      aria-hidden
    >
      <div
        className="h-full w-full origin-left bg-[rgba(1,52,57,0.2)]"
        style={{
          transform: reveal ? "scaleX(1)" : "scaleX(0)",
          transition: reducedMotion
            ? "none"
            : `transform ${STAT_LINE_DRAW_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </div>
  );
}

function TeamStatCell({
  start,
  end,
  label,
  format,
  accentLine,
  durationMs = STAT_COUNT_MS,
}: {
  start: number;
  end: number;
  label: string;
  format: TeamStatFormat;
  /** Figma: 1. riadok čiara zľava, 2. z prava, 3. zľava. */
  accentLine?: "left" | "right";
  durationMs?: number;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const { inView: countInView } = useInView({
    threshold: STAT_COUNT_INVIEW_THRESHOLD,
    once: true,
    elementRef: cellRef,
  });
  const { inView: lineInView } = useInView({
    threshold: STAT_BANNER_INVIEW_THRESHOLD,
    once: true,
    elementRef: cellRef,
  });
  const [value, setValue] = useState(start);
  const [lineReveal, setLineReveal] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!lineInView) return;

    if (reducedMotion) {
      setLineReveal(true);
      return;
    }

    const id = window.setTimeout(() => setLineReveal(true), STAT_LINE_START_DELAY_MS);
    return () => clearTimeout(id);
  }, [lineInView, reducedMotion]);

  useEffect(() => {
    if (!countInView) return;

    if (reducedMotion) {
      setValue(end);
      return;
    }

    let cancelled = false;
    const t0 = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const p = Math.min(1, (now - t0) / durationMs);
      const eased = easeOutCubic(p);
      const next = Math.round(start + (end - start) * eased);
      setValue(next);
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [countInView, reducedMotion, start, end, durationMs]);

  const headline =
    format === "millions" ? (
      <>
        +{value}
        &nbsp;M
      </>
    ) : format === "plus" ? (
      <>+{value}</>
    ) : (
      <>
        {value} days
      </>
    );

  return (
    <div
      ref={cellRef}
      className="relative flex h-full min-h-0 w-full items-stretch"
      style={{ gap: "clamp(16px, 2.5vw, 40px)" }}
    >
      {accentLine === "left" ? (
        <TeamStatAccentLine reveal={lineReveal} reducedMotion={reducedMotion} />
      ) : null}
      <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center px-2 py-8 text-center md:px-4 md:py-10">
        <p
          className="m-0"
          style={{
            fontWeight: 500,
            fontSize: "clamp(40px, 4vw, 68px)",
            color: "#013439",
            letterSpacing: "-3px",
            lineHeight: "normal",
          }}
        >
          {headline}
        </p>
        <p
          className="m-0 mt-2 max-w-[430px]"
          style={{
            fontWeight: 500,
            fontSize: 16,
            color: "rgba(39, 20, 13, 0.5)",
            letterSpacing: "-0.48px",
            lineHeight: "24px",
          }}
        >
          {label}
        </p>
      </div>
      {accentLine ? (
        <div className="absolute left-0 right-0 top-0 -translate-y-8 md:hidden">
          <TeamStatMobileTopLine reveal={lineReveal} reducedMotion={reducedMotion} />
        </div>
      ) : null}
      {accentLine === "right" ? (
        <TeamStatAccentLine reveal={lineReveal} reducedMotion={reducedMotion} />
      ) : null}
    </div>
  );
}

// ─── Individual photo cards ───────────────────────────────────────────────────
// Each card reproduces the Figma ImageContainer at fixed 446×490 output size.
// We wrap in an aspect-ratio div so it scales responsively.

function CardMartin() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      {/* base room layer */}
      <div className="absolute inset-0">
        <img src={imgImage2Mobile2} alt="" className="w-full h-full object-cover pointer-events-none" loading="lazy" />
      </div>
      {/* portrait on top */}
      <div className="absolute inset-0">
        <img src={imgIconImage} alt="Martin Mroc" className="w-full h-full object-cover pointer-events-none" loading="lazy" />
      </div>
    </div>
  );
}

function CardGabriel() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      <img src={imgProfileImage} alt="Gabriel Hudoba" className="w-full h-full object-cover pointer-events-none" loading="lazy" />
    </div>
  );
}

function CardMichal() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      <img src={imgProfileImage1} alt="Michal Prekop" className="w-full h-full object-cover pointer-events-none" loading="lazy" />
    </div>
  );
}

function CardMichaela() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      {/*
       * Michaela's layer in Figma is 1046px wide with mask-position [301px, 18px]:
       * the visible window starts at x=301 of the 1046px-wide image.
       * We reproduce this by anchoring to the right so the correct portion shows.
       */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imgProfileImage2}
          alt="Michaela Fias"
          className="absolute h-full pointer-events-none"
          style={{ width: "auto", right: 0, top: 0, objectFit: "cover" }}
          loading="lazy"
        />
      </div>
    </div>
  );
}

function CardPatrik() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      <img src={imgProfileImage3} alt="Patrik Smejkal" className="w-full h-full object-cover pointer-events-none" loading="lazy" />
    </div>
  );
}

// ─── Name + role label ────────────────────────────────────────────────────────
function Label({ name, role, compact }: { name: string; role: string; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 mt-2 md:mt-3">
      <p
        style={{
          fontWeight: 500,
          color: "#013439",
          letterSpacing: "-0.72px",
          lineHeight: "normal",
          ...(compact
            ? { fontSize: "clamp(14px, 3.6vw, 24px)" }
            : { fontSize: 24 }),
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontWeight: 500,
          color: "rgba(1,52,57,0.5)",
          letterSpacing: "-0.48px",
          lineHeight: "normal",
          ...(compact
            ? { fontSize: "clamp(11px, 2.4vw, 16px)" }
            : { fontSize: 16 }),
        }}
      >
        {role}
      </p>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function AboutSection() {
  return (
    <section
      id="team"
      data-scroll-section
      className="relative w-full"
      style={{ backgroundColor: "#EFEBE9" }}
    >
      <LayoutContainer
        style={{
          paddingTop: "clamp(64px, 6.8vw, 131px)",
          paddingBottom: "clamp(80px, 8.5vw, 163px)",
        }}
      >
        <div className="mb-10 md:mb-14">
          <p
            className="m-0 max-w-[min(100%,42rem)]"
            style={{
              fontWeight: 500,
              fontSize: "clamp(12px, 0.95vw, 18px)",
              color: "var(--logos-intro)",
              letterSpacing: "0.12em",
              lineHeight: "normal",
              textTransform: "uppercase",
            }}
          >
            Meet our team
          </p>
        </div>

        <RevealHeadline
          wrapperClassName="team-section-headline"
          lines={["Team is assembled from this bench", "senior people from companies that ship."]}
          style={{
            fontWeight: 500,
            fontSize: "clamp(28px, 2.5vw, 48px)",
            color: "#013439",
            letterSpacing: "-0.063em",
            lineHeight: "normal",
            margin: 0,
            marginBottom: "clamp(48px, 7vw, 134px)",
          }}
        />

        {/*
         * Desktop grid — Figma 621:25430:
         *   Row 1:  [+20]    [Martin]   [Gabriel]
         *   Row 2:  [Michal]  [Michaela] [+50]
         *   Row 3:  [14 days] [Patrik]   [empty]
         */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto auto auto",
            columnGap: "clamp(12px, 2.5vw, 48px)",
            rowGap: "clamp(32px, 5vw, 80px)",
          }}
        >
          <div className="h-full min-h-0" style={{ gridColumn: 1, gridRow: 1 }}>
            <TeamStatCell
              format="plus"
              start={10}
              end={20}
              label="Senior people in network"
              accentLine="left"
            />
          </div>
          <div className="h-full min-h-0" style={{ gridColumn: 2, gridRow: 1 }}>
            <CardMartin />
            <Label name="Martin Mroc" role="CEO & UX/UI Designer" />
          </div>
          <div className="h-full min-h-0" style={{ gridColumn: 3, gridRow: 1 }}>
            <CardGabriel />
            <Label name="Gabriel Hudoba" role="Consultant & UX/UI Designer" />
          </div>

          <div className="h-full min-h-0" style={{ gridColumn: 1, gridRow: 2 }}>
            <CardMichal />
            <Label name="Michal Prekop" role="3D Artist" />
          </div>
          <div className="h-full min-h-0" style={{ gridColumn: 2, gridRow: 2 }}>
            <CardMichaela />
            <Label name="Michaela Fias" role="Brand Designer" />
          </div>
          <div className="h-full min-h-0" style={{ gridColumn: 3, gridRow: 2 }}>
            <TeamStatCell
              format="plus"
              start={10}
              end={50}
              label="Successful projects shipped"
              accentLine="right"
            />
          </div>

          <div className="h-full min-h-0" style={{ gridColumn: 1, gridRow: 3 }}>
            <TeamStatCell
              format="days"
              start={30}
              end={14}
              label="From idea to testable experience"
              accentLine="left"
            />
          </div>
          <div className="h-full min-h-0" style={{ gridColumn: 2, gridRow: 3 }}>
            <CardPatrik />
            <Label name="Patrik Smejkal" role="Product Manager" />
          </div>
          <div className="h-full min-h-0" style={{ gridColumn: 3, gridRow: 3 }} aria-hidden />
        </div>

        {/* Mobile — stats full width, then 2-col people grid (reading order ≈ Figma) */}
        <div className="flex flex-col gap-10 md:hidden">
          <TeamStatCell
            format="plus"
            start={10}
            end={20}
            label="Senior people in network"
            accentLine="left"
          />
          <div className="grid grid-cols-2 gap-x-[clamp(8px,2.5vw,20px)] gap-y-10">
            <div className="min-w-0">
              <CardMartin />
              <Label name="Martin Mroc" role="CEO & UX/UI Designer" compact />
            </div>
            <div className="min-w-0">
              <CardGabriel />
              <Label name="Gabriel Hudoba" role="Consultant & UX/UI Designer" compact />
            </div>
            <div className="min-w-0">
              <CardMichal />
              <Label name="Michal Prekop" role="3D Artist" compact />
            </div>
            <div className="min-w-0">
              <CardMichaela />
              <Label name="Michaela Fias" role="Brand Designer" compact />
            </div>
            <div className="min-w-0">
              <CardPatrik />
              <Label name="Patrik Smejkal" role="Product Manager" compact />
            </div>
          </div>
        </div>
      </LayoutContainer>
    </section>
  );
}
