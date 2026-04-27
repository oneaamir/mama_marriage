# Claude Code Instructions

Build the royal wedding invitation website using the requirements in `requirements/`.

## Product Direction

This is not a normal landing page. It is a premium mobile-first wedding invitation experience:

```text
intro video
-> final card stays
-> website takes over
-> hero card lifts on scroll
-> large paper panels emerge from the card
-> details stay readable on mobile
```

Use the date and time:

```text
9th May 2026
6:30 PM
```

## Must-Have Features

- Full-screen vertical intro video with `autoplay muted playsInline`.
- Use `theme.assets.introVideo` and `theme.assets.finalFrame` from JSON. They currently point to Cloudinary URLs.
- Smooth video fade into matching final-frame image.
- Hero card with `Tausif & Talat`, `Aaghaz-e-Safar`, date, and time.
- Scroll-based card expansion.
- Use a mobile-friendly cover-card-to-paper-panels layout. Do not squeeze all content into one small card.
- Paper layer reveal for invitation content.
- Subtle gold foil shine.
- Premium shadow depth.
- Very light gold particles only.
- English/Hindi language toggle.
- All editable content from JSON.
- Countdown to `2026-05-09T18:30:00+05:30`.
- Countdown must be a unique royal ivory/gold time-jewel design, not a normal digital timer.
- Venue, map, call, calendar, and WhatsApp actions driven by JSON.

## Visual Rules

- Theme: ivory, antique gold, warm champagne glow, maroon wax seal.
- Match the provided final video frame: card alignment, ivory paper, antique-gold border, warm glow, and soft brown text.
- Keep motion slow and controlled.
- Avoid bubbles, liquid effects, heavy petals, neon colors, and fast animation.
- Prioritize readability and mobile performance.

## Reference Files

- `requirements/README.md`
- `requirements/project-plan.md`
- `requirements/design-system.md`
- `requirements/animation-plan.md`
- `requirements/content-model.md`
- `requirements/data/invitation-data.json`
- `requirements/acceptance-checklist.md`
