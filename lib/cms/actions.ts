"use server";

import { revalidatePath } from "next/cache";

import { fallbackCmsSnapshot } from "./fallback";
import type { WeddingContent } from "./types";

let inMemoryDraftContent: WeddingContent = structuredClone(fallbackCmsSnapshot.content) as WeddingContent;

export async function getDraftContentForAdmin(): Promise<WeddingContent> {
  return structuredClone(inMemoryDraftContent) as WeddingContent;
}

export async function saveDraftContent(content: WeddingContent): Promise<{ ok: boolean }> {
  inMemoryDraftContent = structuredClone(content) as WeddingContent;
  revalidatePath("/admin/content");

  return { ok: true };
}
