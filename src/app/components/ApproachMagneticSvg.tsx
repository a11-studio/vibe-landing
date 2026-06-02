import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  clientPointToSvg,
  parseApproachSvgMarkup,
  repelOffset,
  type ParsedApproachSvg,
} from "@/lib/approachMagneticSvg";

const REPEL_RADIUS = 160;
const MAX_DISPLACEMENT = 16;
const POINTER_DAMP = 14;
const RETURN_DAMP = 10;

type ApproachMagneticSvgProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * SVG ilustrácia — ostré vektory; pri hoveri jednotlivé body „utekajú“ od kurzora.
 */
export function ApproachMagneticSvg({ src, alt, className }: ApproachMagneticSvgProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const parsedRef = useRef<ParsedApproachSvg | null>(null);
  const offsetX = useRef<Float32Array | null>(null);
  const offsetY = useRef<Float32Array | null>(null);
  const targetX = useRef<Float32Array | null>(null);
  const targetY = useRef<Float32Array | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, strength: 0 });
  const [parsed, setParsed] = useState<ParsedApproachSvg | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadError(false);
    setParsed(null);

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`SVG fetch ${r.status}`);
        return r.text();
      })
      .then((markup) => {
        if (cancelled) return;
        const data = parseApproachSvgMarkup(markup);
        parsedRef.current = data;
        const n = data.paths.length;
        offsetX.current = new Float32Array(n);
        offsetY.current = new Float32Array(n);
        targetX.current = new Float32Array(n);
        targetY.current = new Float32Array(n);
        pathRefs.current = new Array(n).fill(null);
        setParsed(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  useLayoutEffect(() => {
    const data = parsedRef.current;
    const ox = offsetX.current;
    const oy = offsetY.current;
    const tx = targetX.current;
    const ty = targetY.current;
    if (!data || !ox || !oy || !tx || !ty) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const ptr = pointerRef.current;
      const damp =
        ptr.strength > 0.01
          ? 1 - Math.exp(-POINTER_DAMP * dt)
          : 1 - Math.exp(-RETURN_DAMP * dt);

      const mx = ptr.x;
      const my = ptr.y;
      const str = ptr.strength;
      const radius = REPEL_RADIUS;
      const maxDisp = MAX_DISPLACEMENT;

      for (let i = 0; i < data.paths.length; i++) {
        const p = data.paths[i];
        const rep =
          str > 0.001
            ? repelOffset(p.cx, p.cy, mx, my, radius, maxDisp, str)
            : { x: 0, y: 0 };
        tx[i] = rep.x;
        ty[i] = rep.y;
        ox[i] += (tx[i] - ox[i]) * damp;
        oy[i] += (ty[i] - oy[i]) * damp;

        const el = pathRefs.current[i];
        if (!el) continue;
        const x = ox[i];
        const y = oy[i];
        if (Math.abs(x) < 0.02 && Math.abs(y) < 0.02) {
          el.removeAttribute("transform");
        } else {
          el.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parsed]);

  const updatePointer = (e: PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    const data = parsedRef.current;
    if (!el || !data) return;
    const pt = clientPointToSvg(e.clientX, e.clientY, el.getBoundingClientRect(), data.viewBox);
    pointerRef.current = { x: pt.x, y: pt.y, strength: 1 };
  };

  const onEnter = () => {
    pointerRef.current.strength = 1;
  };

  const onLeave = () => {
    pointerRef.current.strength = 0;
  };

  if (loadError) {
    return (
      <div className={className}>
        <img src={src} alt={alt} className="h-full w-full object-contain" loading="lazy" />
      </div>
    );
  }

  if (!parsed) {
    return (
      <div className={className} aria-hidden>
        <img src={src} alt="" className="h-full w-full object-contain opacity-0" />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={className}
      onPointerEnter={onEnter}
      onPointerMove={updatePointer}
      onPointerLeave={onLeave}
      onPointerDown={updatePointer}
      role="img"
      aria-label={alt}
      style={{ touchAction: "none" }}
    >
      <svg
        viewBox={parsed.viewBox}
        className="h-full w-full touch-none"
        style={{ touchAction: "none" }}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {parsed.paths.map((p, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={p.d}
            fill={p.fill}
          />
        ))}
      </svg>
    </div>
  );
}
