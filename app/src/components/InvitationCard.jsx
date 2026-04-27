import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t } from "../lib/i18n";
import Countdown from "./Countdown";
import Panel from "./Panel";
import { googleCalendarUrl, whatsappUrl } from "../lib/calendar";

gsap.registerPlugin(ScrollTrigger);

function ActionButton({ href, children, variant = "seal" }) {
  if (!href) return null;
  const cls = variant === "seal" ? "seal-button" : "ivory-button";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} inline-flex items-center justify-center w-full text-center px-5 py-3.5 rounded-full text-[13px] sm:text-[14px] tracking-[0.18em] uppercase`}
    >
      {children}
    </a>
  );
}

export default function InvitationCard({ data, lang, ready }) {
  const wrapRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroBgRef = useRef(null);
  const coverCardRef = useRef(null);
  const heroBlockRef = useRef(null);
  const scrollHintRef = useRef(null);

  useLayoutEffect(() => {
    if (!ready || typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Cover entrance after intro fade.
      gsap.from(heroBlockRef.current, {
        opacity: 0,
        y: 18,
        duration: 1.4,
        delay: 0.2,
        ease: "power2.out",
      });
      gsap.from(scrollHintRef.current, {
        opacity: 0,
        duration: 1.2,
        delay: 1.6,
        ease: "power1.out",
      });

      // Paper-panel reveals — used in both reduced and normal modes.
      gsap.utils.toArray(".paper-panel").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: reduce ? 0.6 : 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      if (reduce) return;

      // Cover card lifts as the hero section scrolls past.
      gsap.to(coverCardRef.current, {
        y: -70,
        scale: 0.94,
        opacity: 0.65,
        ease: "none",
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

      // Hero background blurs and darkens slightly so panels feel separate.
      gsap.to(heroBgRef.current, {
        filter: "blur(14px) brightness(0.7)",
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

      // Subtle 3D tilt on the cover card — desktop only, very mild.
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      if (isFinePointer) {
        const onMove = (e) => {
          const card = coverCardRef.current;
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / rect.width;
          const dy = (e.clientY - cy) / rect.height;
          gsap.to(card, {
            rotationY: dx * 4,
            rotationX: -dy * 3,
            transformPerspective: 1100,
            transformOrigin: "center center",
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, wrapRef);

    return () => ctx.revert();
  }, [ready]);

  const dateTimeISO = data.event.dateTimeISO;
  const calUrl = googleCalendarUrl({
    title: t(data.actions.calendarTitle, "en"),
    startISO: dateTimeISO,
    durationHours: 3,
    details: t(data.families.invitationLine, lang),
    location: `${t(data.venue.name, "en")}, ${t(data.venue.address, "en")}`,
  });
  const waUrl = data.actions.whatsappNumber
    ? whatsappUrl(data.actions.whatsappNumber, t(data.actions.rsvpMessage, lang))
    : "";
  const phoneUrl = data.actions.phoneNumber ? `tel:${data.actions.phoneNumber}` : "";
  const mapUrl = data.venue.mapUrl || "";

  const langClass = lang === "hi" ? "font-hindi" : "font-display";

  return (
    <div ref={wrapRef} className="relative">
      {/* HERO — cover card sits over the matching final-frame image. */}
      <section
        ref={heroSectionRef}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        <img
          ref={heroBgRef}
          src={data.theme.assets.finalFrame}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(26,15,8,0.55) 100%)",
          }}
        />

        {/* COVER CARD — invitation cover. Stays compact, lifts on scroll. */}
        <div
          ref={coverCardRef}
          className="relative paper-grain border-glint card-3d"
          style={{
            width: "min(86vw, 420px)",
            border: "1px solid rgba(184,138,59,0.7)",
            borderRadius: "10px",
            boxShadow:
              "0 32px 60px -22px rgba(58,36,20,0.6), 0 14px 26px rgba(58,36,20,0.3), 0 0 70px rgba(248,217,139,0.18)",
            padding: "32px 24px",
            zIndex: 10,
          }}
        >
          <span className="ornament-corner ornament-tl" />
          <span className="ornament-corner ornament-tr" />
          <span className="ornament-corner ornament-bl" />
          <span className="ornament-corner ornament-br" />
          <div
            className="absolute inset-3 pointer-events-none rounded-[6px]"
            style={{ border: "1px solid rgba(184,138,59,0.35)" }}
          />

          <div ref={heroBlockRef} className="relative text-center py-4">
            <div className={`${langClass} text-[11px] tracking-[0.42em] text-deepgold uppercase mb-3`}>
              {lang === "hi" ? "शादी का निमंत्रण" : "Wedding Invitation"}
            </div>
            <div className="mx-auto w-16 h-[1px] bg-antiquegold/70 mb-6" />
            <h1
              className={`gold-foil-stable ${langClass} text-[44px] sm:text-[56px] leading-[1] font-semibold`}
              style={{ letterSpacing: "0.01em" }}
            >
              {t(data.couple.displayName, lang)}
            </h1>
            <div
              className={`${lang === "hi" ? "font-hindi text-[26px] sm:text-[30px]" : "font-script text-[30px] sm:text-[36px]"} text-deepgold mt-3`}
              style={{ lineHeight: 1.05 }}
            >
              {t(data.couple.tagline, lang)}
            </div>
            <div className="mx-auto w-24 h-[1px] bg-antiquegold/60 my-6" />
            <div className={`${langClass} text-deepbrown text-[19px] sm:text-[21px] tracking-wide`}>
              {t(data.event.displayDate, lang)}
            </div>
            <div className={`${langClass} text-deepbrown/85 text-[15px] sm:text-[17px] mt-1`}>
              {t(data.event.displayTime, lang)}
            </div>
          </div>
        </div>

        {/* Scroll hint sits below the cover, never under the card. */}
        <div
          ref={scrollHintRef}
          className="scroll-hint absolute left-0 right-0 bottom-7 sm:bottom-10 text-center text-ivory/85 text-[10.5px] tracking-[0.36em] uppercase z-10"
        >
          <div className="mb-1.5">{t(data.sections.hero.scrollHint, lang)}</div>
          <div className="mx-auto w-[1px] h-7 bg-antiquegold/80" />
        </div>
      </section>

      {/* PAPER PANELS — large readable scenes that emerge from the card. */}
      <section className="relative pt-[8vh] sm:pt-[14vh] pb-[14vh]">
        {/* Soft warm glow underlay so panels float on a richer ground. */}
        <div
          aria-hidden
          className="absolute inset-x-0 -top-24 h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(248,217,139,0.18) 0%, rgba(248,217,139,0.06) 40%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto flex flex-col items-center gap-10 sm:gap-14 px-4">
          {/* MESSAGE */}
          <Panel ornate>
            <header className="text-center mb-4">
              <div className={`${langClass} text-[11px] tracking-[0.36em] uppercase text-deepgold/90`}>
                {lang === "hi" ? "निमंत्रण" : "Invitation"}
              </div>
              <div className="mx-auto w-12 h-[1px] bg-antiquegold/55 mt-3" />
            </header>
            <p className={`${langClass} text-deepbrown text-[17px] sm:text-[19px] leading-relaxed text-center`}>
              {t(data.families.hostLine, lang)}
            </p>
            <p className={`${langClass} text-deepbrown/95 text-[16px] sm:text-[18px] leading-[1.7] text-center mt-4`}>
              {t(data.families.invitationLine, lang)}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="block w-10 h-[1px] bg-antiquegold/55" />
              <span className="text-antiquegold text-lg leading-none">✦</span>
              <span className="block w-10 h-[1px] bg-antiquegold/55" />
            </div>
          </Panel>

          {/* COUNTDOWN */}
          <Panel ornate>
            <Countdown
              targetISO={dateTimeISO}
              labels={data.sections.countdown.labels}
              title={t(data.sections.countdown.title, lang)}
              lang={lang}
            />
          </Panel>

          {/* DETAILS */}
          <Panel ornate>
            <header className="text-center mb-5">
              <h3 className={`${langClass} text-[18px] sm:text-[20px] tracking-[0.28em] uppercase text-deepgold`}>
                {t(data.sections.details.title, lang)}
              </h3>
              <div className="mx-auto w-12 h-[1px] bg-antiquegold/55 mt-3" />
            </header>
            <dl className="grid grid-cols-1 gap-3 text-center">
              <Detail
                label={t(data.sections.details.dateLabel, lang)}
                value={t(data.event.displayDate, lang)}
                langClass={langClass}
              />
              <Detail
                label={t(data.sections.details.timeLabel, lang)}
                value={t(data.event.displayTime, lang)}
                langClass={langClass}
              />
              <Detail
                label={t(data.sections.details.venueLabel, lang)}
                value={
                  <>
                    <span className={`${langClass} block text-[17px] sm:text-[19px]`}>
                      {t(data.venue.name, lang)}
                    </span>
                    <span className={`${langClass} block text-[14px] sm:text-[15px] text-deepbrown/75 mt-1 leading-relaxed`}>
                      {t(data.venue.address, lang)}
                    </span>
                  </>
                }
                langClass={langClass}
              />
            </dl>
          </Panel>

          {/* ACTIONS */}
          <Panel ornate>
            <header className="text-center mb-5">
              <h3 className={`${langClass} text-[18px] sm:text-[20px] tracking-[0.28em] uppercase text-deepgold`}>
                {t(data.sections.location.title, lang)}
              </h3>
              <div className="mx-auto w-12 h-[1px] bg-antiquegold/55 mt-3" />
            </header>
            <div className="grid grid-cols-1 gap-3">
              {mapUrl && (
                <ActionButton href={mapUrl} variant="seal">
                  {t(data.sections.location.openMap, lang)}
                </ActionButton>
              )}
              <ActionButton href={calUrl} variant="ivory">
                {t(data.sections.location.addCalendar, lang)}
              </ActionButton>
              {phoneUrl && (
                <ActionButton href={phoneUrl} variant="ivory">
                  {t(data.sections.location.call, lang)}
                </ActionButton>
              )}
              {waUrl && (
                <ActionButton href={waUrl} variant="seal">
                  {t(data.sections.location.whatsapp, lang)}
                </ActionButton>
              )}
            </div>
          </Panel>

          {/* CLOSING */}
          <Panel ornate>
            <div className="text-center">
              <div className="mx-auto w-12 h-[1px] bg-antiquegold/55 mb-5" />
              <p className={`${langClass} text-deepbrown italic text-[17px] sm:text-[19px] leading-relaxed`}>
                {t(data.sections.closing.message, lang)}
              </p>
              <div
                className={`${lang === "hi" ? "font-hindi" : "font-script"} gold-foil-stable text-[34px] sm:text-[40px] mt-5`}
              >
                {t(data.couple.displayName, lang)}
              </div>
              <div className="mx-auto w-16 h-[1px] bg-antiquegold/55 mt-4" />
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value, langClass }) {
  return (
    <div className="bg-pearl/60 border border-antiquegold/40 rounded-md py-3.5 px-4">
      <dt className={`${langClass} text-[11px] tracking-[0.3em] uppercase text-deepgold/90`}>{label}</dt>
      <dd className={`${langClass} text-deepbrown text-[17px] sm:text-[18px] mt-1.5`}>{value}</dd>
    </div>
  );
}
