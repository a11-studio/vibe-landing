import type { CSSProperties } from "react";
import svgPaths from "@/imports/Container/svg-9yp879bgs7";
import { LayoutContainer } from "@/app/components/layout";
import { cn } from "@/app/components/ui/utils";
import { useInView } from "@/app/hooks/useInView";

// Each logo is a plain inline SVG with viewBox + responsive height via CSS.
// height is controlled by the parent cell — logo SVGs use height="100%" width="auto".

// ─── eWorld ──────────────────────────────────────────────────────────────────
function LogoWorld() {
  return (
    <svg
      viewBox="0 0 128 32"
      fill="none"
      style={{ height: 32, width: "auto", display: "block" }}
    >
      <path d={svgPaths.p134ed00} fill="black" />
      <path d={svgPaths.p1da62e00} fill="black" />
      <path d={svgPaths.p251066c0} fill="black" />
      <path d={svgPaths.p1f94cf80} fill="black" />
      <path d={svgPaths.pd2ae380}  fill="black" />
      <path d={svgPaths.p31e4ba00} fill="black" />
    </svg>
  );
}

// ─── Realio ───────────────────────────────────────────────────────────────────
function LogoRealio() {
  return (
    <svg
      viewBox="0 0 109.72 31.53"
      fill="none"
      style={{ height: 32, width: "auto", display: "block" }}
    >
      <path d={svgPaths.p189c5800} fill="black" />
      <path clipRule="evenodd" d={svgPaths.p2b3f9f80} fill="black" fillRule="evenodd" />
      <path clipRule="evenodd" d={svgPaths.p38eec300} fill="black" fillRule="evenodd" />
    </svg>
  );
}

// ─── Silencio ─────────────────────────────────────────────────────────────────
function LogoSilencio() {
  return (
    <svg
      viewBox="0 0 137.333 32"
      fill="none"
      style={{ height: 32, width: "auto", display: "block" }}
    >
      <path d={svgPaths.p1e05bc00} fill="black" />
      <path d={svgPaths.p19cea7f2} fill="black" />
      <path d={svgPaths.p30414500} fill="black" />
      <path d={svgPaths.p3954eaf0} fill="black" />
      <path d={svgPaths.p3adf3d00} fill="black" />
      <path d={svgPaths.p29fb8900} fill="black" />
      <path d={svgPaths.p10b25600} fill="black" />
      <path d={svgPaths.p2783ab00} fill="black" />
      <path d={svgPaths.p1b015c80} fill="black" />
      <path d={svgPaths.p2c82dd00} fill="black" />
      <path d={svgPaths.p3178ac00} fill="black" />
    </svg>
  );
}

// ─── WingRiders ───────────────────────────────────────────────────────────────
function LogoWingRiders() {
  return (
    <svg
      viewBox="0 0 154 41.574"
      fill="none"
      style={{ height: 40, width: "auto", display: "block" }}
    >
      <path d={svgPaths.p346a50f0} fill="black" />
      <path d={svgPaths.p157ea800} fill="black" />
      <path d={svgPaths.p1fea7a40} fill="black" />
      <path d={svgPaths.p3f245c00} fill="black" />
      <path d={svgPaths.p3a8a1380} fill="black" />
      <path d={svgPaths.p1969cbc0} fill="black" />
      <path d={svgPaths.p3bfdc580} fill="black" />
      <path d={svgPaths.pcf57980}  fill="black" />
      <path d={svgPaths.p348d7300} fill="black" />
      <path d={svgPaths.p93cc900}  fill="black" />
      <path d={svgPaths.p2248de80} fill="black" />
    </svg>
  );
}

// ─── Cardinal ─────────────────────────────────────────────────────────────────
function LogoCardinal() {
  return (
    <svg
      viewBox="0 0 207.473 32"
      fill="none"
      style={{ height: 32, width: "auto", display: "block" }}
    >
      <path clipRule="evenodd" d={svgPaths.p1346bdc0} fill="black" fillRule="evenodd" />
      <path d={svgPaths.p1a98ef00} fill="black" />
      <path d={svgPaths.pa9bda00}  fill="black" />
      <path d={svgPaths.pe3c2b00}  fill="black" />
      <path d={svgPaths.p19696d00} fill="black" />
      <path d={svgPaths.p18ebf220} fill="black" />
      <path d={svgPaths.p15aa83f0} fill="black" />
      <path d={svgPaths.p2ad26b80} fill="black" />
      <path d={svgPaths.p1ba8a100} fill="black" />
    </svg>
  );
}

// ─── AudiencePlus ─────────────────────────────────────────────────────────────
// Composed from text (0,0 → 152×27.58) + icon (157.92,1.43 → 70.61×30.57)
function LogoAudiencePlus() {
  return (
    <svg
      viewBox="0 0 228.533 32"
      fill="none"
      style={{ height: 32, width: "auto", display: "block" }}
    >
      {/* text group — original viewBox 0 0 152.188 27.5845 placed at 0,0 */}
      <svg x="0" y="2.2" width="152.189" height="27.584" viewBox="0 0 152.188 27.5845">
        <path d={svgPaths.p3e256a00} fill="black" />
        <path d={svgPaths.p2b7f7680} fill="black" />
        <path d={svgPaths.p37412800} fill="black" />
        <path d={svgPaths.p1dcd0400} fill="black" />
        <path d={svgPaths.p1250cb80} fill="black" />
        <path d={svgPaths.pad60300}  fill="black" />
        <path d={svgPaths.p6dad480}  fill="black" />
        <path d={svgPaths.pf92b580}  fill="black" />
      </svg>
      {/* icon group — original viewBox 0 0 70.6133 30.5676 placed at x=157.92 y=1.43 */}
      <svg x="157.92" y="1.43" width="70.613" height="30.568" viewBox="0 0 70.6133 30.5676">
        <path d={svgPaths.p12e84280} fill="black" />
      </svg>
    </svg>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
const logos = [
  { id: "world",        el: <LogoWorld /> },
  { id: "realio",       el: <LogoRealio /> },
  { id: "silencio",     el: <LogoSilencio /> },
  { id: "wingriders",   el: <LogoWingRiders /> },
  { id: "cardinal",     el: <LogoCardinal /> },
  { id: "audienceplus", el: <LogoAudiencePlus /> },
];

/** Oneskořenie štartu animácie medzi susednými logami (v ms). */
const LOGO_STAGGER_BETWEEN_MS = 80;

export function LogosSection() {
  const { ref: sectionRef, inView } = useInView<HTMLElement>({
    once: true,
    threshold: 0.22,
  });

  return (
    <section
      ref={sectionRef}
      id="clients"
      data-scroll-section
      className="relative w-full bg-white"
      style={{ paddingTop: 72, paddingBottom: 88 }}
    >
      <LayoutContainer className="flex flex-col items-center gap-12">
        {/* Subtitle */}
        <p
          style={{
            fontWeight: 400,
            fontSize: "clamp(14px, 1.4vw, 18px)",
            color: "#b0b0b0",
            textAlign: "center",
          }}
        >
          We have deep experience across fintech, web3, and SaaS.
        </p>

        {/* Logos grid:  3-col on mobile · 6-col on md+ (max šírka pasu ako predtým) */}
        <div className="w-full max-w-[1400px] grid grid-cols-3 md:grid-cols-6 gap-y-12 gap-x-6 sm:gap-x-8 md:gap-y-0 md:gap-x-10 lg:gap-x-14">
          {logos.map(({ id, el }, i) => (
            <div
              key={id}
              className={cn("client-logo px-1 sm:px-2", inView && "client-logo--visible")}
              style={
                {
                  borderRight: "1px solid transparent",
                  "--logo-delay": `${i * LOGO_STAGGER_BETWEEN_MS}ms`,
                } as CSSProperties
              }
            >
              {el}
            </div>
          ))}
        </div>
      </LayoutContainer>
    </section>
  );
}