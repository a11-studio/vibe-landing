import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import imgBanner from "@/assets/banner.png";
import imgRege from "@/assets/rege.png";
import imgSelfcheckPhoto from "@/assets/selfcheck.png";
import imgSilencio from "figma:asset/d0cc88609464830db5a519803d66b943f3a8741e.png";
import imgRealitiez from "figma:asset/e456a14899251227c4ec37785838c3ea552f7971.png";
import imgAccuWeather from "figma:asset/ccbe4b5cf5687edf1efe0a848055c6d13b9a393f.png";
import imgSpotify from "figma:asset/5befbd932cd55a328c20d0b015fe5afc87e4ad6f.png";
import { LayoutContainer, LayoutGrid } from "@/app/components/layout";
import { useInView } from "@/app/hooks/useInView";

// ─── Data ─────────────────────────────────────────────────────────────────────
/** Výška média v druhom riadku (AccuWeather · SelfCheck · Rege) — Figma cca 325px. */
const MEDIUM_ROW_IMAGE_PX = 325;

const METRIC_COUNT_START = 10;
const METRIC_COUNT_END = 25;
const METRIC_COUNT_MS = 1500;

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

type ProjectEntry = {
  name: string;
  description: string;
  tags: string[];
  image: string;
  /** Voliteľný CSS aspect-ratio, ak nie je `imageHeightPx`. */
  imageAspect?: string;
  /** Pevná výška obrázka (px) — zarovnanie v jednom riadku. */
  imageHeightPx?: number;
};

const PROJECTS: ProjectEntry[] = [
  {
    name: "Silencio",
    description:
      "A Web3-powered platform that transforms smartphones into a global network of audio sensors, collecting real-world data for AI and urban intelligence.",
    tags: ["UX/UI Design", "Brand lifting"],
    image: imgSilencio,
  },
  {
    name: "Realitiez",
    description:
      "A real-world asset (RWA) platform exploring how tokenized real estate can be discovered, evaluated, and transacted through a clear, structured product experience.",
    tags: ["UX/UI Design", "Brand lifting"],
    image: imgRealitiez,
  },
  {
    name: "AccuWeather",
    description:
      "A cleaner, more focused product direction designed to simplify how users understand forecasts, conditions, and real-time weather data.",
    tags: ["UX/UI Design", "Animation"],
    image: imgAccuWeather,
    imageHeightPx: MEDIUM_ROW_IMAGE_PX,
  },
  {
    name: "SelfCheck",
    description:
      "An interactive product concept designed to turn self-reflection into structured, engaging experiences through guided quizzes and feedback loops.",
    tags: ["Interaction Design", "Prototype"],
    image: imgSelfcheckPhoto,
    imageHeightPx: MEDIUM_ROW_IMAGE_PX,
  },
  {
    name: "Rege Riders",
    description:
      "Visual identity and product UI for a rider-focused platform — clear navigation, bold brand presence, and a tactile feel built for motion and community.",
    tags: ["UX/UI Design", "Brand lifting"],
    image: imgRege,
    imageHeightPx: MEDIUM_ROW_IMAGE_PX,
  },
  {
    name: "Spotify (Apple Vision)",
    description:
      "A spatial product exploration rethinking how music discovery and listening could work in a mixed-reality environment.",
    tags: ["UX/UI Design", "Spatial Design"],
    image: imgSpotify,
  },
];

// ─── Tag — Figma 621:22379: jemný svetlý pás na tmavom pozadí ────────────────
function ProjectTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[50px] px-4 py-2"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        color: "#ffffff",
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: "-0.48px",
        lineHeight: "24px",
      }}
    >
      {label}
    </span>
  );
}

function ProjectCardText({ project }: { project: ProjectEntry }) {
  return (
    <div className="flex min-w-0 flex-col gap-4 text-left">
      <h3
        className="m-0"
        style={{
          fontWeight: 500,
          fontSize: "clamp(28px, 2.2vw, 48px)",
          color: "#ffffff",
          letterSpacing: "-3px",
          lineHeight: "normal",
        }}
      >
        {project.name}
      </h3>
      <p
        className="m-0 max-w-[430px]"
        style={{
          fontWeight: 500,
          fontSize: 16,
          color: "rgba(255, 255, 255, 0.6)",
          letterSpacing: "-0.48px",
          lineHeight: "24px",
        }}
      >
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <ProjectTag key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}

/** Silencio + Realitiez: spodné hrany obrázkov v jednej rovine — Realitiez je len posunutý nadol (`items-end` / `self-end`), obrázky bez natiahnutia orezania. */
function ProjectsRow1Aligned({ left, right }: { left: ProjectEntry; right: ProjectEntry }) {
  return (
    <>
      {/* Mobile: každý projekt ako box — médium, potom text */}
      <div className="col-span-12 flex flex-col gap-10 md:hidden">
        <ProjectCard project={left} size="large" />
        <ProjectCard project={right} size="medium" />
      </div>

      <div className="col-span-12 hidden w-full flex-col gap-6 md:flex md:gap-8">
        <div className="grid w-full grid-cols-12 gap-x-5">
          <div
            className="col-span-12 w-full overflow-hidden md:col-span-7 md:self-start"
            style={{ borderRadius: 4 }}
          >
            <img
              src={left.image}
              alt=""
              className="block aspect-[1064/576] w-full object-cover"
            />
          </div>
          <div className="hidden min-h-px md:col-span-1 md:block" aria-hidden />
          <div className="col-span-12 w-full md:col-span-4 md:self-end">
            <div className="w-full overflow-hidden" style={{ borderRadius: 4 }}>
              <img
                src={right.image}
                alt=""
                className="block aspect-[600/325] w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-12 gap-x-5">
          <div className="col-span-12 md:col-span-7">
            <ProjectCardText project={left} />
          </div>
          <div className="hidden min-h-px md:col-span-1 md:block" aria-hidden />
          <div className="col-span-12 md:col-span-4">
            <ProjectCardText project={right} />
          </div>
        </div>
      </div>
    </>
  );
}

/** Spotify + metrika (+25 M): rovnaké zarovnanie ako Silencio/Realitiez — spodky vizuálov v jednej rovine. */
function ProjectsRow3SpotifyMetric({
  project,
  metricBackgroundImage,
}: {
  project: ProjectEntry;
  metricBackgroundImage: string;
}) {
  return (
    <>
      <div className="col-span-12 flex flex-col gap-10 md:hidden">
        <ProjectCard project={project} size="large" />
        <ProjectsMetricCard backgroundImage={metricBackgroundImage} />
      </div>

      <div className="col-span-12 hidden w-full flex-col gap-6 md:flex md:gap-8">
        <div className="grid w-full grid-cols-12 gap-x-5">
          <div
            className="col-span-12 w-full overflow-hidden md:col-span-7 md:self-start"
            style={{ borderRadius: 4 }}
          >
            <img
              src={project.image}
              alt=""
              className="block aspect-[1064/576] w-full object-cover"
            />
          </div>
          <div className="hidden min-h-px md:col-span-1 md:block" aria-hidden />
          <div className="col-span-12 w-full md:col-span-4 md:self-end">
            <ProjectsMetricCard backgroundImage={metricBackgroundImage} />
          </div>
        </div>
        <div className="grid w-full grid-cols-12 gap-x-5">
          <div className="col-span-12 md:col-span-7">
            <ProjectCardText project={project} />
          </div>
          <div className="hidden min-h-px md:col-span-1 md:block" aria-hidden />
          <div className="hidden md:col-span-4 md:block" aria-hidden />
        </div>
      </div>
    </>
  );
}

type ProjectCardSize = "large" | "medium";

function ProjectCard({
  project,
  size,
}: {
  project: ProjectEntry;
  size: ProjectCardSize;
}) {
  const aspectDefault = size === "large" ? "1064 / 576" : "600 / 325";
  const aspect = project.imageAspect ?? aspectDefault;
  const fixedH = project.imageHeightPx;

  return (
    <article className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
      <div className="w-full overflow-hidden" style={{ borderRadius: 4 }}>
        {fixedH != null ? (
          <img
            src={project.image}
            alt=""
            className="block h-auto w-full object-cover md:h-[var(--project-fixed-img-h)] md:max-h-[var(--project-fixed-img-h)] md:aspect-auto"
            style={
              {
                aspectRatio: aspect,
                ["--project-fixed-img-h" as string]: `${fixedH}px`,
              } as CSSProperties
            }
          />
        ) : (
          <img
            src={project.image}
            alt=""
            className="block h-auto w-full object-cover"
            style={{ aspectRatio: aspect }}
          />
        )}
      </div>
      <ProjectCardText project={project} />
    </article>
  );
}

function ProjectsMetricCard({ backgroundImage }: { backgroundImage: string }) {
  const { ref, inView } = useInView({ threshold: 0.32, once: true });
  const [value, setValue] = useState(METRIC_COUNT_START);

  useEffect(() => {
    if (!inView) return;

    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(METRIC_COUNT_END);
      return;
    }

    let cancelled = false;
    const t0 = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const p = Math.min(1, (now - t0) / METRIC_COUNT_MS);
      const eased = easeOutCubic(p);
      const next = Math.round(
        METRIC_COUNT_START + (METRIC_COUNT_END - METRIC_COUNT_START) * eased
      );
      setValue(next);
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-10 text-center"
      style={{ borderRadius: 4, aspectRatio: "600 / 325" }}
    >
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Len spodný jemný scrim — zvyšok plochy ostáva ako svetlý source */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/35 to-transparent"
        aria-hidden
      />
      <div
        className="relative z-10 flex flex-col items-center justify-center gap-3"
        style={{ textShadow: "0 1px 18px rgba(0,0,0,0.35)" }}
      >
        <p
          className="m-0"
          style={{
            fontWeight: 500,
            fontSize: "clamp(40px, 4vw, 68px)",
            color: "#ffffff",
            letterSpacing: "-3px",
            lineHeight: "normal",
          }}
        >
          +{value}
          &nbsp;M
        </p>
        <p
          className="m-0 max-w-[430px]"
          style={{
            fontWeight: 500,
            fontSize: 16,
            color: "rgba(255, 255, 255, 0.9)",
            letterSpacing: "-0.48px",
            lineHeight: "24px",
          }}
        >
          Active users in apps that we design
        </p>
      </div>
    </div>
  );
}

function GridSpacer() {
  return <div className="hidden min-h-px md:col-span-1 md:block" aria-hidden />;
}

/**
 * Projekty — Figma 621:22379: pod logami, canvas ako logos, 12-col grid:
 * riadok 1: 7 + 1 + 4 · riadok 2: 4 + 1 + 3 + 1 + 3 · riadok 3: 7 + 1 + 4 (metrika).
 */
export function ProjectsSection() {
  const [p0, p1, p2, p3, p4, p5] = PROJECTS;

  return (
    <section
      id="work"
      data-scroll-section
      className="relative w-full bg-[var(--logos-canvas)] text-white"
    >
      <LayoutContainer
        className="flex flex-col"
        style={{
          paddingTop: "clamp(48px, 6.5vw, 96px)",
          paddingBottom: "clamp(64px, 8vw, 140px)",
        }}
      >
        <div className="mb-10 md:mb-14">
          <p
            className="m-0 max-w-[min(100%,42rem)]"
            style={{
              fontWeight: 500,
              fontSize: "clamp(12px, 0.95vw, 18px)",
              color: "var(--logos-intro)",
              letterSpacing: "0.12em",
              lineHeight: "normal",
              textTransform: "uppercase",
            }}
          >
            This is how we do it
          </p>
        </div>

        <LayoutGrid className="gap-y-12 md:gap-y-[clamp(96px,14vw,200px)]">
          <ProjectsRow1Aligned left={p0} right={p1} />

          {/* Row 2 — 4 · 1 · 3 · 1 · 3; mobile: jeden stĺpec, menšie medzery medzi kartami */}
          <div className="col-span-12 flex flex-col gap-10 md:contents">
            <div className="col-span-12 md:col-span-4">
              <ProjectCard project={p2} size="medium" />
            </div>
            <GridSpacer />
            <div className="col-span-12 md:col-span-3">
              <ProjectCard project={p3} size="medium" />
            </div>
            <GridSpacer />
            <div className="col-span-12 md:col-span-3">
              <ProjectCard project={p4} size="medium" />
            </div>
          </div>

          {/* Row 3 — 7 · 1 · 4 (Spotify + metrika) */}
          <ProjectsRow3SpotifyMetric project={p5} metricBackgroundImage={imgBanner} />
        </LayoutGrid>
      </LayoutContainer>
    </section>
  );
}
