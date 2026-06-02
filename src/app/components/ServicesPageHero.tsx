import { useInView } from "@/app/hooks/useInView";
import { HeroHeaderFlower } from "@/app/components/HeroHeaderFlower";
import { ServicesOrbitingTeam } from "@/app/components/ServicesOrbitingTeam";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import { cn } from "@/app/components/ui/utils";

/** Services page hero — Figma 666:2064 + tímové fotky z Meet our team. */
export function ServicesPageHero() {
  const { ref, inView } = useInView<HTMLDivElement>({
    once: true,
    threshold: 0.2,
  });

  return (
    <section className="relative w-full bg-white" aria-labelledby="services-hero-heading">
      <div className="services-hero relative flex min-h-svh flex-col overflow-x-clip">
        <HeroHeaderFlower side="left" />
        <HeroHeaderFlower side="right" />

        <ServicesOrbitingTeam />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-[clamp(100px,28vw,140px)] pt-[var(--hero-nav-clearance)] md:pb-4">
          <div
            ref={ref}
            id="services-hero-heading"
            className="mx-auto flex w-full max-w-[min(100%,52.5rem)] flex-col items-center text-center"
          >
            <RevealHeadline
              as="h1"
              inView={inView}
              lines={["We don't sell design.", "We build momentum."]}
              className={cn(
                "m-0 w-full font-medium text-[var(--hero-brown)]",
                "text-[clamp(36px,4.375vw,84px)] leading-[1] tracking-[-0.03em]",
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
