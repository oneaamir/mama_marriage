import { useEffect, useState, useCallback } from "react";

// Available invitation routes. Anything else falls back to the default.
const KNOWN_ROUTES = ["barat", "walima"];
const DEFAULT_ROUTE = "barat";

function pathToRoute(pathname) {
  const seg = (pathname || "/").replace(/^\/+|\/+$/g, "").split("/")[0]?.toLowerCase();
  return KNOWN_ROUTES.includes(seg) ? seg : DEFAULT_ROUTE;
}

export function useRoute() {
  const [route, setRoute] = useState(() =>
    typeof window === "undefined" ? DEFAULT_ROUTE : pathToRoute(window.location.pathname)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setRoute(pathToRoute(window.location.pathname));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // SPA navigation that updates the URL and lets the page re-render in place.
  const navigate = useCallback((next) => {
    if (typeof window === "undefined") return;
    if (!KNOWN_ROUTES.includes(next)) return;
    if (next === route) return;
    window.history.pushState({}, "", `/${next}`);
    setRoute(next);
    // Scroll to top so the new invitation opens at the hero.
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [route]);

  return { route, navigate };
}

export { KNOWN_ROUTES, DEFAULT_ROUTE };
