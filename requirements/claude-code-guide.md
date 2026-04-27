# Claude Code Build Guide

## How Claude Code Works For This Project

Claude Code is Anthropic's terminal-based coding assistant. It can read the project, make a plan, edit files, run commands, debug errors, and iterate on the implementation from plain-English instructions.

For this project, give Claude Code this folder and ask it to build the website from these requirements.

## Project Context Files

Claude Code uses project memory/context files such as:

```text
CLAUDE.md
.claude/CLAUDE.md
```

This repo includes a root `CLAUDE.md` with instructions for the build. Keep it updated if requirements change.

## Suggested Prompt To Give Claude Code

Use the full paste-ready version in:

```text
requirements/claude-build-prompt.md
```

Short version:

```text
Build the wedding invitation website described in requirements/.

Use the data-first approach from requirements/data/invitation-data.json.
Create a mobile-first React website with:
- full-screen intro video
- seamless final-frame transition
- expanding invitation card on scroll
- subtle gold foil shine
- paper layer reveals
- premium shadow depth
- English/Hindi language toggle
- countdown to 9th May 2026, 6:30 PM
- venue/location/RSVP actions from JSON

Do not make a normal landing page. The experience should feel like a royal invitation card becoming interactive.
Keep animations slow and controlled. Avoid bubbles, heavy petals, heavy particles, or fast motion.
```

## Recommended Implementation Steps

```text
1. Scaffold React app with Vite or Next.js.
2. Add Tailwind CSS.
3. Add GSAP and ScrollTrigger.
4. Create data file from invitation-data.json.
5. Build intro video component using `theme.assets.introVideo`.
6. Build hero card aligned with `theme.assets.finalFrame`.
7. Build language toggle.
8. Build expanding card scroll scene.
9. Build invitation message, countdown, details, venue, RSVP.
10. Add subtle shine, depth, and particles.
11. Test on mobile viewport.
12. Check reduced-motion behavior.
```

## Quality Checks

Claude Code should verify:

- Video is vertical full-screen.
- Autoplay works with `muted` and `playsInline`.
- Final-frame image is loaded before transition.
- Text is readable on mobile.
- Card expansion does not overlap content.
- Language toggle swaps all visible labels.
- Countdown target is correct.
- No heavy animations on reduced motion.
- Build succeeds.
