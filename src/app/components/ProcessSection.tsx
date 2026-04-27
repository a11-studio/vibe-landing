import { useEffect, useRef, useState } from "react";
import { LayoutContainer, LayoutGrid } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";
import { useInView } from "@/app/hooks/useInView";
import imgSenior from "@/assets/process-section/process-senior.png";
import imgFlexible from "@/assets/process-section/process-flexible.png";
import imgPrototype from "@/assets/process-section/process-prototype.png";

// ─── Single card (Figma 601:17068 — obrázok 488×396, text pod ním) ─────────────
interface CardProps {
  image: string;
  title: string;
  description: string;
}

function ProcessCard({ image, title, description }: CardProps) {
  return (
    <div className="flex w-full flex-col gap-10">
      <div
        className="w-full overflow-hidden"
        style={{ borderRadius: 4, aspectRatio: "488 / 396" }}
      >
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-3">
        <p
          style={{
            fontWeight: 500,
            fontSize: 20,
            color: "#013439",
            letterSpacing: "-0.6px",
            lineHeight: "normal",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: "#616161",
            letterSpacing: "-0.42px",
            lineHeight: "22px",
            maxWidth: 420,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

const PROCESS_SAND = "rgba(228, 222, 219, 0.6)";

/** Po zobrazení nadpisu v viewporte – oneskorenie pred prechodom biela → piesok. */
const SAND_REVEAL_DELAY_MS = 240;

// ─── Section (Figma: Testing > node 601:17068) ────────────────────────────────
export function ProcessSection() {
  const sandHeadlineRef = useRef<HTMLDivElement>(null);
  const { inView: sandHeadlineInView } = useInView<HTMLDivElement>({
    elementRef: sandHeadlineRef,
    once: true,
    threshold: 0.35,
  });
  const [sandOn, setSandOn] = useState(false);

  useEffect(() => {
    if (!sandHeadlineInView) return;
    const id = window.setTimeout(() => {
      setSandOn(true);
    }, SAND_REVEAL_DELAY_MS);
    return () => clearTimeout(id);
  }, [sandHeadlineInView]);

  return (
    <section
      id="process"
      data-scroll-section
      className="relative w-full overflow-hidden transition-[background-color] duration-[1200ms] ease-out motion-reduce:transition-none"
      style={{ backgroundColor: sandOn ? PROCESS_SAND : "#ffffff" }}
    >
      <LayoutContainer
        style={{
          paddingTop: "clamp(64px, 5vw, 96px)",
          paddingBottom: "clamp(100px, 7vw, 140px)",
        }}
      >
        <LayoutGrid>
          <div ref={sandHeadlineRef} className="col-span-12">
            {/* Eyebrow — „Our approach“ */}
            <p
              className="text-center"
              style={{
                fontWeight: 500,
                fontSize: "clamp(12px, 0.95vw, 16px)",
                color: "#56544f",
                letterSpacing: "0.12em",
                lineHeight: "normal",
                textTransform: "uppercase",
                marginBottom: "clamp(12px, 1.2vw, 20px)",
              }}
            >
              Our approach
            </p>

            <div className="mx-auto max-w-[min(100vw-2rem,1600px)] text-center">
              <RevealHeadline
                lines={["Most teams don’t need more design.", "They need the right team."]}
                className="text-center"
                lineClassNames={[
                  "whitespace-normal xl:whitespace-nowrap",
                  "mt-1 whitespace-normal xl:whitespace-nowrap",
                ]}
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(22px, 2.85vw, 56px)",
                  color: "#013439",
                  letterSpacing: "clamp(-1px, -0.12vw, -2.5px)",
                  lineHeight: 1.12,
                  margin: 0,
                }}
              />
            </div>
          </div>

          {/*
            Karty: vždy 3 vedľa seba (md+) — grid-cols-3, bez zalamovania 2+1.
            Medzery ~182px na šírke: gap-x, nie 12-stĺpcová mriežka.
            Stagger: 0 / 316 / 79 px.
          */}
          <div
            className="col-span-12 mt-12 hidden w-full min-w-0 grid-cols-3 items-start gap-x-[clamp(16px,9.5vw,182px)] md:mt-20 md:grid"
          >
            <div className="min-w-0" style={{ marginTop: 0 }}>
              <ProcessCard
                image={imgSenior}
                title="Senior-only team"
                description="A team of experienced product designers, directly involved from direction to execution."
              />
            </div>
            <div className="min-w-0" style={{ marginTop: "clamp(80px, 16.46vw, 316px)" }}>
              <ProcessCard
                image={imgFlexible}
                title="Flexible assembly"
                description="We assemble the right mix of people around your product — plugging in where needed and scaling back when it’s not."
              />
            </div>
            <div className="min-w-0" style={{ marginTop: "clamp(20px, 4.11vw, 79px)" }}>
              <ProcessCard
                image={imgPrototype}
                title="Prototype-first delivery"
                description="We turn ideas into real, testable prototypes so teams can validate decisions, reduce uncertainty, and move faster."
              />
            </div>
          </div>
        </LayoutGrid>

        {/* Mobile — pod sebou */}
        <div className="mt-12 flex flex-col gap-12 md:hidden">
          <ProcessCard
            image={imgSenior}
            title="Senior-only team"
            description="A team of experienced product designers, directly involved from direction to execution."
          />
          <ProcessCard
            image={imgFlexible}
            title="Flexible assembly"
            description="We assemble the right mix of people around your product — plugging in where needed and scaling back when it’s not."
          />
          <ProcessCard
            image={imgPrototype}
            title="Prototype-first delivery"
            description="We turn ideas into real, testable prototypes so teams can validate decisions, reduce uncertainty, and move faster."
          />
        </div>
      </LayoutContainer>
    </section>
  );
}
