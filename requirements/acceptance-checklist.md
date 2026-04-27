# Acceptance Checklist

## Experience

- [ ] QR/link opens the invitation website directly.
- [ ] Intro video autoplays on mobile.
- [ ] Intro video uses the Cloudinary URL from JSON.
- [ ] Video is full-screen vertical.
- [ ] Video does not redirect to another page.
- [ ] Final video frame transitions smoothly into website hero.
- [ ] Final-frame image uses the Cloudinary URL from JSON.
- [ ] Same card remains visible after video fade.
- [ ] Guest immediately sees `Tausif & Talat`.
- [ ] Date and time are clear: `9th May 2026`, `6:30 PM`.

## Design

- [ ] Theme matches video: ivory, antique gold, maroon, warm glow.
- [ ] Website feels premium, not cartoonish.
- [ ] Hero card aligns visually with `final-frame.jpg`.
- [ ] Card text aligns to the card center, not only the viewport center.
- [ ] Gold foil shine is subtle.
- [ ] Shadows create real card depth.
- [ ] 3D tilt is subtle and never hurts readability.
- [ ] Silk background movement is very slow.
- [ ] Particles are controlled and do not cover text.
- [ ] No bubbles or liquid effects.
- [ ] No heavy petals in version 1.

## Scroll

- [ ] Card expands on scroll.
- [ ] Content emerges from inside card.
- [ ] Paper layers reveal smoothly.
- [ ] No sudden section pop.
- [ ] Animation is slow and controlled.
- [ ] Mobile scrolling remains smooth.

## Content

- [ ] All editable text comes from JSON.
- [ ] English language works.
- [ ] Hindi language works.
- [ ] Countdown uses `2026-05-09T18:30:00+05:30`.
- [ ] Countdown appears as royal ivory/gold time tiles, not a digital clock.
- [ ] Countdown tiles do not shift when numbers change.
- [ ] Gallery hides if no images are provided.
- [ ] Venue actions hide if URLs/phone numbers are empty.

## Technical

- [ ] Uses React and Tailwind.
- [ ] Uses GSAP ScrollTrigger for scroll animation.
- [ ] Supports `prefers-reduced-motion`.
- [ ] Build command succeeds.
- [ ] No console errors.
- [ ] Tested at mobile and desktop widths.
