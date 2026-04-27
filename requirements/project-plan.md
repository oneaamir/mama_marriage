# Project Plan

## Goal

Build a premium mobile-first wedding invitation website that begins with a cinematic envelope-opening video and then transforms into an interactive invitation card.

The website should not look like a normal landing page. It should feel like the guest is scrolling through a living royal wedding card. On mobile, do not trap all content inside one tiny card. Use the hero card as the invitation cover, then reveal large readable paper panels that feel like they are emerging from the card.

## User Flow

```text
1. Guest opens QR/link.
2. Intro video starts automatically.
3. Video shows royal envelope opening.
4. Final frame shows invitation card with names.
5. Video fades out.
6. Matching final-frame image remains as website background.
7. Website hero card stays in the same visual position.
8. Date and time are shown clearly.
9. User scrolls.
10. Hero card lifts and expands slightly.
11. Large ivory/gold paper panels emerge from behind/inside the card.
12. Invitation message, countdown, event details, location, and RSVP appear as readable panels.
13. Countdown, venue, map, calendar, and RSVP appear.
14. Website ends with final blessing.
```

## Website Sections

### 1. Intro Video

- Full-screen vertical video.
- Use the Cloudinary video URL from `theme.assets.introVideo`.
- Autoplay, muted, playsinline.
- Object-fit cover.
- No redirect.
- No heavy overlay.
- Optional small skip button.

### 2. Hero Invitation Card

Content:

```text
Tausif & Talat
Aaghaz-e-Safar
9th May 2026
6:30 PM
```

The first visible website frame should match the final video frame. Use the Cloudinary final-frame image URL from `theme.assets.finalFrame` as the transition image/background. If text in the video is imperfect, overlay clean HTML text on top of the final-frame image.

### 3. Cover Card To Paper Panels

The first card expands/lifts as the user scrolls, but the rest of the website should become large readable paper panels. This keeps the experience premium without making phone text too small.

```text
scroll down
-> hero card moves slightly upward
-> card tilts back very subtly
-> shadow becomes deeper
-> first paper panel slides from behind the card
-> following panels reveal one by one
```

This is the main premium interaction:

```text
the invitation cover opens
-> invitation pages come out
-> each page stays large and readable on mobile
```

### 4. Invitation Message

Short emotional message from families.

### 5. Countdown

Countdown to:

```text
2026-05-09T18:30:00+05:30
```

Do not make this a normal digital timer. Make it a premium "royal time jewels" section that appears on its own readable ivory paper panel.

Show four small engraved time pieces:

```text
Days
Hours
Minutes
Seconds
```

Visual behavior:

```text
countdown sits inside a large paper panel
each number appears inside a small ivory-gold jewel tile
tiles have soft 3D bevel, inner shadow, and thin antique-gold border
numbers flip or rise gently when changing
labels stay calm and readable
no bright digital clock style
```

The countdown should look like gold-engraved time pieces placed on the invitation card, not like an app widget.

### 6. Event Details

Wedding ceremony details with date, time, venue name, and address. Data must come from JSON.

### 7. Location Actions

Buttons:

```text
Open Location
Add to Calendar
Call
WhatsApp RSVP
```

Use maroon/gold wax-seal styling for primary actions.

### 8. Gallery

Optional. If no images are present in JSON, hide this section.

### 9. RSVP / Wishes

Use WhatsApp link as practical RSVP. Also support "Send Wishes".

### 10. Final Blessing

End with a warm closing message and the couple names again.

## Build Principles

- Mobile-first. Most guests will open by phone.
- One-page experience, but use multiple large paper panels for readability.
- Keep animations slow, smooth, and controlled.
- Use premium shadows and depth before adding decorative effects.
- Keep content readable.
- Keep colors consistent with the video.
- All text should be driven by JSON and support English/Hindi switching.
