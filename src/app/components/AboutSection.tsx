import imgImage2Mobile2 from "@/imports/MainContainer-2/d3cc047f1a595cb3f0387d0955e6730e6c665758.png";
import imgIconImage     from "@/imports/MainContainer-2/c6085f260fd9c0ba4788039a74aabfe2a7c5edce.png";
import imgProfileImage  from "@/imports/MainContainer-2/99e69596bfd47f32feaf8f5fa9b959e58b0a5201.png";
import imgProfileImage1 from "@/imports/MainContainer-2/7cdfc9cdb7fbe3d70aa2bee8d0424356fd95b0d6.png";
import imgProfileImage2 from "@/imports/MainContainer-2/99cf73b51a4c59b3d9120e0891819b22ba7a2ac9.png";
import imgProfileImage3 from "@/imports/MainContainer-2/791ff24325ad83485e0f9e7f0ccd0f68b2c07f3d.png";
import { LayoutContainer } from "@/app/components/layout";
import { RevealHeadline } from "@/app/components/RevealHeadline";
// ─── Individual photo cards ───────────────────────────────────────────────────
// Each card reproduces the Figma ImageContainer at fixed 446×490 output size.
// We wrap in an aspect-ratio div so it scales responsively.

function CardMartin() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      {/* base room layer */}
      <div className="absolute inset-0">
        <img src={imgImage2Mobile2} alt="" className="w-full h-full object-cover pointer-events-none" />
      </div>
      {/* portrait on top */}
      <div className="absolute inset-0">
        <img src={imgIconImage} alt="Martin Mroc" className="w-full h-full object-cover pointer-events-none" />
      </div>
    </div>
  );
}

function CardGabriel() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      <img src={imgProfileImage} alt="Gabriel Hudoba" className="w-full h-full object-cover pointer-events-none" />
    </div>
  );
}

function CardMichal() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      <img src={imgProfileImage1} alt="Michal Prekop" className="w-full h-full object-cover pointer-events-none" />
    </div>
  );
}

function CardMichaela() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      {/*
       * Michaela's layer in Figma is 1046px wide with mask-position [301px, 18px]:
       * the visible window starts at x=301 of the 1046px-wide image.
       * We reproduce this by anchoring to the right so the correct portion shows.
       */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imgProfileImage2}
          alt="Michaela Fias"
          className="absolute h-full pointer-events-none"
          style={{ width: "auto", right: 0, top: 0, objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

function CardPatrik() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "446 / 490", borderRadius: 4 }}>
      <img src={imgProfileImage3} alt="Patrik Smejkal" className="w-full h-full object-cover pointer-events-none" />
    </div>
  );
}

// ─── Name + role label ────────────────────────────────────────────────────────
function Label({ name, role, compact }: { name: string; role: string; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 mt-2 md:mt-3">
      <p
        style={{
          fontWeight: 500,
          color: "#013439",
          letterSpacing: "-0.72px",
          lineHeight: "normal",
          ...(compact
            ? { fontSize: "clamp(14px, 3.6vw, 24px)" }
            : { fontSize: 24 }),
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontWeight: 500,
          color: "rgba(1,52,57,0.5)",
          letterSpacing: "-0.48px",
          lineHeight: "normal",
          ...(compact
            ? { fontSize: "clamp(11px, 2.4vw, 16px)" }
            : { fontSize: 16 }),
        }}
      >
        {role}
      </p>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function AboutSection() {
  return (
    <section
      id="team"
      data-scroll-section
      className="relative w-full"
      style={{ backgroundColor: "rgba(228,222,219,0.6)" }}
    >
      <LayoutContainer
        style={{
          paddingTop: "clamp(64px, 6.8vw, 131px)",
          paddingBottom: "clamp(80px, 8.5vw, 163px)",
        }}
      >
        <RevealHeadline
          lines={["Team is assembled from this bench —", "senior people from companies that ship."]}
          style={{
            fontWeight: 500,
            fontSize: "clamp(28px, 2.5vw, 48px)",
            color: "#013439",
            letterSpacing: "-0.063em",
            lineHeight: "normal",
            margin: 0,
            marginBottom: "clamp(48px, 7vw, 134px)",
          }}
        />

        {/*
         * Desktop grid — mirrors Figma staggered layout:
         *   Row 1:  [·]       [Martin]   [Gabriel]
         *   Row 2:  [Michal]  [Michaela] [·]
         *   Row 3:  [·]       [Patrik]   [·]
         */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto auto auto",
            columnGap: "clamp(12px, 2.5vw, 48px)",
            rowGap: "clamp(32px, 5vw, 80px)",
          }}
        >
          {/* Row 1 */}
          <div style={{ gridColumn: 2, gridRow: 1 }}>
            <CardMartin />
            <Label name="Martin Mroc" role="CEO & UX/UI Designer" />
          </div>
          <div style={{ gridColumn: 3, gridRow: 1 }}>
            <CardGabriel />
            <Label name="Gabriel Hudoba" role="Consultant & UX/UI Designer" />
          </div>

          {/* Row 2 */}
          <div style={{ gridColumn: 1, gridRow: 2 }}>
            <CardMichal />
            <Label name="Michal Prekop" role="3D Artist" />
          </div>
          <div style={{ gridColumn: 2, gridRow: 2 }}>
            <CardMichaela />
            <Label name="Michaela Fias" role="Brand Designer" />
          </div>

          {/* Row 3 */}
          <div style={{ gridColumn: 2, gridRow: 3 }}>
            <CardPatrik />
            <Label name="Patrik Smejkal" role="Product Manager" />
          </div>
        </div>

        {/* Mobile — two people per row */}
        <div className="grid md:hidden grid-cols-2 gap-x-[clamp(8px,2.5vw,20px)] gap-y-10">
          {[
            { Card: CardMartin,   name: "Martin Mroc",     role: "CEO & UX/UI Designer" },
            { Card: CardGabriel,  name: "Gabriel Hudoba",  role: "Consultant & UX/UI Designer" },
            { Card: CardMichal,   name: "Michal Prekop",   role: "3D Artist" },
            { Card: CardMichaela, name: "Michaela Fias",   role: "Brand Designer" },
            { Card: CardPatrik,   name: "Patrik Smejkal",  role: "Product Manager" },
          ].map(({ Card, name, role }) => (
            <div key={name} className="min-w-0">
              <Card />
              <Label name={name} role={role} compact />
            </div>
          ))}
        </div>
      </LayoutContainer>
    </section>
  );
}
