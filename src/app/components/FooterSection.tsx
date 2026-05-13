import type {
  CSSProperties,
  ForwardedRef,
  MouseEventHandler,
  ReactNode,
  TransitionEvent,
} from "react";
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/app/components/ui/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { LayoutContainer, LayoutGrid } from "@/app/components/layout";
import { FooterFlowerFvclip } from "@/app/components/FooterFlowerFvclip";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import { VibeLogoLottieHover, VIBE_LOGO_FOOTER_PX } from "@/app/components/VibeLogoLottieHover";
import vibeLogoIntroWhiteAnimation from "@/assets/lottie/Vibe_logo_anim_V1_intro_white.json";
import svgPaths from "@/imports/Footer/svg-39tshfia8v";

/** Figma footer — farba pozadia. */
const FIGMA = {
  bg: "var(--logos-canvas)",
} as const;

const FOOTER_UNDERLINE_MS = 520;
const FOOTER_UNDERLINE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function useFooterReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Podčiarknutie: nájazd zľava, výjazd doprava (šírka s ukotvením vpravo). */
const FooterUnderlineLink = forwardRef(function FooterUnderlineLink(
  {
    href,
    style,
    className,
    children,
    reducedMotion,
    onClick,
  }: {
    href: string;
    style?: CSSProperties;
    className?: string;
    children: ReactNode;
    reducedMotion: boolean;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  },
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  const [hovered, setHovered] = useState(false);
  const [anchorRight, setAnchorRight] = useState(false);
  const [linePct, setLinePct] = useState(0);
  const shrinkRafRef = useRef<number | null>(null);

  const underlineTransition = reducedMotion
    ? "none"
    : `width ${FOOTER_UNDERLINE_MS}ms ${FOOTER_UNDERLINE_EASE}`;

  useEffect(() => {
    return () => {
      if (shrinkRafRef.current != null) cancelAnimationFrame(shrinkRafRef.current);
    };
  }, []);

  const handleEnter = () => {
    if (shrinkRafRef.current != null) {
      cancelAnimationFrame(shrinkRafRef.current);
      shrinkRafRef.current = null;
    }
    setHovered(true);
    setAnchorRight(false);
    setLinePct(100);
  };

  const handleLeave = () => {
    setHovered(false);
    setAnchorRight(true);
    if (reducedMotion) {
      setLinePct(0);
      setAnchorRight(false);
      return;
    }
    shrinkRafRef.current = requestAnimationFrame(() => {
      shrinkRafRef.current = requestAnimationFrame(() => {
        shrinkRafRef.current = null;
        setLinePct(0);
      });
    });
  };

  const onUnderlineTransitionEnd = (e: TransitionEvent<HTMLSpanElement>) => {
    if (e.propertyName !== "width") return;
    if (!hovered) setAnchorRight(false);
  };

  return (
    <a
      ref={ref}
      href={href}
      style={style}
      className={cn(
        "relative inline-block w-fit max-w-full self-start",
        className,
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onClick={onClick}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[calc(0.08em-1px)] block h-px bg-current"
        style={{
          left: anchorRight ? "auto" : 0,
          right: anchorRight ? 0 : "auto",
          width: `${linePct}%`,
          transition: underlineTransition,
        }}
        onTransitionEnd={onUnderlineTransitionEnd}
      />
    </a>
  );
});

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

/** Zhodné s Tailwind `max-md` (768 px). */
const FOOTER_NARROW_MQ = "(max-width: 767px)";

function useIsNarrowFooter(): boolean {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(FOOTER_NARROW_MQ).matches : false
  );
  useLayoutEffect(() => {
    const mq = window.matchMedia(FOOTER_NARROW_MQ);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return narrow;
}

function FooterComingSoonLink({
  label,
  href,
  reducedMotion,
}: {
  label: string;
  href: string;
  reducedMotion: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <FooterUnderlineLink
          href={href}
          reducedMotion={reducedMotion}
          style={{
            fontWeight: 400,
            fontSize: "clamp(16px, 1.1vw, 20px)",
            color: "white",
            letterSpacing: "-0.6px",
            lineHeight: "normal",
            textDecoration: "none",
          }}
          className="shrink-0 cursor-pointer text-left outline-none sm:whitespace-nowrap"
          onClick={(e) => {
            e.preventDefault();
            setOpen((prev) => !prev);
          }}
        >
          {label}
        </FooterUnderlineLink>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        sideOffset={10}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "w-fit rounded-lg border px-3 py-2 shadow-lg",
          "border-white/15 bg-[var(--logos-canvas)] text-[13px] font-medium text-white",
        )}
      >
        Coming soon
      </PopoverContent>
    </Popover>
  );
}

function FooterSocialRow({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="col-span-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <VibeLogoLottieHover
        animationData={vibeLogoIntroWhiteAnimation}
        reducedMotion={reducedMotion}
        width={VIBE_LOGO_FOOTER_PX.w}
        height={VIBE_LOGO_FOOTER_PX.h}
        staticMark={
          <svg
            width={VIBE_LOGO_FOOTER_PX.w}
            height={VIBE_LOGO_FOOTER_PX.h}
            viewBox="0 0 50.3951 24"
            fill="none"
            className="block max-h-full max-w-full"
          >
            <path d={svgPaths.p2641c400} fill="white" />
            <path d={svgPaths.p11b87d00} fill="white" />
            <path d={svgPaths.p2bd5b200} fill="white" />
            <path d={svgPaths.pdd8c00} fill="white" />
          </svg>
        }
      />
      <nav className="flex w-full max-md:flex-nowrap max-md:justify-between max-md:gap-0 items-center gap-x-6 gap-y-2 sm:w-auto sm:justify-start sm:gap-8">
        {(
          [
            { label: "Instagram", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "X", href: "#" },
            { label: "Join Us", href: "#" },
          ] as const
        ).map(({ label, href }) => (
          <FooterComingSoonLink
            key={label}
            label={label}
            href={href}
            reducedMotion={reducedMotion}
          />
        ))}
      </nav>
    </div>
  );
}

// ─── Footer Section — Figma 606:36065 ───────────────────────────────────────
export function FooterSection() {
  const pragueTime = usePragueTime();
  const reducedMotion = useFooterReducedMotion();
  const isNarrow = useIsNarrowFooter();

  const mainColumn = (
    <div
      className="col-span-12 sm:col-span-5"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <a
        href="mailto:hello@vibestudio.design"
        className="group inline-flex w-fit max-w-none shrink-0 flex-col items-start"
        style={{ textDecoration: "none" }}
      >
        <span className="inline-flex items-center gap-5">
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
        </span>
        <span
          className="mt-3 block"
          style={{
            fontWeight: 400,
            fontSize: "clamp(20px, 1.35vw, 28px)",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "-0.6px",
            lineHeight: "normal",
          }}
        >
          Start with a simple message
        </span>
      </a>

      <div
        className={cn(isNarrow && "mt-7")}
        style={
          isNarrow
            ? undefined
            : { marginTop: "clamp(120px, 12vw, 220px)" }
        }
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
        className={cn("flex max-w-[320px] flex-col gap-2", isNarrow && "mt-6")}
        style={
          isNarrow
            ? undefined
            : { marginTop: "clamp(64px, 7vw, 140px)" }
        }
      >
        <FooterUnderlineLink
          href="mailto:hello@vibestudio.design"
          reducedMotion={reducedMotion}
          className="whitespace-nowrap"
          style={{
            fontWeight: 400,
            fontSize: "clamp(16px, 1.1vw, 20px)",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "-0.6px",
            lineHeight: "normal",
            textDecoration: "none",
          }}
        >
          hello@vibestudio.design
        </FooterUnderlineLink>
        <FooterUnderlineLink
          href="tel:+421911014410"
          reducedMotion={reducedMotion}
          className="whitespace-nowrap"
          style={{
            fontWeight: 400,
            fontSize: "clamp(16px, 1.1vw, 20px)",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "-0.6px",
            lineHeight: "normal",
            textDecoration: "none",
          }}
        >
          +421 911 014 410
        </FooterUnderlineLink>
      </div>
    </div>
  );

  return (
    <footer
      className="relative flex min-h-svh w-full flex-col overflow-x-clip"
      style={{ backgroundColor: FIGMA.bg }}
    >
      {isNarrow ? (
        <>
          <LayoutContainer className="relative z-10 flex shrink-0 flex-col pb-2 pt-14">
            <LayoutGrid className="content-start">{mainColumn}</LayoutGrid>
          </LayoutContainer>
          <div
            className="pointer-events-none relative z-[1] flex min-h-[clamp(268px,40svh,620px)] max-h-[min(90svh,980px)] w-full flex-1 flex-col overflow-hidden"
            aria-hidden
          >
            <div className="pointer-events-none mx-auto flex h-full min-h-0 w-full flex-1 items-end justify-center overflow-visible">
              <div className="footer-mobile-flower-visual w-[150vw] max-w-none shrink-0">
                <FooterFlowerFvclip className="w-full" dense />
              </div>
            </div>
          </div>
          <LayoutContainer className="relative z-10 shrink-0 pt-5 [padding-bottom:max(2rem,env(safe-area-inset-bottom,0px))]">
            <LayoutGrid>
              <FooterSocialRow reducedMotion={reducedMotion} />
            </LayoutGrid>
          </LayoutContainer>
        </>
      ) : (
        <>
          {/* Desktop: kvet abs. v pozadí — pôvodný vizuál (nie orezaný in-flow pás). */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 overflow-hidden [top:calc(50%-100px)]"
            aria-hidden
          >
            <div className="pointer-events-none absolute bottom-0 left-1/2 w-full max-w-[min(96vw,1200px)] -translate-x-1/2 translate-y-[100px]">
              <FooterFlowerFvclip className="w-full" />
            </div>
          </div>
          <LayoutContainer className="relative z-10 flex flex-1 flex-col [padding-top:clamp(96px,10vw,180px)] [padding-bottom:max(2rem,env(safe-area-inset-bottom,0px))]">
            <LayoutGrid className="flex-1 content-start">{mainColumn}</LayoutGrid>
            <LayoutGrid className="relative z-20 mt-auto pt-[clamp(72px,10vw,148px)]">
              <FooterSocialRow reducedMotion={reducedMotion} />
            </LayoutGrid>
          </LayoutContainer>
        </>
      )}
    </footer>
  );
}
