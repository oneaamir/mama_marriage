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
      {/* Ambient backdrop: same final-frame, heavily blurred and dim, fixed
          behind the whole page so panels float in the same wedding setting. */}
      <div className="fixed inset-0 -z-10 bg-[#1a0f08]" aria-hidden>
        <img
          src={data.theme.assets.finalFrame}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "blur(22px) brightness(0.55) saturate(0.95)", transform: "scale(1.12)" }}
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(248,217,139,0.10) 0%, rgba(26,15,8,0.0) 35%, rgba(26,15,8,0.55) 90%)",
          }}
        />
      </div>

      <LanguageToggle lang={lang} onToggle={toggle} />

      {introDone && !reduced && <Particles count={8} enabled />}

      <IntroVideo
        src={data.theme.assets.introVideo}
        poster={data.theme.assets.finalFrame}
        onComplete={() => setIntroDone(true)}
      />

      <main className="relative z-10">
        <InvitationCard data={data} lang={lang} ready={introDone} />
      </main>

      <footer className="relative z-10 text-center py-6 text-deepgold/75 text-[11px] tracking-[0.32em] uppercase">
        {lang === "hi" ? "हार्दिक धन्यवाद" : "With Love & Gratitude"}
      </footer>
    </div>
  );
}
