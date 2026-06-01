import { useEffect, useLayoutEffect, useState } from "react";
import { useInView } from "@/app/hooks/useInView";
import imgHeroImage from "@/imports/image.webp";
import { HeroHeaderFlower } from "@/app/components/HeroHeaderFlower";
import { LogosSection } from "@/app/components/LogosSection";
import { ProcessSection } from "@/app/components/ProcessSection";
import { ProjectsSection } from "@/app/components/ProjectsSection";
import { AboutSection } from "@/app/components/AboutSection";
import { CompetitorSection } from "@/app/components/CompetitorSection";
import { FooterSection } from "@/app/components/FooterSection";
import { ServicesSection } from "@/app/components/ServicesSection";
import { LayoutContainer } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import { cn } from "@/app/components/ui/utils";

const HERO_IMAGE_EXPAND_SCROLL_PX = 520;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function measureHeroImageWidths() {
  const viewportWidth = window.innerWidth;
  const layoutMax = Math.min(viewportWidth, 1920);
  const marginX = clamp(viewportWidth * 0.021, 24, 40);
  const innerWidth = layoutMax - marginX * 2;
  const columnWidth = (innerWidth - 11 * 20) / 12;
  const narrowWidth =
    viewportWidth >= 768 ? columnWidth * 10 + 9 * 20 : innerWidth;

  return { narrow: narrowWidth, full: viewportWidth };
}

export function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [imageWidths, setImageWidths] = useState({ narrow: 0, full: 0 });
  const { ref: heroIntroRef, inView: heroInView } = useInView<HTMLDivElement>({
    once: true,
    threshold: 0.25,
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    const syncWidths = () => setImageWidths(measureHeroImageWidths());
    syncWidths();
    window.addEventListener("resize", syncWidths);
    return () => window.removeEventListener("resize", syncWidths);
  }, []);

  const imageExpandProgress = clamp(scrollY / HERO_IMAGE_EXPAND_SCROLL_PX, 0, 1);
  const heroImageWidth =
    imageWidths.narrow +
    (imageWidths.full - imageWidths.narrow) * imageExpandProgress;
  const heroImageMarginLeft = Math.max(0, (imageWidths.full - heroImageWidth) / 2);

  return (
    <div className="relative w-full bg-[var(--logos-canvas)]">
      <section id="hero" className="relative w-full bg-white">
        <div
          className="relative flex min-h-svh flex-col overflow-x-clip"
          style={{ paddingBottom: "var(--hero-image-peek)" }}
        >
          <HeroHeaderFlower side="left" />
          <HeroHeaderFlower side="right" />

          <LayoutContainer className="relative z-10 flex flex-1 flex-col items-center justify-center pb-4 pt-[var(--hero-nav-clearance)]">
            <div
              ref={heroIntroRef}
              className="mx-auto flex w-full flex-col items-center text-center"
              style={{ maxWidth: "var(--hero-headline-max-width)" }}
            >
              <RevealHeadline
                as="h1"
                inView={heroInView}
                lines={["Designing the future", "with taste"]}
                className="m-0 w-full font-medium text-[var(--hero-brown)]"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(34px, 4.375vw, 84px)",
                  lineHeight: "var(--hero-headline-line-height)",
                  letterSpacing: "var(--hero-headline-letter-spacing)",
                }}
              />
              <RevealHeadline
                as="p"
                inView={heroInView}
                lines={[
                  "Blending culture, technology, and aesthetics",
                  "into high-class experiences.",
                ]}
                staggerBaseDelayS={0.6}
                className="m-0 w-full text-center font-normal text-[var(--hero-tagline)]"
                style={{
                  marginTop: "var(--hero-headline-tagline-gap)",
                  maxWidth: "var(--hero-tagline-max-width)",
                  fontWeight: 400,
                  fontSize: "clamp(14px, 1.04vw, 20px)",
                  lineHeight: "var(--hero-tagline-line-height)",
                }}
              />
            </div>
          </LayoutContainer>
        </div>

        <div
          className="relative z-[3] w-full"
          style={{
            marginTop: "calc(-1 * var(--hero-image-peek))",
            paddingTop: "var(--hero-tagline-image-gap)",
          }}
        >
          <div
            className={cn(
              "hero-image-reveal overflow-hidden will-change-[width,margin]",
              heroInView && "hero-image-reveal--visible",
            )}
            style={{
              width: heroImageWidth > 0 ? `${heroImageWidth}px` : "100%",
              marginLeft: heroImageWidth > 0 ? `${heroImageMarginLeft}px` : undefined,
            }}
          >
            <img
              src={imgHeroImage}
              alt=""
              aria-hidden
              className="pointer-events-none block h-auto w-full"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <LogosSection />
      <ProjectsSection />
      <ProcessSection />
      <ServicesSection />
      <AboutSection />
      <CompetitorSection />
      <FooterSection />
    </div>
  );
}
