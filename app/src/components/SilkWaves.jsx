// Slow gold/ivory silk-like motion behind the page. Pure CSS — three soft
// radial gradient layers drift independently on long ease-in-out loops, so
// the effect reads as woven fabric catching light, not particles or wind.
// Heavy `mix-blend-mode: soft-light` lets the silk glow tint whatever's
// behind it (the blurred final-frame image) without ever darkening it.
export default function SilkWaves({ enabled = true }) {
  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="silk-waves pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      style={{ mixBlendMode: "soft-light" }}
    >
      <div
        className="silk-layer"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 30% 35%, rgba(248, 217, 139, 0.55), transparent 65%)",
          animation: "silk-drift-1 38s ease-in-out infinite",
        }}
      />
      <div
        className="silk-layer"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 70% 65%, rgba(216, 180, 106, 0.50), transparent 65%)",
          animation: "silk-drift-2 46s ease-in-out infinite",
        }}
      />
      <div
        className="silk-layer"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(255, 247, 232, 0.35), transparent 70%)",
          animation: "silk-drift-3 54s ease-in-out infinite",
        }}
      />
    </div>
  );
}
