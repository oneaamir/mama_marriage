import { t } from "../lib/i18n";

// Minimal elegant page shown when the URL is anything other than
// /barat or /walima. Reuses the wedding theme tokens (ivory paper, antique
// gold border, deep brown text) but renders no video, no programme, and
// nothing that links into the invitation — guests must open the personal
// link they were given.
export default function InvalidLink({ data, lang }) {
  const langClass = lang === "hi" ? "font-hindi" : "font-display";
  const block = data?.sections?.invalid;

  return (
    <div className="relative min-h-[100svh] flex items-center justify-center px-4">
      {/* Soft warm ivory wash so the page never feels cold. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,247,232,1) 0%, rgba(244,232,208,1) 60%, rgba(216,180,106,0.35) 100%)",
        }}
        aria-hidden
      />

      <article
        className="relative paper-grain border-glint rim-light w-full"
        style={{
          maxWidth: "min(92vw, 460px)",
          border: "1px solid rgba(184,138,59,0.7)",
          borderRadius: "12px",
          boxShadow:
            "0 28px 54px -22px rgba(90,56,24,0.28), 0 12px 22px rgba(90,56,24,0.16), 0 0 70px rgba(248,217,139,0.18)",
          padding: "40px 24px",
        }}
      >
        <span className="ornament-corner ornament-tl" />
        <span className="ornament-corner ornament-tr" />
        <span className="ornament-corner ornament-bl" />
        <span className="ornament-corner ornament-br" />

        <div className="relative text-center">
          <div
            className={`${langClass} text-[10.5px] sm:text-[11.5px] tracking-[0.36em] uppercase text-deepgold/95`}
          >
            {t(block?.eyebrow, lang)}
          </div>

          <div className="mx-auto w-12 h-[1px] bg-antiquegold/55 my-5" />

          <h1
            className={`gold-foil-stable ${langClass} text-[24px] sm:text-[28px] font-semibold leading-snug`}
            style={{ letterSpacing: "0.01em" }}
          >
            {t(block?.title, lang)}
          </h1>

          <p
            className={`${langClass} text-deepbrown/85 text-[15px] sm:text-[16.5px] leading-[1.7] mt-4`}
          >
            {t(block?.message, lang)}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="block w-8 h-[1px] bg-antiquegold/45" />
            <span className="text-antiquegold text-base leading-none">✦</span>
            <span className="block w-8 h-[1px] bg-antiquegold/45" />
          </div>
        </div>
      </article>
    </div>
  );
}
