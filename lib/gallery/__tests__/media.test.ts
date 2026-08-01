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
