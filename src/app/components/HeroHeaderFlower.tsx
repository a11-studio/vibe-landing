import { FooterFlowerFvclip } from "@/app/components/FooterFlowerFvclip";
import { cn } from "@/app/components/ui/utils";

/** Footer flower pattern v hero headeri — vľavo/vpravo, bez pozadia. */
export function HeroHeaderFlower({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "hero-header-flower",
        side === "left" ? "hero-header-flower--left" : "hero-header-flower--right",
      )}
      aria-hidden
    >
      <FooterFlowerFvclip variant="hero" className="h-full w-full" dense />
    </div>
  );
}
