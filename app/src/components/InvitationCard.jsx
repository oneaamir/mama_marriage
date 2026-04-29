import { Fragment, lazy, Suspense, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { t } from "../lib/i18n";
import Countdown from "./Countdown";
import Panel from "./Panel";
import ProgrammeCard from "./ProgrammeCard";
import { googleCalendarUrl, whatsappUrl } from "../lib/calendar";

// Hero gold-dust — lazy-loaded so the canvas/animation logic isn't in the
// initial bundle. Only renders inside the hero section.
const Particles = lazy(() => import("./Particles"));

gsap.registerPlugin(ScrollTrigger);

function ActionButton({ href, children, variant = "seal", className = "" }) {
  if (!href) return null;
  const cls = variant === "seal" ? "seal-button" : "ivory-button";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} inline-flex items-center justify-center w-full text-center px-5 py-3.5 rounded-full text-[13px] sm:text-[14px] tracking-[0.18em] uppercase ${className}`}
    >
      {children}
    </a>
  );
}

function SectionHeader({ eyebrow, title, langClass }) {
  return (
    <header className="text-center mb-5">
      {eyebrow && (
        <div className={`${langClass} text-[10.5px] sm:text-[11.5px] tracking-[0.36em] uppercase text-deepgold/90`}>
          {eyebrow}
        </div>
      )}
      {title && (
        <h3
          className={`${langClass} mt-2 text-[20px] sm:text-[24px] font-semibold gold-foil-stable`}
          style={{ letterSpacing: "0.01em" }}
        >
          {title}
        </h3>
      )}
      <div className="mx-auto w-12 h-[1px] bg-antiquegold/55 mt-3" />
    </header>
  );
}

function MapPinIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22s7-7.6 7-13a7 7 0 1 0-14 0c0 5.4 7 13 7 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

// Group programme entries by their day label (English value used as key).
function groupByDay(programme) {
  const groups = [];
  const seen = new Map();
  for (const entry of programme) {
    const key = entry.day?.en || entry.id;
    if (!seen.has(key)) {
      seen.set(key, groups.length);
      groups.push({ key, day: entry.day, entries: [] });
    }
    groups[seen.get(key)].entries.push(entry);
  }
  return groups;
}

export default function InvitationCard({ data, lang, route = "barat", ready }) {
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
      gsap.from(coverCardRef.current, {
        opacity: 0,
        scale: 0.96,
        filter: "blur(4px)",
        duration: 0.9,
        delay: 0.1,
        ease: "power2.out",
        clearProps: "filter",
      });
      gsap.from(heroBlockRef.current, {
        opacity: 0,
        y: 14,
        duration: 0.85,
        delay: 0.2,
        ease: "power2.out",
      });
      gsap.from(scrollHintRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.7,
        delay: 0.55,
        ease: "power1.out",
      });

      // Subtle floating breath on the hero block — applied to the inner
      // content (heroBlockRef), not the cover card itself, so it never
      // conflicts with the scroll-lift tween that targets the card.
      if (!reduce) {
        gsap.to(heroBlockRef.current, {
          y: "-=3",
          duration: 3.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.1,
        });
      }

      // Paper panels: scroll-progress-driven reveal so they rise/fade in time
      // with the user's scroll and reverse smoothly when scrolling back up.
      // Programme cards (data-stagger) get a small per-card delay so the
      // four event cards don't all hit max state simultaneously.
      gsap.utils.toArray(".paper-panel").forEach((el) => {
        const stagger = parseFloat(el.dataset?.stagger || "0");
        if (reduce) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24, filter: "blur(0px)" },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: stagger,
              ease: "power1.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
            }
          );
          return;
        }
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 60,
            scale: 0.96,
            filter: "blur(5px)",
            boxShadow:
              "0 8px 16px -8px rgba(90,56,24,0.18), 0 4px 10px rgba(90,56,24,0.10), 0 0 30px rgba(248,217,139,0.05), inset 0 0 30px rgba(255,247,232,0.30)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            boxShadow:
              "0 36px 64px -22px rgba(90,56,24,0.42), 0 18px 32px rgba(90,56,24,0.24), 0 0 80px rgba(248,217,139,0.22), inset 0 0 36px rgba(255,247,232,0.45)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              // Reveal finishes much earlier — by the time the panel's top
              // is at 75% of the viewport, it's fully sharp. Prevents the
              // "last panel still blurred at page bottom" issue.
              start: `top ${95 - stagger * 4}%`,
              end: `top ${75 - stagger * 3}%`,
              scrub: 0.4,
            },
          }
        );
      });

      if (reduce) return;

      gsap.to(coverCardRef.current, {
        y: -55,
        scale: 0.96,
        boxShadow:
          "0 44px 80px -28px rgba(90,56,24,0.30), 0 20px 36px rgba(90,56,24,0.18), 0 0 130px rgba(248,217,139,0.42)",
        ease: "none",
        transformPerspective: 1100,
        transformOrigin: "center top",
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: 0.3,
        },
      });

      gsap.to(heroBgRef.current, {
        filter: "blur(14px) brightness(1.02)",
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

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
            rotationY: dx * 5,
            rotationX: -dy * 4,
            transformPerspective: 1100,
            transformOrigin: "center center",
            duration: 0.55,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, wrapRef);

    return () => ctx.revert();
  }, [ready, route]);

  const langClass = lang === "hi" ? "font-hindi" : "font-display";

  // Route-aware programme + countdown target.
  const allProgramme = Array.isArray(data.programme) ? data.programme : [];
  const routeConfig = (data.routes && data.routes[route]) || null;
  const programme = allProgramme.filter((entry) => {
    if (!entry.routes || entry.routes.length === 0) return true;
    return entry.routes.includes(route);
  });
  const programmeGroups = groupByDay(programme);

  // Countdown event: prefer route-config target → fallback to legacy event.dateTimeISO.
  const countdownEntry =
    routeConfig?.countdownEventId
      ? allProgramme.find((e) => e.id === routeConfig.countdownEventId)
      : null;
  const dateTimeISO = countdownEntry?.dateTimeISO || data.event.dateTimeISO;

  const calTitle = countdownEntry
    ? `${t(data.couple.displayName, lang)} — ${t(countdownEntry.name, lang)}`
    : t(data.actions.calendarTitle, lang);
  const calUrl = googleCalendarUrl({
    title: calTitle,
    startISO: dateTimeISO,
    durationHours: 3,
    details: t(data.families.invitationLine, lang),
    location: `${t(data.venue.name, lang)} — ${t(data.venue.nearby, lang)}`,
  });
  const waUrl = data.actions.whatsappNumber
    ? whatsappUrl(data.actions.whatsappNumber, t(data.actions.rsvpMessage, lang))
    : "";
  const phoneUrl = data.actions.phoneNumber ? `tel:${data.actions.phoneNumber}` : "";
  const mapUrl = data.venue.mapUrl || "";

  const showRsvp = !!(waUrl || phoneUrl);

  const groom = data.couple.groomDetails || {};
  const bride = data.couple.brideDetails || {};

  return (
    <div ref={wrapRef} className="relative">
      {/* HERO — full-screen cinematic cover. The scroll cue at the bottom
          carries the affordance for "more below". */}
      <section
        ref={heroSectionRef}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        <img
          ref={heroBgRef}
          src={data.theme.assets.finalFrame}
          alt=""
          className="absolute object-cover"
          style={{ inset: "-16px", width: "calc(100% + 32px)", height: "calc(100% + 32px)" }}
          draggable={false}
          decoding="async"
          fetchpriority="high"
        />
        {/* Hero-only gold dust — restrained and edge-only. Lazy chunk; only
            mounts after intro completes (ready=true) so it never blocks
            first paint. Scoped to the hero section so it never appears
            on later panels. */}
        {ready && (
          <Suspense fallback={null}>
            <Particles count={5} enabled />
          </Suspense>
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,247,232,0.0) 38%, rgba(216,180,106,0.18) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(244,232,208,0.0) 70%, rgba(244,232,208,0.55) 100%)",
          }}
        />

        <div
          ref={coverCardRef}
          className="relative paper-grain border-glint card-3d rim-light"
          style={{
            width: "min(86vw, 440px)",
            border: "1px solid rgba(184,138,59,0.7)",
            borderRadius: "10px",
            boxShadow:
              "0 28px 54px -22px rgba(90,56,24,0.26), 0 12px 22px rgba(90,56,24,0.14), 0 0 80px rgba(248,217,139,0.22)",
            padding: "44px 24px",
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

          <div ref={heroBlockRef} className="relative text-center">
            <div
              className={`${langClass} text-[10.5px] sm:text-[12px] tracking-[0.32em] uppercase text-deepgold leading-relaxed`}
            >
              {t(data.families.religiousHeader, lang)}
            </div>
            <div className="mx-auto w-14 h-[1px] bg-antiquegold/65 my-5" />

            <h1
              className={`gold-foil-shine ${langClass} text-[44px] sm:text-[60px] leading-[1.05] font-semibold`}
              style={{ letterSpacing: "0.01em" }}
              aria-label={`${t(data.couple.groom, lang)} & ${t(data.couple.bride, lang)}`}
            >
              {t(data.couple.groom, lang)}
              <span
                aria-hidden
                className="mx-2 sm:mx-3 align-middle"
                style={{
                  WebkitTextFillColor: "#b88a3b",
                  color: "#b88a3b",
                  fontSize: "0.55em",
                  verticalAlign: "0.16em",
                }}
              >
                ♥
              </span>
              {t(data.couple.bride, lang)}
            </h1>

            <div
              className={`${lang === "hi" ? "font-hindi text-[26px] sm:text-[32px]" : "font-script text-[32px] sm:text-[40px]"} text-deepgold mt-4`}
              style={{ lineHeight: 1.05 }}
            >
              {t(data.couple.tagline, lang)}
            </div>

            <div className="mx-auto w-20 h-[1px] bg-antiquegold/55 mt-6" />
          </div>
        </div>

        {/* Scroll cue — typography lines flow free; only the chevron sits in
            a small soft-blur halo so it pops without a wide solid card. */}
        <div
          ref={scrollHintRef}
          className="scroll-hint absolute left-0 right-0 bottom-6 sm:bottom-9 z-20 pointer-events-none text-center"
        >
          <div className="inline-flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="block w-10 h-[1.5px] bg-antiquegold" />
              <span
                className={`${langClass} text-deepbrown font-semibold text-[11.5px] sm:text-[12.5px] tracking-[0.36em] uppercase`}
              >
                {t(data.sections.hero.discover, lang)}
              </span>
              <span className="block w-10 h-[1.5px] bg-antiquegold" />
            </div>
            <div className="relative inline-flex items-center justify-center w-9 h-9">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-antiquegold/45"
                style={{
                  backgroundColor: "rgba(255, 247, 232, 0.35)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              />
              <svg
                className="relative"
                width="20"
                height="13"
                viewBox="0 0 22 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 2L11 11L20 2"
                  stroke="#8A6428"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* PAPER PANELS — full-screen hero now, so the first panel gets
          comfortable breathing room below it. */}
      <section className="relative pt-[8vh] sm:pt-[12vh] pb-[14vh]">
        <div
          aria-hidden
          className="absolute inset-x-0 -top-24 h-48 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(248,217,139,0.18) 0%, rgba(248,217,139,0.06) 40%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto flex flex-col items-center gap-12 sm:gap-16 px-4">
          {/* INVITATION MESSAGE — slim panel, transitional, not content-heavy. */}
          <Panel ornate={false} slim>
            <div className="text-center">
              <div className={`${langClass} text-[10.5px] sm:text-[11.5px] tracking-[0.36em] uppercase text-deepgold/90`}>
                {lang === "hi" ? "निमंत्रण" : "Invitation"}
              </div>
              <div className="mx-auto w-10 h-[1px] bg-antiquegold/45 mt-3 mb-4" />
              <p
                className={`${langClass} text-deepbrown text-[16px] sm:text-[18px] leading-[1.7]`}
              >
                {t(data.families.hostLine, lang)}
              </p>
              <p
                className={`${langClass} text-deepbrown/95 text-[15.5px] sm:text-[17.5px] leading-[1.75] mt-3`}
              >
                {t(data.families.invitationLine, lang)}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="block w-8 h-[1px] bg-antiquegold/45" />
                <span className="text-antiquegold text-base leading-none">✦</span>
                <span className="block w-8 h-[1px] bg-antiquegold/45" />
              </div>
            </div>
          </Panel>

          {/* COUNTDOWN — slim panel, compact and focused. Subtitle adapts
              per route so the message matches the event being counted down. */}
          <Panel ornate={false} slim>
            <Countdown
              targetISO={dateTimeISO}
              labels={data.sections.countdown.labels}
              title={t(data.sections.countdown.title, lang)}
              subtitle={t(
                routeConfig?.countdownSubtitle || data.sections.countdown.subtitle,
                lang
              )}
              lang={lang}
            />
          </Panel>

          {/* PROGRAMME — day-grouped event cards. Route label sits above
              the section title so the page identifies itself as the Barat
              or Walima invitation. */}
          {programme.length > 0 && (
            <div className="w-full flex flex-col items-center gap-8 sm:gap-10">
              <div className="text-center">
                {routeConfig?.label && (
                  <div
                    className={`${langClass} inline-block text-[10.5px] sm:text-[11.5px] tracking-[0.36em] uppercase text-deepgold px-4 py-1.5 rounded-full border border-antiquegold/55 bg-pearl/55 mb-3`}
                  >
                    {t(routeConfig.label, lang)}
                  </div>
                )}
                <h2
                  className={`gold-foil-stable ${langClass} mt-1 text-[26px] sm:text-[32px] font-semibold`}
                  style={{ letterSpacing: "0.01em" }}
                >
                  {t(data.sections.programme.title, lang)}
                </h2>
                <div className="mx-auto w-14 h-[1px] bg-antiquegold/55 mt-3" />
              </div>

              {programmeGroups.map((group, gi) => (
                <div key={group.key} className="w-full flex flex-col items-center gap-5 sm:gap-6">
                  <div
                    className={`${langClass} inline-block text-[11px] sm:text-[12px] tracking-[0.34em] uppercase text-deepgold px-4 py-1.5 rounded-full border border-antiquegold/45 bg-pearl/55`}
                  >
                    {t(group.day, lang)}
                  </div>
                  {group.entries.map((entry, i) => (
                    <Fragment key={entry.id}>
                      {i > 0 && (
                        <span
                          aria-hidden
                          className="block w-[1.5px] h-7 bg-antiquegold/45"
                        />
                      )}
                      <ProgrammeCard
                        entry={entry}
                        lang={lang}
                        stagger={gi * 0.04 + i * 0.06}
                      />
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* VENUE — modern utility card. Slim panel, location-pin chip,
              strong primary CTA, lighter ceremonial weight than programme. */}
          <Panel ornate={false} slim>
            <div className="flex items-center gap-4">
              <div
                className="flex-none flex items-center justify-center w-11 h-11 rounded-full border border-antiquegold/55 bg-pearl/55 text-antiquegold"
                aria-hidden
              >
                <MapPinIcon />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className={`${langClass} text-[10.5px] sm:text-[11.5px] tracking-[0.32em] uppercase text-deepgold/90`}>
                  {t(data.sections.venue.eyebrow, lang)}
                </div>
                <h3
                  className={`gold-foil-stable ${langClass} mt-1 text-[20px] sm:text-[24px] font-semibold leading-tight`}
                  style={{ letterSpacing: "0.01em" }}
                >
                  {t(data.venue.name, lang)}
                </h3>
                <p className={`${langClass} text-deepbrown/80 text-[13.5px] sm:text-[15px] mt-1 leading-snug`}>
                  {t(data.venue.nearby, lang)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
              {mapUrl && (
                <ActionButton href={mapUrl} variant="seal">
                  {t(data.sections.venue.openMap, lang)}
                </ActionButton>
              )}
              <ActionButton href={calUrl} variant="ivory">
                {t(data.sections.venue.addCalendar, lang)}
              </ActionButton>
            </div>
          </Panel>

          {/* COUPLE DETAILS — slim, lower emphasis than hero/programme. */}
          <Panel ornate={false} slim>
            <div className="text-center mb-4">
              <div className={`${langClass} text-[10.5px] sm:text-[11.5px] tracking-[0.36em] uppercase text-deepgold/90`}>
                {t(data.sections.couple.eyebrow, lang)}
              </div>
              <div className="mx-auto w-10 h-[1px] bg-antiquegold/45 mt-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-stretch">
              <PersonBlock
                label={t(data.sections.couple.groomLabel, lang)}
                relation={t(data.sections.couple.fatherOf, lang)}
                fullName={t(groom.fullName, lang)}
                father={t(groom.father, lang)}
                address={t(groom.address, lang)}
                addressLabel={t(data.sections.couple.addressLabel, lang)}
                langClass={langClass}
              />

              <div className="hidden md:flex flex-col items-center justify-center px-2">
                <span className="block w-[1px] flex-1 bg-antiquegold/55" />
                <span
                  className={`${lang === "hi" ? "font-hindi text-[18px]" : "font-script text-[28px]"} text-deepgold py-2`}
                >
                  {t(data.sections.couple.weds, lang)}
                </span>
                <span className="block w-[1px] flex-1 bg-antiquegold/55" />
              </div>
              <div className="md:hidden flex items-center justify-center gap-3">
                <span className="block w-10 h-[1px] bg-antiquegold/55" />
                <span
                  className={`${lang === "hi" ? "font-hindi text-[16px]" : "font-script text-[22px]"} text-deepgold leading-none`}
                >
                  {t(data.sections.couple.weds, lang)}
                </span>
                <span className="block w-10 h-[1px] bg-antiquegold/55" />
              </div>

              <PersonBlock
                label={t(data.sections.couple.brideLabel, lang)}
                relation={t(data.sections.couple.daughterOf, lang)}
                fullName={t(bride.fullName, lang)}
                father={t(bride.father, lang)}
                address={t(bride.address, lang)}
                addressLabel={t(data.sections.couple.addressLabel, lang)}
                ps={t(bride.ps, lang)}
                po={t(bride.po, lang)}
                psLabel={t(data.sections.couple.psLabel, lang)}
                poLabel={t(data.sections.couple.poLabel, lang)}
                langClass={langClass}
              />
            </div>
          </Panel>

          {/* RSVP — slim, only shown when at least one contact channel exists. */}
          {showRsvp && (
            <Panel ornate={false} slim>
              <div className="text-center mb-4">
                <div className={`${langClass} text-[10.5px] sm:text-[11.5px] tracking-[0.36em] uppercase text-deepgold/90`}>
                  {t(data.sections.rsvp.eyebrow, lang)}
                </div>
                <div className="mx-auto w-10 h-[1px] bg-antiquegold/45 mt-3" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                {phoneUrl && (
                  <ActionButton href={phoneUrl} variant="ivory">
                    {t(data.sections.rsvp.call, lang)}
                  </ActionButton>
                )}
                {waUrl && (
                  <ActionButton href={waUrl} variant="seal">
                    {t(data.sections.rsvp.whatsapp, lang)}
                  </ActionButton>
                )}
              </div>
            </Panel>
          )}

          {/* CLOSING — slim, simple, calm. */}
          <Panel ornate={false} slim>
            <div className="text-center">
              <div
                className={`${langClass} text-[10.5px] sm:text-[11.5px] tracking-[0.36em] uppercase text-deepgold/90`}
              >
                {t(data.sections.closing.eyebrow, lang)}
              </div>
              <div className="mx-auto w-10 h-[1px] bg-antiquegold/45 mt-3 mb-4" />
              <p
                className={`${langClass} text-deepbrown italic text-[16px] sm:text-[18px] leading-relaxed`}
              >
                {t(data.sections.closing.message, lang)}
              </p>
              <div
                className={`${lang === "hi" ? "font-hindi" : "font-script"} gold-foil-stable text-[30px] sm:text-[38px] mt-4`}
              >
                {t(data.couple.displayName, lang)}
              </div>
              <div className="mx-auto w-12 h-[1px] bg-antiquegold/45 mt-3" />
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

function PersonBlock({
  label,
  relation,
  fullName,
  father,
  address,
  addressLabel,
  ps,
  po,
  psLabel,
  poLabel,
  langClass,
}) {
  return (
    <div className="text-center md:px-2">
      <div
        className={`${langClass} text-[10.5px] sm:text-[11.5px] tracking-[0.36em] uppercase text-deepgold/95`}
      >
        {label}
      </div>
      <h4
        className={`${langClass} mt-2 text-[22px] sm:text-[26px] font-semibold text-deepbrown leading-tight`}
      >
        {fullName}
      </h4>
      <div className={`${langClass} text-deepbrown/80 text-[14.5px] sm:text-[16px] mt-2`}>
        {relation} <span className="text-deepbrown">{father}</span>
      </div>

      <div className="mx-auto w-10 h-[1px] bg-antiquegold/40 my-4" />

      <div className={`${langClass} text-deepbrown text-[14px] sm:text-[15.5px]`}>
        <span className="text-deepgold tracking-[0.18em] uppercase text-[11px]">
          {addressLabel}
        </span>
        <div className="mt-1.5 leading-relaxed text-deepbrown/90">{address}</div>
        {(ps || po) && (
          <div className="mt-2 flex flex-col items-center gap-0.5 text-[13.5px] sm:text-[14.5px] text-deepbrown/90">
            {ps && (
              <div>
                <span className="text-deepgold tracking-[0.18em] uppercase text-[10.5px] mr-1.5">
                  {psLabel}
                </span>
                {ps}
              </div>
            )}
            {po && (
              <div>
                <span className="text-deepgold tracking-[0.18em] uppercase text-[10.5px] mr-1.5">
                  {poLabel}
                </span>
                {po}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
