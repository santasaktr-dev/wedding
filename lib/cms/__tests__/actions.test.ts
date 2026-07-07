import { beforeEach, describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../fallback";
import { getDraftContentForAdmin, saveDraftContent } from "../actions";

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
    maybeSingle: vi.fn(() => promise),
    single: vi.fn(() => promise),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
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
});
