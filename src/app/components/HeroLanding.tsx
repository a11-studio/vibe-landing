import { useEffect, useState } from "react";
import svgPaths from "@/imports/MainContainer/svg-mqtv51ktgp";
import imgBackgroundImage from "@/imports/image.png";
import imgProfileImage1 from "@/imports/MainContainer/ecc192fa4213baaac273888921a1551274ec058a.png";
import { LogosSection } from "@/app/components/LogosSection";
import { ProcessSection } from "@/app/components/ProcessSection";
import { Process2Section } from "@/app/components/Process2Section";
import { ProjectsSection } from "@/app/components/ProjectsSection";
import { AboutSection } from "@/app/components/AboutSection";
import { FooterSection } from "@/app/components/FooterSection";

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
    <header
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
      style={{ willChange: "transform" }}
    >
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
        className="flex items-center gap-3 rounded-[62px] transition-all duration-300 hover:scale-[1.03]"
        style={{
          backgroundColor: "white",
          padding: "10px 18px 10px 10px",
          boxShadow: "0 6px 30px rgba(0,0,0,0.13), 0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Profile image */}
        <div className="w-[52px] h-[52px] rounded-full overflow-hidden shrink-0">
          <img
            src={imgProfileImage1}
            alt="Team member"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-start">
          <span className="text-[15px] font-medium text-black leading-tight">
            Schedule now
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="text-[13px] font-medium"
              style={{ color: "rgba(0,0,0,0.5)" }}
            >
              15 min call
            </span>
            {/* Caret */}
            <svg width="7" height="11" viewBox="0 0 7 11" fill="none" className="opacity-50 rotate-0">
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
          className="relative w-full overflow-hidden flex items-center justify-center"
          style={{ minHeight: "100vh" }}
        >
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={imgBackgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "60%",
              height: 200,
              borderRadius: "50%",
              filter: "blur(88px)",
              background: "linear-gradient(84deg, rgb(182,179,64) 1%, rgb(14,146,102) 96%)",
              opacity: 0.55,
            }}
          />

          {/* Hero Text */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <h1
              className="text-white mb-5"
              style={{
                fontWeight: 500,
                fontSize: "clamp(40px, 5.5vw, 72px)",
                lineHeight: 1.17,
                letterSpacing: "-2px",
              }}
            >
              <span style={{ display: "block" }}>Senior design team</span>
              <span style={{ display: "block" }}>Assembled for you.</span>
            </h1>
            <p
              className="text-white/90"
              style={{
                fontWeight: 400,
                fontSize: "clamp(15px, 1.8vw, 24px)",
                lineHeight: 1.5,
              }}
            >
              We turn product ideas into device-ready, coded prototypes
            </p>
          </div>

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