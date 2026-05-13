import { useEffect, useId, useState } from "react";
import { useInView } from "@/app/hooks/useInView";
import imgBackgroundImage from "@/imports/image.webp";
import imgHeadlineBlur from "@/imports/blur.webp";
import { HeroAsciiPattern } from "@/app/components/HeroAsciiPattern";
import { HeroNavbar } from "@/app/components/HeroNavbar";
import { ScheduleCTA } from "@/app/components/ScheduleCTA";
import { LogosSection } from "@/app/components/LogosSection";
import { ProcessSection } from "@/app/components/ProcessSection";
import { ProjectsSection } from "@/app/components/ProjectsSection";
import { AboutSection } from "@/app/components/AboutSection";
import { CompetitorSection } from "@/app/components/CompetitorSection";
import { FooterSection } from "@/app/components/FooterSection";
import { LayoutContainer } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";

const SCROLL_NAVBAR_THRESHOLD_PX = 40;
const SCROLL_HINT_HIDE_PX = 60;

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
      <HeroNavbar
        scrollY={scrollY}
        menuOpen={menuOpen}
        menuPanelId={menuPanelId}
        onMenuOpenChange={setMenuOpen}
      />

      <div className="relative w-full bg-[var(--logos-canvas)]">

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
              aria-hidden
              className="w-full h-full object-cover"
            />
          </div>

          {/* Glow — pod ASCII patternom (z-[1]) */}
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

          {/* ASCII vzorka nad pozadím */}
          <HeroAsciiPattern />

          <LayoutContainer className="relative z-10 flex justify-center">
            <div ref={heroIntroRef} className="flex flex-col items-center text-center">
              {/* Blur vrstva za nadpisom */}
              <div className="relative isolate mb-2 w-full sm:mb-3">
                <img
                  src={imgHeadlineBlur}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -inset-6 object-cover object-center sm:-inset-8 md:-inset-10 lg:-inset-12"
                  loading="eager"
                />
                <div className="relative z-10 px-0 pt-5 pb-2 sm:px-9 sm:pt-6 sm:pb-2 md:px-12 md:pt-7 md:pb-2 lg:px-14 lg:pt-8 lg:pb-2.5">
                  <RevealHeadline
                    as="h1"
                    inView={heroInView}
                    lines={["Designing the future", "with taste"]}
                    className="m-0 font-medium text-white"
                    style={{
                      fontWeight: 500,
                      fontSize: "clamp(34px, 5vw, 62px)",
                      lineHeight: 0.96,
                      letterSpacing: "clamp(-2px, -0.34vw, -1.2px)",
                    }}
                  />
                </div>
              </div>
              <RevealHeadline
                as="p"
                inView={heroInView}
                lines={[
                  "Blending culture, technology, and aesthetics",
                  "into high-class experiences.",
                ]}
                staggerBaseDelayS={0.6}
                className="m-0 max-w-[min(100%,42rem)] text-center font-normal text-white/90 mt-1 sm:mt-1.5"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(14px, 1.5vw, 20px)",
                  lineHeight: 1.42,
                }}
              />
            </div>
          </LayoutContainer>

          {/* Scroll hint */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 transition-opacity duration-300"
            style={{ opacity: scrollY > SCROLL_HINT_HIDE_PX ? 0 : 1 }}
          >
            <span className="hero-scroll-hint text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-white/30 animate-pulse" />
          </div>
        </section>

        <LogosSection />
        <ProjectsSection />
        <ProcessSection />
        <AboutSection />
        <CompetitorSection />
        <FooterSection />
      </div>

      <ScheduleCTA scrolled={scrollY > SCROLL_NAVBAR_THRESHOLD_PX} />
    </>
  );
}
