# Editorial Wedding Invitation Layout Design

## Goal

Recompose the wedding homepage into a cohesive editorial invitation layout while preserving all existing CMS-driven content, bilingual behavior, RSVP behavior, and responsive support.

## Design Direction

The page will use an editorial wedding-invitation composition: a split hero, a compact event metadata rail, a dark timeline, an asymmetric gallery, map-first location content, a palette-led dress-code section, a dark RSVP invitation panel, an FAQ accordion-like list, and a quieter contact/footer close.

## Layout Rules

- Keep the existing Oxford Navy, Tweed Brown, Deep Olive, Camel Beige, Ash Grey, and warm-white tokens.
- Keep the existing Tailwind-only implementation; do not add shadcn dependencies for this pass.
- Use semantic `header`, `nav`, `main`, `section`, `article`, `figure`, `time`, and `footer` elements.
- Use a 12-column editorial grid at large breakpoints and single-column reading order on small screens.
- Avoid animation for this pass; only retain existing hover/focus transitions.
- Preserve existing anchors used by navigation and mobile quick actions.
- Preserve CMS snapshot copy and language toggle behavior.

## Section Composition

1. Header: compact sticky navigation with an understated brand mark and RSVP action.
2. Hero: image-led split composition with copy, date, and two primary actions.
3. Countdown: retained as a centered bridge between hero and event metadata.
4. Event info: four metadata cells in one editorial rail rather than elevated cards.
5. Schedule: navy background, oversized sequence numbers, vertical timeline, and concise copy.
6. Gallery: asymmetric image composition with one dominant image and supporting tiles.
7. Location: map-first two-column composition followed by a compact transport note.
8. Dress code: large title/copy beside a five-swatch palette strip.
9. RSVP: navy invitation panel with pale form surface and clear deadline context.
10. FAQ: compact disclosure-style rows to reduce visual density.
11. Contact: olive closing panel with two contact actions.
12. Footer: minimal couple/date lockup.

## Acceptance Criteria

- Desktop layout visibly differs from the existing repeated full-width card rhythm.
- Mobile layout remains readable without horizontal overflow and keeps quick actions usable.
- Existing CMS-driven labels, links, images, forms, language toggle, and section anchors remain functional.
- Existing component tests pass, and lint/build complete successfully.
