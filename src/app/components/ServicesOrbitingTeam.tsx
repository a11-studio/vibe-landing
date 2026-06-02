import { useEffect, useState, type CSSProperties } from "react";
import { TEAM_MEMBERS } from "@/app/data/teamMembers";
import { TeamMemberPhoto } from "@/app/components/TeamMemberPhoto";
import { cn } from "@/app/components/ui/utils";

const ORBIT_DURATION_S = 36;
const MARQUEE_LOOP = [...TEAM_MEMBERS, ...TEAM_MEMBERS];

type ServicesOrbitingTeamProps = {
  className?: string;
};

function TeamPhotoCard({
  member,
  className,
}: {
  member: (typeof TEAM_MEMBERS)[number];
  className?: string;
}) {
  return (
    <div className={cn("services-hero__team-photo shrink-0", className)}>
      <TeamMemberPhoto
        src={member.src}
        alt={member.alt}
        objectPosition={member.objectPosition}
        className="relative h-full w-full overflow-hidden"
      />
    </div>
  );
}

/** Fotky tímu — desktop: elipsa okolo nadpisu; mobile: spodný pás, pomalý infinite scroll. */
export function ServicesOrbitingTeam({ className }: ServicesOrbitingTeamProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = TEAM_MEMBERS.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {/* Mobile — jedna rovina pri spodku hero */}
      <div
        className={cn("services-hero__team-marquee md:hidden", className)}
        aria-hidden
      >
        <div
          className={cn(
            "services-hero__team-marquee-track",
            reducedMotion && "services-hero__team-marquee-track--static",
          )}
        >
          {(reducedMotion ? TEAM_MEMBERS : MARQUEE_LOOP).map((member, index) => (
            <TeamPhotoCard
              key={`${member.alt}-${index}`}
              member={member}
            />
          ))}
        </div>
      </div>

      {/* Desktop — orbit */}
      <div
        className={cn(
          "services-hero__orbit-field hidden md:block",
          className,
        )}
        aria-hidden
      >
        {TEAM_MEMBERS.map((member, index) => (
          <div
            key={member.alt}
            className={cn(
              "services-hero__orbit-photo",
              reducedMotion && "services-hero__orbit-photo--static",
            )}
            style={
              {
                ["--orbit-index" as string]: index,
                ["--orbit-count" as string]: count,
                ["--orbit-delay" as string]: reducedMotion
                  ? "0s"
                  : `${-(ORBIT_DURATION_S / count) * index}s`,
                ["--orbit-start" as string]: reducedMotion
                  ? `${(index / count) * 100}%`
                  : undefined,
              } as CSSProperties
            }
          >
            <TeamMemberPhoto
              src={member.src}
              alt={member.alt}
              objectPosition={member.objectPosition}
              className="relative h-full w-full overflow-hidden"
            />
          </div>
        ))}
      </div>
    </>
  );
}
