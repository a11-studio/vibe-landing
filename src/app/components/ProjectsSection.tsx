import imgSilencio    from "figma:asset/d0cc88609464830db5a519803d66b943f3a8741e.png";
import imgRealitiez   from "figma:asset/e456a14899251227c4ec37785838c3ea552f7971.png";
import imgAccuWeather from "figma:asset/ccbe4b5cf5687edf1efe0a848055c6d13b9a393f.png";
import imgSelfCheck   from "figma:asset/a09f93abcab1572bed25b1d59de6c0f2be87884a.png";
import imgSpotify     from "figma:asset/5befbd932cd55a328c20d0b015fe5afc87e4ad6f.png";
import { ArrowIcon } from "@/app/components/shared/ArrowIcon";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
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
  },
  {
    name: "SelfCheck",
    description:
      "An interactive product concept designed to turn self-reflection into structured, engaging experiences through guided quizzes and feedback loops.",
    tags: ["UX/UI Design", "Interaction Design", "Prototype"],
    image: imgSelfCheck,
  },
  {
    name: "Spotify (Apple Vision)",
    description:
      "A spatial product exploration rethinking how music discovery and listening could work in a mixed-reality environment.",
    tags: ["UX/UI Design", "Spatial Design"],
    image: imgSpotify,
  },
];

// ─── Tag pill ──────────────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "#edfafc",
        color: "#013439",
        fontWeight: 500,
        fontSize: 14,
        letterSpacing: "-0.42px",
        lineHeight: "24px",
        padding: "6px 14px",
        borderRadius: 50,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ─── Project row ──────────────────────────────────────────────────────────────
interface ProjectRowProps {
  name: string;
  description: string;
  tags: string[];
  image: string;
}

function ProjectRow({ name, description, tags, image }: ProjectRowProps) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-start w-full"
      style={{ paddingTop: "clamp(32px, 4vw, 78px)", paddingBottom: "clamp(32px, 4vw, 78px)", gap: "clamp(24px, 3vw, 48px)" }}
    >
        {/* Left — text */}
        <div
          className="flex flex-col shrink-0"
          style={{
            width: "clamp(220px, 28%, 430px)",
            gap: 16,
            paddingTop: 6,
          }}
        >
          {/* Project name */}
          <h3
            style={{
              fontWeight: 500,
              fontSize: "clamp(28px, 2.5vw, 48px)",
              color: "#013439",
              letterSpacing: "-0.063em",
              lineHeight: "normal",
              margin: 0,
            }}
          >
            {name}
          </h3>

          {/* Description */}
          <p
            style={{
              fontWeight: 500,
              fontSize: 15,
              color: "#616161",
              letterSpacing: "-0.45px",
              lineHeight: "24px",
              margin: 0,
            }}
          >
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Right — image */}
        <div className="flex-1 min-w-0 overflow-hidden" style={{ borderRadius: 4 }}>
          <img
            src={image}
            alt={name}
            className="w-full h-auto block object-cover"
            style={{ aspectRatio: "1064 / 577" }}
          />
        </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function ProjectsSection() {
  return (
    <section
      id="work"
      data-scroll-section
      className="relative w-full bg-white"
    >
      <div
        className="mx-auto w-full flex flex-col"
        style={{
          maxWidth: 1920,
          paddingTop: "clamp(48px, 6.5vw, 124px)",
          paddingBottom: "clamp(48px, 6.5vw, 124px)",
          paddingLeft: "clamp(16px, 2.1vw, 40px)",
          paddingRight: "clamp(16px, 2.1vw, 40px)",
        }}
      >
        {/* Section heading */}
        <div className="flex items-center justify-between mb-10 md:mb-16">
          <h2
            style={{
              fontWeight: 500,
              fontSize: "clamp(28px, 3.54vw, 68px)",
              color: "#013439",
              letterSpacing: "-0.044em",
              lineHeight: "normal",
              margin: 0,
            }}
          >
            This is how we do it
          </h2>

          {/* See all */}
          <button
            className="flex items-center gap-2 shrink-0 hover:opacity-60 transition-opacity duration-200"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <span
              style={{
                fontWeight: 400,
                fontSize: "clamp(18px, 2.08vw, 40px)",
                color: "rgba(1,52,57,0.5)",
                letterSpacing: "-0.044em",
                lineHeight: "normal",
              }}
            >
              See all
            </span>
            <ArrowIcon color="rgba(1,52,57,0.5)" size={28} />
          </button>
        </div>

        {/* Project list */}
        <div className="flex flex-col w-full">
          {PROJECTS.map((project) => (
            <ProjectRow key={project.name} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}