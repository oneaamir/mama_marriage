import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t } from "../lib/i18n";
import Countdown from "./Countdown";
import { googleCalendarUrl, whatsappUrl } from "../lib/calendar";

gsap.registerPlugin(ScrollTrigger);

function ActionButton({ href, children, variant = "seal" }) {
  if (!href) return null;
  const cls =
    variant === "seal"
      ? "seal-button"
      : "ivory-button";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} inline-flex items-center justify-center w-full text-center px-4 py-3 rounded-full text-[13px] tracking-[0.18em] uppercase`}
    >
      {children}
    </a>
  );
}

export default function InvitationCard({ data, lang, ready }) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const heroBlockRef = useRef(null);
  const scrollHintRef = useRef(null);
  const messageRef = useRef(null);
  const countdownRef = useRef(null);
  const detailsRef = useRef(null);
  const actionsRef = useRef(null);
  const closingRef = useRef(null);
  const bgImageRef = useRef(null);

  useLayoutEffect(() => {
    if (!ready) return;
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      // Initial hero state: card matches the final-frame visual position.
      gsap.set(heroBlockRef.current, { opacity: 0, y: 16 });
      gsap.to(heroBlockRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.set(scrollHintRef.current, { opacity: 0 });
      gsap.to(scrollHintRef.current, {
        opacity: 1,
        duration: 1.2,
        delay: 1.6,
        ease: "power1.out",
      });

      const reveals = [messageRef, countdownRef, detailsRef, actionsRef, closingRef];
      reveals.forEach((r) => {
        gsap.set(r.current, { opacity: 0, y: 36, filter: "blur(8px)" });
      });

      if (reduce) {
        // Reduced motion: simple fades, no pinning.
        reveals.forEach((r, i) => {
          gsap.to(r.current, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            delay: 0.2 + i * 0.15,
            ease: "power1.out",
            scrollTrigger: { trigger: r.current, start: "top 85%" },
          });
        });
        return;
      }

      // Card expansion driven by scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=2400",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(
        cardRef.current,
        {
          minHeight: "min(165vh, 1280px)",
          width: "min(94vw, 560px)",
          ease: "none",
        },
        0
      )
        .to(
          bgImageRef.current,
          {
            filter: "blur(14px) brightness(0.85)",
            scale: 1.05,
            ease: "none",
          },
          0
        )
        .to(
          heroBlockRef.current,
          {
            y: -10,
            ease: "none",
          },
          0
        )
        .to(
          scrollHintRef.current,
          { opacity: 0, duration: 0.1 },
          0
        )
        .to(
          messageRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", ease: "power1.out", duration: 0.4 },
          0.18
        )
        .to(
          countdownRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", ease: "power1.out", duration: 0.4 },
          0.36
        )
        .to(
          detailsRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", ease: "power1.out", duration: 0.4 },
          0.55
        )
        .to(
          actionsRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", ease: "power1.out", duration: 0.4 },
          0.72
        )
        .to(
          closingRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", ease: "power1.out", duration: 0.4 },
          0.88
        );

      // Subtle 3D tilt on pointer move (desktop only).
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      if (isFinePointer) {
        const onMove = (e) => {
          const rect = cardRef.current.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / rect.width;
          const dy = (e.clientY - cy) / rect.height;
          gsap.to(cardRef.current, {
            rotationY: dx * 4,
            rotationX: -dy * 3,
            transformPerspective: 1100,
            transformOrigin: "center center",
            duration: 0.6,
            ease: "power2.out",
          });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, wrapRef);

    return () => ctx.revert();
  }, [ready]);

  const dateTimeISO = data.event.dateTimeISO;
  const titleEn = t(data.actions.calendarTitle, "en");
  const calUrl = googleCalendarUrl({
    title: titleEn,
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
      {/* Pinned section: stays full viewport while card expands. */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Final-frame image as the base layer — matches the video's last frame. */}
        <img
          ref={bgImageRef}
          src={data.theme.assets.finalFrame}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Warm vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(26,15,8,0.55) 100%)",
          }}
        />

        {/* The card. Starts small, grows on scroll. */}
        <div
          ref={cardRef}
          className="relative paper-grain border-glint card-3d"
          style={{
            width: "min(86vw, 430px)",
            minHeight: "62vh",
            border: "1px solid rgba(184,138,59,0.7)",
            borderRadius: "10px",
            boxShadow:
              "0 30px 60px -20px rgba(58,36,20,0.55), 0 12px 22px rgba(58,36,20,0.28), 0 0 60px rgba(248,217,139,0.18)",
            padding: "28px 22px",
            zIndex: 10,
          }}
        >
          <span className="ornament-corner ornament-tl" />
          <span className="ornament-corner ornament-tr" />
          <span className="ornament-corner ornament-bl" />
          <span className="ornament-corner ornament-br" />

          {/* Inner thin double border */}
          <div
            className="absolute inset-3 pointer-events-none rounded-[6px]"
            style={{ border: "1px solid rgba(184,138,59,0.35)" }}
          />

          <div className="relative h-full flex flex-col">
            {/* HERO — visible before scrolling */}
            <div ref={heroBlockRef} className="text-center pt-8 pb-6">
              <div className="text-[11px] tracking-[0.42em] text-deepgold uppercase mb-3">
                {lang === "hi" ? "शादी का निमंत्रण" : "Wedding Invitation"}
              </div>
              <div className={`mx-auto w-16 h-[1px] bg-antiquegold/70 mb-6`} />
              <h1
                className={`gold-foil-stable ${langClass} text-[44px] sm:text-[56px] leading-[1] font-semibold`}
                style={{ letterSpacing: "0.01em" }}
              >
                {t(data.couple.displayName, lang)}
              </h1>
              <div
                className="font-script text-deepgold mt-3 text-[28px] sm:text-[34px]"
                style={{ lineHeight: 1 }}
              >
                {t(data.couple.tagline, lang)}
              </div>
              <div className="mx-auto w-24 h-[1px] bg-antiquegold/60 my-6" />
              <div className={`${langClass} text-deepbrown text-[18px] sm:text-[20px] tracking-wide`}>
                {t(data.event.displayDate, lang)}
              </div>
              <div className={`${langClass} text-deepbrown/85 text-[15px] sm:text-[16px] mt-1`}>
                {t(data.event.displayTime, lang)}
              </div>
            </div>

            <div
              ref={scrollHintRef}
              className="scroll-hint absolute left-0 right-0 -bottom-2 sm:bottom-4 text-center text-deepgold/80 text-[11px] tracking-[0.32em] uppercase"
            >
              <div className="mb-1">{t(data.sections.hero.scrollHint, lang)}</div>
              <div className="mx-auto w-[1px] h-6 bg-antiquegold/70" />
            </div>

            {/* MESSAGE */}
            <div ref={messageRef} className="mt-10 px-2 text-center">
              <div className="mx-auto w-12 h-[1px] bg-antiquegold/60 mb-4" />
              <p className={`${langClass} text-deepbrown text-[15px] sm:text-[17px] leading-relaxed`}>
                {t(data.families.hostLine, lang)}
              </p>
              <p className={`${langClass} text-deepbrown/90 text-[15px] sm:text-[17px] leading-relaxed mt-3`}>
                {t(data.families.invitationLine, lang)}
              </p>
              <div className="mx-auto w-12 h-[1px] bg-antiquegold/60 mt-5" />
            </div>

            {/* COUNTDOWN */}
            <div ref={countdownRef} className="mt-9 px-1">
              <Countdown
                targetISO={dateTimeISO}
                labels={data.sections.countdown.labels}
                title={t(data.sections.countdown.title, lang)}
                lang={lang}
              />
            </div>

            {/* DETAILS */}
            <div ref={detailsRef} className="mt-10 px-2">
              <h3 className={`${langClass} text-center text-[15px] tracking-[0.28em] uppercase text-deepgold/90 mb-4`}>
                {t(data.sections.details.title, lang)}
              </h3>
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
                      <span className="block">{t(data.venue.name, lang)}</span>
                      <span className="block text-[13px] text-deepbrown/75 mt-1">
                        {t(data.venue.address, lang)}
                      </span>
                    </>
                  }
                  langClass={langClass}
                />
              </dl>
            </div>

            {/* ACTIONS */}
            <div ref={actionsRef} className="mt-9 px-2">
              <h3 className={`${langClass} text-center text-[15px] tracking-[0.28em] uppercase text-deepgold/90 mb-4`}>
                {t(data.sections.location.title, lang)}
              </h3>
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
            </div>

            {/* CLOSING */}
            <div ref={closingRef} className="mt-10 px-2 pb-4 text-center">
              <div className="mx-auto w-12 h-[1px] bg-antiquegold/60 mb-4" />
              <p className={`${langClass} text-deepbrown italic text-[15px] sm:text-[17px] leading-relaxed`}>
                {t(data.sections.closing.message, lang)}
              </p>
              <div
                className={`${langClass} font-script gold-foil-stable text-[28px] sm:text-[34px] mt-4`}
              >
                {t(data.couple.displayName, lang)}
              </div>
              <div className="mx-auto w-16 h-[1px] bg-antiquegold/60 mt-3" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value, langClass }) {
  return (
    <div className="bg-pearl/55 border border-antiquegold/35 rounded-md py-3 px-4">
      <dt className="text-[10px] tracking-[0.3em] uppercase text-deepgold/85">{label}</dt>
      <dd className={`${langClass} text-deepbrown text-[16px] mt-1`}>{value}</dd>
    </div>
  );
}
