# Confirmed wedding timeline

## Goal

Replace the provisional wedding schedule with the couple's confirmed five-part timeline in English and Thai.

## Design

- Keep the existing Schedule component and mobile-first visual layout unchanged.
- Replace the default CMS schedule data with five ordered items: guest registration, wedding ceremony, dinner reception, toast and celebration, and end of celebration.
- Store each title and detail in both English and Thai; retain the supplied time format exactly.
- Update the introductory text to indicate that this is the confirmed event timeline.

## Verification

- Add a focused test asserting the five ordered time values and the final bilingual event text in the fallback CMS content.
- Run the focused test, the full test suite, and the production build.
