# Wedding Countdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a responsive bilingual countdown below the hero that reaches 00:00 Asia/Bangkok on 1 November 2026.

**Architecture:** Create a focused client component that owns the one-second timer and accepts the active language. Render it from the existing `WeddingHomeClient` immediately before Event Info. Use a fixed Bangkok target timestamp and clamp expired values to zero.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS.

---

### Task 1: Add countdown timer component

**Files:**
- Create: `app/components/WeddingCountdown.tsx`

- [ ] Create a client component with `language: "en" | "th"`, a `CountdownValues` type, a target timestamp of `2026-11-01T00:00:00+07:00`, and a one-second `setInterval` that is cleaned up on unmount.
- [ ] Calculate remaining days, hours, minutes, and seconds from `target - Date.now()`, clamping expired values to zero.
- [ ] Render bilingual eyebrow, title, unit labels, and completion message with an Oxford Navy section and Camel Beige numbers.
- [ ] Use a responsive grid: two columns on mobile and four columns from `sm` upward.

### Task 2: Integrate below hero

**Files:**
- Modify: `app/components/WeddingHomeClient.tsx`

- [ ] Import `WeddingCountdown`.
- [ ] Render it immediately after the hero section and before the `event-info` section, passing the current `language` state.

### Task 3: Verify

**Files:**
- No new files.

- [ ] Run `npm run lint` and confirm no lint errors.
- [ ] Run `npm run build` and confirm the app builds.
- [ ] Request `http://localhost:3000` and confirm HTTP 200.
- [ ] Confirm the server-rendered page includes the countdown section and the existing Supabase image URLs remain present.
