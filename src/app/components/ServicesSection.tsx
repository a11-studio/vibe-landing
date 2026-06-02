import type { ComponentType, ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";
import { LayoutContainer } from "@/app/components/layout";
import {
  REVEAL_WORD_STAGGER_S,
  RevealHeadline,
} from "@/app/components/RevealHeadline";
import {
  servicesPanelContentBaseDelayS,
  ServicesColumnRevealPanels,
} from "@/app/components/ServicesColumnRevealPanels";
import { ServicesDividerBlocks } from "@/app/components/ServicesDividerBlocks";
import {
  IconAiNativeDelivery,
  IconBrandSystems,
  IconCreativeDirection,
  IconProductDesign,
} from "@/app/components/ServiceIcons";
import { cn } from "@/app/components/ui/utils";
import { useInView } from "@/app/hooks/useInView";

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

const ICON_TO_TITLE_GAP_S = 0.1;
const LIST_ITEM_STAGGER_S = 0.06;
/** Medzera medzi dokončením nadpisu a prvou položkou zoznamu. */
const TITLE_TO_LIST_GAP_S = 0.1;

const DIVIDER = "rgba(0, 0, 0, 0.08)" as const;

const TITLE_CLASS = cn(
  "m-0 text-balance",
  "text-[clamp(22px,4.2vw,28px)] tracking-[-0.06em]",
  "md:text-[clamp(21px,2.15vw,34px)] md:tracking-[-0.042em]",
  "lg:text-[clamp(24px,2.35vw,48px)] lg:tracking-[-0.06em]",
);

const LIST_ITEM_CLASS = cn(
  "text-[clamp(15px,3.6vw,17px)] tracking-[-0.03em] leading-[38px]",
  "md:text-[clamp(15px,1.7vw,18px)] md:tracking-[-0.032em] md:leading-[37px]",
  "lg:text-[clamp(16px,1.05vw,20px)] lg:tracking-[-0.04em] lg:leading-[42px]",
);

/** Riadok zoznamu — odsadenie ako pri `list-outside` + `ps-1.5` na položke. */
const LIST_ROW_CLASS = "services-section-list__row";

const PADDING = {
  default: {
    paddingTop: "clamp(96px, 12vw, 168px)",
    paddingBottom: "clamp(72px, 8vw, 120px)",
  },
  spacious: {
    paddingTop: "clamp(140px, 16vw, 240px)",
    paddingBottom: "clamp(140px, 16vw, 240px)",
  },
} as const;

function countWords(text: string): number {
  const t = text.trim();
  return t.length === 0 ? 0 : t.split(/\s+/).filter(Boolean).length;
}

function ServicesRevealMask({
  children,
  delayS,
  maskClassName,
  lineClassName,
}: {
  children: ReactNode;
  delayS: number;
  maskClassName?: string;
  lineClassName?: string;
}) {
  return (
    <span className={cn("reveal-headline__mask", maskClassName)}>
      <span
        className={cn("reveal-headline__line", lineClassName)}
        style={{ animationDelay: `${delayS}s` }}
      >
        {children}
      </span>
    </span>
  );
}

function titleRevealEndDelayS(title: string, columnStaggerS: number): number {
  const words = countWords(title);
  if (words <= 1) {
    return columnStaggerS + TITLE_TO_LIST_GAP_S;
  }
  return (
    columnStaggerS +
    (words - 1) * REVEAL_WORD_STAGGER_S +
    TITLE_TO_LIST_GAP_S
  );
}

function ServiceColumn({
  column,
  index,
  sectionInView,
}: {
  column: ServiceColumn;
  index: number;
  sectionInView: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const animated = !prefersReducedMotion;
  const contentBaseS = prefersReducedMotion
    ? 0
    : servicesPanelContentBaseDelayS(index);

  const { Icon } = column;
  const isFirst = index === 0;
  const isLast = index === SERVICE_COLUMNS.length - 1;
  const titleStartS = contentBaseS + ICON_TO_TITLE_GAP_S;
  const listBaseDelayS = titleRevealEndDelayS(column.title, titleStartS);
  const inView = sectionInView;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col justify-start",
        animated && "reveal-headline",
        animated && inView && "reveal-headline--visible",
        !isFirst && "border-t border-black/[0.08] pt-14 md:border-t-0 md:pt-0",
        isFirst && "md:pr-8 lg:pr-10",
        !isFirst && !isLast && "md:px-8 lg:px-10",
        isLast && !isFirst && "md:pl-8 lg:pl-10 md:pr-0",
      )}
    >
      <div className="mb-8 h-11 w-11 shrink-0 md:h-12 md:w-12">
        {animated ? (
          <ServicesRevealMask
            delayS={contentBaseS}
            maskClassName="services-section-icon__mask"
            lineClassName="flex h-11 w-11 md:h-12 md:w-12"
          >
            <Icon className="block h-full w-full" />
          </ServicesRevealMask>
        ) : (
          <Icon className="block h-full w-full" />
        )}
      </div>

      <RevealHeadline
        as="h2"
        lines={[column.title]}
        inView={inView}
        animated={animated}
        staggerBaseDelayS={titleStartS}
        wrapperClassName="services-section-headline mb-6 md:mb-8"
        className={TITLE_CLASS}
        style={{
          fontWeight: 500,
          color: SERVICES_HEADING,
          lineHeight: "normal",
        }}
      />

      <ul className="m-0 list-none p-0">
        {column.items.map((item, itemIndex) => (
          <li
            key={item}
            className={LIST_ITEM_CLASS}
            style={{ fontWeight: 500 }}
          >
            {animated ? (
              <ServicesRevealMask
                delayS={listBaseDelayS + itemIndex * LIST_ITEM_STAGGER_S}
                maskClassName="services-section-list__mask"
                lineClassName={LIST_ROW_CLASS}
              >
                <span className="services-section-list__bullet" aria-hidden>
                  •
                </span>
                <span className="services-section-list__text">{item}</span>
              </ServicesRevealMask>
            ) : (
              <span className={LIST_ROW_CLASS}>
                <span className="services-section-list__bullet" aria-hidden>
                  •
                </span>
                <span className="services-section-list__text">{item}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Sekcia Services — bez horného eyebrow-u; asymetrický spacing (väčší hore).
 * Vertikálne deliace čiary pokrývajú celú vnútornú výšku blokového kontajnera (top → bottom vrátane odsadenia).
 */
export function ServicesSection({
  variant = "default",
}: {
  variant?: keyof typeof PADDING;
}) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const { ref: sectionRef, inView: sectionInView } = useInView<HTMLElement>({
    once: true,
    threshold: 0.12,
    rootMargin: "0px 0px -5% 0px",
    resetKey: location.key,
  });
  const showPanels = !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="services"
      data-scroll-section
      className="relative isolate w-full bg-white text-[#0a0a0a]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[var(--sand-surface)]" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 z-[1] mx-auto hidden w-full max-w-[var(--layout-max-width,1920px)] px-[clamp(24px,2.1vw,40px)] md:block"
        aria-hidden
      >
        <div className="relative h-full w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${(i / 4) * 100}%`, backgroundColor: DIVIDER }}
            />
          ))}
          <ServicesDividerBlocks />
        </div>
      </div>

      {showPanels ? (
        <ServicesColumnRevealPanels
          key={`services-panels-${location.key}-${sectionInView ? "in" : "out"}`}
          active={sectionInView}
          revealAxis="vertical"
        />
      ) : null}

      <LayoutContainer className="relative z-[2]" style={PADDING[variant]}>
        <div className="relative flex flex-col gap-y-14 md:flex-row md:items-stretch md:gap-0">
          {SERVICE_COLUMNS.map((column, index) => (
            <ServiceColumn
              key={column.title}
              column={column}
              index={index}
              sectionInView={sectionInView || prefersReducedMotion}
            />
          ))}
        </div>
      </LayoutContainer>
    </section>
  );
}
