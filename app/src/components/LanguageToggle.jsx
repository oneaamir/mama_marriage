export default function LanguageToggle({ lang, onToggle }) {
  return (
    <div className="fixed top-3 right-3 z-50 select-none">
      <button
        type="button"
        onClick={onToggle}
        className="group inline-flex items-center gap-2 rounded-full border border-antiquegold/60 bg-ivory/85 backdrop-blur px-3 py-1.5 text-[12px] tracking-[0.18em] text-deepbrown shadow-md hover:bg-pearl"
        aria-label="Toggle language"
      >
        <span className={lang === "en" ? "text-deepbrown font-semibold" : "text-deepbrown/40"}>EN</span>
        <span className="text-antiquegold">|</span>
        <span className={`font-hindi ${lang === "hi" ? "text-deepbrown font-semibold" : "text-deepbrown/40"}`}>हिन्दी</span>
      </button>
    </div>
  );
}
