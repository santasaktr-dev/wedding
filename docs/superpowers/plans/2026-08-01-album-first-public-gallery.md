# Album-First Public Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show real published photos from every album on the home page and make the public gallery start with an album picker.

**Architecture:** The home gallery flattens images from all published albums supplied in the CMS snapshot, so it has no Highlights-only dependency. The gallery route uses an optional `album` query parameter: without it, it displays mobile-first album cards; with it, it renders one album's lightbox and a link back to the picker.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Vitest, Testing Library.

---

### Task 1: Test the home-page preview source

**Files:**
- Modify: `app/components/__tests__/wedding-home-client.test.tsx`
- Modify: `app/components/WeddingHomeClient.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
it("uses preview photos from every published album instead of a Highlights album", () => {
  const snapshot = structuredClone(fallbackCmsSnapshot) as CmsSnapshot;
  snapshot.albums = [
    { ...snapshot.albums[0], slug: "first", images: [{ ...snapshot.albums[0].images[0], publicUrl: "/first.jpg" }] },
    { ...snapshot.albums[0], id: "second", slug: "second", images: [{ ...snapshot.albums[0].images[0], id: "second-photo", publicUrl: "/second.jpg" }] },
  ];
  render(<WeddingHomeClient snapshot={snapshot} />);
  expect(screen.getByRole("img", { name: /prewedding portrait/i })).toHaveAttribute("src", expect.stringContaining("first.jpg"));
  expect(screen.getByRole("img", { name: /prewedding portrait/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/components/__tests__/wedding-home-client.test.tsx`
Expected: FAIL before the component reads all albums.

- [ ] **Step 3: Implement the minimal source selection**

```ts
const previewImages = snapshot.albums.flatMap((album) => album.images).slice(0, 3);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/components/__tests__/wedding-home-client.test.tsx`
Expected: PASS.

### Task 2: Test and implement the album-first public route

**Files:**
- Modify: `app/gallery/__tests__/gallery-page.test.tsx`
- Modify: `app/gallery/page.tsx`

- [ ] **Step 1: Write failing route tests**

```tsx
expect(screen.getByRole("link", { name: /highlights/i })).toHaveAttribute("href", "/gallery?album=highlights");

render(await GalleryPage({ searchParams: Promise.resolve({ album: "highlights" }) }));
expect(screen.getByTestId("gallery-masonry-highlights")).toBeInTheDocument();
expect(screen.getByRole("link", { name: /back to albums/i })).toHaveAttribute("href", "/gallery");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/gallery/__tests__/gallery-page.test.tsx`
Expected: FAIL because the route always renders all image grids.

- [ ] **Step 3: Implement picker and selected-album states**

```ts
const selectedAlbum = albums.find((album) => album.slug === albumSlug);
// No albumSlug: show each album as a touch-friendly card.
// selectedAlbum: show its GalleryLightbox plus a back link.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/gallery/__tests__/gallery-page.test.tsx`
Expected: PASS.

### Task 3: Final verification and restart

**Files:**
- Verify: `app/components/WeddingHomeClient.tsx`
- Verify: `app/gallery/page.tsx`

- [ ] **Step 1: Run full tests**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Build production output**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 3: Restart and inspect local site**

Run: `npm run dev -- --port 3000`
Expected: `http://localhost:3000` responds with HTTP 200.
