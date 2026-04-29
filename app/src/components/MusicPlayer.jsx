import { useEffect, useRef, useState } from "react";

const VOLUME_TOP = 0.55;
const VOLUME_BOTTOM = 0.28;
const FADE_MS = 1200;
const FADE_OUT_MS = 1500;
const AUTO_STOP_MS = 60_000;

function scrollVolume() {
  const depth = window.scrollY / (window.innerHeight * 2);
  const clamped = Math.min(1, Math.max(0, depth));
  return VOLUME_TOP - (VOLUME_TOP - VOLUME_BOTTOM) * clamped;
}

export default function MusicPlayer({ src, videoStarted }) {
  const audioRef = useRef(null);
  const fadeRafRef = useRef(null);
  const stopTimerRef = useRef(null);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(() => {
    try { return sessionStorage.getItem("music-muted") === "1"; } catch { return false; }
  });

  // Create audio element and begin buffering immediately.
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto"; // buffer right away so play() starts with no lag
    audio.volume = 0;
    audio.muted = muted;
    audio.src = src;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync muted toggle → audio element.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    try { sessionStorage.setItem("music-muted", muted ? "1" : "0"); } catch {}
  }, [muted]);

  // Core: attempt play. Can be called from multiple triggers.
  const attemptPlay = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function doPlay() {
      if (playingRef.current) return;
      audio.volume = 0;
      audio.play().then(() => {
        playingRef.current = true;
        setPlaying(true);
        // Remove interaction listeners — no longer needed.
        window.removeEventListener("click", doPlay);
        window.removeEventListener("touchstart", doPlay);
        window.removeEventListener("scroll", doPlay);
        // Fade volume in.
        const target = scrollVolume();
        const t0 = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - t0) / FADE_MS);
          audio.volume = p * target;
          if (p < 1) fadeRafRef.current = requestAnimationFrame(tick);
        }
        fadeRafRef.current = requestAnimationFrame(tick);
        // Auto-stop: fade out after 1 minute then pause.
        stopTimerRef.current = setTimeout(() => {
          const startVol = audio.volume;
          const t1 = performance.now();
          function fadeOut(now) {
            const p = Math.min(1, (now - t1) / FADE_OUT_MS);
            audio.volume = startVol * (1 - p);
            if (p < 1) {
              fadeRafRef.current = requestAnimationFrame(fadeOut);
            } else {
              audio.pause();
              playingRef.current = false;
              setPlaying(false);
            }
          }
          fadeRafRef.current = requestAnimationFrame(fadeOut);
        }, AUTO_STOP_MS);
      }).catch(() => {
        // Blocked by browser — will retry on next event.
      });
    }

    attemptPlay.current = doPlay;

    // Attempt 1: immediately on mount (works in some browsers/contexts).
    doPlay();

    // Attempt 2: on any first user interaction.
    window.addEventListener("click", doPlay, { passive: true });
    window.addEventListener("touchstart", doPlay, { passive: true });
    window.addEventListener("scroll", doPlay, { passive: true });

    return () => {
      window.removeEventListener("click", doPlay);
      window.removeEventListener("touchstart", doPlay);
      window.removeEventListener("scroll", doPlay);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attempt 3: when the intro video starts playing — its gesture context
  // sometimes unlocks audio on older iOS / some Android WebViews.
  useEffect(() => {
    if (videoStarted) attemptPlay.current?.();
  }, [videoStarted]);

  // Scroll-breathing volume.
  useEffect(() => {
    function onScroll() {
      const audio = audioRef.current;
      if (!audio || !playingRef.current || audio.muted) return;
      audio.volume = scrollVolume();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => setMuted((m) => !m)}
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
