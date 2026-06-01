import { useEffect, useId, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HeroNavbar } from "@/app/components/HeroNavbar";
import { ScheduleCTA } from "@/app/components/ScheduleCTA";

const SCROLL_NAVBAR_THRESHOLD_PX = 40;

function scrollWindowToTopInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function SiteLayout() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuPanelId = useId();
  const location = useLocation();

  useLayoutEffect(() => {
    scrollWindowToTopInstant();
    setScrollY(0);
  }, [location.pathname, location.key]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <HeroNavbar
        scrollY={scrollY}
        menuOpen={menuOpen}
        menuPanelId={menuPanelId}
        onMenuOpenChange={setMenuOpen}
      />
      <Outlet />
      <ScheduleCTA scrolled={scrollY > SCROLL_NAVBAR_THRESHOLD_PX} />
    </>
  );
}
