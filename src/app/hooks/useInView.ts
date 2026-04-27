import { type RefObject, useLayoutEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement = HTMLDivElement>(options?: {
  /** Default true — animácia sa nespustí opakovane po opätovnom scrollnutí. */
  once?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
  /** Vypne observer (napr. keď inView rieši rodič). */
  disabled?: boolean;
  /** Meria sa tento element (namiesto `ref` z návratovej hodnoty). */
  elementRef?: RefObject<T | null>;
}) {
  const internalRef = useRef<T | null>(null);
  const ref = options?.elementRef ?? internalRef;
  const [inView, setInView] = useState(false);
  const once = options?.once ?? true;
  const threshold = options?.threshold ?? 0.2;
  const rootMargin = options?.rootMargin ?? "0px";
  const disabled = options?.disabled ?? false;

  useLayoutEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) obs.disconnect();
          }
         }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, threshold, rootMargin, disabled, ref]);

  return { ref, inView };
}
