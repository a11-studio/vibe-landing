import { cn } from "@/app/components/ui/utils";

/** Rovnaká farba ako ServicesManifestoSection nad Services. */
export const SERVICES_MANIFESTO_SURFACE = "#1c1310";

const PANEL_COUNT = 4;
const PANEL_STAGGER_S = 0.14;

export type ServicesPanelRevealAxis = "horizontal" | "vertical";

type ServicesColumnRevealPanelsProps = {
  active: boolean;
  /** `horizontal` = zľava doprava; `vertical` = zhora nadol. */
  revealAxis?: ServicesPanelRevealAxis;
};

/**
 * Štyri panely (25 % každý) — celá výška sekcie.
 * Pri vstupe do viewportu sa odokryjú (100 % → 0 %) a odhalia obsah stĺpca.
 */
export function ServicesColumnRevealPanels({
  active,
  revealAxis = "vertical",
}: ServicesColumnRevealPanelsProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[4] hidden w-full md:block"
      aria-hidden
    >
      <div className="relative flex h-full w-full flex-row items-stretch">
        {Array.from({ length: PANEL_COUNT }, (_, index) => (
          <div
            key={index}
            className="relative min-h-0 flex-1 overflow-hidden"
          >
            <div
              className={cn(
                "services-column-reveal-panel absolute inset-0",
                revealAxis === "vertical"
                  ? "services-column-reveal-panel--vertical"
                  : "services-column-reveal-panel--horizontal",
                active && "services-column-reveal-panel--active",
              )}
              style={{
                backgroundColor: SERVICES_MANIFESTO_SURFACE,
                animationDelay: active ? `${index * PANEL_STAGGER_S}s` : undefined,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const SERVICES_PANEL_STAGGER_S = PANEL_STAGGER_S;
export const SERVICES_PANEL_DURATION_S = 0.88;
/** Kedy začne textový reveal po štarte panelu daného stĺpca. */
export const SERVICES_PANEL_CONTENT_START_RATIO = 0.38;

export function servicesPanelContentBaseDelayS(columnIndex: number): number {
  return (
    columnIndex * SERVICES_PANEL_STAGGER_S +
    SERVICES_PANEL_DURATION_S * SERVICES_PANEL_CONTENT_START_RATIO
  );
}
