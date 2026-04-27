# Animation Plan

## Final Effect Decision

Keep the effect stack premium and controlled:

```text
Core:
1. Card expansion
2. Gold foil shine
3. Paper layer reveal
4. Shadow depth

Light atmosphere:
5. Very subtle silk background
6. Very few gold particles

Skip initially:
7. Thread line
8. Petals
9. Bubble/liquid effects
```

## Intro Video Transition

```text
video playing
-> video ends
-> final-frame image is already underneath
-> video opacity fades to 0
-> hero card remains aligned
-> website controls become active
```

Implementation notes:

- Preload `final-frame.jpg`.
- Put image under video from start.
- On `video.onended`, add `intro-complete` class.
- Fade video out over 800-1200ms.
- Do not remove video instantly.

## Hero Motion

After video fades:

- Card receives soft shadow depth.
- Date/time fades in if not already visible.
- Scroll hint appears after a small delay.
- Gold particles begin moving only near edges.

No sudden pop.

## Card Expansion Scroll

Use GSAP ScrollTrigger.

Suggested behavior:

```text
section pin starts
card min-height: about 68vh
scroll progress 0 -> 1
card height grows to about 160vh or content height
border opacity/sharpness increases
background blur increases slightly
content groups fade/slide in one by one
```

Content should emerge from inside the card:

```text
Invitation message
Countdown
Event details
Location actions
RSVP
```

The countdown should appear after the invitation message, not immediately at the top. It should feel like the card is revealing a special engraved time panel.

## Paper Layer Reveal

Each content block can appear as a soft paper insert:

```text
opacity: 0 -> 1
y: 36px -> 0
filter: blur(8px) -> blur(0)
shadow grows slightly
```

Some sections can slide from behind the main card edge, but keep motion slow.

## Countdown Animation

Use a unique but elegant timer effect:

```text
countdown panel fades in from inside the card
four time tiles rise gently from the paper surface
each tile gets a soft bevel shadow
numbers update with a slow roll/fade, not a sharp pop
gold glint moves across tile borders occasionally
```

Rules:

- Timer must remain readable at all times.
- Changing digits must not resize or shift the tile.
- Use tabular numbers if possible.
- Animation duration for digit change: about `350ms` to `600ms`.
- No fast flip clock, no loud bounce, no glowing digital effect.
- Respect `prefers-reduced-motion` by changing digits instantly or with simple fade.

## Gold Foil Shine

Use a CSS pseudo-element or gradient overlay:

```text
thin diagonal light sweep
duration 5-7 seconds
delay between loops
opacity low
only on border/title, not full screen
```

## Shadow Depth

Depth is mandatory:

```text
outer shadow under card
gold back glow
inner paper shadow
slight transform: perspective(1000px) rotateX/rotateY
```

Mouse/gyro tilt:

- Max rotate 3-5 degrees.
- Disable or reduce if user prefers reduced motion.
- On mobile, keep very subtle.

## Particles

Use only 5-10 visible gold particles at once.

Rules:

- Edges only.
- Slow movement.
- Never cover text.
- No glitter storm.
- Pause/reduce on low-end devices or reduced motion.

## Reduced Motion

Respect `prefers-reduced-motion`:

- Skip 3D tilt.
- Disable particles.
- Use simple fade transitions.
- No pinned long scroll animation.
