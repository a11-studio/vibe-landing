import type { TeamMember } from "@/app/data/teamMembers";
import { IMAGE_RADIUS } from "@/app/utils/tokens";
import { cn } from "@/app/components/ui/utils";

/** Karta fotky — zdieľaná Meet our team + Services hero orbit. */
export function TeamMemberPhoto({
  src,
  alt,
  objectPosition,
  className,
}: Pick<TeamMember, "src" | "alt" | "objectPosition"> & { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ borderRadius: IMAGE_RADIUS }}>
      <img
        src={src}
        alt={alt}
        className="pointer-events-none h-full w-full object-cover"
        style={objectPosition ? { objectPosition } : undefined}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
