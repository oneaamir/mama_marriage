import { lazy, Suspense, useEffect, useState } from "react";
import data from "./data/invitation-data.json";
import IntroVideo from "./components/IntroVideo";
import InvitationCard from "./components/InvitationCard";
import InvalidLink from "./components/InvalidLink";
import LanguageToggle from "./components/LanguageToggle";
import MusicPlayer from "./components/MusicPlayer";
import { useLanguage, t } from "./lib/i18n";
import { useRoute } from "./lib/routing";

// Decorative layers — lazy-loaded as separate chunks so they're not in the
// initial JS payload. They only render after the intro video completes.
const SilkWaves = lazy(() => import("./components/SilkWaves"));

export default function App() {
  const { lang, toggle } = useLanguage(data.meta.defaultLanguage || "en");
  const { route } = useRoute();
  const [introDone, setIntroDone] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
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

  // Hint scroll: after entrance animations settle, ease down ~120px so the guest
  // 3 scroll hints after video ends: each nudges the page down progressively,
  // pausing between pulses so the guest clearly feels "scroll down".
  // Any interaction cancels the sequence immediately.
  // Listeners are registered only when active — prevents music-player's
  // first-touch from killing the hints before they start.
  useEffect(() => {
    if (!introDone || reduced) return;

    let raf;
    let pauseTimer;
    let cancelled = false;

    function cancel() {
      if (cancelled) return;
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(pauseTimer);
      window.removeEventListener("wheel",       cancel);
      window.removeEventListener("touchstart",  cancel);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("keydown",     cancel);
    }

    // Three progressive targets: each pulse scrolls deeper.
    const HINTS = [110, 240, 380];

    // document.scrollingElement is the spec-correct scroll container (works on
    // all browsers including iOS Safari when overflow-x is set on body/#root).
    const scroller = () => document.scrollingElement || document.documentElement;

    function runHint(index) {
      if (cancelled || index >= HINTS.length) { cancel(); return; }
      const from = scroller().scrollTop;
      const to   = HINTS[index];
      const t0   = performance.now();
      function tick(now) {
        if (cancelled) return;
        const p = Math.min(1, (now - t0) / 1500);
        scroller().scrollTop = from + (to - from) * (1 - Math.pow(1 - p, 3));
        if (p < 1) raf = requestAnimationFrame(tick);
        else pauseTimer = setTimeout(() => runHint(index + 1), 750);
      }
      raf = requestAnimationFrame(tick);
    }

    const startTimer = setTimeout(() => {
      if (scroller().scrollTop > 10) return; // guest already scrolled

      window.addEventListener("wheel",       cancel, { once: true, passive: true });
      window.addEventListener("touchstart",  cancel, { once: true, passive: true });
      window.addEventListener("pointerdown", cancel, { once: true, passive: true });
      window.addEventListener("keydown",     cancel, { once: true });

      runHint(0);
    }, 1400);

    return () => {
      clearTimeout(startTimer);
      cancel();
    };
  }, [introDone, reduced]);

  // Invalid path (anything other than /barat or /walima) → minimal page only.
  // No video, no silk, no particles, no invitation, no footer switch.
  if (!route) {
    return (
      <div className="relative min-h-screen text-deepbrown">
        <LanguageToggle lang={lang} onToggle={toggle} />
        <InvalidLink data={data} lang={lang} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-deepbrown">
      {/* Ambient backdrop: the final-frame is the page background everywhere. */}
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
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(244,232,208,0.22)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(248,217,139,0.18) 0%, rgba(248,217,139,0.06) 40%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,247,232,0.06) 0%, rgba(244,232,208,0.0) 40%, rgba(216,180,106,0.10) 100%)",
          }}
        />
      </div>

      <LanguageToggle lang={lang} onToggle={toggle} />
      <MusicPlayer src={data.theme.assets.music} videoStarted={videoStarted} />

      {introDone && !reduced && (
        <Suspense fallback={null}>
          <SilkWaves enabled />
        </Suspense>
      )}

      <IntroVideo
        src={data.theme.assets.introVideo}
        poster={data.theme.assets.finalFrame}
        onComplete={() => setIntroDone(true)}
        onPlay={() => setVideoStarted(true)}
      />

      <main className="relative z-10">
        <InvitationCard data={data} lang={lang} route={route} ready={introDone} />
      </main>

      <footer
        className={`relative z-10 text-center py-7 ${
          lang === "hi" ? "font-hindi" : "font-display"
        }`}
      >
        <div className="text-deepbrown/80 text-[11px] tracking-[0.32em] uppercase">
          {t(data.sections.footer?.message, lang)}
        </div>
      </footer>
    </div>
  );
}
