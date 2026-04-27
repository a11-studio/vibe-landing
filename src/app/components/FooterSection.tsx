import { useEffect, useState } from "react";
import { LayoutContainer, LayoutGrid } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import svgPaths from "@/imports/Footer/svg-39tshfia8v";
import { AnimatedSvgPattern } from "@/app/components/AnimatedSvgPattern";
import flowerSvgRaw from "@/assets/flower.svg?raw";

/** Figma footer 606:36065 — 1920×1216. Vertikál: CTA 200 ↓ 137 ↓ Prague 405, +28 time, +109 email+phone, kvet 423×560 od dna, nav 89 od spodku. */
const FIGMA = {
  bg: "#1c1310",
  flowerW: 423,
  flowerH: 560,
} as const;

// ─── Live Prague time ─────────────────────────────────────────────────────────
function usePragueTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Europe/Prague",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

// ─── Vibe logo (white) ────────────────────────────────────────────────────────
function VibeLogoWhite() {
  return (
    <svg width="51" height="24" viewBox="0 0 50.3951 24" fill="none">
      <path d={svgPaths.p2641c400} fill="white" />
      <path d={svgPaths.p11b87d00} fill="white" />
      <path d={svgPaths.p2bd5b200} fill="white" />
      <path d={svgPaths.pdd8c00}   fill="white" />
    </svg>
  );
}

// ─── Arrow (Figma: arrow-top-left, ↗) ─────────────────────────────────────────
function ArrowRight() {
  return (
    <div style={{ width: 50.912, height: 50.912, position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "rotate(135deg)" }}>
          <div style={{ width: 36, height: 36, position: "relative", overflow: "clip" }}>
            <div style={{ position: "absolute", inset: "12.5%" }}>
              <div style={{ position: "absolute", inset: "-5.56%" }}>
                <svg width="100%" height="100%" viewBox="0 0 30 30" fill="none" preserveAspectRatio="none">
                  <path d="M1.5 1.5L28.5 28.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                  <path d="M19.5 1.5H1.5V19.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Flower: Figma 423×560, centered, from bottom edge (rovnaká anim. ako hero pattern) ─
function FlowerSvg() {
  return (
    <AnimatedSvgPattern
      svgRaw={flowerSvgRaw}
      variant="footer"
      preserveAspectRatio="xMidYMax meet"
      tickMs={420}
      swapIntervalMs={2600}
      className="h-full w-full"
    />
  );
}

// ─── Footer Section — Figma 606:36065 ───────────────────────────────────────
export function FooterSection() {
  const pragueTime = usePragueTime();

  return (
    <footer
      className="relative flex w-full min-h-[clamp(780px,92svh,1200px)] flex-col overflow-x-clip sm:min-h-[clamp(600px,76svh,1100px)]"
      style={{ backgroundColor: FIGMA.bg }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
        style={{
          height: "min(50vh, 560px)",
          maxHeight: 560,
        }}
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            maxWidth: `min(88vw, ${FIGMA.flowerW}px)`,
            maxHeight: FIGMA.flowerH,
            aspectRatio: `${FIGMA.flowerW} / ${FIGMA.flowerH}`,
          }}
        >
          <FlowerSvg />
        </div>
      </div>

      <LayoutContainer
        className="relative z-10 flex flex-1 flex-col [padding-bottom:max(1.5rem,env(safe-area-inset-bottom,0px))]"
        style={{
          paddingTop: "clamp(72px, 8vw, 140px)",
        }}
      >
        <LayoutGrid className="flex-1 content-start">
          <div
            className="col-span-12 sm:col-start-2 sm:col-span-5"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <a
              href="mailto:vibestudio@design"
              className="group inline-flex w-fit max-w-none shrink-0 items-center gap-5"
              style={{ textDecoration: "none" }}
            >
              <RevealHeadline
                as="h2"
                lines={["Let's grow together"]}
                animated={false}
                className="whitespace-nowrap"
                wrapperClassName="inline-block shrink-0"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(32px, 4.5vw, 68px)",
                  color: "white",
                  letterSpacing: "-3px",
                  lineHeight: "normal",
                  margin: 0,
                }}
              />
              <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-2">
                <ArrowRight />
              </span>
            </a>

            <div
              style={{
                marginTop: "clamp(96px, 10vw, 180px)",
              }}
            >
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(16px, 1.1vw, 20px)",
                  color: "white",
                  letterSpacing: "-0.6px",
                  lineHeight: "normal",
                }}
              >
                Prague, CZ
              </p>
              <p
                className="mt-1"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(16px, 1.1vw, 20px)",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "-0.6px",
                  lineHeight: "normal",
                }}
              >
                {pragueTime}
              </p>
            </div>

            <div
              className="flex max-w-[320px] flex-col gap-2 max-sm:mb-2 max-sm:pb-2"
              style={{ marginTop: "clamp(48px, 5.6vw, 109px)" }}
            >
              <a
                href="mailto:vibestudio@design"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(16px, 1.1vw, 20px)",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "-0.6px",
                  lineHeight: "normal",
                  textDecoration: "none",
                }}
                className="hover:opacity-80 transition-opacity duration-200"
              >
                vibestudio@design
              </a>
              <a
                href="tel:+421911014410"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(16px, 1.1vw, 20px)",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "-0.6px",
                  lineHeight: "normal",
                  textDecoration: "none",
                }}
                className="hover:opacity-80 transition-opacity duration-200"
              >
                +421 911 014 410
              </a>
            </div>
          </div>
        </LayoutGrid>

        <LayoutGrid className="relative z-20 mt-auto pt-[clamp(64px,11vw,112px)] sm:pt-[clamp(48px,7vw,112px)]">
          <div className="col-span-12 flex flex-col items-start gap-6 sm:col-start-2 sm:col-span-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <VibeLogoWhite />
            <nav className="flex w-full max-md:flex-nowrap max-md:justify-between max-md:gap-0 items-center gap-x-6 gap-y-2 sm:w-auto sm:justify-start sm:gap-8">
              {(
                [
                  { label: "Instagram", href: "#" },
                  { label: "LinkedIn", href: "#" },
                  { label: "X", href: "#" },
                  { label: "Join Us", href: "#" },
                ] as const
              ).map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontWeight: 400,
                    fontSize: "clamp(16px, 1.1vw, 20px)",
                    color: "white",
                    letterSpacing: "-0.6px",
                    lineHeight: "normal",
                    textDecoration: "none",
                  }}
                  className="shrink-0 text-left hover:opacity-50 transition-opacity duration-200 sm:whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </LayoutGrid>
      </LayoutContainer>
    </footer>
  );
}
