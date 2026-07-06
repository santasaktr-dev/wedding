# Language Popup Design

## Context

The wedding website already supports English and Thai copy through client-side React state in `app/page.tsx`. The new feature adds an entry language prompt before guests interact with the page.

## Selected Direction

Use a responsive invitation panel inspired by the bottom-sheet mockup:

- Mobile: a polished bottom sheet over the hero image.
- Desktop: a wider bottom invitation panel positioned over the hero image, constrained in width so it feels intentional rather than stretched.
- Both sizes show the couple name, a short language prompt, and two large language choices with flag icons.

This keeps the first impression visual and simple while matching the Modern Old Money design direction.

## Behavior

- On first visit, show the language selector before the guest can interact with the page.
- Choosing Thai sets the site language to Thai.
- Choosing English sets the site language to English.
- Persist the choice in `localStorage` so returning guests skip the popup.
- Keep the existing language toggle available after entry.
- If `localStorage` is unavailable, the popup still works for the current session, but the choice may not persist.

## Components

- Add a reusable `LanguageGate` client component or a focused section within the existing client page if that better matches the current file structure.
- The component receives the current hero image context visually through overlay styling, but it should not duplicate page content logic.
- The component exposes one action: selecting a `Language` value.

## Visual Requirements

- Use the existing palette: Oxford Navy, Tweed Brown, Camel Beige, Ash Grey, and warm white.
- Use Thai and English flag icons in the language buttons.
- Maintain elegant spacing, subtle border treatment, and readable button targets on mobile.
- The prompt should feel like part of the invitation, not a generic app dialog.

## Accessibility

- Use a semantic dialog-like overlay with clear heading text.
- Language buttons must be real buttons.
- Buttons must have visible focus states.
- Avoid trapping users in a broken state if storage or hydration timing fails.

## Testing

- Verify first visit shows the popup on mobile and desktop.
- Verify selecting each language updates visible page copy.
- Verify refresh keeps the selected language and does not show the popup again.
- Verify the existing language toggle still works after the popup is dismissed.
- Run lint/build checks if available, then start `npm run dev`.
