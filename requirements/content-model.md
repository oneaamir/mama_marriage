# Content Model

All editable invitation content must live in `requirements/data/invitation-data.json` first, then the app should copy or import the same structure into its runtime data folder.

## Why JSON

The family can change names, date, venue, phone, map links, or language text without touching animation code.

## Language Support

Support two languages:

```text
English: en
Hindi: hi
```

The website should include a small language toggle:

```text
EN | हिन्दी
```

Language toggle rules:

- Default to English.
- Hindi text should use `Noto Serif Devanagari` or similar.
- Keep date/time readable in both languages.
- Do not duplicate layout components. Only swap text from JSON.

## Data Sections

The JSON contains:

```text
meta
theme
couple
event
families
venue
actions
gallery
sections
translations
```

## Countdown Content

The countdown uses the event target:

```text
event.dateTimeISO
```

The visible labels come from:

```text
sections.countdown.labels.days
sections.countdown.labels.hours
sections.countdown.labels.minutes
sections.countdown.labels.seconds
```

The design style can come from:

```text
sections.countdown.variant
sections.countdown.motion
```

Recommended variant:

```text
royal-time-jewels
```

This means the countdown is not a standard timer. It should look like four small engraved ivory-and-gold pieces inside the expanded card.

## Missing Data Behavior

If a field is empty:

- Hide that optional UI part.
- Do not show placeholder text to guests.
- Keep layout balanced.

Examples:

- If `gallery.images` is empty, hide Gallery.
- If venue map URL is empty, hide Open Location.
- If phone is empty, hide Call.
