import { lazy, Suspense, useEffect, useState } from "react";
import data from "./data/invitation-data.json";
import IntroVideo from "./components/IntroVideo";
import InvitationCard from "./components/InvitationCard";
import LanguageToggle from "./components/LanguageToggle";
import { useLanguage, t } from "./lib/i18n";
import { useRoute } from "./lib/routing";

// Decorative layers — lazy-loaded as separate chunks so they're not in the
// initial JS payload. They only render after the intro video completes.
const SilkWaves = lazy(() => import("./components/SilkWaves"));

export default function App() {
  const { lang, toggle } = useLanguage(data.meta.defaultLanguage || "en");
  const { route, navigate } = useRoute();
  const [introDone, setIntroDone] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (data?.meta?.siteTitle) document.title = data.meta.siteTitle;
  }, []);

  return (
    <div className="relative min-h-screen text-deepbrown">
      {/* Ambient backdrop: the final-frame is the page background everywhere.
          The photo stays visible (light blur + light warm tint) so the page
          continues from the video's final frame on every section — never a
          flat solid color, never darkened. */}
      <div className="fixed inset-0 z-0 bg-ivory" aria-hidden>
        <img
          src={data.theme.assets.finalFrame}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "blur(14px) brightness(1.06) saturate(1.08)",
            transform: "scale(1.06) translateZ(0)",
            willChange: "transform",
          }}
          draggable={false}
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
        {/* Light warm ivory tint — keeps the photo clearly visible but warms
            the whole page so dark frame areas don't read as flat brown. */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(244,232,208,0.22)" }}
        />
        {/* Soft gold radial glow at center for premium depth. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(248,217,139,0.18) 0%, rgba(248,217,139,0.06) 40%, transparent 75%)",
          }}
        />
        {/* Very subtle warm vertical gradient — gold at bottom, no dark. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,247,232,0.06) 0%, rgba(244,232,208,0.0) 40%, rgba(216,180,106,0.10) 100%)",
          }}
        />
      </div>

      <LanguageToggle lang={lang} onToggle={toggle} />

      {introDone && !reduced && (
        <Suspense fallback={null}>
          <SilkWaves enabled />
        </Suspense>
      )}

      <IntroVideo
        src={data.theme.assets.introVideo}
        poster={data.theme.assets.finalFrame}
        onComplete={() => setIntroDone(true)}
      />

      <main className="relative z-10">
        <InvitationCard data={data} lang={lang} route={route} ready={introDone} />
      </main>

      <footer
        className={`relative z-10 text-center py-7 ${
          lang === "hi" ? "font-hindi" : "font-display"
        }`}
      >
        {/* Subtle invitation switch — only renders if both routes are configured. */}
        {data.routes && (
          <div className="flex items-center justify-center gap-3 mb-3 text-[11px] tracking-[0.32em] uppercase">
            {Object.entries(data.routes).map(([k, v], i, arr) => (
              <span key={k} className="contents">
                <button
                  type="button"
                  onClick={() => navigate(k)}
                  className={`transition-colors ${
                    route === k
                      ? "text-deepgold font-semibold"
                      : "text-deepbrown/60 hover:text-deepbrown"
                  }`}
                  aria-current={route === k ? "page" : undefined}
                >
                  {t(v.switchLabel, lang)}
                </button>
                {i < arr.length - 1 && (
                  <span aria-hidden className="block w-1 h-1 rounded-full bg-antiquegold/55" />
                )}
              </span>
            ))}
          </div>
        )}
        <div className="text-deepbrown/80 text-[11px] tracking-[0.32em] uppercase">
          {t(data.sections.footer?.message, lang)}
        </div>
      </footer>
    </div>
  );
}
