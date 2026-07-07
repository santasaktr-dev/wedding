import { beforeEach, describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../fallback";
import { getAdminGalleryAlbums, getPublishedCmsSnapshot, loadCmsSnapshotFromRows } from "../server";

const supabaseMocks = vi.hoisted(() => ({
  getSupabaseConfig: vi.fn(() => ({ url: undefined, anonKey: undefined, isConfigured: false })),
  createSupabaseServerClient: vi.fn(),
}));

vi.mock("../../supabase/config", () => ({
  getSupabaseConfig: supabaseMocks.getSupabaseConfig,
}));

vi.mock("../../supabase/server", () => ({
  createSupabaseServerClient: supabaseMocks.createSupabaseServerClient,
}));

function createQueryResult<T>(result: T) {
  const promise = Promise.resolve(result);
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    maybeSingle: vi.fn(() => promise),
    then: promise.then.bind(promise),
  };

  return query;
}

describe("loadCmsSnapshotFromRows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseMocks.getSupabaseConfig.mockReturnValue({
      url: undefined,
      anonKey: undefined,
      isConfigured: false,
    });
  });

  it("returns fallback when rows are missing", () => {
    expect(loadCmsSnapshotFromRows({ sections: [], albums: [], images: [] })).toEqual(fallbackCmsSnapshot);
  });

  it("maps snake_case section keys into camelCase content keys", () => {
    const snapshot = loadCmsSnapshotFromRows({
      sections: [
        {
          section_key: "event_info",
          language: "en",
          content: {
            title: { en: "Updated Event Info", th: "อัปเดตรายละเอียดงาน" },
          },
        },
        {
          section_key: "dress_code",
          language: "en",
          content: {
            title: { en: "Updated Dress Code", th: "อัปเดตธีมชุด" },
          },
        },
      ],
      albums: [],
      images: [],
    });

    expect(snapshot.content.eventInfo.title).toEqual({
      en: "Updated Event Info",
      th: "อัปเดตรายละเอียดงาน",
    });
    expect(snapshot.content.dressCode.title).toEqual({
      en: "Updated Dress Code",
      th: "อัปเดตธีมชุด",
    });
  });

  it("fills new CMS fields when older content rows do not include them", () => {
    const snapshot = loadCmsSnapshotFromRows({
      sections: [
        {
          section_key: "rsvp",
          language: "en",
          content: {
            title: { en: "Old Draft RSVP", th: "แบบร่างเดิม" },
          },
        },
      ],
      albums: [],
      images: [],
    });

    expect(snapshot.content.navigation.items).toHaveLength(fallbackCmsSnapshot.content.navigation.items.length);
    expect(snapshot.content.rsvp.relationshipOptions).toHaveLength(
      fallbackCmsSnapshot.content.rsvp.relationshipOptions.length,
    );
    expect(snapshot.content.rsvp.title.en).toBe("Old Draft RSVP");
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

describe("getPublishedCmsSnapshot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns fallback when a published query fails", async () => {
    supabaseMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    const versionQuery = createQueryResult({
      data: {
        id: "published-version",
        status: "published",
        updated_at: "2026-07-07T01:00:00.000Z",
        published_at: "2026-07-07T01:00:00.000Z",
      },
      error: new Error("version query failed"),
    });
    const albumsQuery = createQueryResult({ data: [], error: null });
    const imagesQuery = createQueryResult({ data: [], error: null });
    const sectionsQuery = createQueryResult({ data: [], error: null });

    supabaseMocks.createSupabaseServerClient.mockResolvedValue({
      from: vi.fn((table: string) => {
        if (table === "content_versions") {
          return versionQuery;
        }
        if (table === "gallery_albums") {
          return albumsQuery;
        }
        if (table === "gallery_images") {
          return imagesQuery;
        }
        if (table === "content_sections") {
          return sectionsQuery;
        }
        throw new Error(`Unexpected table: ${table}`);
      }),
    });

    await expect(getPublishedCmsSnapshot()).resolves.toEqual(fallbackCmsSnapshot);
  });
});

describe("getAdminGalleryAlbums", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads draft gallery rows for the admin gallery", async () => {
    supabaseMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    const albumsQuery = createQueryResult({
      data: [
        {
          id: "album-1",
          slug: "highlights",
          status: "draft",
          sort_order: 0,
          cover_image_id: null,
          label_en: "Gallery",
          label_th: "แกลเลอรี",
          title_en: "Highlights",
          title_th: "ไฮไลต์",
          description_en: "Draft photos",
          description_th: "รูปแบบร่าง",
        },
      ],
      error: null,
    });
    const imagesQuery = createQueryResult({
      data: [
        {
          id: "image-1",
          album_id: "album-1",
          storage_path: "highlights/photo.jpg",
          public_url: "https://cdn.example.com/highlights/photo.jpg",
          sort_order: 0,
          caption_en: "",
          caption_th: "",
          alt_en: "",
          alt_th: "",
          is_cover: false,
          status: "draft",
        },
      ],
      error: null,
    });

    supabaseMocks.createSupabaseServerClient.mockResolvedValue({
      from: vi.fn((table: string) => {
        if (table === "gallery_albums") {
          return albumsQuery;
        }
        if (table === "gallery_images") {
          return imagesQuery;
        }
        throw new Error(`Unexpected table: ${table}`);
      }),
    });

    await expect(getAdminGalleryAlbums()).resolves.toMatchObject([
      {
        id: "album-1",
        status: "draft",
        images: [
          {
            id: "image-1",
            publicUrl: "https://cdn.example.com/highlights/photo.jpg",
            status: "draft",
          },
        ],
      },
    ]);
  });
});
