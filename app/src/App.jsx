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

  // Update document title from JSON.
  useEffect(() => {
    if (data?.meta?.siteTitle) document.title = data.meta.siteTitle;
  }, []);

  return (
    <div className="relative min-h-screen text-deepbrown">
      <LanguageToggle lang={lang} onToggle={toggle} />

      {/* Light gold dust particles, edges only. Disabled when reduced motion. */}
      {introDone && !reduced && <Particles count={8} enabled />}

      <IntroVideo
        src={data.theme.assets.introVideo}
        poster={data.theme.assets.finalFrame}
        onComplete={() => setIntroDone(true)}
      />

      <main className="relative">
        <InvitationCard data={data} lang={lang} ready={introDone} />
        {/* small breathing space after the pinned section */}
        <div className="h-[10vh]" aria-hidden />
      </main>

      <footer className="relative z-10 text-center py-6 text-deepgold/70 text-[11px] tracking-[0.32em] uppercase bg-[#1a0f08]">
        {lang === "hi" ? "हार्दिक धन्यवाद" : "With Love & Gratitude"}
      </footer>
    </div>
  );
}
