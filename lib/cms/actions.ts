"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseConfig } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import { fallbackCmsSnapshot } from "./fallback";
import { loadCmsSnapshotFromRows } from "./server";
import { buildGalleryStoragePath } from "./storage";
import type { WeddingContent } from "./types";

type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;
type ContentSectionUpsertRow = {
  version_id: string;
  section_key: string;
  language: "en" | "th";
  content: WeddingContent[keyof WeddingContent];
};
type CmsActionResult = {
  ok: boolean;
  message?: string;
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

export async function saveDraftContent(content: WeddingContent): Promise<CmsActionResult> {
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

export async function uploadGalleryImages(formData: FormData): Promise<CmsActionResult> {
  if (!getSupabaseConfig().isConfigured) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const albumId = String(formData.get("albumId") ?? "");
  const albumSlug = String(formData.get("albumSlug") ?? "album");
  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);

  if (!albumId || files.length === 0) {
    return { ok: false, message: "Select an album and at least one image." };
  }

  const supabase = await createSupabaseServerClient();
  const latestSortOrderResult = await supabase
    .from("gallery_images")
    .select("sort_order")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestSortOrderResult.error) {
    return { ok: false, message: latestSortOrderResult.error.message };
  }

  const latestSortOrder =
    typeof latestSortOrderResult.data?.sort_order === "number" ? latestSortOrderResult.data.sort_order : -1;
  const uploadedRows = [];

  for (const [index, file] of files.entries()) {
    if (!file.type.startsWith("image/")) {
      return { ok: false, message: `${file.name} is not an image.` };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { ok: false, message: `${file.name} is larger than 10MB.` };
    }

    const storagePath = buildGalleryStoragePath({
      albumSlug,
      fileName: file.name,
      now: Date.now() + index,
    });
    const uploadResult = await supabase.storage.from("wedding-gallery").upload(storagePath, file);

    if (uploadResult.error) {
      return { ok: false, message: uploadResult.error.message };
    }

    const { data } = supabase.storage.from("wedding-gallery").getPublicUrl(storagePath);
    uploadedRows.push({
      album_id: albumId,
      storage_path: storagePath,
      public_url: data.publicUrl,
      sort_order: latestSortOrder + index + 1,
      caption_en: "",
      caption_th: "",
      alt_en: "",
      alt_th: "",
      is_cover: false,
      status: "draft",
    });
  }

  const insertResult = await supabase.from("gallery_images").insert(uploadedRows);

  if (insertResult.error) {
    return { ok: false, message: insertResult.error.message };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");

  return { ok: true };
}

export async function uploadGalleryImagesAction(
  _previousState: CmsActionResult,
  formData: FormData,
): Promise<CmsActionResult> {
  const result = await uploadGalleryImages(formData);

  if (!result.ok) {
    return result;
  }

  return { ok: true, message: "Uploaded selected photos." };
}

export async function uploadGalleryImagesFromForm(formData: FormData): Promise<void> {
  await uploadGalleryImages(formData);
}

export async function saveGalleryImageOrder(albumId: string, orderedImageIds: string[]): Promise<CmsActionResult> {
  if (!getSupabaseConfig().isConfigured) {
    return { ok: true };
  }

  if (!albumId || orderedImageIds.length === 0) {
    return { ok: false, message: "Select an album and at least one image." };
  }

  const supabase = await createSupabaseServerClient();

  for (const [index, id] of orderedImageIds.entries()) {
    const updateResult = await supabase
      .from("gallery_images")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("album_id", albumId);

    if (updateResult.error) {
      return { ok: false, message: updateResult.error.message };
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");

  return { ok: true };
}

export async function publishDraftContent(): Promise<CmsActionResult> {
  if (!getSupabaseConfig().isConfigured) {
    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/settings");

    return { ok: true };
  }

  const supabase = await createSupabaseServerClient();
  const draftResult = await supabase.from("content_versions").select("id").eq("status", "draft").maybeSingle();

  if (draftResult.error) {
    return { ok: false, message: draftResult.error.message };
  }

  if (!draftResult.data?.id) {
    return { ok: false, message: "No draft to publish." };
  }

  const publishedVersionResult = await supabase
    .from("content_versions")
    .insert({ status: "published", published_at: new Date().toISOString() })
    .select("id")
    .single();

  if (publishedVersionResult.error || !publishedVersionResult.data?.id) {
    return {
      ok: false,
      message: publishedVersionResult.error?.message ?? "Unable to create published content version.",
    };
  }

  const draftSectionsResult = await supabase
    .from("content_sections")
    .select("section_key, language, content")
    .eq("version_id", draftResult.data.id);

  if (draftSectionsResult.error) {
    return { ok: false, message: draftSectionsResult.error.message };
  }

  const publishedSections = (draftSectionsResult.data ?? []).map((section) => ({
    version_id: publishedVersionResult.data.id,
    section_key: section.section_key,
    language: section.language,
    content: section.content,
  }));

  if (publishedSections.length > 0) {
    const sectionWriteResult = await supabase.from("content_sections").insert(publishedSections);

    if (sectionWriteResult.error) {
      return { ok: false, message: sectionWriteResult.error.message };
    }
  }

  const albumResult = await supabase.from("gallery_albums").update({ status: "published" }).eq("status", "draft");

  if (albumResult.error) {
    return { ok: false, message: albumResult.error.message };
  }

  const imageResult = await supabase.from("gallery_images").update({ status: "published" }).eq("status", "draft");

  if (imageResult.error) {
    return { ok: false, message: imageResult.error.message };
  }

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/settings");

  return { ok: true };
}

export async function publishDraftContentFromForm(): Promise<void> {
  await publishDraftContent();
}
