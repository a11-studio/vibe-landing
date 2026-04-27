import type { ComponentProps } from "react";
import { cn } from "@/app/components/ui/utils";

/** Figma: max 1920px, margin 40px (clamp na menších šírkach) */
export function LayoutContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--layout-max-width,1920px)] px-[clamp(24px,2.1vw,40px)]",
        className
      )}
      {...props}
    />
  );
}

/** 12 stĺpcov, gutter 20px (`gap-x-5`) */
export function LayoutGrid({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("grid w-full grid-cols-12 gap-x-5", className)} {...props} />
  );
}
