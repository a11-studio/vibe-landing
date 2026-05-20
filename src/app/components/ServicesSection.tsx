import type { ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LayoutContainer } from "@/app/components/layout";
import { cn } from "@/app/components/ui/utils";
import {
  IconAiNativeDelivery,
  IconBrandSystems,
  IconCreativeDirection,
  IconProductDesign,
} from "@/app/components/ServiceIcons";

const SERVICES_HEADING = "#013439";

type ServiceColumn = {
  title: string;
  Icon: ComponentType<{ className?: string }>;
  items: string[];
};

const SERVICE_COLUMNS: ServiceColumn[] = [
  {
    title: "Creative Direction",
    Icon: IconCreativeDirection,
    items: [
      "Brand positioning",
      "Visual direction",
      "Art direction",
      "Digital aesthetics",
      "Creative systems",
    ],
  },
  {
    title: "Product Design",
    Icon: IconProductDesign,
    items: [
      "UX/UI design",
      "User flows & prototypes",
      "Design systems",
      "Web & app experiences",
      "Product strategy",
    ],
  },
  {
    title: "Brand Systems",
    Icon: IconBrandSystems,
    items: [
      "Identity design",
      "Brand guidelines",
      "Launch visuals",
      "Campaign assets",
      "Motion language",
    ],
  },
  {
    title: "AI-Native Delivery",
    Icon: IconAiNativeDelivery,
    items: [
      "Rapid prototyping",
      "Front-end development",
      "Automation workflows",
      "Interactive experiences",
      "Testable MVPs",
    ],
  },
];

const COL_ENTER_Y = 20;
const COL_STAGGER_S = 0.1;
const COL_DURATION_S = 0.48;

const DIVIDER = "rgba(0, 0, 0, 0.08)" as const;

/**
 * Sekcia Services — bez horného eyebrow-u; asymetrický spacing (väčší hore).
 * Vertikálne deliace čiary pokrývajú celú vnútornú výšku blokového kontajnera (top → bottom vrátane odsadenia).
 */
export function ServicesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="services"
      data-scroll-section
      className="relative isolate w-full bg-white text-[#0a0a0a]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[var(--sand-surface)]" aria-hidden />

      <LayoutContainer
        className="relative z-[1]"
        style={{
          paddingTop: "clamp(96px, 12vw, 168px)",
          paddingBottom: "clamp(72px, 8vw, 120px)",
        }}
      >
        {/* Vertikálne čiary celej vnútornej výšky sekcie (vrátane pt/pb LayoutContainer); desktop */}
        <div
          className="pointer-events-none absolute inset-0 z-0 hidden md:block"
          aria-hidden
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${(i / 4) * 100}%`, backgroundColor: DIVIDER }}
            />
          ))}
        </div>

        <div className="relative z-[2] flex flex-col gap-y-14 md:flex-row md:items-stretch md:gap-0">
          {SERVICE_COLUMNS.map((column, index) => {
            const { Icon } = column;
            const isFirst = index === 0;
            const isLast = index === SERVICE_COLUMNS.length - 1;
            return (
              <motion.div
                key={column.title}
                className={cn(
                  "flex min-h-0 flex-1 flex-col justify-start",
                  !isFirst && "border-t border-black/[0.08] pt-14 md:border-t-0 md:pt-0",
                  isFirst && "md:pr-8 lg:pr-10",
                  !isFirst && !isLast && "md:px-8 lg:px-10",
                  isLast && !isFirst && "md:pl-8 lg:pl-10 md:pr-0",
                )}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: COL_ENTER_Y }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : COL_DURATION_S,
                  delay: prefersReducedMotion ? 0 : index * COL_STAGGER_S,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="mb-8 flex h-11 w-11 shrink-0 md:h-12 md:w-12">
                  <Icon className="block h-full w-full" />
                </div>
                <h2
                  className={cn(
                    "m-0 mb-6 text-balance md:mb-8",
                    "text-[clamp(22px,4.2vw,28px)] tracking-[-0.06em]",
                    "md:text-[clamp(21px,2.15vw,34px)] md:tracking-[-0.042em]",
                    "lg:text-[clamp(24px,2.35vw,48px)] lg:tracking-[-0.06em]",
                  )}
                  style={{
                    fontWeight: 500,
                    color: SERVICES_HEADING,
                    lineHeight: "normal",
                  }}
                >
                  {column.title}
                </h2>
                <ul className="m-0 list-outside ps-4" style={{ listStyleType: "disc" }}>
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "ps-1.5 marker:text-current",
                        "text-[clamp(15px,3.6vw,17px)] tracking-[-0.03em] leading-[38px]",
                        "md:text-[clamp(15px,1.7vw,18px)] md:tracking-[-0.032em] md:leading-[37px]",
                        "lg:text-[clamp(16px,1.05vw,20px)] lg:tracking-[-0.04em] lg:leading-[42px]",
                      )}
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </LayoutContainer>
    </section>
  );
}
