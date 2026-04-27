import { useEffect, useRef, useState } from "react";

export default function IntroVideo({ src, poster, onComplete }) {
  const videoRef = useRef(null);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let finished = false;
    let playingFired = false;

    // Fire onComplete the moment the fade BEGINS (not after) so the hero text
    // animates in while the video fade is still playing — no blank pause.
    const finish = () => {
      if (finished) return;
      finished = true;
      onComplete && onComplete();
      setFading(true);
      setTimeout(() => setHidden(true), 700);
    };

    const tryPlay = async () => {
      try {
        v.muted = true;
        await v.play();
      } catch {
        // Autoplay blocked: continue immediately.
        finish();
      }
    };

    const onEnded = () => finish();
    const onErr = () => finish();
    const onPlaying = () => {
      playingFired = true;
    };

    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onErr);
    v.addEventListener("playing", onPlaying);
    tryPlay();

    // If the first frame doesn't start playing within 4s, bail to the website.
    const watchdog = setTimeout(() => {
      if (!playingFired) finish();
    }, 4000);
    // Hard cap so the intro never holds the page longer than 9s total.
    const safety = setTimeout(finish, 9000);

    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onErr);
      v.removeEventListener("playing", onPlaying);
      clearTimeout(watchdog);
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    if (fading) return;
    setFading(true);
    onComplete && onComplete();
    setTimeout(() => setHidden(true), 500);
  };

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-ivory transition-opacity duration-[700ms] ease-out"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}
      aria-hidden={fading}
    >
      {/* Final frame sits underneath so the fade lands on a matching image. */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={skip}
        className="absolute bottom-5 right-5 z-10 text-ivory/95 text-[11px] tracking-[0.32em] uppercase border border-ivory/55 bg-deepbrown/30 px-3.5 py-1.5 rounded-full backdrop-blur-sm hover:bg-deepbrown/45 hover:border-ivory/80 transition"
      >
        Skip Intro
      </button>
    </div>
  );
}
