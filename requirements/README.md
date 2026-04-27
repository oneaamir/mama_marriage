# Royal Wedding Invitation Website Requirements

This folder is the build handoff for Claude Code. It defines the complete website idea, visual direction, animation rules, content model, bilingual language support, and implementation plan.

## Final Experience

The website must feel like one continuous royal invitation experience:

```text
QR scan
-> Full-screen vertical intro video autoplay
-> Envelope opens and final card with names is visible
-> Video fades into matching website hero
-> Same card stays on screen
-> User instantly understands the invitation
-> Scroll expands the card
-> Content emerges from inside the card
-> Event details, location, RSVP, and final blessing appear
```

## Required Assets

Place assets in the app's public assets folder when building:

```text
intro-video.mp4       Full vertical envelope opening video
final-frame.jpg       Still image from the final video frame
silk-texture.jpg      Optional subtle ivory silk texture
music.mp3             Optional soft instrumental music
```

The final video frame and `final-frame.jpg` should visually match. This is what makes the video-to-website transition feel seamless.

Current hosted assets:

```text
Intro video:
https://res.cloudinary.com/dim7qn23t/video/upload/v1777325159/Video_Generation_with_Text_Addition_ir9bei.mp4

Final frame image:
https://res.cloudinary.com/dim7qn23t/image/upload/v1777325204/55536cc6-5401-43a6-b1a6-e78140945cee.png
```

## Key Wedding Details

```text
Couple: Tausif & Talat
Tagline: Aaghaz-e-Safar
Date: 9th May 2026
Time: 6:30 PM
Theme: Royal ivory, antique gold, deep maroon
Languages: English and Hindi
```

## Recommended Tech Stack

```text
React
Vite or Next.js
Tailwind CSS
GSAP + ScrollTrigger
Framer Motion optional
Canvas or CSS particles for very light gold dust
```

Prefer a single-page app. Do not redirect after the video.

## Main Docs

- [project-plan.md](./project-plan.md)
- [design-system.md](./design-system.md)
- [animation-plan.md](./animation-plan.md)
- [content-model.md](./content-model.md)
- [claude-code-guide.md](./claude-code-guide.md)
- [claude-build-prompt.md](./claude-build-prompt.md)
- [acceptance-checklist.md](./acceptance-checklist.md)
- [data/invitation-data.json](./data/invitation-data.json)
