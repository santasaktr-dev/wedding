import { beforeEach, describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../fallback";
import {
  getDraftContentForAdmin,
  publishDraftContent,
  saveDraftContent,
  saveGalleryImageOrder,
  deleteGalleryImage,
  uploadGalleryImages,
  uploadGalleryImagesAction,
} from "../actions";

const actionMocks = vi.hoisted(() => ({
  getSupabaseConfig: vi.fn(() => ({ url: undefined, anonKey: undefined, isConfigured: false })),
  createSupabaseServerClient: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("../../supabase/config", () => ({
  getSupabaseConfig: actionMocks.getSupabaseConfig,
}));

vi.mock("../../supabase/server", () => ({
  createSupabaseServerClient: actionMocks.createSupabaseServerClient,
}));

vi.mock("next/cache", () => ({
  revalidatePath: actionMocks.revalidatePath,
}));

function createQueryResult<T>(result: T) {
  const promise = Promise.resolve(result);
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    maybeSingle: vi.fn(() => promise),
    single: vi.fn(() => promise),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),
    upsert: vi.fn(() => promise),
    then: promise.then.bind(promise),
  };

  return query;
}

describe("cms draft actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actionMocks.getSupabaseConfig.mockReturnValue({
      url: undefined,
      anonKey: undefined,
      isConfigured: false,
    });
  });

  it("stores fallback drafts when Supabase is not configured", async () => {
    const draft = structuredClone(fallbackCmsSnapshot.content);
    draft.hero.text.en = "Updated fallback draft";

    await expect(saveDraftContent(draft)).resolves.toEqual({ ok: true });
    draft.hero.text.en = "Caller mutation after save";

    await expect(getDraftContentForAdmin()).resolves.toMatchObject({
      hero: {
        text: {
          en: "Updated fallback draft",
        },
      },
    });
    expect(actionMocks.createSupabaseServerClient).not.toHaveBeenCalled();
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/admin/content");
  });

  it("loads a configured draft from content section rows", async () => {
    actionMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    const versionQuery = createQueryResult({
      data: {
        id: "draft-version",
        status: "draft",
        updated_at: "2026-07-07T02:00:00.000Z",
        published_at: null,
      },
      error: null,
    });
    const sectionsQuery = createQueryResult({
      data: [
        {
          section_key: "hero",
          language: "en",
          content: {
            text: {
              en: "Loaded draft",
              th: "โหลดแบบร่าง",
            },
          },
        },
      ],
      error: null,
    });

    actionMocks.createSupabaseServerClient.mockResolvedValue({
      from: vi.fn((table: string) => {
        if (table === "content_versions") {
          return versionQuery;
        }
        if (table === "content_sections") {
          return sectionsQuery;
        }
        throw new Error(`Unexpected table: ${table}`);
      }),
    });

    await expect(getDraftContentForAdmin()).resolves.toMatchObject({
      hero: {
        text: {
          en: "Loaded draft",
          th: "โหลดแบบร่าง",
        },
      },
    });
  });

  it("upserts section rows into the configured draft", async () => {
    actionMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    const versionQuery = createQueryResult({ data: { id: "draft-version" }, error: null });
    const sectionsQuery = createQueryResult({ data: null, error: null });
    const updateQuery = createQueryResult({ data: null, error: null });
    const from = vi.fn((table: string) => {
      if (table === "content_versions") {
        return versionQuery;
      }
      if (table === "content_sections") {
        return sectionsQuery;
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    versionQuery.update.mockReturnValue(updateQuery);
    actionMocks.createSupabaseServerClient.mockResolvedValue({ from });

    const draft = structuredClone(fallbackCmsSnapshot.content);
    draft.hero.text.en = "Persisted draft";

    await expect(saveDraftContent(draft)).resolves.toEqual({ ok: true });

    expect(sectionsQuery.upsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          version_id: "draft-version",
          section_key: "hero",
          language: "en",
          content: expect.objectContaining({
            text: expect.objectContaining({ en: "Persisted draft" }),
          }),
        }),
        expect.objectContaining({
          version_id: "draft-version",
          section_key: "hero",
          language: "th",
        }),
      ]),
      { onConflict: "version_id,section_key,language" },
    );
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/admin/content");
  });

  it("rejects gallery uploads when Supabase is not configured", async () => {
    const formData = new FormData();
    formData.set("albumId", "album-id");
    formData.set("albumSlug", "highlights");
    formData.append("images", new File(["image"], "photo.jpg", { type: "image/jpeg" }));

    await expect(uploadGalleryImages(formData)).resolves.toEqual({
      ok: false,
      message: "Supabase is not configured.",
    });
  });

  it("returns gallery upload errors to action-state forms", async () => {
    const formData = new FormData();
    formData.set("albumId", "album-id");
    formData.set("albumSlug", "highlights");

    await expect(uploadGalleryImagesAction({ ok: false }, formData)).resolves.toEqual({
      ok: false,
      message: "Supabase is not configured.",
    });
  });

  it("uploads gallery images and inserts draft image rows", async () => {
    actionMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    const imagesQuery = createQueryResult({ data: null, error: null });
    const upload = vi.fn().mockResolvedValue({ error: null });
    const getPublicUrl = vi.fn((path: string) => ({
      data: {
        publicUrl: `https://cdn.example.com/${path}`,
      },
    }));
    const storageFrom = vi.fn(() => ({ upload, getPublicUrl }));
    const from = vi.fn((table: string) => {
      if (table === "gallery_images") {
        return imagesQuery;
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    actionMocks.createSupabaseServerClient.mockResolvedValue({
      from,
      storage: {
        from: storageFrom,
      },
    });

    const formData = new FormData();
    formData.set("albumId", "album-id");
    formData.set("albumSlug", "Highlights");
    formData.append("images", new File([new Uint8Array(11 * 1024 * 1024)], "Jajah & Smart.JPG", { type: "image/jpeg" }));

    await expect(uploadGalleryImages(formData)).resolves.toEqual({ ok: true });

    expect(storageFrom).toHaveBeenCalledWith("wedding-gallery");
    expect(upload).toHaveBeenCalledWith(expect.stringMatching(/^highlights\/\d+-jajah-smart\.jpg$/), expect.any(File));
    expect(imagesQuery.insert).toHaveBeenCalledWith([
      expect.objectContaining({
        album_id: "album-id",
        public_url: expect.stringMatching(/^https:\/\/cdn\.example\.com\/highlights\/\d+-jajah-smart\.jpg$/),
        sort_order: 0,
        status: "draft",
      }),
    ]);
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/admin/gallery");
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/gallery");
  });

  it("persists gallery image order when Supabase is configured", async () => {
    actionMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    const updateQuery = createQueryResult({ data: null, error: null });
    const from = vi.fn((table: string) => {
      if (table === "gallery_images") {
        return updateQuery;
      }
      throw new Error(`Unexpected table: ${table}`);
    });
    actionMocks.createSupabaseServerClient.mockResolvedValue({ from });

    await expect(saveGalleryImageOrder("album-id", ["image-2", "image-1"])).resolves.toEqual({ ok: true });

    expect(updateQuery.update).toHaveBeenNthCalledWith(1, { sort_order: 0 });
    expect(updateQuery.update).toHaveBeenNthCalledWith(2, { sort_order: 1 });
    expect(updateQuery.eq).toHaveBeenCalledWith("album_id", "album-id");
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/admin/gallery");
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/gallery");
  });

  it("deletes a gallery image row and storage object when Supabase is configured", async () => {
    actionMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    const imageQuery = createQueryResult({
      data: {
        id: "image-id",
        storage_path: "highlights/photo.jpg",
      },
      error: null,
    });
    const deleteQuery = createQueryResult({ data: null, error: null });
    const remove = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn((table: string) => {
      if (table === "gallery_images") {
        return imageQuery;
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    imageQuery.delete.mockReturnValue(deleteQuery);
    actionMocks.createSupabaseServerClient.mockResolvedValue({
      from,
      storage: {
        from: vi.fn(() => ({ remove })),
      },
    });

    await expect(deleteGalleryImage("image-id")).resolves.toEqual({ ok: true });

    expect(imageQuery.select).toHaveBeenCalledWith("id, storage_path");
    expect(imageQuery.eq).toHaveBeenCalledWith("id", "image-id");
    expect(remove).toHaveBeenCalledWith(["highlights/photo.jpg"]);
    expect(imageQuery.delete).toHaveBeenCalled();
    expect(deleteQuery.eq).toHaveBeenCalledWith("id", "image-id");
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/admin/gallery");
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/gallery");
  });

  it("publishes locally when Supabase is not configured", async () => {
    await expect(publishDraftContent()).resolves.toEqual({ ok: true });

    expect(actionMocks.createSupabaseServerClient).not.toHaveBeenCalled();
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/");
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/gallery");
    expect(actionMocks.revalidatePath).toHaveBeenCalledWith("/admin/settings");
  });

  it("returns an error when no configured draft exists to publish", async () => {
    actionMocks.getSupabaseConfig.mockReturnValue({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
      isConfigured: true,
    });

    const versionQuery = createQueryResult({ data: null, error: null });
    actionMocks.createSupabaseServerClient.mockResolvedValue({
      from: vi.fn((table: string) => {
        if (table === "content_versions") {
          return versionQuery;
        }
        throw new Error(`Unexpected table: ${table}`);
      }),
    });

    await expect(publishDraftContent()).resolves.toEqual({
      ok: false,
      message: "No draft to publish.",
    });
  });
});
