# Home Album Carousel and Ordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present published albums as a mobile-first home carousel and give administrators control of album display order.

**Architecture:** `WeddingHomeClient` renders albums as horizontally scrollable cards and advances only when motion is permitted. Admin sends the chosen album ID order to a small CMS server action, which persists `gallery_albums.sort_order`; every public query already reads this field.

**Tech Stack:** Next.js, React, Tailwind CSS, dnd-kit, Vitest.

---

### Task 1: Home album carousel

**Files:**
- Modify: `app/components/WeddingHomeClient.tsx`
- Modify: `app/components/__tests__/wedding-home-client.test.tsx`

- [ ] Add a failing test for one album card per CMS album and run the component test.
- [ ] Replace image collage with scroll-snap album cards, left/right controls, and reduced-motion-aware autoplay.
- [ ] Run the component test.

### Task 2: Album detail navigation

**Files:**
- Modify: `app/gallery/page.tsx`
- Modify: `app/gallery/__tests__/gallery-page.test.tsx`

- [ ] Add a failing assertion that the selected album back link occurs before the album heading.
- [ ] Move the back link directly below the header/breadcrumb, before the selected album title.
- [ ] Run the gallery page test.

### Task 3: Admin ordering

**Files:**
- Modify: `lib/cms/actions.ts`
- Modify: `lib/cms/__tests__/actions.test.ts`
- Modify: `app/admin/components/GalleryManager.tsx`
- Modify: `app/admin/__tests__/gallery-manager.test.tsx`

- [ ] Add failing tests for saving album sort order and the Admin arrange-albums controls.
- [ ] Implement `saveGalleryAlbumOrder`, a dedicated Admin arrange mode, and one-save persistence.
- [ ] Run the action and component tests, full tests, build, then restart port 3000.
