import type { CSSProperties } from "react";
import { LayoutContainer, LayoutGrid } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import { ArrowIcon } from "@/app/components/shared/ArrowIcon";

// ─── Process row ──────────────────────────────────────────────────────────────
interface RowProps {
  index: number;
  label: string;
}

function ProcessRow({ index, label }: RowProps) {
  const num = String(index).padStart(2, "0");
  const typeStyle: CSSProperties = {
    fontWeight: 500,
    fontSize: "clamp(20px, 2.5vw, 48px)",
    letterSpacing: "-0.03em",
    lineHeight: "normal",
  };

  return (
    <div
      className="group cursor-default"
      style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div
        className="flex items-center"
        style={{
          paddingTop: "clamp(20px, 2.6vw, 50px)",
          paddingBottom: "clamp(20px, 2.6vw, 50px)",
          gap: "clamp(32px, 4vw, 80px)",
        }}
      >
        {/*
          Track: [šipka | číslo] (ľavá / pravá polovica). Default -translate-x-1/2 → vo výreze je
          pravá polovica = číslo. Hover translate-x-0 → track sa posunie doprava, číslo odíde doprava,
          zľava vjde šipka. Kladný +50% pri [číslo|šipka] by zobrazilo prázdno — to bol bug.
        */}
        <div
          className="w-[clamp(56px,4.5vw,76px)] shrink-0 overflow-hidden"
        >
          <div
            className="flex w-[200%] -translate-x-1/2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:translate-x-0 motion-reduce:duration-0"
          >
            <span
              className="flex w-1/2 items-center justify-end pl-1"
              style={typeStyle}
              aria-hidden
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center">
                <ArrowIcon color="#80999C" strokeWidth={3} size={28} />
              </span>
            </span>
            <span
              className="flex w-1/2 items-center justify-end pr-0.5 text-right text-white"
              style={typeStyle}
            >
              {num}
            </span>
          </div>
        </div>

        {/* Label */}
        <span
          style={{
            fontWeight: 500,
            fontSize: "clamp(20px, 2.5vw, 48px)",
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: "normal",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
const STEPS = [
  "Validate product ideas",
  "Improve core product flows",
  "Build new product experiences",
  "Support product teams",
];

export function Process2Section() {
  return (
    <section
      id="process2"
      data-scroll-section
      className="relative w-full"
      style={{ backgroundColor: "#013439" }}
    >
      <LayoutContainer
        style={{
          paddingTop: "clamp(64px, 8.7vw, 167px)",
          paddingBottom: "clamp(64px, 8.7vw, 167px)",
        }}
      >
        <LayoutGrid className="items-start gap-y-12 md:gap-y-0">
          {/* Ľavý nadpis a pravý zoznam v jednom riadku (md+), horizontálne zarovnané hore */}
          <div className="col-span-12 md:col-span-6">
            <RevealHeadline
              lines={["From idea to real", "product decisions."]}
              style={{
                fontWeight: 500,
                fontSize: "clamp(32px, 3.54vw, 68px)",
                color: "white",
                letterSpacing: "-0.044em",
                lineHeight: "normal",
                margin: 0,
              }}
            />
          </div>

          <div className="col-span-12 w-full md:col-start-7 md:col-span-6">
            {STEPS.map((label, i) => (
              <ProcessRow key={i} index={i + 1} label={label} />
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
        </LayoutGrid>
      </LayoutContainer>
    </section>
  );
}
