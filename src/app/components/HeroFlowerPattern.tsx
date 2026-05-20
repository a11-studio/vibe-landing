import flowerSvg from "@/assets/flower.svg";
import { cn } from "@/app/components/ui/utils";

type HeroFlowerPatternProps = {
  side: "left" | "right";
  className?: string;
};

/** ASCII kvet z Figma (flower.svg) — maskou na hnedú farbu hero headeru. */
export function HeroFlowerPattern({ side, className }: HeroFlowerPatternProps) {
  const isLeft = side === "left";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-[1] opacity-90",
        isLeft
          ? "left-[max(-6%,calc(50%-960px))] top-[clamp(24px,6.22%,56px)] h-[clamp(320px,80.4%,724px)] w-[clamp(200px,28.5%,547px)]"
          : "right-[max(-6%,calc(50%-960px))] top-[clamp(180px,53%,477px)] h-[clamp(320px,83.3%,750px)] w-[clamp(200px,29.5%,567px)]",
        className,
      )}
      style={{
        WebkitMaskImage: `url(${flowerSvg})`,
        maskImage: `url(${flowerSvg})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        backgroundColor: "var(--hero-brown)",
      }}
    />
  );
}
