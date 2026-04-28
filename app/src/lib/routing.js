import { useEffect, useState, useCallback } from "react";

// Available invitation routes. Anything else is treated as invalid — the app
// renders an "invalid invitation link" page instead of the invitation.
const KNOWN_ROUTES = ["barat", "walima"];

function pathToRoute(pathname) {
  const seg = (pathname || "/").replace(/^\/+|\/+$/g, "").split("/")[0]?.toLowerCase();
  if (KNOWN_ROUTES.includes(seg)) return seg;
  return null;
}

export function useRoute() {
  const [route, setRoute] = useState(() =>
    typeof window === "undefined" ? null : pathToRoute(window.location.pathname)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setRoute(pathToRoute(window.location.pathname));
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // SPA navigation that updates the URL and re-renders in place.
  const navigate = useCallback(
    (next) => {
      if (typeof window === "undefined") return;
      if (!KNOWN_ROUTES.includes(next)) return;
      if (next === route) return;
      window.history.pushState({}, "", `/${next}`);
      setRoute(next);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    },
    [route]
  );

  return { route, navigate };
}

export { KNOWN_ROUTES };
