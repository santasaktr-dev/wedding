import { describe, expect, it } from "vitest";

import { fallbackCmsSnapshot } from "../fallback";
import { loadCmsSnapshotFromRows } from "../server";

describe("loadCmsSnapshotFromRows", () => {
  it("returns fallback when rows are missing", () => {
    expect(loadCmsSnapshotFromRows({ sections: [], albums: [], images: [] })).toEqual(fallbackCmsSnapshot);
  });

  it("maps and sorts gallery rows", () => {
    const snapshot = loadCmsSnapshotFromRows({
      sections: [],
      albums: [
        {
          id: "album-2",
          slug: "family",
          status: "published",
          sort_order: 20,
          cover_image_id: null,
          label_en: "Family",
          label_th: "ครอบครัว",
          title_en: "Family Moments",
          title_th: "ครอบครัว",
          description_en: "Family photos",
          description_th: "ภาพครอบครัว",
        },
        {
          id: "album-1",
          slug: "portraits",
          status: "published",
          sort_order: 10,
          cover_image_id: "image-2",
          label_en: "Portraits",
          label_th: "พอร์ตเทรต",
          title_en: "Wedding Portraits",
          title_th: "ภาพคู่",
          description_en: "Portrait photos",
          description_th: "ภาพพอร์ตเทรต",
        },
      ],
      images: [
        {
          id: "image-2",
          album_id: "album-1",
          storage_path: "portraits/2.jpg",
          public_url: "https://example.com/2.jpg",
          sort_order: 2,
          caption_en: "Second",
          caption_th: "ภาพสอง",
          alt_en: "Second portrait",
          alt_th: "ภาพพอร์ตเทรตที่สอง",
          is_cover: true,
          status: "published",
        },
        {
          id: "image-1",
          album_id: "album-1",
          storage_path: "portraits/1.jpg",
          public_url: "https://example.com/1.jpg",
          sort_order: 1,
          caption_en: "First",
          caption_th: "ภาพหนึ่ง",
          alt_en: "First portrait",
          alt_th: "ภาพพอร์ตเทรตแรก",
          is_cover: false,
          status: "published",
        },
      ],
    });

    expect(snapshot.albums.map((album) => album.id)).toEqual(["album-1", "album-2"]);
    expect(snapshot.albums[0]).toMatchObject({
      id: "album-1",
      slug: "portraits",
      status: "published",
      sortOrder: 10,
      coverImageId: "image-2",
      label: { en: "Portraits", th: "พอร์ตเทรต" },
      title: { en: "Wedding Portraits", th: "ภาพคู่" },
      description: { en: "Portrait photos", th: "ภาพพอร์ตเทรต" },
    });
    expect(snapshot.albums[0].images.map((image) => image.id)).toEqual(["image-1", "image-2"]);
    expect(snapshot.albums[0].images[0]).toMatchObject({
      id: "image-1",
      albumId: "album-1",
      storagePath: "portraits/1.jpg",
      publicUrl: "https://example.com/1.jpg",
      caption: { en: "First", th: "ภาพหนึ่ง" },
      alt: { en: "First portrait", th: "ภาพพอร์ตเทรตแรก" },
      sortOrder: 1,
      isCover: false,
      status: "published",
    });
  });
});
