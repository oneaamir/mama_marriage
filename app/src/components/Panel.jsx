// Ivory paper panel.
// `ornate` (default true): full corner ornaments + inner double border.
// `slim`  (default false): lighter surface for secondary sections — same paper
// grain, rim-light, and thin gold border, but no inner border / corners and
// reduced padding. Used for invitation message, countdown, venue, couple,
// and closing so they feel lower-weight than hero / programme cards.
// `stagger` (number, optional): forwarded to `data-stagger` so InvitationCard
// can give programme cards a small per-card reveal delay.
export default function Panel({ children, ornate = true, slim = false, stagger, className = "" }) {
  const padding = slim ? "22px 20px" : "32px 24px";
  const shadow = slim
    ? "0 20px 40px -20px rgba(90,56,24,0.30), 0 10px 18px rgba(90,56,24,0.16), 0 0 60px rgba(248,217,139,0.14), inset 0 0 28px rgba(255,247,232,0.42)"
    : "0 30px 56px -22px rgba(90,56,24,0.42), 0 14px 26px rgba(90,56,24,0.22), 0 0 70px rgba(248,217,139,0.18), inset 0 0 32px rgba(255,247,232,0.42)";
  const border = slim ? "1px solid rgba(184,138,59,0.55)" : "1px solid rgba(184,138,59,0.7)";

  return (
    <article
      data-stagger={stagger != null ? stagger : undefined}
      className={`paper-panel relative paper-grain border-glint rim-light w-full ${className}`}
      style={{
        maxWidth: slim ? "min(94vw, 480px)" : "min(94vw, 540px)",
        border,
        borderRadius: "12px",
        boxShadow: shadow,
        padding,
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
