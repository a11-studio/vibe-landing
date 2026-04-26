import imgSenior    from "figma:asset/a95f7e385d0b25bf47ba2d7a7f50cc074bee3c7d.png"; // purple – left
import imgFlexible  from "figma:asset/55c72bbf9392712faf976543217fe402213c814c.png"; // green  – middle
import imgPrototype from "figma:asset/2b67c20eea0beb68f980e0a2183fd1c370c263db.png"; // orange – right

// ─── Single card ──────────────────────────────────────────────────────────────
interface CardProps {
  image: string;
  title: string;
  description: string;
}
function ProcessCard({ image, title, description }: CardProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Image — 4:3 ratio matching Figma 488×396 */}
      <div
        className="w-full overflow-hidden"
        style={{ borderRadius: 4, aspectRatio: "488 / 396" }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <p
        style={{
          fontWeight: 500,
          fontSize: 24,
          color: "#013439",
          letterSpacing: "-0.72px",
          lineHeight: "normal",
        }}
      >
        {title}
      </p>

      {/* Description */}
      <p
        style={{
          fontWeight: 500,
          fontSize: 15,
          color: "#616161",
          letterSpacing: "-0.45px",
          lineHeight: "24px",
          maxWidth: 420,
        }}
      >
        {description}
      </p>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function ProcessSection() {
  return (
    <section
      id="process"
      data-scroll-section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "rgba(228,222,219,0.6)" }}
    >
      {/*
       * Inner wrapper: full width up to 1920px, padded 39px left/right to
       * mirror the Figma canvas placement (cards start at x=39).
       */}
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: 1920, paddingTop: 96, paddingBottom: 140 }}
      >

        {/* ── Headline ────────────────────────────────────────────────────────
         *  Figma positions (at 1920px canvas):
         *    Line 1: left = calc(50% - 762px) = 198px  → indented
         *    Line 2: left = calc(50% - 921px) = 39px   → flush left
         *  Difference ≈ 159px, ~8.3vw at 1920px.
         */}
        <div
          className="flex flex-col"
          style={{ paddingLeft: "clamp(16px, 2.03vw, 39px)" }}
        >
          {/* Line 1 — extra left indent */}
          <h2
            style={{
              fontWeight: 500,
              fontSize: "clamp(28px, 3.54vw, 68px)",
              color: "#013439",
              letterSpacing: "clamp(-1px, -0.156vw, -3px)",
              lineHeight: "normal",
              paddingLeft: "clamp(20px, 8.28vw, 159px)",
            }}
          >
            Most teams don't need more design.
          </h2>

          {/* Line 2 — no indent */}
          <h2
            style={{
              fontWeight: 500,
              fontSize: "clamp(28px, 3.54vw, 68px)",
              color: "#013439",
              letterSpacing: "clamp(-1px, -0.156vw, -3px)",
              lineHeight: "normal",
            }}
          >
            They need the right team.
          </h2>
        </div>

        {/* ── Cards ───────────────────────────────────────────────────────────
         *  Desktop: 3 equal columns, staggered via marginTop
         *    Col 1: mt = 0        (image top 545 in Figma)
         *    Col 2: mt ≈ +316px   (image top 861)
         *    Col 3: mt ≈ +79px    (image top 624)
         *
         *  At 1920px each card is 488px wide with ~189px gaps.
         *  We scale stagger proportionally: clamp(min, vw, max).
         */}
        <div
          className="hidden md:grid mt-16"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            columnGap: "clamp(12px, 9.84vw, 189px)",
            paddingLeft: "clamp(16px, 2.03vw, 39px)",
            paddingRight: "clamp(16px, 2.03vw, 39px)",
            alignItems: "start",
          }}
        >
          {/* Card 1 — Senior-only team, top-left, no offset */}
          <div style={{ marginTop: 0 }}>
            <ProcessCard
              image={imgSenior}
              title="Senior-only team"
              description="A team of experienced product designers, directly involved from direction to execution."
            />
          </div>

          {/* Card 2 — Flexible assembly, middle, pushed down */}
          <div style={{ marginTop: "clamp(80px, 16.46vw, 316px)" }}>
            <ProcessCard
              image={imgFlexible}
              title="Flexible assembly"
              description="We assemble the right mix of people around your product — plugging in where needed and scaling back when it's not."
            />
          </div>

          {/* Card 3 — Prototype-first, right, slightly down */}
          <div style={{ marginTop: "clamp(20px, 4.11vw, 79px)" }}>
            <ProcessCard
              image={imgPrototype}
              title="Prototype-first delivery"
              description="We turn ideas into real, testable prototypes so teams can validate decisions, reduce uncertainty, and move faster."
            />
          </div>
        </div>

        {/* Mobile — stacked single column */}
        <div
          className="flex md:hidden flex-col gap-12 mt-12"
          style={{ paddingLeft: 16, paddingRight: 16 }}
        >
          <ProcessCard
            image={imgSenior}
            title="Senior-only team"
            description="A team of experienced product designers, directly involved from direction to execution."
          />
          <ProcessCard
            image={imgFlexible}
            title="Flexible assembly"
            description="We assemble the right mix of people around your product — plugging in where needed and scaling back when it's not."
          />
          <ProcessCard
            image={imgPrototype}
            title="Prototype-first delivery"
            description="We turn ideas into real, testable prototypes so teams can validate decisions, reduce uncertainty, and move faster."
          />
        </div>

      </div>
    </section>
  );
}
