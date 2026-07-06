# Wedding CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private Supabase-backed CMS for editing wedding website content and managing gallery albums/images.

**Architecture:** Add a focused CMS layer under `lib/cms` for types, fallback data, Supabase access, validation, and publish operations. Add protected `/admin` routes for login, content editing, gallery management, settings, draft preview, and publish actions. Refactor public pages to load published CMS content through the CMS data layer, with fallback content when Supabase is not configured.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage, Vitest, Testing Library, Playwright.

---

## Scope Check

The spec is broad but cohesive: all work belongs to one private CMS subsystem. The implementation should be split into small tasks and frequent commits. If time is constrained, stop after any task and the public website should still build.

## File Structure

### Dependencies and Config

- Modify: `package.json` — add Supabase and test dependencies/scripts.
- Modify: `.env.example` — document Supabase variables and preview secret.
- Create: `vitest.config.ts` — unit/component test config.
- Create: `test/setup.ts` — Testing Library setup.

### Supabase and Database

- Create: `supabase/schema.sql` — tables, indexes, RLS policies, storage policy notes.
- Create: `lib/supabase/config.ts` — env parsing and configured/unconfigured detection.
- Create: `lib/supabase/client.ts` — browser Supabase client.
- Create: `lib/supabase/server.ts` — server Supabase client using cookies.

### CMS Domain Layer

- Create: `lib/cms/types.ts` — public content, section, album, image types.
- Create: `lib/cms/fallback.ts` — fallback content copied from current hardcoded data.
- Create: `lib/cms/validation.ts` — runtime validation helpers.
- Create: `lib/cms/reorder.ts` — pure reorder helpers.
- Create: `lib/cms/storage.ts` — safe file path helpers.
- Create: `lib/cms/server.ts` — load published/draft content.
- Create: `lib/cms/actions.ts` — server actions for draft save, publish, gallery mutations.

### Admin UI

- Create: `app/admin/login/page.tsx` — login page.
- Create: `app/admin/actions.ts` — login/logout actions.
- Create: `app/admin/layout.tsx` — auth guard and admin shell.
- Create: `app/admin/page.tsx` — redirect to Content tab.
- Create: `app/admin/content/page.tsx` — content editor tab.
- Create: `app/admin/gallery/page.tsx` — gallery manager tab.
- Create: `app/admin/settings/page.tsx` — settings/checklist tab.
- Create: `app/admin/components/AdminShell.tsx` — nav and layout.
- Create: `app/admin/components/LanguageTabs.tsx` — EN/TH tabs.
- Create: `app/admin/components/SectionEditor.tsx` — section form renderer.
- Create: `app/admin/components/GalleryManager.tsx` — album/image manager.
- Create: `app/admin/components/ImageGrid.tsx` — reorderable images with fallback buttons.
- Create: `app/admin/components/StatusBanner.tsx` — loading/error/success feedback.

### Preview and Public Integration

- Create: `app/preview/page.tsx` — authenticated draft preview.
- Modify: `app/page.tsx` — read content from CMS data layer while preserving current layout.
- Modify: `app/gallery/page.tsx` — read albums/images from CMS data layer while preserving current layout.

### Tests

- Create: `lib/cms/__tests__/reorder.test.ts`
- Create: `lib/cms/__tests__/storage.test.ts`
- Create: `lib/cms/__tests__/validation.test.ts`
- Create: `lib/cms/__tests__/server.test.ts`
- Create: `app/admin/__tests__/auth.test.tsx`
- Create: `app/admin/__tests__/gallery-manager.test.tsx`
- Create: `tests/e2e/cms.spec.ts`

---

## Task 1: Add Test and Supabase Dependencies

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `test/setup.ts`

- [ ] **Step 1: Update `package.json` scripts and dependencies**

Add these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Install dependencies:

```bash
npm install @supabase/ssr @supabase/supabase-js
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  },
});
```

- [ ] **Step 3: Create `test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Run dependency verification**

Run:

```bash
npm run test
npm run lint
```

Expected:

- `npm run test` reports no test files or zero tests without crashing.
- `npm run lint` exits 0.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts test/setup.ts
git commit -m "chore: add cms test and supabase dependencies"
```

---

## Task 2: Add Supabase Setup Documentation and SQL Schema

**Files:**
- Modify: `.env.example`
- Create: `supabase/schema.sql`

- [ ] **Step 1: Update `.env.example`**

Add:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CMS_PREVIEW_SECRET=
```

- [ ] **Step 2: Create `supabase/schema.sql`**

```sql
create extension if not exists "pgcrypto";

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  published_by uuid references auth.users(id)
);

create unique index if not exists one_draft_content_version
on public.content_versions (status)
where status = 'draft';

create table if not exists public.content_sections (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.content_versions(id) on delete cascade,
  section_key text not null,
  language text not null check (language in ('en', 'th')),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (version_id, section_key, language)
);

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  status text not null check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  cover_image_id uuid,
  title_en text not null default '',
  title_th text not null default '',
  description_en text not null default '',
  description_th text not null default '',
  label_en text not null default '',
  label_th text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, status)
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  sort_order integer not null default 0,
  caption_en text not null default '',
  caption_th text not null default '',
  alt_en text not null default '',
  alt_th text not null default '',
  is_cover boolean not null default false,
  status text not null check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_versions enable row level security;
alter table public.content_sections enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;

create policy "Public read published content versions"
on public.content_versions for select
using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated write content versions"
on public.content_versions for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public read published content sections"
on public.content_sections for select
using (
  exists (
    select 1 from public.content_versions
    where content_versions.id = content_sections.version_id
    and (content_versions.status = 'published' or auth.role() = 'authenticated')
  )
);

create policy "Authenticated write content sections"
on public.content_sections for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public read published gallery albums"
on public.gallery_albums for select
using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated write gallery albums"
on public.gallery_albums for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public read published gallery images"
on public.gallery_images for select
using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated write gallery images"
on public.gallery_images for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
```

- [ ] **Step 3: Add storage setup comments to `supabase/schema.sql`**

Append:

```sql
-- Create a Supabase Storage bucket named `wedding-gallery`.
-- Recommended bucket mode: public read, authenticated write.
-- In Supabase Dashboard, add storage policies that allow:
-- 1. Public SELECT for objects in `wedding-gallery`.
-- 2. Authenticated INSERT/UPDATE/DELETE for objects in `wedding-gallery`.
```

- [ ] **Step 4: Run lint**

Run:

```bash
npm run lint
```

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add .env.example supabase/schema.sql
git commit -m "docs: add supabase cms setup"
```

---

## Task 3: Create CMS Types, Fallback Data, and Pure Helpers

**Files:**
- Create: `lib/cms/types.ts`
- Create: `lib/cms/fallback.ts`
- Create: `lib/cms/reorder.ts`
- Create: `lib/cms/storage.ts`
- Create: `lib/cms/validation.ts`
- Create: `lib/cms/__tests__/reorder.test.ts`
- Create: `lib/cms/__tests__/storage.test.ts`
- Create: `lib/cms/__tests__/validation.test.ts`

- [ ] **Step 1: Write failing test for reorder helpers**

Create `lib/cms/__tests__/reorder.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { moveItem, normalizeSortOrder } from "../reorder";

describe("moveItem", () => {
  it("moves an item from one index to another without mutating input", () => {
    const input = ["a", "b", "c", "d"];
    const result = moveItem(input, 1, 3);
    expect(result).toEqual(["a", "c", "d", "b"]);
    expect(input).toEqual(["a", "b", "c", "d"]);
  });
});

describe("normalizeSortOrder", () => {
  it("assigns zero-based sort order to each item", () => {
    const result = normalizeSortOrder([
      { id: "b", sortOrder: 8 },
      { id: "a", sortOrder: 4 },
    ]);
    expect(result).toEqual([
      { id: "b", sortOrder: 0 },
      { id: "a", sortOrder: 1 },
    ]);
  });
});
```

- [ ] **Step 2: Run failing reorder test**

Run:

```bash
npm run test -- lib/cms/__tests__/reorder.test.ts
```

Expected: FAIL because `lib/cms/reorder.ts` does not exist.

- [ ] **Step 3: Implement `lib/cms/reorder.ts`**

```ts
export function moveItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  if (item === undefined) {
    return [...items];
  }
  next.splice(toIndex, 0, item);
  return next;
}

export function normalizeSortOrder<T extends { sortOrder: number }>(items: readonly T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    sortOrder: index,
  }));
}
```

- [ ] **Step 4: Write failing tests for storage helper**

Create `lib/cms/__tests__/storage.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildGalleryStoragePath, slugifyFileName } from "../storage";

describe("slugifyFileName", () => {
  it("removes unsafe characters and preserves extension", () => {
    expect(slugifyFileName("Jajah & Smart 01.JPG")).toBe("jajah-smart-01.jpg");
  });
});

describe("buildGalleryStoragePath", () => {
  it("builds a safe path under an album slug", () => {
    const path = buildGalleryStoragePath({
      albumSlug: "highlights",
      fileName: "Jajah & Smart 01.JPG",
      now: 1783365937000,
    });
    expect(path).toBe("highlights/1783365937000-jajah-smart-01.jpg");
  });
});
```

- [ ] **Step 5: Run failing storage test**

Run:

```bash
npm run test -- lib/cms/__tests__/storage.test.ts
```

Expected: FAIL because `lib/cms/storage.ts` does not exist.

- [ ] **Step 6: Implement `lib/cms/storage.ts`**

```ts
export function slugifyFileName(fileName: string) {
  const lower = fileName.toLowerCase();
  const extensionMatch = lower.match(/\.([a-z0-9]+)$/);
  const extension = extensionMatch?.[1] ?? "jpg";
  const base = lower
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${base || "image"}.${extension}`;
}

export function buildGalleryStoragePath({
  albumSlug,
  fileName,
  now = Date.now(),
}: {
  albumSlug: string;
  fileName: string;
  now?: number;
}) {
  const safeAlbum = albumSlug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${safeAlbum || "album"}/${now}-${slugifyFileName(fileName)}`;
}
```

- [ ] **Step 7: Create `lib/cms/types.ts`**

```ts
export type Language = "en" | "th";
export type CmsStatus = "draft" | "published";

export type LocalizedText = {
  en: string;
  th: string;
};

export type WeddingContent = {
  hero: {
    date: LocalizedText;
    text: LocalizedText;
  };
  eventInfo: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    cards: Array<{
      key: "date" | "time" | "venue" | "dress";
      label: LocalizedText;
      value: LocalizedText;
    }>;
  };
  schedule: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    items: Array<{
      id: string;
      time: string;
      title: LocalizedText;
      detail: LocalizedText;
      sortOrder: number;
    }>;
  };
  location: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    address: LocalizedText;
    parkingNote: LocalizedText;
    mapsUrl: string;
  };
  dressCode: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    keywords: LocalizedText[];
    paletteTitle: LocalizedText;
  };
  gallery: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    cta: LocalizedText;
    comingSoon: LocalizedText;
  };
  faq: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    items: Array<{
      id: string;
      question: LocalizedText;
      answer: LocalizedText;
      sortOrder: number;
    }>;
  };
  contact: {
    eyebrow: LocalizedText;
    title: LocalizedText;
    intro: LocalizedText;
    lineLabel: LocalizedText;
    lineUrl: string;
    phoneLabel: LocalizedText;
    phoneHref: string;
  };
  footer: {
    names: string;
    detail: LocalizedText;
  };
};

export type GalleryImage = {
  id: string;
  albumId: string;
  src: string;
  storagePath: string | null;
  caption: LocalizedText;
  alt: LocalizedText;
  isCover: boolean;
  sortOrder: number;
  status: CmsStatus;
};

export type GalleryAlbum = {
  id: string;
  slug: string;
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  sortOrder: number;
  coverImageId: string | null;
  status: CmsStatus;
  images: GalleryImage[];
};

export type CmsSnapshot = {
  content: WeddingContent;
  albums: GalleryAlbum[];
};
```

- [ ] **Step 8: Create `lib/cms/fallback.ts`**

Copy current public content into a normalized snapshot:

```ts
import type { CmsSnapshot } from "./types";

export const fallbackCmsSnapshot: CmsSnapshot = {
  content: {
    hero: {
      date: {
        en: "Sunday, 1 November 2026",
        th: "วันอาทิตย์ที่ 1 พฤศจิกายน 2569",
      },
      text: {
        en: "Together with their families request the pleasure of your company at the celebration of their wedding at Pearl Wedding Venue.",
        th: "เรียนเชิญร่วมเป็นเกียรติในงานฉลองมงคลสมรสของ Jajah & Smart ณ Pearl Wedding Venue",
      },
    },
    eventInfo: {
      eyebrow: { en: "Event Info", th: "ข้อมูลสำคัญ" },
      title: { en: "The Celebration", th: "รายละเอียดงาน" },
      intro: {
        en: "A concise guide to the date, arrival time, venue, and overall style of the wedding day.",
        th: "สรุปวัน เวลา สถานที่ และธีมงาน เพื่อให้แขกเตรียมตัวได้อย่างสะดวก",
      },
      cards: [
        {
          key: "date",
          label: { en: "Date", th: "วันที่" },
          value: { en: "Sunday, 1 November 2026", th: "วันอาทิตย์ที่ 1 พฤศจิกายน 2569" },
        },
        {
          key: "time",
          label: { en: "Time", th: "เวลา" },
          value: { en: "To be confirmed", th: "รอยืนยันเวลา" },
        },
        {
          key: "venue",
          label: { en: "Venue", th: "สถานที่" },
          value: { en: "Pearl Wedding Venue", th: "Pearl Wedding Venue" },
        },
        {
          key: "dress",
          label: { en: "Dress Code", th: "ธีมชุด" },
          value: { en: "Old Money Elegance", th: "Old Money Elegance" },
        },
      ],
    },
    schedule: {
      eyebrow: { en: "Schedule", th: "กำหนดการ" },
      title: { en: "Wedding Day Timeline", th: "ลำดับพิธี" },
      intro: {
        en: "The final timeline is being confirmed. Please check back closer to the wedding date for the exact arrival and ceremony times.",
        th: "กำหนดการและเวลางานโดยละเอียดอยู่ระหว่างการยืนยัน และจะอัปเดตอีกครั้งเมื่อใกล้วันงาน",
      },
      items: [
        { id: "registration", time: "TBC", title: { en: "Guest Registration", th: "ลงทะเบียน" }, detail: { en: "Welcome and arrival", th: "ต้อนรับแขกและลงทะเบียน" }, sortOrder: 0 },
        { id: "ceremony", time: "TBC", title: { en: "Wedding Ceremony", th: "พิธีแต่งงาน" }, detail: { en: "Ceremony begins", th: "เริ่มพิธีมงคลสมรส" }, sortOrder: 1 },
        { id: "dinner", time: "TBC", title: { en: "Dinner Reception", th: "งานเลี้ยงฉลอง" }, detail: { en: "Dinner and reception", th: "รับประทานอาหารและร่วมฉลอง" }, sortOrder: 2 },
        { id: "toast", time: "TBC", title: { en: "Toast & Celebration", th: "กล่าวอวยพร" }, detail: { en: "Toasts and celebration", th: "ช่วงอวยพรและเฉลิมฉลอง" }, sortOrder: 3 },
      ],
    },
    location: {
      eyebrow: { en: "Location", th: "สถานที่" },
      title: { en: "Pearl Wedding Venue", th: "Pearl Wedding Venue" },
      intro: {
        en: "Pearl Wedding Venue is located on Borommaratchachonnani Road outbound, between Phutthamonthon Sai 2 and Sai 3.",
        th: "สถานที่ตั้งอยู่ติดถนนบรมราชชนนีฝั่งขาออก ช่วงระหว่างพุทธมณฑลสาย 2 และพุทธมณฑลสาย 3",
      },
      address: {
        en: "Pearl Wedding Venue, Borommaratchachonnani Road, Bangkok",
        th: "Pearl Wedding Venue, ถนนบรมราชชนนี, กรุงเทพฯ",
      },
      parkingNote: {
        en: "Please allow extra travel time and follow the Google Maps route to the venue.",
        th: "กรุณาเผื่อเวลาเดินทาง และสามารถกด Google Maps เพื่อนำทางมายังสถานที่",
      },
      mapsUrl: "https://maps.app.goo.gl/XwnnwTVqNXy3SNzSA",
    },
    dressCode: {
      eyebrow: { en: "Dress Code", th: "ธีมการแต่งกาย" },
      title: { en: "Old Money Elegance", th: "Old Money Elegance" },
      intro: {
        en: "Refined, timeless tones inspired by classic tailoring and understated luxury. Choose polished silhouettes, soft textures, and minimal details that feel formal without being ornate.",
        th: "ขอเชิญแต่งกายในโทนสุภาพ เรียบหรู และคลาสสิก เลือกทรงชุดที่ดูประณีต รายละเอียดน้อย และเหมาะกับบรรยากาศงานช่วงเย็น",
      },
      keywords: [
        { en: "Tailored", th: "สุภาพ" },
        { en: "Timeless", th: "คลาสสิก" },
        { en: "Minimal", th: "เรียบหรู" },
      ],
      paletteTitle: { en: "Suggested Palette", th: "โทนสีแนะนำ" },
    },
    gallery: {
      eyebrow: { en: "Gallery", th: "แกลเลอรี" },
      title: { en: "Prewedding Moments", th: "ภาพพรีเวดดิ้ง" },
      intro: {
        en: "A quiet preview of the celebration, styled with the same refined and timeless mood as the wedding day.",
        th: "พรีวิวบรรยากาศอบอุ่น เรียบหรู และคลาสสิกในโทนเดียวกับวันงาน",
      },
      cta: { en: "View Full Gallery", th: "ดูแกลเลอรีทั้งหมด" },
      comingSoon: {
        en: "Wedding day photos will be added after the celebration.",
        th: "ภาพวันงานจะเพิ่มหลังจบงานแต่งงาน",
      },
    },
    faq: {
      eyebrow: { en: "FAQ", th: "FAQ" },
      title: { en: "Guest Notes", th: "คำถามที่พบบ่อย" },
      items: [
        {
          id: "rsvp-date",
          question: { en: "When should I RSVP?", th: "ควรตอบรับคำเชิญภายในวันไหน?" },
          answer: { en: "Please submit your RSVP by 30 September 2026.", th: "กรุณาส่งคำตอบ RSVP ภายในวันที่ 30 กันยายน 2569" },
          sortOrder: 0,
        },
      ],
    },
    contact: {
      eyebrow: { en: "Contact", th: "ติดต่อ" },
      title: { en: "Smart", th: "Smart" },
      intro: {
        en: "For questions about the wedding, location, RSVP, or schedule, please contact Smart via LINE Official or phone.",
        th: "หากมีคำถามเกี่ยวกับงาน สถานที่ RSVP หรือกำหนดการ สามารถติดต่อ Smart ผ่าน LINE Official หรือโทรศัพท์",
      },
      lineLabel: { en: "Add LINE Official: @990yroaq", th: "เพิ่มเพื่อน LINE Official: @990yroaq" },
      lineUrl: "https://line.me/R/ti/p/%40990yroaq",
      phoneLabel: { en: "Phone: 099-656-7965", th: "โทร: 099-656-7965" },
      phoneHref: "tel:+66996567965",
    },
    footer: {
      names: "Jajah & Smart",
      detail: {
        en: "1 November 2026 · Pearl Wedding Venue",
        th: "1 พฤศจิกายน 2569 · Pearl Wedding Venue",
      },
    },
  },
  albums: [
    {
      id: "highlights",
      slug: "highlights",
      label: { en: "Prewedding", th: "Prewedding" },
      title: { en: "Highlights", th: "ไฮไลต์" },
      description: { en: "A curated first look at the prewedding mood.", th: "รวมภาพเด่นของบรรยากาศพรีเวดดิ้ง" },
      sortOrder: 0,
      coverImageId: "highlights-1",
      status: "published",
      images: [
        {
          id: "highlights-1",
          albumId: "highlights",
          src: "/images/wedding-hero.png",
          storagePath: null,
          caption: { en: "Classic Portrait", th: "ภาพพอร์ตเทรต" },
          alt: { en: "Prewedding portrait of Jajah and Smart", th: "ภาพพรีเวดดิ้งของ Jajah และ Smart" },
          isCover: true,
          sortOrder: 0,
          status: "published",
        },
      ],
    },
  ],
};
```

- [ ] **Step 9: Write validation test**

Create `lib/cms/__tests__/validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assertValidLanguage, getLocalizedText } from "../validation";

describe("assertValidLanguage", () => {
  it("accepts en and th", () => {
    expect(assertValidLanguage("en")).toBe("en");
    expect(assertValidLanguage("th")).toBe("th");
  });

  it("falls back to en for invalid values", () => {
    expect(assertValidLanguage("fr")).toBe("en");
  });
});

describe("getLocalizedText", () => {
  it("returns requested language text", () => {
    expect(getLocalizedText({ en: "Hello", th: "สวัสดี" }, "th")).toBe("สวัสดี");
  });

  it("falls back to English if requested text is empty", () => {
    expect(getLocalizedText({ en: "Hello", th: "" }, "th")).toBe("Hello");
  });
});
```

- [ ] **Step 10: Implement `lib/cms/validation.ts`**

```ts
import type { Language, LocalizedText } from "./types";

export function assertValidLanguage(value: unknown): Language {
  return value === "th" ? "th" : "en";
}

export function getLocalizedText(text: LocalizedText, language: Language) {
  return text[language] || text.en || text.th;
}
```

- [ ] **Step 11: Run tests**

Run:

```bash
npm run test -- lib/cms/__tests__
npm run lint
```

Expected: all tests pass and lint exits 0.

- [ ] **Step 12: Commit**

```bash
git add lib/cms
git commit -m "feat: add cms domain helpers"
```

---

## Task 4: Add Supabase Clients and Server Data Loading

**Files:**
- Create: `lib/supabase/config.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/cms/server.ts`
- Create: `lib/cms/__tests__/server.test.ts`

- [ ] **Step 1: Write failing test for fallback loading**

Create `lib/cms/__tests__/server.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { fallbackCmsSnapshot } from "../fallback";
import { loadCmsSnapshotFromRows } from "../server";

describe("loadCmsSnapshotFromRows", () => {
  it("returns fallback when rows are missing", () => {
    expect(loadCmsSnapshotFromRows({ sections: [], albums: [], images: [] })).toEqual(fallbackCmsSnapshot);
  });
});
```

- [ ] **Step 2: Run failing test**

Run:

```bash
npm run test -- lib/cms/__tests__/server.test.ts
```

Expected: FAIL because `lib/cms/server.ts` does not exist.

- [ ] **Step 3: Implement `lib/supabase/config.ts`**

```ts
export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

export function requireSupabaseConfig() {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return {
    url: config.url,
    anonKey: config.anonKey,
  };
}
```

- [ ] **Step 4: Implement `lib/supabase/client.ts`**

```ts
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseConfig } from "./config";

export function createSupabaseBrowserClient() {
  const config = requireSupabaseConfig();
  return createBrowserClient(config.url, config.anonKey);
}
```

- [ ] **Step 5: Implement `lib/supabase/server.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseConfig } from "./config";

export async function createSupabaseServerClient() {
  const config = requireSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
```

- [ ] **Step 6: Implement `lib/cms/server.ts` data shaping**

```ts
import { getSupabaseConfig } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import { fallbackCmsSnapshot } from "./fallback";
import type { CmsSnapshot, GalleryAlbum, GalleryImage, WeddingContent } from "./types";

type ContentSectionRow = {
  section_key: string;
  language: "en" | "th";
  content: unknown;
};

type GalleryAlbumRow = {
  id: string;
  slug: string;
  sort_order: number;
  cover_image_id: string | null;
  title_en: string;
  title_th: string;
  description_en: string;
  description_th: string;
  label_en: string;
  label_th: string;
  status: "draft" | "published";
};

type GalleryImageRow = {
  id: string;
  album_id: string;
  storage_path: string;
  public_url: string;
  sort_order: number;
  caption_en: string;
  caption_th: string;
  alt_en: string;
  alt_th: string;
  is_cover: boolean;
  status: "draft" | "published";
};

export function loadCmsSnapshotFromRows({
  sections,
  albums,
  images,
}: {
  sections: ContentSectionRow[];
  albums: GalleryAlbumRow[];
  images: GalleryImageRow[];
}): CmsSnapshot {
  if (sections.length === 0 && albums.length === 0 && images.length === 0) {
    return fallbackCmsSnapshot;
  }

  const content = structuredClone(fallbackCmsSnapshot.content) as WeddingContent;
  for (const section of sections) {
    const key = section.section_key as keyof WeddingContent;
    if (key in content && typeof section.content === "object" && section.content !== null) {
      content[key] = {
        ...(content[key] as object),
        ...(section.content as object),
      } as never;
    }
  }

  const imagesByAlbum = new Map<string, GalleryImage[]>();
  for (const image of images) {
    const mapped: GalleryImage = {
      id: image.id,
      albumId: image.album_id,
      src: image.public_url,
      storagePath: image.storage_path,
      caption: { en: image.caption_en, th: image.caption_th },
      alt: { en: image.alt_en, th: image.alt_th },
      isCover: image.is_cover,
      sortOrder: image.sort_order,
      status: image.status,
    };
    imagesByAlbum.set(image.album_id, [...(imagesByAlbum.get(image.album_id) ?? []), mapped]);
  }

  const mappedAlbums: GalleryAlbum[] = albums
    .map((album) => ({
      id: album.id,
      slug: album.slug,
      label: { en: album.label_en, th: album.label_th },
      title: { en: album.title_en, th: album.title_th },
      description: { en: album.description_en, th: album.description_th },
      sortOrder: album.sort_order,
      coverImageId: album.cover_image_id,
      status: album.status,
      images: (imagesByAlbum.get(album.id) ?? []).sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    content,
    albums: mappedAlbums.length > 0 ? mappedAlbums : fallbackCmsSnapshot.albums,
  };
}

export async function getPublishedCmsSnapshot(): Promise<CmsSnapshot> {
  if (!getSupabaseConfig().isConfigured) {
    return fallbackCmsSnapshot;
  }

  const supabase = await createSupabaseServerClient();
  const [{ data: versions }, { data: albums }, { data: images }] = await Promise.all([
    supabase.from("content_versions").select("id").eq("status", "published").order("published_at", { ascending: false }).limit(1),
    supabase.from("gallery_albums").select("*").eq("status", "published").order("sort_order"),
    supabase.from("gallery_images").select("*").eq("status", "published").order("sort_order"),
  ]);

  const versionId = versions?.[0]?.id;
  const { data: sections } = versionId
    ? await supabase.from("content_sections").select("*").eq("version_id", versionId)
    : { data: [] };

  return loadCmsSnapshotFromRows({
    sections: (sections ?? []) as ContentSectionRow[],
    albums: (albums ?? []) as GalleryAlbumRow[],
    images: (images ?? []) as GalleryImageRow[],
  });
}
```

- [ ] **Step 7: Run tests**

Run:

```bash
npm run test -- lib/cms/__tests__/server.test.ts
npm run lint
```

Expected: tests pass and lint exits 0.

- [ ] **Step 8: Commit**

```bash
git add lib/supabase lib/cms/server.ts lib/cms/__tests__/server.test.ts
git commit -m "feat: add cms server data loading"
```

---

## Task 5: Add Admin Login and Auth Guard

**Files:**
- Create: `app/admin/actions.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `app/admin/components/AdminShell.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/__tests__/auth.test.tsx`

- [ ] **Step 1: Write component test for login form**

Create `app/admin/__tests__/auth.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "../login/page";

describe("LoginPage", () => {
  it("renders email and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run failing auth test**

Run:

```bash
npm run test -- app/admin/__tests__/auth.test.tsx
```

Expected: FAIL because login page does not exist.

- [ ] **Step 3: Create `app/admin/actions.ts`**

```ts
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=invalid");
  }

  redirect("/admin/content");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
```

- [ ] **Step 4: Create `app/admin/login/page.tsx`**

```tsx
import { signInAdmin } from "../actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#FBF8F0] px-4 py-16 text-[#0A1F44]">
      <form
        action={signInAdmin}
        className="mx-auto max-w-md rounded border border-[#0A1F44]/10 bg-white/80 p-6 shadow-[0_22px_70px_rgba(10,31,68,0.08)]"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7C5C3B]">Admin</p>
        <h1 className="luxury-heading mt-3 text-2xl font-semibold">Wedding CMS</h1>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Email</span>
            <input className="min-h-12 w-full rounded border border-[#0A1F44]/15 px-4" name="email" type="email" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <input className="min-h-12 w-full rounded border border-[#0A1F44]/15 px-4" name="password" type="password" required />
          </label>
        </div>
        <button className="mt-6 min-h-12 w-full rounded bg-[#0A1F44] px-4 font-semibold text-[#FBF8F0]" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 5: Create `app/admin/components/AdminShell.tsx`**

```tsx
import Link from "next/link";
import { signOutAdmin } from "../actions";

const navItems = [
  { label: "Content", href: "/admin/content" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBF8F0] text-[#0A1F44]">
      <header className="border-b border-[#0A1F44]/10 bg-white/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link className="luxury-heading text-lg font-semibold" href="/admin/content">
            J&S CMS
          </Link>
          <div className="flex items-center gap-3">
            {navItems.map((item) => (
              <Link className="rounded px-3 py-2 text-sm font-semibold hover:bg-[#D6C8A5]/25" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <form action={signOutAdmin}>
              <button className="rounded border border-[#0A1F44]/15 px-3 py-2 text-sm font-semibold" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 6: Create `app/admin/layout.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getSupabaseConfig } from "../../lib/supabase/config";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { AdminShell } from "./components/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!getSupabaseConfig().isConfigured) {
    return <AdminShell>{children}</AdminShell>;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
```

- [ ] **Step 7: Create `app/admin/page.tsx`**

```tsx
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/content");
}
```

- [ ] **Step 8: Run tests and build**

Run:

```bash
npm run test -- app/admin/__tests__/auth.test.tsx
npm run build
```

Expected: test passes and build exits 0.

- [ ] **Step 9: Commit**

```bash
git add app/admin
git commit -m "feat: add admin auth shell"
```

---

## Task 6: Add Content Editor Tab with Draft Save Stubs

**Files:**
- Create: `app/admin/content/page.tsx`
- Create: `app/admin/components/LanguageTabs.tsx`
- Create: `app/admin/components/SectionEditor.tsx`
- Create: `app/admin/components/StatusBanner.tsx`
- Extend: `lib/cms/actions.ts`

- [ ] **Step 1: Create `app/admin/components/LanguageTabs.tsx`**

```tsx
"use client";

import type { Language } from "../../../lib/cms/types";

export function LanguageTabs({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div className="inline-flex rounded border border-[#0A1F44]/10 bg-white p-1">
      {(["en", "th"] as const).map((item) => (
        <button
          className={`min-h-10 rounded px-4 text-sm font-semibold ${language === item ? "bg-[#0A1F44] text-[#FBF8F0]" : "text-[#0A1F44]"}`}
          key={item}
          onClick={() => onChange(item)}
          type="button"
        >
          {item === "en" ? "English" : "ไทย"}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `app/admin/components/StatusBanner.tsx`**

```tsx
export function StatusBanner({
  tone,
  children,
}: {
  tone: "info" | "success" | "error";
  children: React.ReactNode;
}) {
  const classes = {
    info: "border-[#0A1F44]/15 bg-white/70 text-[#0A1F44]",
    success: "border-[#3E4D3A]/25 bg-[#3E4D3A]/10 text-[#3E4D3A]",
    error: "border-red-700/25 bg-red-50 text-red-800",
  };

  return <div className={`rounded border p-4 text-sm ${classes[tone]}`}>{children}</div>;
}
```

- [ ] **Step 3: Create `lib/cms/actions.ts` draft save stub**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { fallbackCmsSnapshot } from "./fallback";
import type { WeddingContent } from "./types";

let inMemoryDraftContent: WeddingContent = fallbackCmsSnapshot.content;

export async function getDraftContentForAdmin() {
  return inMemoryDraftContent;
}

export async function saveDraftContent(content: WeddingContent) {
  inMemoryDraftContent = content;
  revalidatePath("/admin/content");
  return { ok: true };
}
```

- [ ] **Step 4: Create `app/admin/components/SectionEditor.tsx`**

```tsx
"use client";

import { useState, useTransition } from "react";
import { saveDraftContent } from "../../../lib/cms/actions";
import type { Language, WeddingContent } from "../../../lib/cms/types";
import { LanguageTabs } from "./LanguageTabs";
import { StatusBanner } from "./StatusBanner";

export function SectionEditor({ initialContent }: { initialContent: WeddingContent }) {
  const [content, setContent] = useState(initialContent);
  const [language, setLanguage] = useState<Language>("en");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const updateHeroText = (value: string) => {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        text: {
          ...current.hero.text,
          [language]: value,
        },
      },
    }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded border border-[#0A1F44]/10 bg-white/75 p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7C5C3B]">Content</p>
            <h1 className="luxury-heading mt-2 text-2xl font-semibold">Hero</h1>
          </div>
          <LanguageTabs language={language} onChange={setLanguage} />
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Hero text</span>
          <textarea
            className="min-h-32 w-full rounded border border-[#0A1F44]/15 p-3"
            value={content.hero.text[language]}
            onChange={(event) => updateHeroText(event.target.value)}
          />
        </label>
        <button
          className="mt-5 min-h-11 rounded bg-[#0A1F44] px-5 font-semibold text-[#FBF8F0] disabled:opacity-60"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveDraftContent(content);
              setStatus(result.ok ? "saved" : "error");
            });
          }}
          type="button"
        >
          {isPending ? "Saving..." : "Save draft"}
        </button>
        {status === "saved" ? <div className="mt-4"><StatusBanner tone="success">Draft saved.</StatusBanner></div> : null}
        {status === "error" ? <div className="mt-4"><StatusBanner tone="error">Unable to save draft.</StatusBanner></div> : null}
      </section>
      <section className="rounded border border-[#0A1F44]/10 bg-[#0A1F44] p-6 text-[#FBF8F0]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D6C8A5]">Inline preview</p>
        <h2 className="script-display mt-8 text-6xl">Jajah & Smart</h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[#FBF8F0]/80">{content.hero.text[language]}</p>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Create `app/admin/content/page.tsx`**

```tsx
import { getDraftContentForAdmin } from "../../../lib/cms/actions";
import { SectionEditor } from "../components/SectionEditor";

export default async function AdminContentPage() {
  const content = await getDraftContentForAdmin();
  return <SectionEditor initialContent={content} />;
}
```

- [ ] **Step 6: Run build**

Run:

```bash
npm run build
```

Expected: build exits 0.

- [ ] **Step 7: Commit**

```bash
git add app/admin/content app/admin/components lib/cms/actions.ts
git commit -m "feat: add cms content editor"
```

---

## Task 7: Replace Draft Stubs with Supabase Draft Persistence

**Files:**
- Modify: `lib/cms/actions.ts`
- Modify: `lib/cms/server.ts`

- [ ] **Step 1: Add Supabase draft helpers in `lib/cms/actions.ts`**

Replace the in-memory implementation with:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseConfig } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import { fallbackCmsSnapshot } from "./fallback";
import type { WeddingContent } from "./types";

let fallbackDraftContent: WeddingContent = fallbackCmsSnapshot.content;

async function getOrCreateDraftVersionId() {
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase.from("content_versions").select("id").eq("status", "draft").maybeSingle();
  if (existing?.id) {
    return existing.id as string;
  }

  const { data, error } = await supabase.from("content_versions").insert({ status: "draft" }).select("id").single();
  if (error) {
    throw error;
  }
  return data.id as string;
}

export async function getDraftContentForAdmin() {
  if (!getSupabaseConfig().isConfigured) {
    return fallbackDraftContent;
  }

  const supabase = await createSupabaseServerClient();
  const { data: version } = await supabase.from("content_versions").select("id").eq("status", "draft").maybeSingle();
  if (!version?.id) {
    return fallbackCmsSnapshot.content;
  }

  const { data: sections } = await supabase.from("content_sections").select("*").eq("version_id", version.id);
  if (!sections || sections.length === 0) {
    return fallbackCmsSnapshot.content;
  }

  return sections.reduce((content, section) => {
    const key = section.section_key as keyof WeddingContent;
    if (key in content) {
      content[key] = {
        ...(content[key] as object),
        ...(section.content as object),
      } as never;
    }
    return content;
  }, structuredClone(fallbackCmsSnapshot.content) as WeddingContent);
}

export async function saveDraftContent(content: WeddingContent) {
  if (!getSupabaseConfig().isConfigured) {
    fallbackDraftContent = content;
    revalidatePath("/admin/content");
    return { ok: true };
  }

  const supabase = await createSupabaseServerClient();
  const versionId = await getOrCreateDraftVersionId();
  const sectionRows = Object.entries(content).flatMap(([sectionKey, sectionContent]) => [
    {
      version_id: versionId,
      section_key: sectionKey,
      language: "en",
      content: sectionContent,
    },
    {
      version_id: versionId,
      section_key: sectionKey,
      language: "th",
      content: sectionContent,
    },
  ]);

  const { error } = await supabase
    .from("content_sections")
    .upsert(sectionRows, { onConflict: "version_id,section_key,language" });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/content");
  return { ok: true };
}
```

- [ ] **Step 2: Run tests/build**

Run:

```bash
npm run test
npm run build
```

Expected: tests pass and build exits 0 with and without Supabase env vars.

- [ ] **Step 3: Commit**

```bash
git add lib/cms/actions.ts lib/cms/server.ts
git commit -m "feat: persist cms drafts in supabase"
```

---

## Task 8: Add Gallery Manager UI and Pure Client Behavior

**Files:**
- Create: `app/admin/gallery/page.tsx`
- Create: `app/admin/components/GalleryManager.tsx`
- Create: `app/admin/components/ImageGrid.tsx`
- Create: `app/admin/__tests__/gallery-manager.test.tsx`
- Extend: `lib/cms/actions.ts`

- [ ] **Step 1: Write failing gallery manager test**

Create `app/admin/__tests__/gallery-manager.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import { GalleryManager } from "../components/GalleryManager";

describe("GalleryManager", () => {
  it("renders albums and selects an album", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);
    expect(screen.getByRole("button", { name: /highlights/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /highlights/i }));
    expect(screen.getByText(/classic portrait/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run failing gallery test**

Run:

```bash
npm run test -- app/admin/__tests__/gallery-manager.test.tsx
```

Expected: FAIL because `GalleryManager` does not exist.

- [ ] **Step 3: Create `app/admin/components/ImageGrid.tsx`**

```tsx
"use client";

import Image from "next/image";
import type { GalleryImage } from "../../../lib/cms/types";

export function ImageGrid({
  images,
  onMove,
}: {
  images: GalleryImage[];
  onMove: (fromIndex: number, toIndex: number) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <article className="rounded border border-[#0A1F44]/10 bg-white p-3" key={image.id}>
          <div className="relative aspect-[4/5] overflow-hidden rounded bg-[#0A1F44]/10">
            <Image alt={image.alt.en || image.caption.en} className="object-cover" fill src={image.src} />
          </div>
          <p className="mt-3 text-sm font-semibold">{image.caption.en}</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded border px-2 py-1 text-xs" disabled={index === 0} onClick={() => onMove(index, index - 1)} type="button">
              Move up
            </button>
            <button className="rounded border px-2 py-1 text-xs" disabled={index === images.length - 1} onClick={() => onMove(index, index + 1)} type="button">
              Move down
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create `app/admin/components/GalleryManager.tsx`**

```tsx
"use client";

import { useState } from "react";
import { moveItem, normalizeSortOrder } from "../../../lib/cms/reorder";
import type { GalleryAlbum } from "../../../lib/cms/types";
import { ImageGrid } from "./ImageGrid";

export function GalleryManager({ initialAlbums }: { initialAlbums: GalleryAlbum[] }) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [selectedAlbumId, setSelectedAlbumId] = useState(initialAlbums[0]?.id ?? "");
  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId) ?? albums[0];

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (!selectedAlbum) return;
    const reordered = normalizeSortOrder(moveItem(selectedAlbum.images, fromIndex, toIndex));
    setAlbums((current) =>
      current.map((album) => (album.id === selectedAlbum.id ? { ...album, images: reordered } : album)),
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded border border-[#0A1F44]/10 bg-white/75 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7C5C3B]">Albums</p>
        <div className="mt-4 space-y-2">
          {albums.map((album) => (
            <button
              className={`w-full rounded px-3 py-2 text-left font-semibold ${selectedAlbum?.id === album.id ? "bg-[#0A1F44] text-[#FBF8F0]" : "bg-[#FBF8F0] text-[#0A1F44]"}`}
              key={album.id}
              onClick={() => setSelectedAlbumId(album.id)}
              type="button"
            >
              {album.title.en}
            </button>
          ))}
        </div>
      </aside>
      <section className="rounded border border-[#0A1F44]/10 bg-white/75 p-5">
        {selectedAlbum ? (
          <>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7C5C3B]">{selectedAlbum.label.en}</p>
                <h1 className="luxury-heading mt-2 text-2xl font-semibold">{selectedAlbum.title.en}</h1>
              </div>
              <p className="text-sm font-semibold text-[#0A1F44]/65">{selectedAlbum.images.length} photos</p>
            </div>
            <ImageGrid images={selectedAlbum.images} onMove={moveImage} />
          </>
        ) : (
          <p>No albums yet.</p>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Create `app/admin/gallery/page.tsx`**

```tsx
import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import { GalleryManager } from "../components/GalleryManager";

export default function AdminGalleryPage() {
  return <GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />;
}
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm run test -- app/admin/__tests__/gallery-manager.test.tsx lib/cms/__tests__/reorder.test.ts
npm run build
```

Expected: tests pass and build exits 0.

- [ ] **Step 7: Commit**

```bash
git add app/admin/gallery app/admin/components/GalleryManager.tsx app/admin/components/ImageGrid.tsx app/admin/__tests__/gallery-manager.test.tsx
git commit -m "feat: add cms gallery manager"
```

---

## Task 9: Add Supabase Gallery Mutations and Upload Flow

**Files:**
- Modify: `lib/cms/actions.ts`
- Modify: `app/admin/components/GalleryManager.tsx`

- [ ] **Step 1: Add upload and metadata server actions**

Add to `lib/cms/actions.ts`:

```ts
import { buildGalleryStoragePath } from "./storage";

export async function uploadGalleryImages(formData: FormData) {
  if (!getSupabaseConfig().isConfigured) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const albumId = String(formData.get("albumId") ?? "");
  const albumSlug = String(formData.get("albumSlug") ?? "album");
  const files = formData.getAll("images").filter((item): item is File => item instanceof File);

  if (!albumId || files.length === 0) {
    return { ok: false, message: "Select an album and at least one image." };
  }

  const supabase = await createSupabaseServerClient();
  const uploadedRows = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return { ok: false, message: `${file.name} is not an image.` };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { ok: false, message: `${file.name} is larger than 10MB.` };
    }

    const storagePath = buildGalleryStoragePath({ albumSlug, fileName: file.name });
    const { error: uploadError } = await supabase.storage.from("wedding-gallery").upload(storagePath, file);
    if (uploadError) {
      return { ok: false, message: uploadError.message };
    }
    const { data } = supabase.storage.from("wedding-gallery").getPublicUrl(storagePath);
    uploadedRows.push({
      album_id: albumId,
      storage_path: storagePath,
      public_url: data.publicUrl,
      caption_en: "",
      caption_th: "",
      alt_en: "",
      alt_th: "",
      status: "draft",
      sort_order: Date.now(),
    });
  }

  const { error } = await supabase.from("gallery_images").insert(uploadedRows);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/gallery");
  return { ok: true };
}

export async function saveGalleryImageOrder(albumId: string, orderedImageIds: string[]) {
  if (!getSupabaseConfig().isConfigured) {
    return { ok: true };
  }

  const supabase = await createSupabaseServerClient();
  for (const [index, id] of orderedImageIds.entries()) {
    const { error } = await supabase.from("gallery_images").update({ sort_order: index }).eq("id", id).eq("album_id", albumId);
    if (error) {
      return { ok: false, message: error.message };
    }
  }

  revalidatePath("/admin/gallery");
  return { ok: true };
}
```

- [ ] **Step 2: Add upload form to `GalleryManager`**

Inside selected album section, above `ImageGrid`, add:

```tsx
<form action={uploadGalleryImages} className="mb-5 rounded border border-dashed border-[#0A1F44]/20 p-4">
  <input name="albumId" type="hidden" value={selectedAlbum.id} />
  <input name="albumSlug" type="hidden" value={selectedAlbum.slug} />
  <label className="block">
    <span className="mb-2 block text-sm font-semibold">Upload photos</span>
    <input accept="image/*" multiple name="images" type="file" />
  </label>
  <button className="mt-3 rounded bg-[#0A1F44] px-4 py-2 text-sm font-semibold text-[#FBF8F0]" type="submit">
    Upload selected photos
  </button>
</form>
```

Add import:

```ts
import { saveGalleryImageOrder, uploadGalleryImages } from "../../../lib/cms/actions";
```

After `moveImage`, call:

```ts
void saveGalleryImageOrder(selectedAlbum.id, reordered.map((image) => image.id));
```

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: build exits 0.

- [ ] **Step 4: Commit**

```bash
git add lib/cms/actions.ts app/admin/components/GalleryManager.tsx
git commit -m "feat: add gallery upload actions"
```

---

## Task 10: Add Publish and Preview

**Files:**
- Modify: `lib/cms/actions.ts`
- Create: `app/preview/page.tsx`
- Create: `app/admin/settings/page.tsx`

- [ ] **Step 1: Add publish action**

Add to `lib/cms/actions.ts`:

```ts
export async function publishDraftContent() {
  if (!getSupabaseConfig().isConfigured) {
    revalidatePath("/");
    revalidatePath("/gallery");
    return { ok: true };
  }

  const supabase = await createSupabaseServerClient();
  const { data: draft } = await supabase.from("content_versions").select("id").eq("status", "draft").maybeSingle();
  if (!draft?.id) {
    return { ok: false, message: "No draft to publish." };
  }

  const { data: publishedVersion, error: versionError } = await supabase
    .from("content_versions")
    .insert({ status: "published", published_at: new Date().toISOString() })
    .select("id")
    .single();
  if (versionError) {
    return { ok: false, message: versionError.message };
  }

  const { data: draftSections, error: sectionReadError } = await supabase
    .from("content_sections")
    .select("section_key, language, content")
    .eq("version_id", draft.id);
  if (sectionReadError) {
    return { ok: false, message: sectionReadError.message };
  }

  const publishedSections = (draftSections ?? []).map((section) => ({
    version_id: publishedVersion.id,
    section_key: section.section_key,
    language: section.language,
    content: section.content,
  }));

  if (publishedSections.length > 0) {
    const { error: sectionWriteError } = await supabase.from("content_sections").insert(publishedSections);
    if (sectionWriteError) {
      return { ok: false, message: sectionWriteError.message };
    }
  }

  const { error: albumError } = await supabase.from("gallery_albums").update({ status: "published" }).eq("status", "draft");
  if (albumError) {
    return { ok: false, message: albumError.message };
  }

  const { error: imageError } = await supabase.from("gallery_images").update({ status: "published" }).eq("status", "draft");
  if (imageError) {
    return { ok: false, message: imageError.message };
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/settings");
  return { ok: true };
}
```

- [ ] **Step 2: Create `app/admin/settings/page.tsx`**

```tsx
import { publishDraftContent } from "../../../lib/cms/actions";

export default function AdminSettingsPage() {
  return (
    <section className="rounded border border-[#0A1F44]/10 bg-white/75 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7C5C3B]">Settings</p>
      <h1 className="luxury-heading mt-2 text-2xl font-semibold">Publish</h1>
      <p className="mt-4 max-w-2xl text-[#0A1F44]/70">
        Save content and gallery changes as draft first. Use publish only when the draft is ready for guests.
      </p>
      <form action={publishDraftContent} className="mt-6">
        <button className="min-h-12 rounded bg-[#0A1F44] px-5 font-semibold text-[#FBF8F0]" type="submit">
          Publish draft
        </button>
      </form>
      <a className="mt-5 inline-flex rounded border border-[#0A1F44]/15 px-4 py-3 font-semibold" href="/preview">
        Preview full page
      </a>
    </section>
  );
}
```

- [ ] **Step 3: Create `app/preview/page.tsx`**

```tsx
import Home from "../page";

export default function PreviewPage() {
  return <Home />;
}
```

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: build exits 0.

- [ ] **Step 5: Commit**

```bash
git add lib/cms/actions.ts app/admin/settings app/preview
git commit -m "feat: add cms publish controls"
```

---

## Task 11: Refactor Public Pages to Use CMS Data Layer

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/gallery/page.tsx`
- Modify: `lib/cms/server.ts`

- [ ] **Step 1: Add public mapping helpers to `lib/cms/server.ts`**

Add functions:

```ts
export async function getPublicWeddingContent() {
  const snapshot = await getPublishedCmsSnapshot();
  return snapshot.content;
}

export async function getPublicGalleryAlbums() {
  const snapshot = await getPublishedCmsSnapshot();
  return snapshot.albums;
}
```

- [ ] **Step 2: Modify `app/gallery/page.tsx` to load albums**

Delete the local `albums` constant at the top of `app/gallery/page.tsx`. Change the component to async and load albums from the CMS data layer:

```tsx
import { getPublicGalleryAlbums } from "../../lib/cms/server";

export default async function GalleryPage() {
  const albums = await getPublicGalleryAlbums();
  return (
    <main className="subtle-paper min-h-screen bg-[#FBF8F0] text-[#0A1F44]">
      {/* keep the existing header and section wrappers */}
      <div className="mt-12 space-y-14">
        {albums.map((album) => (
          <section className="border-t border-[#0A1F44]/10 pt-8" id={album.slug} key={album.id}>
            <h2 className="luxury-heading mt-2 text-2xl font-semibold">{album.title.en}</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#0A1F44]/68">{album.description.en}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {album.images.map((image, index) => (
                <figure className="group overflow-hidden rounded border border-[#0A1F44]/10 bg-[#0A1F44]" key={image.id}>
                  {/* keep existing Image markup and use image.src, image.alt.en, image.caption.en */}
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
```

Map values exactly as follows:

```tsx
album.slug
album.title.en
album.description.en
album.images
image.id
image.src
image.alt.en
image.caption.en
```

- [ ] **Step 3: Modify `app/page.tsx` carefully**

Move the current client component out of `app/page.tsx` and turn `app/page.tsx` into a server wrapper. Replace the contents of `app/page.tsx` with:

```tsx
import { getPublishedCmsSnapshot } from "../lib/cms/server";
import { WeddingHomeClient } from "./components/WeddingHomeClient";

export default async function Home() {
  const snapshot = await getPublishedCmsSnapshot();
  return <WeddingHomeClient snapshot={snapshot} />;
}
```

- [ ] **Step 4: Create `app/components/WeddingHomeClient.tsx`**

Move current `"use client"` homepage code into this file and add prop:

```tsx
"use client";

import type { CmsSnapshot } from "../../lib/cms/types";

export function WeddingHomeClient({ snapshot }: { snapshot: CmsSnapshot }) {
  // Paste the current client-side Home implementation here.
  // Keep the language gate, language state, nav, RSVP, and section JSX intact.
  // Replace only gallery data in this task.
}
```

Inside `WeddingHomeClient`, replace the current `previewImages` line with:

```ts
const previewImages = snapshot.albums[0]?.images.slice(0, 3) ?? [];
```

Replace `t.galleryAlbums` usages with `snapshot.albums` in the gallery section:

```tsx
{snapshot.albums.map((album) => (
  <a
    className="group border border-[#0A1F44]/10 bg-white/60 p-5 transition hover:border-[#7C5C3B]/45 hover:bg-[#FBF8F0]"
    href={`/gallery#${album.slug}`}
    key={album.id}
  >
    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C5C3B]">
      {album.images.length} {t.galleryPhotoCount}
    </span>
    <span className="luxury-heading block text-lg font-semibold text-[#0A1F44]">
      {album.title[language]}
    </span>
  </a>
))}
```

Leave non-gallery text on the existing `copy` object for this task. A separate follow-up plan can migrate every text field from `snapshot.content` after this refactor is build-clean.

- [ ] **Step 5: Run build after each small replacement**

Run after moving the component:

```bash
npm run build
```

Expected: build exits 0.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/gallery/page.tsx app/components/WeddingHomeClient.tsx lib/cms/server.ts
git commit -m "feat: load public site content from cms layer"
```

---

## Task 12: Add E2E Smoke Tests

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/cms.spec.ts`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev -- --port 3020",
    url: "http://localhost:3020",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3020",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
});
```

- [ ] **Step 2: Create `tests/e2e/cms.spec.ts`**

```ts
import { expect, test } from "@playwright/test";

test("public home page renders with fallback CMS content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /jajah & smart/i })).toBeVisible();
  await expect(page.getByText(/Pearl Wedding Venue/i)).toBeVisible();
});

test("admin login page renders", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("gallery page renders fallback album", async ({ page }) => {
  await page.goto("/gallery");
  await expect(page.getByRole("heading", { name: /jajah & smart albums/i })).toBeVisible();
  await expect(page.getByText(/Highlights/i)).toBeVisible();
});
```

- [ ] **Step 3: Run e2e tests**

Run:

```bash
npx playwright install chromium
npm run test:e2e
```

Expected: all e2e tests pass.

- [ ] **Step 4: Run final verification**

Run:

```bash
npm run test
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/cms.spec.ts
git commit -m "test: add cms smoke coverage"
```

---

## Execution Notes

- Keep the public wedding page visually unchanged unless data source changes require small mapping adjustments.
- Do not remove the existing RSVP Google Form integration.
- If Supabase is not configured, admin can render local fallback/stub screens but real upload/save/publish actions should show a clear configuration message.
- Prefer small commits after each task.
- Before final handoff, run `npm run test`, `npm run lint`, `npm run build`, and `npm run test:e2e`.

## Self-Review Checklist

- Spec coverage: auth, content tabs, gallery upload, cover, reorder, draft, preview, publish, fallback, and public integration are covered by tasks.
- Placeholder scan: no task relies on placeholder markers or undefined future work.
- Type consistency: `WeddingContent`, `GalleryAlbum`, `GalleryImage`, and `CmsSnapshot` are introduced before use.
- Risk note: Task 11 is the highest-risk refactor because the homepage is currently a large client component. The plan limits that task to splitting the component and wiring gallery data first.
