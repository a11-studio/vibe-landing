import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react";
import { cn } from "@/app/components/ui/utils";
import { useInView } from "@/app/hooks/useInView";
import {
  createProjectRippleStage,
  hasWebGL,
  type RippleStageHandle,
} from "@/lib/projectRipple";

type ProjectRippleMediaProps = {
  imageA: string;
  imageB: string;
  className?: string;
  style?: CSSProperties;
  /** Skrytý popis pre screen readery — klik spustí ripple. */
  label: string;
};

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };
}

/**
 * Projektové médium s ripple prechodom po kliknutí (WebGL).
 * Fallback: statický obrázok bez WebGL / reduced motion.
 */
export function ProjectRippleMedia({
  imageA,
  imageB,
  className,
  style,
  label,
}: ProjectRippleMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<RippleStageHandle | null>(null);
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({
    threshold: 0.08,
    rootMargin: "80px",
    once: false,
  });

  const [canRipple, setCanRipple] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setCanRipple(hasWebGL() && !mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!canRipple || !inView || !containerRef.current) return;

    setReady(false);
    stageRef.current?.destroy();
    stageRef.current = createProjectRippleStage(containerRef.current, {
      imageA,
      imageB,
      onReady: () => setReady(true),
    });

    return () => {
      stageRef.current?.destroy();
      stageRef.current = null;
      setReady(false);
    };
  }, [canRipple, inView, imageA, imageB]);

  const showFallback = !canRipple || !ready;

  return (
    <div
      ref={mergeRefs(containerRef, inViewRef)}
      className={cn(
        "relative isolate w-full overflow-hidden bg-[var(--logos-canvas)]",
        canRipple && "cursor-pointer",
        className,
      )}
      style={style}
      role={canRipple ? "button" : undefined}
      tabIndex={canRipple ? 0 : undefined}
      aria-label={
        canRipple ? `${label}. Press for ripple transition.` : undefined
      }
      onKeyDown={
        canRipple
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                stageRef.current?.trigger(0.5, 0.5);
              }
            }
          : undefined
      }
    >
      <img
        src={imageA}
        alt=""
        className={cn(
          "pointer-events-none absolute inset-0 block h-full w-full object-cover transition-opacity duration-300",
          showFallback ? "opacity-100" : "opacity-0",
        )}
        loading="lazy"
        aria-hidden
      />
      {canRipple ? (
        <span className="sr-only">Ripple preview active</span>
      ) : null}
    </div>
  );
}
