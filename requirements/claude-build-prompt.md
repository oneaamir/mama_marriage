# Paste This Prompt Into Claude Code

Read `CLAUDE.md`, `.claude/CLAUDE.md`, and every file inside `requirements/` before coding.

Build the complete premium royal wedding invitation website in this project folder.

## Build Goal

Create a mobile-first one-page wedding invitation experience for:

```text
Tausif & Talat
Aaghaz-e-Safar
9th May 2026
6:30 PM
```

This must not feel like a normal landing page. It should feel like a royal ivory-and-gold invitation card becomes alive after the intro video.

## Data Source

Use this file as the editable data source:

```text
requirements/data/invitation-data.json
```

All editable text, date/time, assets, venue, RSVP, buttons, and language strings must come from JSON where possible.

Use:

```text
theme.assets.introVideo
theme.assets.finalFrame
```

These already contain Cloudinary URLs for the intro video and final-frame image.

## Tech Stack

Use:

```text
React
Tailwind CSS
GSAP + ScrollTrigger
```

Vite is preferred unless the existing project already uses another framework.

## Required Experience

```text
1. Guest opens the link.
2. Full-screen vertical video autoplays.
3. Video shows envelope opening and final invitation card.
4. Final-frame image is already preloaded underneath.
5. Video fades out smoothly.
6. Same card remains visible as website hero.
7. User immediately sees the invitation names/date/time.
8. On scroll, the hero card lifts like an invitation cover.
9. Large readable ivory/gold paper panels emerge from behind/inside the card.
10. Invitation message, countdown, event details, location, and RSVP reveal as premium panels.
11. Final blessing closes the page.
```

## Important Mobile Layout Rule

Do not squeeze the whole website into one small card.

Use this approach:

```text
hero card = invitation cover
scroll = cover lifts
content = large paper panels sliding out from the card
```

On mobile, panels should be readable:

```text
width: 88vw to 92vw
min-height: 55vh to 75vh
countdown: 2x2 grid
buttons: touch-friendly
text: readable without zoom
```

## Visual Theme

Match the provided video/image theme:

```text
ivory pearl paper
antique gold embossed border
warm champagne glow
deep maroon wax seal accents
soft brown typography
subtle silk background
premium paper shadows
```

Do not introduce a new color theme.

## Animation Requirements

Keep motion slow, smooth, and premium.

Must include:

```text
video fade transition
subtle 3D card depth
cover card lift on scroll
paper panel reveal
gold foil border shine
soft shadow depth
royal countdown tile animation
very light gold particles near edges only
```

Countdown must be unique:

```text
royal ivory/gold time-jewel tiles
Days / Hours / Minutes / Seconds
mobile 2x2 grid
desktop 4x1 row
soft 3D bevel
inner shadow
subtle border glint
digits change with soft roll/fade
no digital clock look
```

## Avoid

Do not use:

```text
bubbles
liquid/water effects
heavy petals
heavy particles
neon colors
fast animation
spinning 3D
sparkle explosions
normal landing-page sections
tiny text on mobile
```

## Language Support

Add English/Hindi toggle:

```text
EN | हिन्दी
```

Default language: English.

Use the bilingual strings from JSON. If any Hindi text renders incorrectly due to encoding, keep the JSON UTF-8 and fix the app rendering/font, not by hardcoding random text.

## Sections To Build

```text
1. IntroVideo
2. HeroInvitationCard
3. PaperPanel invitation message
4. RoyalTimeJewels countdown
5. EventDetails panel
6. VenueActions panel
7. Optional Gallery if JSON enables it
8. RSVP / wishes panel
9. FinalBlessing
```

## Verification

After implementation:

```text
run install if needed
run build
run local dev server
check mobile viewport
check video autoplay attributes
check final-frame transition
check countdown target: 2026-05-09T18:30:00+05:30
check English/Hindi toggle
check no content overlaps
check reduced-motion behavior
```

Tell me the local URL after starting the dev server.
