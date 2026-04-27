import { useEffect, useState } from "react";
import { useInView } from "@/app/hooks/useInView";
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

// ─── Hamburger Icon ───────────────────────────────────────────────────────────
function HamburgerIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <path d="M18 7H1.2"  stroke="#212121" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 1H1.2"  stroke="#212121" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 13H1.2" stroke="#212121" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ scrollY }: { scrollY: number }) {
  const scrolled = scrollY > 40;
  return (
    <header className="fixed top-5 left-0 right-0 z-50" style={{ willChange: "transform" }}>
      <LayoutContainer className="flex justify-center">
      <nav
        className="flex items-center gap-10 px-5 rounded-[70px] transition-all duration-500"
        style={{
          height: 54,
          backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.06)"
            : "0 2px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center shrink-0 cursor-pointer">
          <VibeLogo />
        </div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-10">
          {["Process", "Work", "Team"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[15px] font-medium text-black whitespace-nowrap transition-opacity duration-200 hover:opacity-50"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="flex items-center justify-center w-6 h-6 shrink-0 hover:opacity-50 transition-opacity duration-200"
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>
      </nav>
      </LayoutContainer>
    </header>
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
      <Navbar scrollY={scrollY} />

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