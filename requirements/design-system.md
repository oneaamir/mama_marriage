# Design System

## Visual Theme

Use the theme from the video frame:

```text
Royal ivory paper
Antique gold embossing
Warm champagne glow
Deep maroon wax seal
Soft brown text
Subtle silk background
```

## Color Palette

```json
{
  "ivory": "#F4E8D0",
  "pearl": "#FFF7E8",
  "champagne": "#D8B46A",
  "antiqueGold": "#B88A3B",
  "deepGold": "#8A6428",
  "deepBrown": "#3A2414",
  "maroonSeal": "#5A1F16",
  "softGlow": "#F8D98B",
  "shadowBrown": "rgba(58, 36, 20, 0.35)"
}
```

## Typography

Use elegant serif/calligraphy pairings:

```text
Names: Playfair Display, Cormorant Garamond, or Great Vibes
Body: Cormorant Garamond, Lora, or Noto Serif
Hindi: Noto Serif Devanagari
```

Rules:

- Names must be large but readable on mobile.
- Date/time should be clear immediately.
- Avoid thin low-contrast text.
- Keep letter spacing normal.

## Card Style

The hero card and revealed paper panels should have:

- Ivory paper texture.
- Thin antique gold border.
- Ornamental gold corners.
- Soft inner shadow.
- Soft outer shadow.
- Slight 3D thickness using pseudo-elements or layered shadows.
- Gold foil shine across border only, not across the full card.

Panel rules:

- Hero card is the visual cover.
- Later content uses large ivory paper panels, not one cramped long card.
- Panels should look like matching invitation inserts from the same envelope.
- Each panel can have slightly different height, but all should share the same gold border language.

## Alignment With Video Frame

The website hero must visually continue from the provided final video frame:

- Keep the main card vertically centered in the first website state.
- Match the ivory card, antique-gold border, warm golden glow, and brown text from the video.
- Do not introduce new dominant colors after the video ends.
- The website card should align over the same approximate card position from `final-frame.jpg`.
- On mobile, card width should be about `78vw` to `88vw`, with a max width near `430px`.
- Keep enough top/bottom breathing room so the card does not feel cropped.
- If overlaying real HTML text, align it to the center of the visible card, not the viewport.
- The card should remain the visual anchor during scroll; content grows from it.

## 3D Depth Rules

Use 3D effects only to make the invitation feel physically premium:

- Card tilt: max `3deg` to `5deg`.
- Perspective: around `900px` to `1200px`.
- Outer shadow should be warm brown, soft, and wide.
- Add a subtle gold back glow behind the card.
- Use a tiny paper-edge thickness effect on the card sides.
- Use inner shadows for inset panels and countdown tiles.
- Keep all 3D movement slow enough that text remains easy to read.

Avoid obvious spinning, flipping whole sections, or strong perspective distortion.

## Unique Countdown Style

The countdown should be designed as "royal time jewels":

- Four compact ivory tiles inside the expanded card.
- Each tile has an antique-gold bevel border.
- Each tile has a warm inner shadow, like pressed paper or enamel.
- Number text uses deep brown or gold-foil styling.
- A very subtle shine can pass across the tiles every few seconds.
- When a number changes, use a soft vertical roll, tiny flip, or fade-up.
- Never use neon, LED, or digital clock styling.

Layout:

- Mobile: `2 x 2` grid.
- Wider screens: `4 x 1` row.
- Keep tile sizes stable so changing numbers do not shift layout.
- Keep labels short and driven by JSON language data.

## Background

Use final-frame image for the hero transition. After scroll starts, background may become:

- blurred final-frame image,
- subtle silk texture,
- warm radial gold glow.

Silk movement must be very slow and almost invisible. It should feel like fabric, not water.

## Buttons

Primary buttons should feel like wedding invitation seals:

```text
Deep maroon background
Antique gold border
Soft gold glow on hover/tap
Slight press animation
```

Secondary buttons:

```text
Ivory background
Thin gold border
Deep brown text
```

## Avoid

- Neon colors.
- Bright yellow flat gold.
- Too many particles.
- Bubbles.
- Water/liquid effects.
- Fast rotations.
- Cartoon petals.
- Heavy gradients that fight the video.
