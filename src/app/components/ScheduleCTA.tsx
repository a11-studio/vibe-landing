import imgProfileImage1 from "@/imports/MainContainer/ecc192fa4213baaac273888921a1551274ec058a.webp";
import { CALENDLY_BOOKING_URL } from "@/app/components/heroConstants";

export function ScheduleCTA({ scrolled }: { scrolled: boolean }) {
  return (
    <div
      className="fixed bottom-8 right-8 z-50 hidden transition-[opacity,transform] duration-300 ease-out [transform:translateX(var(--schedule-cta-scroll-x))] sm:block"
      style={{
        ["--schedule-cta-scroll-x" as string]: scrolled ? "40px" : "0px",
        opacity: scrolled ? 0 : 1,
        pointerEvents: scrolled ? "none" : "auto",
      }}
    >
      <a
        href={CALENDLY_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex cursor-pointer items-center gap-4 rounded-[62px] no-underline"
        style={{
          backgroundColor: "white",
          padding: "6px 22px 6px 8px",
          boxShadow: "0 6px 30px rgba(0,0,0,0.13), 0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <img
            src={imgProfileImage1}
            alt="Team member"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[13px] font-medium leading-tight text-black">
            Schedule now
          </span>
          <div className="mt-0.5 flex items-center gap-1">
            <span className="text-[11px] font-medium" style={{ color: "rgba(0,0,0,0.5)" }}>
              15 min call
            </span>
            <svg
              width="7"
              height="11"
              viewBox="0 0 7 11"
              fill="none"
              className="opacity-50 transition-transform duration-300 ease-out will-change-transform group-hover:translate-x-1"
              aria-hidden
            >
              <path d="M1 1L6 5.5L1 10" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}
