import { useEffect, useState } from "react";
import { t } from "../lib/i18n";

function diffParts(targetMs) {
  const now = Date.now();
  let delta = Math.max(0, targetMs - now);
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const min = 60 * 1000;
  const days = Math.floor(delta / day);
  delta -= days * day;
  const hours = Math.floor(delta / hour);
  delta -= hours * hour;
  const minutes = Math.floor(delta / min);
  delta -= minutes * min;
  const seconds = Math.floor(delta / 1000);
  return { days, hours, minutes, seconds };
}

function pad(n, w = 2) {
  return n.toString().padStart(w, "0");
}

function Tile({ value, label, width = 2 }) {
  return (
    <div className="jewel-tile border-glint rim-light-soft relative flex flex-col items-center justify-center px-3 py-4 sm:py-5 min-w-[82px] sm:min-w-[110px]">
      <DigitRoll value={value} width={width} />
      <div className="mt-2 text-[11px] sm:text-[12.5px] tracking-[0.18em] text-deepgold uppercase font-display font-semibold">
        {label}
      </div>
    </div>
  );
}

function DigitRoll({ value, width }) {
  const [display, setDisplay] = useState(value);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (value === display) return;
    setRolling(true);
    const id = setTimeout(() => {
      setDisplay(value);
      setRolling(false);
    }, 220);
    return () => clearTimeout(id);
  }, [value, display]);

  return (
    <div className="overflow-hidden h-[44px] sm:h-[56px] flex items-center">
      <span
        className="tabular text-deepbrown text-[36px] sm:text-[46px] font-display font-semibold leading-none transition-all duration-[360ms] ease-out"
        style={{
          transform: rolling ? "translateY(-6px)" : "translateY(0)",
          opacity: rolling ? 0.55 : 1,
          filter: rolling ? "blur(0.6px)" : "blur(0)",
          letterSpacing: "0.03em",
          textShadow: "0 1px 0 rgba(255,247,232,0.85), 0 -1px 0 rgba(184,138,59,0.25)",
        }}
      >
        {pad(display, width)}
      </span>
    </div>
  );
}

export default function Countdown({ targetISO, labels, lang, title, subtitle }) {
  const targetMs = new Date(targetISO).getTime();
  const [parts, setParts] = useState(() => diffParts(targetMs));

  useEffect(() => {
    const id = setInterval(() => setParts(diffParts(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const langClass = lang === "hi" ? "font-hindi" : "font-display";

  return (
    <div className="w-full">
      {title && (
        <>
          <h3
            className={`text-center text-[16px] sm:text-[18px] tracking-[0.18em] uppercase text-deepgold mb-1.5 ${
              lang === "hi" ? "font-hindi normal-case tracking-wider" : "font-display font-semibold"
            }`}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className={`${langClass} text-center text-deepbrown/75 text-[12.5px] sm:text-[13.5px] italic mb-3`}
            >
              {subtitle}
            </p>
          )}
          <div className="mx-auto w-14 h-[1px] bg-antiquegold/55 mb-6" />
        </>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
        <Tile value={parts.days} label={t(labels.days, lang)} width={3} />
        <Tile value={parts.hours} label={t(labels.hours, lang)} />
        <Tile value={parts.minutes} label={t(labels.minutes, lang)} />
        <Tile value={parts.seconds} label={t(labels.seconds, lang)} />
      </div>
    </div>
  );
}
