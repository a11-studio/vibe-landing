import { useReducedMotion } from "motion/react";
import { cn } from "@/app/components/ui/utils";

const BLOCK_COLOR = "#eeebea";
const BLOCK_WIDTH_PX = 20;
const BLOCK_HEIGHT_PX = 160;
/** Rovnaké pozície ako vertikálne deliace čiary (25 %, 50 %, 75 %). */
const LINE_POSITIONS_PERCENT = [25, 50, 75] as const;
const BLOCKS_PER_LINE = 2;
const FALL_DURATION_S = 7;
/** Polovica cyklu — dva bloky na línii sú čo najďalej od seba. */
const BLOCK_STAGGER_S = FALL_DURATION_S / 2;
const LINE_STAGGER_S = 2;

/**
 * Pády blokov pozdĺž vertikálnych línií v Services — asynchrónne zhora nadol.
 */
export function ServicesDividerBlocks() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {LINE_POSITIONS_PERCENT.map((leftPercent, lineIndex) => (
        <div
          key={leftPercent}
          className="absolute top-0 bottom-0 overflow-hidden"
          style={{
            left: `${leftPercent}%`,
            width: BLOCK_WIDTH_PX,
            transform: "translateX(-50%)",
            ["--services-divider-block-h" as string]: `${BLOCK_HEIGHT_PX}px`,
          }}
        >
          {Array.from({ length: BLOCKS_PER_LINE }, (_, blockIndex) => (
            <div
              key={blockIndex}
              className={cn(
                "services-divider-block",
                reducedMotion && "services-divider-block--static",
              )}
              style={{
                width: BLOCK_WIDTH_PX,
                height: BLOCK_HEIGHT_PX,
                backgroundColor: BLOCK_COLOR,
                animationDuration: reducedMotion
                  ? undefined
                  : `${FALL_DURATION_S}s`,
                animationDelay: reducedMotion
                  ? undefined
                  : `${lineIndex * LINE_STAGGER_S + blockIndex * BLOCK_STAGGER_S}s`,
                ...(reducedMotion && {
                  top: blockIndex === 0 ? "22%" : "58%",
                }),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
