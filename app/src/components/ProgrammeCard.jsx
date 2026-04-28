import Panel from "./Panel";
import { t } from "../lib/i18n";

// Tiny accent motifs in antique gold — abstract and elegant, never cartoony.
// Kept small (16px), top-right, low opacity so they're hint-of-identity, not decoration.
const MOTIFS = {
  spiritual: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l1.6 6.4L20 12l-6.4 1.6L12 20l-1.6-6.4L4 12l6.4-1.6Z" />
    </svg>
  ),
  haldi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
    </svg>
  ),
  wedding: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="13" r="4" />
      <circle cx="15" cy="13" r="4" />
    </svg>
  ),
  walima: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a8 8 0 0 0 16 0" />
      <path d="M12 11V4M9 4h6M5 20h14" />
    </svg>
  ),
};

// One programme entry, designed for a stacked column.
// Day is shown by the parent group header — never repeated inside the card.
// Uses the ornate Panel (corner ornaments + inner double border) so programme
// cards sit at a clear "medium" tier — heavier than slim secondary panels
// but lighter than the hero cover. Accent class only re-tints the rim glow.
export default function ProgrammeCard({ entry, lang, stagger = 0 }) {
  const accent = entry.accent || "wedding";
  const motif = MOTIFS[accent] || MOTIFS.wedding;
  const langClass = lang === "hi" ? "font-hindi" : "font-display";

  return (
    <Panel ornate stagger={stagger} className={`accent-${accent}`}>
      {/* Motif sits inboard of the top-right corner ornament. */}
      <span className="accent-motif" style={{ width: 18, height: 18, top: 18, right: 26 }}>
        {motif}
      </span>

      <div className="text-center px-1 pt-1 pb-0.5">
        <h3
          className={`gold-foil-stable ${langClass} text-[24px] sm:text-[28px] font-semibold leading-tight`}
          style={{ letterSpacing: "0.01em" }}
        >
          {t(entry.name, lang)}
        </h3>

        <div className="mx-auto w-12 h-[1px] bg-antiquegold/55 my-3.5" />

        <div
          className={`${langClass} text-deepbrown text-[15.5px] sm:text-[17px] leading-relaxed`}
        >
          {t(entry.displayDate, lang)}
        </div>
        <div
          className={`${langClass} text-deepgold text-[13.5px] sm:text-[15px] mt-1 tracking-[0.16em] uppercase font-semibold`}
        >
          {t(entry.displayTime, lang)}
        </div>
      </div>
    </Panel>
  );
}
