# Editorial Wedding Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose the public wedding homepage into an editorial invitation layout without changing CMS data or RSVP behavior.

**Architecture:** Keep `WeddingHomeClient` as the page composition component and use existing Tailwind utilities plus a small set of semantic layout wrappers. Keep all content sourced from `CmsSnapshot`; only class names, hierarchy, and local presentation markup change.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS v4, Vitest, ESLint.

---

### Task 1: Establish the editorial page shell

**Files:**
- Modify: `app/components/WeddingHomeClient.tsx`
- Modify: `app/globals.css` only if a reusable editorial utility is genuinely needed
- Test: `app/components/__tests__/wedding-home-client.test.tsx`

- [ ] **Step 1: Add a regression assertion for the page landmarks**

Assert that the rendered page contains `main`, `header`, `footer`, and all existing section IDs: `home`, `event-info`, `schedule`, `gallery`, `location`, `dress-code`, `rsvp`, `faq`, and `contact`.

- [ ] **Step 2: Run the focused test and confirm the baseline**

Run: `npm test -- app/components/__tests__/wedding-home-client.test.tsx`

Expected: existing tests pass before the layout change.

- [ ] **Step 3: Update the page shell classes and header composition**

Use the current CMS navigation and language/RSPV actions, but reduce the header height and use a max-width editorial container. Keep all links and labels unchanged.

- [ ] **Step 4: Run the focused test**

Run: `npm test -- app/components/__tests__/wedding-home-client.test.tsx`

Expected: PASS.

### Task 2: Recompose hero, countdown, and event metadata

**Files:**
- Modify: `app/components/WeddingHomeClient.tsx`

- [ ] **Step 1: Make the hero a responsive split composition**

Keep the existing `Image`, CMS image alt/src, title, date, text, and two anchor targets. Use a dark copy panel beside a portrait image on large screens and stack them in a readable order on mobile.

- [ ] **Step 2: Convert event cards into a metadata rail**

Keep the four CMS cards and icons, but remove card shadows and use four bordered cells on desktop, two columns on tablet, and a two-column or stacked reading order on mobile.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- app/components/__tests__/wedding-home-client.test.tsx`

Expected: PASS and CMS copy remains visible.

### Task 3: Apply editorial layouts to schedule, gallery, location, and dress code

**Files:**
- Modify: `app/components/WeddingHomeClient.tsx`

- [ ] **Step 1: Restyle schedule as a sequence-led timeline**

Keep `scheduleItems`, `time`, title, detail, and dark section. Add visible sequence numbers and preserve the existing accessible `time` element.

- [ ] **Step 2: Preserve the asymmetric gallery and refine its hierarchy**

Retain the dominant image, supporting images, gallery link, captions, and `/gallery` destination while making the desktop grid more editorial and the mobile flow single-column.

- [ ] **Step 3: Make location map-first**

Keep the map iframe and both action links. Place the map as the stronger visual block on desktop, with location copy and transport guidance in a clean secondary composition.

- [ ] **Step 4: Make dress code palette-led**

Keep all keywords and CMS color values. Use the title/copy as the editorial lead and make the swatches the dominant visual block.

- [ ] **Step 5: Run all component tests**

Run: `npm test -- app/components/__tests__/wedding-home-client.test.tsx`

Expected: PASS.

### Task 4: Recompose RSVP, FAQ, contact, and footer

**Files:**
- Modify: `app/components/WeddingHomeClient.tsx`

- [ ] **Step 1: Wrap RSVP in an invitation panel**

Keep `RsvpForm`, relationship options, language prop, all CMS copy, and `id="rsvp"`. Use a navy panel with a warm form surface and mobile-first stacking.

- [ ] **Step 2: Convert FAQ cards into disclosure-style rows**

Use native `<details>`/`<summary>` rows so the section is compact and keyboard accessible while retaining all FAQ copy from the CMS snapshot.

- [ ] **Step 3: Keep contact actions and simplify the closing hierarchy**

Preserve LINE and phone links, labels, icons, and `id="contact"`; use an olive closing panel and quieter footer lockup.

- [ ] **Step 4: Run all tests**

Run: `npm test`

Expected: PASS with zero failures.

### Task 5: Verify responsive and production quality

**Files:**
- Modify: `app/components/WeddingHomeClient.tsx` only for fixes found during verification

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: exit code 0 and successful Next.js production build.

- [ ] **Step 3: Check the local page at desktop and mobile widths**

Run the existing local server with `npm run dev -- --port 3000`, then inspect `http://localhost:3000` at a desktop width and a narrow mobile width. Confirm no horizontal overflow, no clipped CTA/form controls, all anchors still land on their sections, and the bottom mobile navigation remains visible and usable.
