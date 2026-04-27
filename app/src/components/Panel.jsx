// Large readable ivory paper panel that emerges from the cover card.
// Each panel is its own surface — generous padding, large type, antique-gold border.
export default function Panel({ children, ornate = true, className = "" }) {
  return (
    <article
      className={`paper-panel relative paper-grain border-glint w-full ${className}`}
      style={{
        maxWidth: "min(94vw, 540px)",
        border: "1px solid rgba(184,138,59,0.7)",
        borderRadius: "12px",
        boxShadow:
          "0 30px 50px -22px rgba(58,36,20,0.55), 0 12px 22px rgba(58,36,20,0.25), 0 0 60px rgba(248,217,139,0.12), inset 0 0 30px rgba(255,247,232,0.35)",
        padding: "30px 22px",
      }}
    >
      {ornate && (
        <>
          <span className="ornament-corner ornament-tl" />
          <span className="ornament-corner ornament-tr" />
          <span className="ornament-corner ornament-bl" />
          <span className="ornament-corner ornament-br" />
          <div
            className="absolute inset-3 pointer-events-none rounded-[7px]"
            style={{ border: "1px solid rgba(184,138,59,0.32)" }}
          />
        </>
      )}
      <div className="relative">{children}</div>
    </article>
  );
}
