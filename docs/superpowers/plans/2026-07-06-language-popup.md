# Language Popup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a first-visit Thai/English language selection popup that persists the guest's choice locally.

**Architecture:** Keep language state in `app/page.tsx`, initialize it from `localStorage` after hydration, and render a focused `LanguageGate` component above the existing page. The gate is a responsive overlay: bottom sheet on mobile and constrained invitation panel on desktop.

**Tech Stack:** Next.js App Router, React client components, Tailwind CSS, browser `localStorage`, Playwright for visual behavior checks.

---

## File Structure

- Modify `app/page.tsx`: add language gate copy, persistence state/effects, selection handler, and the `LanguageGate` component.
- No new runtime dependency is required.
- No API changes are required.

## Task 1: Add Language Persistence State

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import `useEffect`**

Change the React import at the top of `app/page.tsx` to:

```tsx
import { useEffect, useState } from "react";
```

- [ ] **Step 2: Add storage key and gate copy**

After `type Language = "en" | "th";`, add:

```tsx
const LANGUAGE_STORAGE_KEY = "jah-smart-wedding-language";
```

Add `languageGate` content under both `copy.en` and `copy.th`:

```tsx
languageGate: {
  eyebrow: "Wedding Invitation",
  title: "Jajah & Smart",
  prompt: "Please select your preferred language",
  thai: "ภาษาไทย",
  english: "English",
},
```

```tsx
languageGate: {
  eyebrow: "Wedding Invitation",
  title: "Jajah & Smart",
  prompt: "กรุณาเลือกภาษาที่ต้องการ",
  thai: "ภาษาไทย",
  english: "English",
},
```

- [ ] **Step 3: Add initialized gate state**

Inside `Home`, after the existing language state line, add:

```tsx
const [showLanguageGate, setShowLanguageGate] = useState(false);
```

- [ ] **Step 4: Read persisted language after hydration**

Inside `Home`, before `return`, add:

```tsx
useEffect(() => {
  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage === "en" || storedLanguage === "th") {
      setLanguage(storedLanguage);
      setShowLanguageGate(false);
      return;
    }
  } catch {
    // If storage is blocked, guests can still choose for the current session.
  }

  setShowLanguageGate(true);
}, []);
```

- [ ] **Step 5: Add selected-language handler**

Inside `Home`, before `return`, add:

```tsx
const handleLanguageSelect = (selectedLanguage: Language) => {
  setLanguage(selectedLanguage);
  setShowLanguageGate(false);

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
  } catch {
    // The visible language still updates even if persistence is unavailable.
  }
};
```

## Task 2: Add the Responsive Language Gate

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add the component**

Place this component below `SectionHeader` and above `Home`:

```tsx
function LanguageGate({
  copy: gateCopy,
  onSelect,
}: {
  copy: {
    eyebrow: string;
    title: string;
    prompt: string;
    thai: string;
    english: string;
  };
  onSelect: (language: Language) => void;
}) {
  return (
    <div
      aria-labelledby="language-gate-title"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-end justify-center overflow-hidden bg-[#0A1F44]/35 px-4 pb-4 pt-24 backdrop-blur-[2px] sm:px-6 md:items-center md:pb-8"
      role="dialog"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover"
        fill
        priority
        sizes="100vw"
        src="/images/wedding-hero.png"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/88 via-[#0A1F44]/45 to-[#0A1F44]/25" />
      <div className="relative w-full max-w-xl rounded-t border border-[#D6C8A5]/35 bg-[#FBF8F0]/96 p-5 text-[#0A1F44] shadow-[0_26px_80px_rgba(10,31,68,0.34)] backdrop-blur md:rounded md:p-8">
        <p className="mb-3 text-center text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#7C5C3B]">
          {gateCopy.eyebrow}
        </p>
        <h2
          className="script-display text-center text-5xl font-medium leading-none text-[#0A1F44] md:text-6xl"
          id="language-gate-title"
        >
          {gateCopy.title}
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-[#0A1F44]/68 md:text-base">
          {gateCopy.prompt}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            className="min-h-14 rounded border border-[#0A1F44]/15 bg-[#0A1F44] px-4 text-base font-semibold text-[#FBF8F0] transition hover:bg-[#132d5d] focus:outline-none focus:ring-2 focus:ring-[#7C5C3B] focus:ring-offset-2 focus:ring-offset-[#FBF8F0]"
            onClick={() => onSelect("th")}
            type="button"
          >
            <span aria-hidden="true" className="mr-2">
              🇹🇭
            </span>
            {gateCopy.thai}
          </button>
          <button
            className="min-h-14 rounded border border-[#0A1F44]/20 bg-white/70 px-4 text-base font-semibold text-[#0A1F44] transition hover:border-[#7C5C3B] hover:bg-[#D6C8A5]/35 focus:outline-none focus:ring-2 focus:ring-[#7C5C3B] focus:ring-offset-2 focus:ring-offset-[#FBF8F0]"
            onClick={() => onSelect("en")}
            type="button"
          >
            <span aria-hidden="true" className="mr-2">
              🇬🇧
            </span>
            {gateCopy.english}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Render the gate**

Inside the `main` element, before `<header`, add:

```tsx
{showLanguageGate ? (
  <LanguageGate copy={t.languageGate} onSelect={handleLanguageSelect} />
) : null}
```

- [ ] **Step 3: Persist manual language toggle**

Replace the language toggle `onClick` with:

```tsx
onClick={() => handleLanguageSelect(isThai ? "en" : "th")}
```

## Task 3: Verify

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: command exits successfully with no ESLint errors.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: command exits successfully.

- [ ] **Step 3: Start dev server**

Run: `npm run dev`

Expected: Next.js starts and prints a localhost URL.

- [ ] **Step 4: Browser behavior check**

Use Playwright against the dev URL:

```ts
await page.goto("http://localhost:3000");
await page.evaluate(() => localStorage.removeItem("jah-smart-wedding-language"));
await page.reload();
await page.getByRole("dialog", { name: "Jajah & Smart" }).isVisible();
await page.getByRole("button", { name: /ภาษาไทย/ }).click();
await page.getByText("ข้อมูลสำคัญ").isVisible();
await page.reload();
await page.getByRole("dialog", { name: "Jajah & Smart" }).isHidden();
```

Expected: first visit shows the gate, Thai selection changes copy, refresh skips the gate.
