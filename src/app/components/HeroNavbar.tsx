import { useEffect, useLayoutEffect, useRef, useState, useCallback, type CSSProperties, type FocusEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/app/components/ui/utils";
import { VibeLogoLottieHover, VIBE_LOGO_NAV_PX } from "@/app/components/VibeLogoLottieHover";
import vibeLogoIntroAnimation from "@/assets/lottie/Vibe_logo_anim_V1_intro.json";
import svgPaths from "@/imports/MainContainer/svg-mqtv51ktgp";
import { LayoutContainer } from "@/app/components/layout";
import { CALENDLY_BOOKING_URL, MOBILE_NAV } from "@/app/components/heroConstants";

// ─── Logo ─────────────────────────────────────────────────────────────────────
function VibeLogo() {
  const reducedMotion = useReducedMotion();

  return (
    <VibeLogoLottieHover
      animationData={vibeLogoIntroAnimation}
      reducedMotion={!!reducedMotion}
      width={VIBE_LOGO_NAV_PX.w}
      height={VIBE_LOGO_NAV_PX.h}
      staticMark={
        <svg
          width={VIBE_LOGO_NAV_PX.w}
          height={VIBE_LOGO_NAV_PX.h}
          viewBox="0 0 50.3951 24"
          fill="none"
          className="block max-h-full max-w-full"
        >
          <path d={svgPaths.p2ed8a900} fill="black" />
          <path d={svgPaths.pf4d1e80} fill="black" />
          <path d={svgPaths.p2bd5b200} fill="black" />
          <path d={svgPaths.p3ab9e400} fill="black" />
        </svg>
      }
    />
  );
}

// ─── Menu toggle: designcouch „icon 4" (CodePen ExvwPY, #nav-icon4) ───────────
// https://codepen.io/designcouch/pen/ExvwPY — ľavý transform-origin, stred mizne na šírku 0
function MenuToggleIcon({ open }: { open: boolean }) {
  const line: CSSProperties = {
    display: "block",
    position: "absolute",
    height: 6,
    width: "100%",
    backgroundColor: "currentColor",
    borderRadius: 3,
    left: 0,
    transition: "0.25s ease-in-out",
    transformOrigin: "left center",
  };

  const span1: CSSProperties = {
    ...line,
    top: open ? -3 : 0,
    left: open ? 8 : 0,
    transform: open ? "rotate(45deg)" : "rotate(0deg)",
  };
  const span2: CSSProperties = {
    ...line,
    top: 18,
    width: open ? "0%" : "100%",
    opacity: open ? 0 : 1,
  };
  const span3: CSSProperties = {
    ...line,
    top: open ? 39 : 36,
    left: open ? 8 : 0,
    transform: open ? "rotate(-45deg)" : "rotate(0deg)",
  };

  return (
    <div
      className="pointer-events-none relative inline-block h-[15px] w-5 shrink-0 overflow-visible motion-reduce:[&_span]:!transition-none"
      aria-hidden
    >
      <div
        className="absolute left-0 top-0 will-change-transform"
        style={{
          width: 60,
          height: 45,
          transform: "scale(0.333333)",
          transformOrigin: "top left",
        }}
      >
        <span style={span1} />
        <span style={span2} />
        <span style={span3} />
      </div>
    </div>
  );
}

/** Figma 626:2 — posúvajúci sa pill na pozadí desktop nav */
const NAV_PILL_BG = "rgba(227,234,239,0.6)";

function HeroDesktopNav({
  reducedMotion,
  menuOpen,
  onMenuOpenChange,
}: {
  reducedMotion: boolean;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const hoverIdxRef = useRef<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const measureAtIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const link = linkRefs.current[index];
    if (!track || !link) return;
    const tr = track.getBoundingClientRect();
    const lr = link.getBoundingClientRect();
    setPill({
      left: lr.left - tr.left,
      top: lr.top - tr.top,
      width: lr.width,
      height: lr.height,
    });
  }, []);

  const measureHoveredIfAny = useCallback(() => {
    const i = hoverIdxRef.current;
    if (i != null) measureAtIndex(i);
  }, [measureAtIndex]);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measureHoveredIfAny());
    ro.observe(el);
    window.addEventListener("resize", measureHoveredIfAny);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureHoveredIfAny);
    };
  }, [measureHoveredIfAny]);

  const showAtIndex = useCallback(
    (index: number) => {
      hoverIdxRef.current = index;
      measureAtIndex(index);
      setHoverIdx(index);
    },
    [measureAtIndex],
  );

  const hidePill = useCallback(() => {
    hoverIdxRef.current = null;
    setHoverIdx(null);
  }, []);

  const onLinkBlur = (e: FocusEvent<HTMLAnchorElement>) => {
    const track = trackRef.current;
    const next = e.relatedTarget;
    if (track && next instanceof Node && track.contains(next)) return;
    hidePill();
  };

  const pillTransition = reducedMotion
    ? ({
        duration: 0.12,
        ease: [0.33, 1, 0.68, 1] as const,
        opacity: { duration: 0.1, ease: "easeOut" as const },
      } as const)
    : ({
        type: "spring" as const,
        stiffness: 420,
        damping: 30,
        mass: 0.78,
        opacity: { duration: 0.18, ease: "easeOut" as const },
      } as const);

  return (
    <div
      ref={trackRef}
      className="relative hidden min-h-0 min-w-0 flex-1 items-center sm:flex sm:justify-between"
      onMouseLeave={hidePill}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[1] rounded-[50px]"
        style={{ backgroundColor: NAV_PILL_BG }}
        initial={false}
        animate={{
          x: pill.left,
          y: pill.top,
          width: Math.max(pill.width, 0),
          height: Math.max(pill.height, 0),
          opacity: hoverIdx != null && pill.width > 0 ? 1 : 0,
        }}
        transition={pillTransition}
      />
      {MOBILE_NAV.map((item, index) => (
        <a
          key={item.href}
          ref={(el) => {
            linkRefs.current[index] = el;
          }}
          href={item.href}
          onMouseEnter={() => showAtIndex(index)}
          onFocus={() => showAtIndex(index)}
          onBlur={onLinkBlur}
          className={cn(
            "relative z-[2] inline-flex items-center justify-center rounded-[50px] px-4 py-2 text-[15px] font-medium whitespace-nowrap text-black outline-none select-none",
            "transition-colors duration-200 ease-out motion-reduce:transition-none",
            hoverIdx === index && "text-[rgba(0,0,0,0.7)]",
            "focus-visible:text-[rgba(0,0,0,0.7)] motion-reduce:focus-visible:text-black",
          )}
          onClick={() => {
            if (menuOpen) onMenuOpenChange(false);
          }}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

// ─── Menu panel timing ────────────────────────────────────────────────────────
const MENU_PANEL_NAV_STAGGER_MS = 54;
const MENU_PANEL_AFTER_NAV_MS = 88;
const MENU_PANEL_LINE_DELAY_MS =
  (MOBILE_NAV.length - 1) * MENU_PANEL_NAV_STAGGER_MS + MENU_PANEL_AFTER_NAV_MS;
const MENU_PANEL_AFTER_LINE_MS = 72;
const MENU_PANEL_EMAIL_DELAY_MS = MENU_PANEL_LINE_DELAY_MS + MENU_PANEL_AFTER_LINE_MS;
const MENU_PANEL_AFTER_EMAIL_MS = 70;
const MENU_PANEL_CTA_DELAY_MS = MENU_PANEL_EMAIL_DELAY_MS + MENU_PANEL_AFTER_EMAIL_MS;
const MENU_PANEL_BOTTOM_DURATION_MS = 560;
const MENU_PANEL_EASE = "cubic-bezier(0.19, 1, 0.22, 1)";

function HeroNavMenuLink({
  item,
  index,
  reveal,
  onRequestClose,
}: {
  item: (typeof MOBILE_NAV)[number];
  index: number;
  reveal: boolean;
  onRequestClose: () => void;
}) {
  return (
    <li>
      <a
        href={item.href}
        className="block text-center text-[22px] font-medium leading-none text-black tracking-[-0.84px] transition-opacity duration-200 hover:opacity-50 sm:text-[28px]"
        onClick={onRequestClose}
      >
        <span className="nav-menu-panel__mask">
          <span
            className="nav-menu-panel__line"
            style={{
              animationDelay: reveal ? `${index * MENU_PANEL_NAV_STAGGER_MS}ms` : "0ms",
            }}
          >
            {item.label}
          </span>
        </span>
      </a>
    </li>
  );
}

// ─── Biely zaoblený box pod pill barom (Figma 609:3277) ───────────────────────
function NavMenuPanel({
  id,
  onRequestClose,
  ariaHidden,
  animateIn,
}: {
  id: string;
  onRequestClose: () => void;
  ariaHidden?: boolean;
  animateIn: boolean;
}) {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (!animateIn) return;
    setReveal(false);
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => setReveal(true));
    });
    return () => cancelAnimationFrame(rafId);
  }, [animateIn]);

  const ctaCssVars = {
    ["--nav-cta-delay" as string]: `${MENU_PANEL_CTA_DELAY_MS}ms`,
    ["--nav-cta-duration" as string]: `${MENU_PANEL_BOTTOM_DURATION_MS}ms`,
    ["--nav-cta-ease" as string]: MENU_PANEL_EASE,
  } as const;

  const ruleCssVars = {
    ["--nav-rule-delay" as string]: reveal ? `${MENU_PANEL_LINE_DELAY_MS}ms` : "0ms",
    ["--nav-rule-duration" as string]: `${MENU_PANEL_BOTTOM_DURATION_MS}ms`,
    ["--nav-rule-ease" as string]: MENU_PANEL_EASE,
  } as const;

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-hidden={ariaHidden ? true : undefined}
      aria-label="Site menu"
      className="w-full rounded-[48px] bg-white px-6 py-10 sm:px-10 sm:py-12"
      style={{
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <nav
        className={cn(
          "flex flex-col items-center",
          reveal && "nav-menu-panel--visible",
        )}
        aria-label="Primary"
      >
        <ul className="m-0 flex w-full max-w-full list-none flex-col items-center gap-6 p-0 sm:gap-8">
          {MOBILE_NAV.map((item, index) => (
            <HeroNavMenuLink
              key={item.href}
              item={item}
              index={index}
              reveal={reveal}
              onRequestClose={onRequestClose}
            />
          ))}
        </ul>

        <div
          className="nav-menu-panel__rule-track mt-6 w-full sm:mt-8"
          style={ruleCssVars}
          aria-hidden
        >
          <div className="nav-menu-panel__rule" />
        </div>

        <a
          href="mailto:hello@vibestudio.design?subject=Hello"
          className="mt-8 text-center text-[16px] font-medium leading-none text-black tracking-[-0.54px] transition-opacity duration-200 hover:opacity-50 sm:mt-10 sm:text-[18px]"
        >
          <span className="nav-menu-panel__mask">
            <span
              className="nav-menu-panel__line"
              style={{
                animationDelay: reveal ? `${MENU_PANEL_EMAIL_DELAY_MS}ms` : "0ms",
              }}
            >
              hello@vibestudio.design
            </span>
          </span>
        </a>

        <a
          href={CALENDLY_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "nav-menu-panel__cta mt-8 inline-flex items-center justify-center rounded-[40px] bg-[#040404] px-6 py-3 text-[16px] font-medium leading-none text-white tracking-[-0.54px] sm:mt-10 sm:text-[18px]",
            "hover:opacity-90 motion-reduce:hover:opacity-100",
          )}
          style={ctaCssVars}
          onClick={onRequestClose}
        >
          schedule a call
        </a>
      </nav>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const MENU_LAYER_MS = 360;
const SM_BREAKPOINT_PX = 639;

export function HeroNavbar({
  scrollY,
  menuOpen,
  menuPanelId,
  onMenuOpenChange,
}: {
  scrollY: number;
  menuOpen: boolean;
  menuPanelId: string;
  onMenuOpenChange: (open: boolean) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [navWidthPx, setNavWidthPx] = useState<number | null>(null);
  const [isSmDown, setIsSmDown] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(`(max-width: ${SM_BREAKPOINT_PX}px)`).matches,
  );
  const [layerMounted, setLayerMounted] = useState(false);
  const [layerVisible, setLayerVisible] = useState(false);
  const scrolled = scrollY > 40;
  const layerOpen = menuOpen || layerMounted;
  const zHeader = layerOpen ? 100 : 50;

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const mq = window.matchMedia(`(max-width: ${SM_BREAKPOINT_PX}px)`);
    const sync = () => {
      setIsSmDown(mq.matches);
      setNavWidthPx(el.offsetWidth);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    mq.addEventListener("change", sync);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setLayerMounted(true);
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => setLayerVisible(true));
      });
      return () => cancelAnimationFrame(rafId);
    }
    setLayerVisible(false);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen || layerVisible) return;
    if (!layerMounted) return;
    const t = window.setTimeout(() => setLayerMounted(false), MENU_LAYER_MS);
    return () => window.clearTimeout(t);
  }, [menuOpen, layerVisible, layerMounted]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMenuOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, onMenuOpenChange]);

  useEffect(() => {
    if (!menuOpen) return;
    closeRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!layerMounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [layerMounted]);

  return (
    <>
      {layerMounted && (
        <div
          className={cn(
            "fixed inset-0 z-[90] cursor-pointer bg-black/15",
            "transition-opacity ease-out motion-reduce:transition-none",
          )}
          style={{
            transitionDuration: `${MENU_LAYER_MS}ms`,
            opacity: layerVisible ? 1 : 0,
            pointerEvents: layerVisible ? "auto" : "none",
            backdropFilter: "blur(2px)",
          }}
          aria-hidden
          onClick={() => onMenuOpenChange(false)}
        />
      )}

      <header
        className="fixed top-5 left-0 right-0 flex flex-col items-center"
        style={{ willChange: "transform", zIndex: zHeader }}
      >
        <LayoutContainer className="flex w-full max-w-full flex-col items-center">
          <nav
            ref={navRef}
            className="isolate inline-flex max-w-full items-center gap-4 px-4 rounded-[70px] transition-all duration-500 sm:w-[min(420px,calc(100vw-32px))] sm:gap-4 sm:px-5"
            style={{
              minHeight: 54,
              backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,1)",
              backdropFilter: scrolled ? "blur(16px)" : "none",
              boxShadow: layerOpen
                ? "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)"
                : scrolled
                  ? "0 4px 32px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.06)"
                  : "0 2px 20px rgba(0,0,0,0.08)",
            }}
            aria-label="Main"
          >
            <a
              href="#hero"
              className="flex shrink-0 cursor-pointer items-center"
              onClick={() => {
                if (menuOpen) onMenuOpenChange(false);
              }}
            >
              <VibeLogo />
            </a>

            <HeroDesktopNav
              reducedMotion={!!reducedMotion}
              menuOpen={menuOpen}
              onMenuOpenChange={onMenuOpenChange}
            />

            <button
              ref={closeRef}
              type="button"
              className="flex h-6 w-6 cursor-pointer shrink-0 items-center justify-center text-[#212121] transition-opacity duration-200 hover:opacity-50"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? menuPanelId : undefined}
              aria-haspopup="dialog"
              onClick={() => onMenuOpenChange(!menuOpen)}
            >
              <MenuToggleIcon open={menuOpen} />
            </button>
          </nav>

          {layerMounted && (
            <div
              className={cn(
                "mt-2 min-w-0 will-change-transform sm:px-0",
                "motion-reduce:transition-none",
                "transition-[opacity,transform]",
                "ease-[cubic-bezier(0.16,1,0.3,1)]",
                isSmDown ? "w-full" : navWidthPx == null && "w-full max-w-[min(100%,420px)]",
              )}
              style={{
                transitionDuration: `${MENU_LAYER_MS}ms`,
                opacity: layerVisible ? 1 : 0,
                transform: layerVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(-10px) scale(0.98)",
                pointerEvents: layerVisible ? "auto" : "none",
                ...(!isSmDown && navWidthPx != null
                  ? { width: navWidthPx, maxWidth: "100%" }
                  : {}),
              }}
            >
              <NavMenuPanel
                id={menuPanelId}
                onRequestClose={() => onMenuOpenChange(false)}
                ariaHidden={!layerVisible}
                animateIn={layerVisible}
              />
            </div>
          )}
        </LayoutContainer>
      </header>
    </>
  );
}
