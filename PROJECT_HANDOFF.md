# Project Handoff

Last updated: 2026-05-31

## Project

Responsive one-page wedding website for **Jah & Smart**.

Tech stack:

- Next.js App Router
- React
- Tailwind CSS
- Google Form RSVP integration

## Current Status

Implemented MVP sections:

1. Hero
2. Event Info
3. Schedule
4. Location
5. Dress Code
6. RSVP
7. Contact
8. Footer

The website supports English and Thai via a header language toggle.

## Naming

Current display name:

```text
Jah & Smart
```

Current monogram:

```text
J&S
```

## Typography

English version:

- Couple name: Great Vibes
- Headings / important info: Cinzel, uppercase, letter-spaced
- Body / small details / form: Montserrat

Thai version:

- Couple name remains Great Vibes in English
- Thai content: Prompt

## Color Palette

Use only these theme colors:

- Oxford Navy: `#0A1F44`
- Tweed Brown: `#7C5C3B`
- Deep Olive: `#3E4D3A`
- Camel Beige: `#D6C8A5`
- Ash Grey: `#BDBFBA`

Warm white may be used as a neutral page background, but it should not be shown as a theme swatch.

## RSVP

RSVP submits directly to Google Form:

```text
https://forms.gle/ECyvWYyYS2x8pGVP7
```

API route:

```text
app/api/rsvp/route.ts
```

Form UI:

```text
app/components/RsvpForm.tsx
```

Current RSVP fields:

- Full Name
- Nickname
- Email
- Phone
- Relationship
- Attendance
- Guest Count
- Message / Additional Notes

Guest Count starts at `1 guest`; no `0 guest` option.

After RSVP success, a popup appears with:

- Add to Google Calendar
- Download `.ics`

No email sending is currently used.

## Contact

LINE Official:

```text
@990yroaq
```

Phone:

```text
099-656-7965
```

## Key Files

- `app/page.tsx`: main one-page website and language toggle
- `app/components/RsvpForm.tsx`: RSVP form and calendar popup
- `app/api/rsvp/route.ts`: Google Form submission endpoint
- `app/layout.tsx`: metadata and Google fonts
- `app/globals.css`: global typography and palette helpers
- `public/images/wedding-hero.png`: generated hero image
- `google-form-rsvp-setup.md`: Google Form mapping notes
- `AGENTS.md`: project instructions
- `wedding-website-spec.md`: current product spec

## Commands

Run development server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

## Verification Already Done

The following passed after the latest changes:

```bash
npm run lint
npm run build
```

Browser checks were also run for mobile and desktop:

- no horizontal overflow
- language toggle works
- Thai version uses Prompt
- English headings use Cinzel
- couple name uses Great Vibes
- RSVP success popup shows Add to Calendar buttons

## Known Test Rows

Several test RSVP submissions were sent to Google Form during development. Examples include:

- `Codex Test User`
- `Codex Email Test User`
- `Codex Calendar UI Test`
- `Codex Modal Test`

These can be deleted from the Google Form response sheet if needed.

## Good Next Steps

1. Review visual layout on a real phone browser.
2. Replace placeholder venue/address details if needed.
3. Confirm final schedule times.
4. Confirm final Thai copy tone.
5. Add real domain / deployment settings when ready.
6. Add favicon and social preview image before sharing publicly.
