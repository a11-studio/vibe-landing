import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LayoutContainer, LayoutGrid } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import imgSenior from "@/assets/image-1.svg?url";
import imgFlexible from "@/assets/image-2.svg?url";
import imgPrototype from "@/assets/image-3.svg?url";

const PROCESS_CARD_ENTER_Y = 30;
const PROCESS_CARD_STAGGER_S = 0.14;
const PROCESS_CARD_DURATION_S = 0.55;

interface ApproachCardProps {
  image: string;
  title: string;
  description: string;
}

function ApproachCard({ image, title, description }: ApproachCardProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-12 md:gap-14">
      <div
        className="flex w-full items-center justify-center overflow-hidden"
        style={{ borderRadius: 4, aspectRatio: "488 / 396" }}
      >
        <img src={image} alt={title} className="h-full w-full object-contain" />
      </div>
      <div className="flex min-w-0 flex-col gap-3 text-center">
        <p
          className="m-0 text-white"
          style={{
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: "-0.6px",
            lineHeight: "normal",
          }}
        >
          {title}
        </p>
        <p
          className="m-0 max-w-[420px] self-center"
          style={{
            fontWeight: 400,
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.55)",
            letterSpacing: "-0.32px",
            lineHeight: "24px",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

const CARDS: ApproachCardProps[] = [
  {
    image: imgSenior,
    title: "Senior-only team",
    description:
      "A team of experienced product designers, directly involved from direction to execution.",
  },
  {
    image: imgFlexible,
    title: "Flexible assembly",
    description:
      "We assemble the right mix of people around your product — plugging in where needed and scaling back when it’s not.",
  },
  {
    image: imgPrototype,
    title: "Prototype-first delivery",
    description:
      "We turn ideas into real, testable prototypes so teams can validate decisions, reduce uncertainty, and move faster.",
  },
];

/**
 * Sekcia „Our approach“ — Figma 621:19494: riadok boxov = 1 + 3 + 1 + 3 + 1 + 3
 * (ľavý okraj, box, medzera, box, medzera, box) na 12 stĺpcoch.
 */
export function ProcessSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="process"
      data-scroll-section
      className="relative w-full overflow-hidden bg-[var(--process-canvas)] text-white"
    >
      <LayoutContainer
        style={{
          paddingTop: "clamp(88px, 8vw, 140px)",
          paddingBottom: "clamp(140px, 11vw, 200px)",
        }}
      >
        <LayoutGrid className="gap-y-16 md:gap-y-28">
          <div className="col-span-12 md:col-start-3 md:col-span-8">
            <p
              className="text-center"
              style={{
                fontWeight: 500,
                fontSize: "clamp(12px, 0.95vw, 16px)",
                color: "var(--logos-intro)",
                letterSpacing: "0.12em",
                lineHeight: "normal",
                textTransform: "uppercase",
                marginBottom: "clamp(12px, 1.2vw, 20px)",
              }}
            >
              Our process
            </p>

            <div className="mx-auto max-w-[min(100vw-2rem,1600px)] text-center">
              <RevealHeadline
                lines={["Most teams don’t need more design.", "They need the right people."]}
                className="text-center text-white"
                lineClassNames={[
                  "whitespace-normal xl:whitespace-nowrap",
                  "mt-1 whitespace-normal xl:whitespace-nowrap",
                ]}
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(28px, 3.15vw, 60px)",
                  color: "#ffffff",
                  letterSpacing: "clamp(-1px, -0.12vw, -2.5px)",
                  lineHeight: 1.08,
                  margin: 0,
                }}
              />
            </div>
          </div>

          <div
            className="hidden min-h-px md:col-span-1 md:block"
            aria-hidden
          />
          {CARDS.map((card, index) => (
            <Fragment key={card.title}>
              <motion.div
                className="col-span-12 md:col-span-3"
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: PROCESS_CARD_ENTER_Y }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : PROCESS_CARD_DURATION_S,
                  delay: prefersReducedMotion ? 0 : index * PROCESS_CARD_STAGGER_S,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ApproachCard {...card} />
              </motion.div>
              {index < CARDS.length - 1 ? (
                <div
                  className="hidden min-h-px md:col-span-1 md:block"
                  aria-hidden
                />
              ) : null}
            </Fragment>
          ))}
        </LayoutGrid>
      </LayoutContainer>
    </section>
  );
}
