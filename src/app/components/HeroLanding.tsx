import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useInView } from "@/app/hooks/useInView";
import { cn } from "@/app/components/ui/utils";
import svgPaths from "@/imports/MainContainer/svg-mqtv51ktgp";
import imgBackgroundImage from "@/imports/image.png";
import imgHeadlineBlur from "@/imports/blur.png";
import { HeroPattern } from "@/app/components/HeroPattern";
import imgProfileImage1 from "@/imports/MainContainer/ecc192fa4213baaac273888921a1551274ec058a.png";
import { LogosSection } from "@/app/components/LogosSection";
import { ProcessSection } from "@/app/components/ProcessSection";
import { Process2Section } from "@/app/components/Process2Section";
import { ProjectsSection } from "@/app/components/ProjectsSection";
import { AboutSection } from "@/app/components/AboutSection";
import { FooterSection } from "@/app/components/FooterSection";
import { LayoutContainer } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";

// ─── Vibe Logo ────────────────────────────────────────────────────────────────
function VibeLogo() {
  return (
    <svg width="51" height="24" viewBox="0 0 50.3951 24" fill="none">
      <path d={svgPaths.p2ed8a900} fill="black" />
      <path d={svgPaths.pf4d1e80}  fill="black" />
      <path d={svgPaths.p2bd5b200} fill="black" />
      <path d={svgPaths.p3ab9e400} fill="black" />
    </svg>
  );
}

// ─── Menu toggle: designcouch „icon 4“ (CodePen ExvwPY, #nav-icon4) ───────────
// https://codepen.io/designcouch/pen/ExvwPY — ľavý transform-origin, stred mizne na šírku 0
function MenuToggleIcon({ open }: { open: boolean }) {
  const line: CSSProperties = {
    display: "block",
    position: "absolute",
    height: 6,
    width: "100%",
    backgroundColor: "currentColor",
    borderRadius: 3,
    left: 0,
    transition: "0.25s ease-in-out",
    transformOrigin: "left center",
  };

  const span1: CSSProperties = {
    ...line,
    top: open ? -3 : 0,
    left: open ? 8 : 0,
    transform: open ? "rotate(45deg)" : "rotate(0deg)",
  };
  const span2: CSSProperties = {
    ...line,
    top: 18,
    width: open ? "0%" : "100%",
    opacity: open ? 0 : 1,
  };
  const span3: CSSProperties = {
    ...line,
    top: open ? 39 : 36,
    left: open ? 8 : 0,
    transform: open ? "rotate(-45deg)" : "rotate(0deg)",
  };

  return (
    <div
      className="pointer-events-none relative inline-block h-[15px] w-5 shrink-0 overflow-visible motion-reduce:[&_span]:!transition-none"
      aria-hidden
    >
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{
          width: 60,
          height: 45,
          transform: "scale(0.333333)",
          transformOrigin: "top left",
        }}
      >
        <span style={span1} />
        <span style={span2} />
        <span style={span3} />
      </div>
    </div>
  );
}

const MOBILE_NAV = [
  { label: "About", href: "#process" },
  { label: "Projects", href: "#work" },
  { label: "Team", href: "#team" },
] as const;

// ─── Biely zaoblený box pod pill barom (Figma 609:3277) ───────────────────────
function NavMenuPanel({
  id,
  onRequestClose,
  ariaHidden,
}: {
  id: string;
  onRequestClose: () => void;
  ariaHidden?: boolean;
}) {
  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-hidden={ariaHidden ? true : undefined}
      aria-label="Site menu"
      className="w-full max-w-[535px] rounded-[48px] bg-white px-6 py-10 sm:px-10 sm:py-12"
      style={{
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <nav className="flex flex-col items-center" aria-label="Primary">
        <ul className="flex w-full max-w-[469px] flex-col items-center gap-12 sm:gap-16 list-none m-0 p-0">
          {MOBILE_NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block text-center text-[22px] font-medium leading-none text-black tracking-[-0.84px] transition-opacity duration-200 hover:opacity-50 sm:text-[28px]"
                onClick={onRequestClose}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div
          className="mt-10 h-px w-full max-w-[469px] bg-black/10 sm:mt-16"
          aria-hidden
        />

        <a
          href="mailto:vibestudio@design?subject=Hello"
          className="mt-8 text-center text-[16px] font-medium leading-none text-black tracking-[-0.54px] transition-opacity duration-200 hover:opacity-50 sm:mt-10 sm:text-[18px]"
        >
          vibestudio@design
        </a>

        <a
          href="mailto:vibestudio@design?subject=Schedule%20a%20call"
          className="mt-8 inline-flex items-center justify-center rounded-[40px] bg-[#040404] px-6 py-3 text-[16px] font-medium leading-none text-white tracking-[-0.54px] transition-opacity duration-200 hover:opacity-90 sm:mt-10 sm:text-[18px]"
          onClick={onRequestClose}
        >
          schedule a call
        </a>
      </nav>
    </div>
  );
}

const MENU_LAYER_MS = 360;

// ─── Navbar (pill + hamburger; pri otvorení box pod barom) ────────────────────
function Navbar({
  scrollY,
  menuOpen,
  menuPanelId,
  onMenuOpenChange,
}: {
  scrollY: number;
  menuOpen: boolean;
  menuPanelId: string;
  onMenuOpenChange: (open: boolean) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [layerMounted, setLayerMounted] = useState(false);
  const [layerVisible, setLayerVisible] = useState(false);
  const scrolled = scrollY > 40;
  const layerOpen = menuOpen || layerMounted;
  const zHeader = layerOpen ? 100 : 50;

  useEffect(() => {
    if (menuOpen) {
      setLayerMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setLayerVisible(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setLayerVisible(false);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen || layerVisible) return;
    if (!layerMounted) return;
    const t = window.setTimeout(() => {
      setLayerMounted(false);
    }, MENU_LAYER_MS);
    return () => window.clearTimeout(t);
  }, [menuOpen, layerVisible, layerMounted]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMenuOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, onMenuOpenChange]);

  useEffect(() => {
    if (!menuOpen) return;
    closeRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!layerMounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [layerMounted]);

  return (
    <>
      {layerMounted && (
        <div
          className={cn(
            "fixed inset-0 z-[90] cursor-pointer bg-black/15",
            "transition-opacity ease-out motion-reduce:transition-none",
          )}
          style={{
            transitionDuration: `${MENU_LAYER_MS}ms`,
            opacity: layerVisible ? 1 : 0,
            pointerEvents: layerVisible ? "auto" : "none",
            backdropFilter: "blur(2px)",
          }}
          aria-hidden
          onClick={() => onMenuOpenChange(false)}
        />
      )}

      <header
        className="fixed top-5 left-0 right-0 flex flex-col items-center"
        style={{ willChange: "transform", zIndex: zHeader }}
      >
        <LayoutContainer className="flex w-full max-w-full flex-col items-center">
          <nav
            className="inline-flex max-w-full items-center gap-4 px-4 rounded-[70px] transition-all duration-500 sm:gap-10 sm:px-5"
            style={{
              minHeight: 54,
              backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,1)",
              backdropFilter: scrolled ? "blur(16px)" : "none",
              boxShadow: layerOpen
                ? "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)"
                : scrolled
                  ? "0 4px 32px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.06)"
                  : "0 2px 20px rgba(0,0,0,0.08)",
            }}
            aria-label="Main"
          >
            <a
              href="#hero"
              className="flex shrink-0 cursor-pointer items-center"
              onClick={() => {
                if (menuOpen) onMenuOpenChange(false);
              }}
            >
              <VibeLogo />
            </a>

            <div className="hidden min-w-0 sm:flex sm:items-center sm:gap-10">
              {["Process", "Work", "Team"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-[15px] font-medium text-black whitespace-nowrap transition-opacity duration-200 hover:opacity-50"
                  onClick={() => {
                    if (menuOpen) onMenuOpenChange(false);
                  }}
                >
                  {link}
                </a>
              ))}
            </div>

            <button
              ref={closeRef}
              type="button"
              className="flex h-6 w-6 cursor-pointer shrink-0 items-center justify-center text-[#212121] transition-opacity duration-200 hover:opacity-50"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuPanelId : undefined}
              aria-haspopup="dialog"
              onClick={() => onMenuOpenChange(!menuOpen)}
            >
              <MenuToggleIcon open={menuOpen} />
            </button>
          </nav>

          {layerMounted && (
            <div
              className={cn(
                "mt-2 w-full max-w-[min(100%,535px)] will-change-transform sm:px-0",
                "motion-reduce:transition-none",
                "transition-[opacity,transform]",
                "ease-[cubic-bezier(0.16,1,0.3,1)]",
              )}
              style={{
                transitionDuration: `${MENU_LAYER_MS}ms`,
                opacity: layerVisible ? 1 : 0,
                transform: layerVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(-10px) scale(0.98)",
                pointerEvents: layerVisible ? "auto" : "none",
              }}
            >
              <NavMenuPanel
                id={menuPanelId}
                onRequestClose={() => onMenuOpenChange(false)}
                ariaHidden={!layerVisible}
              />
            </div>
          )}
        </LayoutContainer>
      </header>
    </>
  );
}

// ─── Schedule CTA ─────────────────────────────────────────────────────────────
function ScheduleCTA({ scrolled }: { scrolled: boolean }) {
  return (
    <div
      className="fixed bottom-8 right-8 z-50"
      style={{
        opacity: scrolled ? 0 : 1,
        transform: scrolled ? "translateX(40px)" : "translateX(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: scrolled ? "none" : "auto",
      }}
    >
      <button
        type="button"
        className="group flex cursor-pointer items-center gap-4 rounded-[62px]"
        style={{
          backgroundColor: "white",
          padding: "6px 22px 6px 8px",
          boxShadow: "0 6px 30px rgba(0,0,0,0.13), 0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Profile image */}
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <img
            src={imgProfileImage1}
            alt="Team member"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-start">
          <span className="text-[13px] font-medium leading-tight text-black">
            Schedule now
          </span>
          <div className="mt-0.5 flex items-center gap-1">
            <span
              className="text-[11px] font-medium"
              style={{ color: "rgba(0,0,0,0.5)" }}
            >
              15 min call
            </span>
            {/* Caret */}
            <svg
              width="7"
              height="11"
              viewBox="0 0 7 11"
              fill="none"
              className="opacity-50 transition-transform duration-300 ease-out will-change-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M1 1L6 5.5L1 10" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuPanelId = useId();
  const { ref: heroIntroRef, inView: heroInView } = useInView<HTMLDivElement>({
    once: true,
    threshold: 0.25,
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar
        scrollY={scrollY}
        menuOpen={menuOpen}
        menuPanelId={menuPanelId}
        onMenuOpenChange={setMenuOpen}
      />

      <div className="relative w-full">

        {/* ── Hero ── */}
        <section
          id="hero"
          className="relative flex w-full items-center justify-center overflow-x-visible overflow-y-clip"
          style={{ minHeight: "100vh" }}
        >
          {/* Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={imgBackgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Glow — pod patternami (z-[1]), inak rozmazanie prebíja biely pattern a pôsobí ako miznutie) */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-[1] w-[60%] max-w-[900px] -translate-x-1/2 -translate-y-1/2"
            style={{
              height: 200,
              borderRadius: "50%",
              filter: "blur(88px)",
              background: "linear-gradient(84deg, rgb(182,179,64) 1%, rgb(14,146,102) 96%)",
              opacity: 0.55,
            }}
            aria-hidden
          />

          {/* Pattern — right edge (silnejší posun doprava + užší pás) */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[2] flex w-[min(38%,360px)] max-w-[32rem] translate-x-10 justify-end sm:w-[min(36%,380px)] sm:translate-x-12 md:w-[min(28%,420px)] md:translate-x-16 lg:translate-x-20 xl:translate-x-24"
            aria-hidden
          >
            <HeroPattern tickMs={400} className="shrink-0" />
          </div>

          {/* Pattern — ľavý okraj (od md; silnejší posun doľava) */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[2] hidden w-[min(38%,360px)] max-w-[32rem] -translate-x-10 sm:w-[min(36%,380px)] sm:-translate-x-12 md:block md:w-[min(28%,420px)] md:-translate-x-16 lg:-translate-x-20 xl:-translate-x-24"
            aria-hidden
          >
            <div className="h-full w-full -scale-x-100">
              <div className="flex h-full w-full justify-end">
                <HeroPattern tickMs={500} className="shrink-0" />
              </div>
            </div>
          </div>

          <LayoutContainer className="relative z-10 flex justify-center">
          <div
            ref={heroIntroRef}
            className="flex flex-col items-center text-center"
          >
            {/* Vrstva pod hlavný nadpis — blur.png na plnú šírku, negat. inset = väčšia plocha za okrajom textu */}
            <div className="relative isolate mb-4 w-full sm:mb-5">
              <img
                src={imgHeadlineBlur}
                alt=""
                className="pointer-events-none absolute -inset-6 object-cover object-center sm:-inset-8 md:-inset-10 lg:-inset-12"
                loading="eager"
                aria-hidden
              />
              <div className="relative z-10 px-6 pt-5 pb-4 sm:px-9 sm:pt-6 sm:pb-4 md:px-12 md:pt-7 md:pb-5 lg:px-14 lg:pt-8 lg:pb-5">
                <RevealHeadline
                  as="h1"
                  inView={heroInView}
                  lines={["Senior design team", "Assembled for you."]}
                  className="text-white m-0"
                  style={{
                    fontWeight: 500,
                    fontSize: "clamp(40px, 5.5vw, 72px)",
                    lineHeight: 1.17,
                    letterSpacing: "-2px",
                  }}
                />
              </div>
            </div>
            <RevealHeadline
              as="p"
              inView={heroInView}
              lines={["We turn product ideas into device-ready, coded prototypes"]}
              staggerBaseDelayS={0.6}
              className="m-0 max-w-[min(100%,42rem)] text-center text-white/90"
              style={{
                fontWeight: 400,
                fontSize: "clamp(15px, 1.8vw, 24px)",
                lineHeight: 1.5,
              }}
            />
          </div>
          </LayoutContainer>

          {/* Scroll hint */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 transition-opacity duration-300"
            style={{ opacity: scrollY > 60 ? 0 : 1 }}
          >
            <span className="text-white/50 text-xs tracking-widest uppercase">
              Scroll
            </span>
            <div className="w-px h-8 bg-white/30 animate-pulse" />
          </div>
        </section>

        <LogosSection />
        <ProcessSection />
        <Process2Section />
        <ProjectsSection />
        <AboutSection />

        <FooterSection />
      </div>

      <ScheduleCTA scrolled={scrollY > 40} />
    </>
  );
}