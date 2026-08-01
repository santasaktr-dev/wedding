# Scalable Gallery Uploads Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an administrator create albums and upload more than 20 photos without freezing the browser, while keeping guest gallery pages fast.

**Architecture:** The browser reduces selected photos to WebP before upload, then uploads at most three files at a time to time-limited Supabase Storage upload URLs. Server Actions only authorize object paths and persist the completed metadata. Public and admin galleries render cards in 24-image batches; gallery cards use transformed thumbnails while the lightbox uses the uploaded WebP.

**Tech Stack:** Next.js 15, React 19, TypeScript, Supabase Storage/SSR, Vitest, Testing Library, Tailwind CSS.

---

## File structure

- Create: `lib/gallery/media.ts` — thumbnail URL and fixed gallery batch-size helpers.
- Create: `app/admin/lib/prepare-gallery-image.ts` — browser-only image resize and WebP conversion.
- Create: `app/admin/lib/upload-queue.ts` — concurrency-limited upload queue.
- Create: `app/admin/components/CreateAlbumForm.tsx` — album creation fields and status.
- Modify: `lib/cms/actions.ts` — create album, authorize signed uploads, and persist completed uploads.
- Modify: `app/admin/components/GalleryManager.tsx` — album creation, upload progress, and 24-card window.
- Modify: `app/admin/components/ImageGrid.tsx` — render only the requested image window while retaining global ordering controls.
- Modify: `app/components/GalleryLightbox.tsx` — thumbnail cards, 24-card initial view, and load-more control.
- Modify: `app/gallery/page.tsx` — provide a thumbnail URL and full URL per image.
- Modify: `lib/cms/__tests__/actions.test.ts`, `app/admin/__tests__/gallery-manager.test.tsx`, and `app/gallery/__tests__/gallery-page.test.tsx`.
- Create: `lib/gallery/__tests__/media.test.ts`, `app/admin/lib/__tests__/upload-queue.test.ts`, and `app/components/__tests__/gallery-lightbox.test.tsx`.

### Task 1: Thumbnail URL and batching helpers

**Files:**
- Create: `lib/gallery/media.ts`
- Create: `lib/gallery/__tests__/media.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { GALLERY_PAGE_SIZE, getGalleryThumbnailUrl } from "../media";

describe("getGalleryThumbnailUrl", () => {
  it("uses Supabase's render endpoint for a 720px WebP thumbnail", () => {
    expect(
      getGalleryThumbnailUrl("https://project.supabase.co/storage/v1/object/public/wedding-gallery/album/photo.webp"),
    ).toBe(
      "https://project.supabase.co/storage/v1/render/image/public/wedding-gallery/album/photo.webp?width=720&quality=75&format=webp",
    );
  });
});

it("uses 24 images per gallery batch", () => {
  expect(GALLERY_PAGE_SIZE).toBe(24);
});
```

- [ ] **Step 2: Run the test and confirm it fails because the module is absent**

Run: `npm test -- lib/gallery/__tests__/media.test.ts`

Expected: FAIL with a module-not-found error for `../media`.

- [ ] **Step 3: Implement the minimal helper**

```ts
export const GALLERY_PAGE_SIZE = 24;

export function getGalleryThumbnailUrl(publicUrl: string) {
  const url = new URL(publicUrl);
  url.pathname = url.pathname.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  url.search = "width=720&quality=75&format=webp";
  return url.toString();
}
```

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- lib/gallery/__tests__/media.test.ts`

Expected: PASS with 2 tests.

- [ ] **Step 5: Commit this isolated change**

```bash
git add lib/gallery/media.ts lib/gallery/__tests__/media.test.ts
git commit -m "feat: add gallery thumbnail helpers"
```

### Task 2: Browser-side image preparation and bounded queue

**Files:**
- Create: `app/admin/lib/prepare-gallery-image.ts`
- Create: `app/admin/lib/upload-queue.ts`
- Create: `app/admin/lib/__tests__/upload-queue.test.ts`

- [ ] **Step 1: Write the failing queue test**

```ts
import { describe, expect, it, vi } from "vitest";
import { runWithConcurrency } from "../upload-queue";

it("never runs more than three upload jobs at once", async () => {
  let active = 0;
  let peak = 0;
  const jobs = Array.from({ length: 8 }, (_, value) => async () => {
    active += 1;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active -= 1;
    return value;
  });

  await expect(runWithConcurrency(jobs, 3)).resolves.toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  expect(peak).toBe(3);
});
```

- [ ] **Step 2: Run the test and confirm it fails because the queue is absent**

Run: `npm test -- app/admin/lib/__tests__/upload-queue.test.ts`

Expected: FAIL with a module-not-found error for `../upload-queue`.

- [ ] **Step 3: Implement preparation and queue helpers**

```ts
export const MAX_IMAGE_EDGE = 2560;
export const WEBP_QUALITY = 0.85;

export async function prepareGalleryImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("Unable to prepare image."))), "image/webp", WEBP_QUALITY),
  );
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
}
```

```ts
export async function runWithConcurrency<T>(jobs: Array<() => Promise<T>>, limit: number): Promise<T[]> {
  const results = new Array<T>(jobs.length);
  let nextIndex = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, jobs.length) }, async () => {
      while (nextIndex < jobs.length) {
        const index = nextIndex++;
        results[index] = await jobs[index]();
      }
    }),
  );
  return results;
}
```

- [ ] **Step 4: Run the focused queue test and confirm it passes**

Run: `npm test -- app/admin/lib/__tests__/upload-queue.test.ts`

Expected: PASS with 1 test.

- [ ] **Step 5: Commit this isolated change**

```bash
git add app/admin/lib/prepare-gallery-image.ts app/admin/lib/upload-queue.ts app/admin/lib/__tests__/upload-queue.test.ts
git commit -m "feat: prepare gallery images in the browser"
```

### Task 3: Server Actions for albums and signed uploads

**Files:**
- Modify: `lib/cms/actions.ts`
- Modify: `lib/cms/__tests__/actions.test.ts`

- [ ] **Step 1: Write failing action tests**

```ts
it("creates a draft album with localized fields", async () => {
  await expect(
    createGalleryAlbum({ slug: "ceremony", labelEn: "Ceremony", labelTh: "พิธี", titleEn: "Ceremony", titleTh: "พิธี", descriptionEn: "", descriptionTh: "" }),
  ).resolves.toMatchObject({ ok: true, album: { slug: "ceremony", status: "draft" } });
});

it("creates signed upload instructions and persists only completed uploads", async () => {
  const instructions = await createGalleryUploadInstructions({ albumId: "album-id", files: [{ name: "photo.webp", type: "image/webp", size: 200_000 }] });
  expect(instructions.ok).toBe(true);
  expect(instructions.instructions).toHaveLength(1);
});
```

- [ ] **Step 2: Run the action tests and confirm the new exports fail**

Run: `npm test -- lib/cms/__tests__/actions.test.ts`

Expected: FAIL because `createGalleryAlbum` and `createGalleryUploadInstructions` do not exist.

- [ ] **Step 3: Implement the server boundary**

Add these exported payload types and actions to `lib/cms/actions.ts`:

```ts
export type GalleryUploadCandidate = { name: string; type: string; size: number };
export type GalleryUploadInstruction = { storagePath: string; token: string; publicUrl: string; sortOrder: number };

export async function createGalleryAlbum(input: CreateGalleryAlbumInput) { /* validate localized fields; insert a draft album */ }

export async function createGalleryUploadInstructions(input: { albumId: string; files: GalleryUploadCandidate[] }) { /* validate image/WebP and 30MB cap; create a signed upload URL for every unique storage path */ }

export async function finalizeGalleryUploads(input: { albumId: string; uploads: CompletedGalleryUpload[] }) { /* insert successful rows once; revalidate admin and public gallery */ }
```

`createGalleryUploadInstructions` must call `supabase.storage.from("wedding-gallery").createSignedUploadUrl(storagePath)` for each server-generated path. `finalizeGalleryUploads` must accept only the returned paths for the selected album and must insert all completed rows in one `gallery_images.insert(rows)` call.

- [ ] **Step 4: Run the focused action test and confirm it passes**

Run: `npm test -- lib/cms/__tests__/actions.test.ts`

Expected: PASS, including the new album and signed-upload tests.

- [ ] **Step 5: Commit this isolated change**

```bash
git add lib/cms/actions.ts lib/cms/__tests__/actions.test.ts
git commit -m "feat: add signed gallery upload actions"
```

### Task 4: Admin album creation and non-blocking upload UI

**Files:**
- Create: `app/admin/components/CreateAlbumForm.tsx`
- Modify: `app/admin/components/GalleryManager.tsx`
- Modify: `app/admin/components/ImageGrid.tsx`
- Modify: `app/admin/__tests__/gallery-manager.test.tsx`

- [ ] **Step 1: Write failing component tests**

```tsx
it("creates an album and selects it for uploads", async () => {
  render(<GalleryManager initialAlbums={initialAlbums} />);
  await userEvent.click(screen.getByRole("button", { name: /create album/i }));
  await userEvent.type(screen.getByLabelText(/album title \(english\)/i), "Ceremony");
  await userEvent.click(screen.getByRole("button", { name: /save album/i }));
  expect(await screen.findByRole("button", { name: /ceremony/i })).toBeInTheDocument();
});

it("renders only the first 24 admin image cards until load more is pressed", async () => {
  render(<GalleryManager initialAlbums={albumWith30Images} />);
  expect(screen.getAllByRole("article")).toHaveLength(24);
  await userEvent.click(screen.getByRole("button", { name: /load more photos/i }));
  expect(screen.getAllByRole("article")).toHaveLength(30);
});
```

- [ ] **Step 2: Run the component tests and confirm they fail**

Run: `npm test -- app/admin/__tests__/gallery-manager.test.tsx`

Expected: FAIL because the create-album controls and load-more control do not exist.

- [ ] **Step 3: Implement the UI**

`CreateAlbumForm` must collect slug, label, title, and description in English and Thai, call `createGalleryAlbum`, then return the mapped album to `GalleryManager`.

In `GalleryManager`, replace the FormData upload with this sequence:

```ts
const prepared = await Promise.all(files.map(prepareGalleryImage));
const instructions = await createGalleryUploadInstructions({ albumId, files: prepared.map(toCandidate) });
await runWithConcurrency(
  instructions.instructions.map((instruction, index) => () =>
    createSupabaseBrowserClient().storage.from("wedding-gallery").uploadToSignedUrl(
      instruction.storagePath,
      instruction.token,
      prepared[index],
      { contentType: "image/webp", cacheControl: "31536000" },
    ),
  ),
  3,
);
await finalizeGalleryUploads({ albumId, uploads: completedUploads });
```

Track `preparing`, `uploading`, `completed`, and `failed` per filename. Disable selecting another upload only while the current queue is active. Pass the first 24 images, then each subsequent 24-image increment, to `ImageGrid`; keep global indices when calling move and reorder functions.

- [ ] **Step 4: Run the component test and confirm it passes**

Run: `npm test -- app/admin/__tests__/gallery-manager.test.tsx`

Expected: PASS, including existing upload, delete, sort, create-album, and 24-card-window tests.

- [ ] **Step 5: Commit this isolated change**

```bash
git add app/admin/components/CreateAlbumForm.tsx app/admin/components/GalleryManager.tsx app/admin/components/ImageGrid.tsx app/admin/__tests__/gallery-manager.test.tsx
git commit -m "feat: manage albums and queued gallery uploads"
```

### Task 5: Fast public gallery rendering

**Files:**
- Modify: `app/gallery/page.tsx`
- Modify: `app/components/GalleryLightbox.tsx`
- Create: `app/components/__tests__/gallery-lightbox.test.tsx`
- Modify: `app/gallery/__tests__/gallery-page.test.tsx`

- [ ] **Step 1: Write failing lightbox tests**

```tsx
it("renders the first 24 thumbnails and reveals the next batch", async () => {
  render(<GalleryLightbox images={Array.from({ length: 30 }, makeImage)} />);
  expect(screen.getAllByRole("button", { name: /open image/i })).toHaveLength(24);
  await userEvent.click(screen.getByRole("button", { name: /load more photos/i }));
  expect(screen.getAllByRole("button", { name: /open image/i })).toHaveLength(30);
});

it("uses the thumbnail for the card and full URL in the dialog", async () => {
  render(<GalleryLightbox images={[{ id: "1", thumbnailSrc: "thumbnail.webp", src: "full.webp", alt: "", caption: "" }]} />);
  expect(screen.getByRole("img")).toHaveAttribute("src", "thumbnail.webp");
  await userEvent.click(screen.getByRole("button", { name: /open image/i }));
  expect(screen.getByRole("dialog").querySelector("img")).toHaveAttribute("src", "full.webp");
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test -- app/components/__tests__/gallery-lightbox.test.tsx`

Expected: FAIL because the component has no `thumbnailSrc`, 24-card window, or load-more control.

- [ ] **Step 3: Implement public gallery data flow**

In `app/gallery/page.tsx`, map each image to `{ id, src: image.publicUrl, thumbnailSrc: getGalleryThumbnailUrl(image.publicUrl), alt, caption }`.

In `GalleryLightbox`, hold `visibleCount` state initialized to `GALLERY_PAGE_SIZE`, render `images.slice(0, visibleCount)`, add accessible `aria-label="Open image"` labels to cards, and render a `Load more photos` button while `visibleCount < images.length`. Keep `src` only for the dialog image.

- [ ] **Step 4: Run focused public-gallery tests and confirm they pass**

Run: `npm test -- app/components/__tests__/gallery-lightbox.test.tsx app/gallery/__tests__/gallery-page.test.tsx`

Expected: PASS, including existing localized gallery tests.

- [ ] **Step 5: Commit this isolated change**

```bash
git add app/gallery/page.tsx app/components/GalleryLightbox.tsx app/components/__tests__/gallery-lightbox.test.tsx app/gallery/__tests__/gallery-page.test.tsx
git commit -m "feat: paginate gallery thumbnails"
```

### Task 6: Full verification and Supabase setup check

**Files:**
- Modify: `supabase/schema.sql` only if the deployed Storage bucket lacks authenticated INSERT permission.

- [ ] **Step 1: Verify the Storage policy before changing SQL**

Confirm the `wedding-gallery` bucket accepts authenticated INSERT. The current schema documents this required policy; signed upload URLs created by the server require it when they are issued.

- [ ] **Step 2: Run all automated tests**

Run: `npm test`

Expected: PASS with no failing test files.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 4: Manual browser verification**

1. Sign in to `/admin`.
2. Create an English/Thai album and select it.
3. Select 25+ JPEG/PNG photos; confirm every file is converted to WebP, the queue has no more than three active uploads, and successful images appear in the album.
4. Open `/gallery`; confirm 24 thumbnails appear initially, “Load more photos” reveals the remainder, and the lightbox renders the full uploaded image.

- [ ] **Step 5: Commit the completed work**

```bash
git add lib app supabase docs/superpowers/specs/2026-08-01-gallery-performance-design.md docs/superpowers/plans/2026-08-01-scalable-gallery-uploads.md
git commit -m "feat: scale gallery albums and uploads"
```

## Plan self-review

- Spec coverage: Tasks 1 and 5 implement transformed thumbnails and 24-image public rendering; Tasks 2 through 4 implement WebP compression, a three-upload queue, and album administration; Task 6 verifies production behavior and Storage access.
- Scope: The plan intentionally keeps original photo backup outside the website and does not introduce resumable TUS uploads, because 2,560px WebP conversion makes normal signed uploads sufficiently small for this workflow.
- Type consistency: `GalleryUploadInstruction.storagePath` and `.token` are generated server-side and consumed by `uploadToSignedUrl`; the same returned `storagePath` is the only path accepted by finalization.
