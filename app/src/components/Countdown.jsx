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
    <div className="jewel-tile border-glint rim-light-soft relative flex flex-col items-center justify-center px-3 py-4 sm:py-5 min-w-[78px] sm:min-w-[100px]">
      <DigitRoll value={value} width={width} />
      <div className="mt-1.5 text-[10.5px] sm:text-[11.5px] tracking-[0.22em] text-deepgold/95 uppercase">
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
    <div className="overflow-hidden h-[40px] sm:h-[50px] flex items-center">
      <span
        className="tabular text-deepbrown text-[32px] sm:text-[40px] font-display font-semibold leading-none transition-all duration-[420ms] ease-out"
        style={{
          transform: rolling ? "translateY(-8px)" : "translateY(0)",
          opacity: rolling ? 0.2 : 1,
          filter: rolling ? "blur(2px)" : "blur(0)",
          letterSpacing: "0.04em",
          textShadow: "0 1px 0 rgba(255,247,232,0.85), 0 -1px 0 rgba(184,138,59,0.25)",
        }}
      >
        {pad(display, width)}
      </span>
    </div>
  );
}

export default function Countdown({ targetISO, labels, lang, title }) {
  const targetMs = new Date(targetISO).getTime();
  const [parts, setParts] = useState(() => diffParts(targetMs));

  useEffect(() => {
    const id = setInterval(() => setParts(diffParts(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return (
    <div className="w-full">
      {title && (
        <h3
          className={`text-center text-[14px] sm:text-[16px] tracking-[0.22em] uppercase text-deepgold mb-5 ${
            lang === "hi" ? "font-hindi normal-case tracking-wider" : "font-display"
          }`}
        >
          {title}
        </h3>
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
