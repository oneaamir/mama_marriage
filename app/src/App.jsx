import { useEffect, useState } from "react";
import data from "./data/invitation-data.json";
import IntroVideo from "./components/IntroVideo";
import InvitationCard from "./components/InvitationCard";
import LanguageToggle from "./components/LanguageToggle";
import Particles from "./components/Particles";
import { useLanguage } from "./lib/i18n";

export default function App() {
  const { lang, toggle } = useLanguage(data.meta.defaultLanguage || "en");
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

      {introDone && !reduced && <Particles count={6} enabled />}

      <IntroVideo
        src={data.theme.assets.introVideo}
        poster={data.theme.assets.finalFrame}
        onComplete={() => setIntroDone(true)}
      />

      <main className="relative z-10">
        <InvitationCard data={data} lang={lang} ready={introDone} />
      </main>

      <footer className="relative z-10 text-center py-7 text-deepbrown/80 text-[11px] tracking-[0.32em] uppercase">
        {lang === "hi" ? "हार्दिक धन्यवाद" : "With Love & Gratitude"}
      </footer>
    </div>
  );
}
