import { useEffect, useRef, useState } from "react";

export default function IntroVideo({ src, poster, onComplete }) {
  const videoRef = useRef(null);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        v.muted = true;
        await v.play();
      } catch {
        // Autoplay blocked: still show the final frame underneath and continue.
        finish();
      }
    };

    const finish = () => {
      if (fading || hidden) return;
      setFading(true);
      setTimeout(() => {
        setHidden(true);
        onComplete && onComplete();
      }, 1100);
    };

    const onEnded = () => finish();
    const onErr = () => finish();

    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onErr);
    tryPlay();

    // Hard fallback so guests never get stuck on a stalled video.
    const safety = setTimeout(finish, 18000);

    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onErr);
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setHidden(true);
      onComplete && onComplete();
    }, 700);
  };

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black transition-opacity duration-[1100ms] ease-out"
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
        className="absolute bottom-6 right-6 z-10 text-ivory/85 text-sm tracking-[0.2em] uppercase border border-ivory/40 px-3 py-1.5 rounded-full backdrop-blur-sm hover:text-ivory hover:border-ivory/70 transition"
      >
        Skip
      </button>
    </div>
  );
}
