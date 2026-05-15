import { useRef, useState, type ReactNode } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { cn } from "@/app/components/ui/utils";

/** Logo v hlavičke — viewBox 50.3951×24. */
export const VIBE_LOGO_NAV_PX = { w: 68, h: 32 } as const;

/** Logo vo footri (mierne väčšie ako v nav). */
export const VIBE_LOGO_FOOTER_PX = { w: 84, h: 40 } as const;

/** Minimálny shape Lottie JSON potrebný na výpočet posledného frame. */
interface LottieAnimationData {
  op?: number;
  [key: string]: unknown;
}

function restFrameFromAnimation(animationData: LottieAnimationData) {
  return Math.max(0, Math.floor(Number(animationData.op ?? 0)) - 1);
}

function holdRestFrame(
  inst: LottieRefCurrentProps | null,
  frame: number,
) {
  if (!inst) return;
  inst.stop();
  inst.goToAndStop(frame, true);
}

export function VibeLogoLottieHover({
  animationData,
  reducedMotion,
  width = VIBE_LOGO_NAV_PX.w,
  height = VIBE_LOGO_NAV_PX.h,
  staticMark,
}: {
  animationData: LottieAnimationData;
  reducedMotion: boolean;
  width?: number;
  height?: number;
  staticMark: ReactNode;
}) {
  const restFrame = restFrameFromAnimation(animationData);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [lottieSized, setLottieSized] = useState(false);

  // Touch devices have no reliable hover — play on tap instead.
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  const holdRest = () => holdRestFrame(lottieRef.current, restFrame);
  const playAnimation = () => {
    if (!lottieSized) return;
    lottieRef.current?.goToAndPlay(0, true);
  };

  if (reducedMotion) {
    return <>{staticMark}</>;
  }

  return (
    <div
      className="relative flex shrink-0 cursor-pointer items-center justify-center overflow-visible"
      style={{ width, height }}
      {...(isTouchDevice
        ? { onClick: playAnimation }
        : {
            onPointerEnter: playAnimation,
            onPointerLeave: holdRest,
          })}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        autoplay={false}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        className={cn(
          "block h-full w-full transition-opacity duration-75 ease-out",
          "[&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:max-w-none",
          lottieSized ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onDOMLoaded={() => {
          requestAnimationFrame(() => {
            holdRestFrame(lottieRef.current, restFrame);
            setLottieSized(true);
          });
        }}
        onComplete={holdRest}
      />
    </div>
  );
}
