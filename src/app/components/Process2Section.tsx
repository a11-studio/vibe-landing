import { useState } from "react";
import { ArrowIcon } from "@/app/components/shared/ArrowIcon";

// ─── Process row ──────────────────────────────────────────────────────────────
interface RowProps {
  index: number;
  label: string;
  isFirst?: boolean;
}

function ProcessRow({ index, label, isFirst = false }: RowProps) {
  const [hovered, setHovered] = useState(false);
  const num = String(index).padStart(2, "0");

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
        cursor: "default",
        transition: "background 0.2s ease",
      }}
    >
      <div
        className="flex items-center"
        style={{
          paddingTop: "clamp(20px, 2.6vw, 50px)",
          paddingBottom: "clamp(20px, 2.6vw, 50px)",
          gap: "clamp(32px, 4vw, 80px)",
        }}
      >
        {/* Number / Arrow col */}
        <div
          style={{
            width: "clamp(36px, 3.5vw, 52px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flexShrink: 0,
          }}
        >
          {hovered ? (
            <div style={{ transition: "opacity 0.15s ease", opacity: 1 }}>
              <ArrowIcon color="#80999C" strokeWidth={3} />
            </div>
          ) : (
            <span
              style={{
                fontWeight: 500,
                fontSize: "clamp(20px, 2.5vw, 48px)",
                color: "white",
                letterSpacing: "-0.03em",
                lineHeight: "normal",
                transition: "opacity 0.15s ease",
                opacity: hovered ? 0 : 1,
              }}
            >
              {num}
            </span>
          )}
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
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: 1920,
          paddingTop: "clamp(64px, 8.7vw, 167px)",
          paddingBottom: "clamp(64px, 8.7vw, 167px)",
          paddingLeft: "clamp(16px, 5.7vw, 109px)",
          paddingRight: "clamp(16px, 5.7vw, 109px)",
        }}
      >
        {/* Headline */}
        <div className="mb-12 md:mb-20">
          <h2
            style={{
              fontWeight: 500,
              fontSize: "clamp(32px, 3.54vw, 68px)",
              color: "white",
              letterSpacing: "-0.044em",
              lineHeight: "normal",
            }}
          >
            From idea to real
          </h2>
          <h2
            style={{
              fontWeight: 500,
              fontSize: "clamp(32px, 3.54vw, 68px)",
              color: "white",
              letterSpacing: "-0.044em",
              lineHeight: "normal",
            }}
          >
            product decisions.
          </h2>
        </div>

        {/* Process list — right-half of the screen, mirroring Figma layout */}
        <div
          className="ml-auto"
          style={{ maxWidth: "clamp(300px, 60%, 1100px)" }}
        >
          {/* Bottom border after last item */}
          {STEPS.map((label, i) => (
            <ProcessRow key={i} index={i + 1} label={label} isFirst={i === 0} />
          ))}
          {/* Closing line */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />
        </div>
      </div>
    </section>
  );
}
