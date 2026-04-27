import { useEffect, useRef } from "react";

// Very light gold-dust particles: ~8 visible, edges only, slow.
export default function Particles({ count = 8, enabled = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", onResize);

    const particles = Array.from({ length: count }, () => spawn(w, h));

    function spawn(W, H) {
      const edge = Math.random() < 0.5 ? 0 : 1; // 0 = left, 1 = right
      return {
        x: edge ? W - Math.random() * W * 0.18 : Math.random() * W * 0.18,
        y: H + Math.random() * H * 0.4,
        r: (1.2 + Math.random() * 1.6) * window.devicePixelRatio,
        vy: (0.18 + Math.random() * 0.35) * window.devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.15 * window.devicePixelRatio,
        a: 0,
        ttl: 1,
        phase: Math.random() * Math.PI * 2,
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let p of particles) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.phase + p.y * 0.005) * 0.15;
        p.phase += 0.005;
        // Fade in then out
        const lifeY = (h - p.y) / h;
        p.a = Math.max(0, Math.min(0.55, lifeY * 1.4 - Math.max(0, lifeY - 0.7) * 4));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(255, 240, 190, ${p.a})`);
        grad.addColorStop(0.5, `rgba(216, 180, 106, ${p.a * 0.5})`);
        grad.addColorStop(1, "rgba(216, 180, 106, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        if (p.y < -10 || p.a <= 0.001 && lifeY > 0.95) {
          Object.assign(p, spawn(w, h));
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count, enabled]);

  if (!enabled) return null;
  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden
    />
  );
}
