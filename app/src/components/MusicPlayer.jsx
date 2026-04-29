import { useEffect, useRef, useState } from "react";

const VOLUME_TOP = 0.55;
const VOLUME_BOTTOM = 0.28;
const FADE_MS = 1200;

function scrollVolume() {
  const depth = window.scrollY / (window.innerHeight * 2);
  const clamped = Math.min(1, Math.max(0, depth));
  return VOLUME_TOP - (VOLUME_TOP - VOLUME_BOTTOM) * clamped;
}

export default function MusicPlayer({ src }) {
  const audioRef = useRef(null);
  const fadeRafRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(() => {
    try { return sessionStorage.getItem("music-muted") === "1"; } catch { return false; }
  });
  const startedRef = useRef(false);

  // Mount: create audio element once.
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0;
    audio.muted = muted;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync muted state → audio element whenever it changes.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    try { sessionStorage.setItem("music-muted", muted ? "1" : "0"); } catch {}
  }, [muted]);

  // First-interaction trigger.
  useEffect(() => {
    function start() {
      if (startedRef.current) return;
      startedRef.current = true;

      const audio = audioRef.current;
      if (!audio) return;

      audio.src = src;
      audio.volume = 0;

      audio.play().then(() => {
        setPlaying(true);
        // Fade volume 0 → target over FADE_MS.
        const target = scrollVolume();
        const startTime = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - startTime) / FADE_MS);
          audio.volume = t * target;
          if (t < 1) fadeRafRef.current = requestAnimationFrame(tick);
        }
        fadeRafRef.current = requestAnimationFrame(tick);
      }).catch(() => {
        // Autoplay blocked even after gesture on some browsers — silently ignore.
        startedRef.current = false;
      });
    }

    window.addEventListener("click", start, { once: true, passive: true });
    window.addEventListener("touchstart", start, { once: true, passive: true });
    window.addEventListener("scroll", start, { once: true, passive: true });

    return () => {
      window.removeEventListener("click", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("scroll", start);
    };
  }, [src]);

  // Scroll-breathing volume.
  useEffect(() => {
    function onScroll() {
      const audio = audioRef.current;
      if (!audio || !playing || audio.muted) return;
      audio.volume = scrollVolume();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [playing]);

  function toggleMute() {
    setMuted((m) => !m);
  }

  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? "Unmute music" : "Mute music"}
      className={`fixed bottom-6 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center gap-[3px] border border-antiquegold/70 transition-opacity duration-500 ${muted ? "music-muted" : ""}`}
      style={{
        background: "linear-gradient(160deg, #fbf1d9 0%, #f4e8d0 100%)",
        boxShadow:
          "0 4px 12px rgba(58,36,20,0.22), inset 0 1px 0 rgba(255,247,232,0.9), 0 0 0 1px rgba(184,138,59,0.18)",
        opacity: playing ? 1 : 0.55,
      }}
    >
      <span className="music-bar" />
      <span className="music-bar" />
      <span className="music-bar" />
      <span className="music-bar" />
    </button>
  );
}
