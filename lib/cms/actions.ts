"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseConfig } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import { fallbackCmsSnapshot } from "./fallback";
import { loadCmsSnapshotFromRows } from "./server";
import type { WeddingContent } from "./types";

type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type ContentSectionUpsertRow = {
  version_id: string;
  section_key: string;
  language: "en" | "th";
  content: WeddingContent[keyof WeddingContent];
};

let fallbackDraftContent: WeddingContent = structuredClone(fallbackCmsSnapshot.content) as WeddingContent;

async function getOrCreateDraftVersionId(supabase: SupabaseClient): Promise<string> {
  const existingResult = await supabase
    .from("content_versions")
    .select("id")
    .eq("status", "draft")
    .maybeSingle();

  if (existingResult.error) {
    throw existingResult.error;
  }

  if (existingResult.data?.id) {
    return existingResult.data.id as string;
  }

  const insertResult = await supabase.from("content_versions").insert({ status: "draft" }).select("id").single();

  if (insertResult.error || !insertResult.data?.id) {
    throw insertResult.error ?? new Error("Unable to create draft content version.");
  }

  return insertResult.data.id as string;
}

function cloneContent(content: WeddingContent): WeddingContent {
  return structuredClone(content) as WeddingContent;
}

function createSectionRows(versionId: string, content: WeddingContent): ContentSectionUpsertRow[] {
  return Object.entries(content).flatMap(([sectionKey, sectionContent]) =>
    (["en", "th"] as const).map((language) => ({
      version_id: versionId,
      section_key: sectionKey,
      language,
      content: sectionContent,
    })),
  );
}

export async function getDraftContentForAdmin(): Promise<WeddingContent> {
  if (!getSupabaseConfig().isConfigured) {
    return cloneContent(fallbackDraftContent);
  }

  const supabase = await createSupabaseServerClient();
  const versionResult = await supabase
    .from("content_versions")
    .select("id, status, updated_at, published_at")
    .eq("status", "draft")
    .maybeSingle();

  if (versionResult.error || !versionResult.data?.id) {
    return cloneContent(fallbackCmsSnapshot.content);
  }

  const sectionsResult = await supabase
    .from("content_sections")
    .select("section_key, language, content")
    .eq("version_id", versionResult.data.id);

  if (sectionsResult.error || !sectionsResult.data || sectionsResult.data.length === 0) {
    return cloneContent(fallbackCmsSnapshot.content);
  }

  return loadCmsSnapshotFromRows({
    version: versionResult.data,
    sections: sectionsResult.data,
    albums: [],
    images: [],
  }).content;
}

export async function saveDraftContent(content: WeddingContent): Promise<{ ok: boolean }> {
  if (!getSupabaseConfig().isConfigured) {
    fallbackDraftContent = cloneContent(content);
    revalidatePath("/admin/content");

    return { ok: true };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const versionId = await getOrCreateDraftVersionId(supabase);
    const sectionRows = createSectionRows(versionId, content);
    const upsertResult = await supabase.from("content_sections").upsert(sectionRows, {
      onConflict: "version_id,section_key,language",
    });

    if (upsertResult.error) {
      return { ok: false };
    }

    await supabase.from("content_versions").update({ updated_at: new Date().toISOString() }).eq("id", versionId);
    revalidatePath("/admin/content");

    return { ok: true };
  } catch {
    return { ok: false };
  }
}
