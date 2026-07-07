import { getSupabaseConfig } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import { fallbackCmsSnapshot } from "./fallback";
import type { CmsSnapshot, CmsStatus, GalleryAlbum, GalleryImage, WeddingContent } from "./types";

type ContentVersionRow = {
  id: string;
  status: CmsStatus;
  updated_at: string | null;
  published_at: string | null;
};

type ContentSectionRow = {
  section_key: string;
  language: "en" | "th";
  content: unknown;
};

type GalleryAlbumRow = {
  id: string;
  slug: string;
  status: CmsStatus;
  sort_order: number;
  cover_image_id: string | null;
  label_en: string;
  label_th: string;
  title_en: string;
  title_th: string;
  description_en: string;
  description_th: string;
};

type GalleryImageRow = {
  id: string;
  album_id: string;
  storage_path: string;
  public_url: string;
  sort_order: number;
  caption_en: string;
  caption_th: string;
  alt_en: string;
  alt_th: string;
  is_cover: boolean;
  status: CmsStatus;
};

type CmsRows = {
  version?: ContentVersionRow | null;
  sections: ContentSectionRow[];
  albums: GalleryAlbumRow[];
  images: GalleryImageRow[];
};

const defaultAdminGalleryAlbum: GalleryAlbumRow = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "highlights",
  status: "draft",
  sort_order: 0,
  cover_image_id: null,
  label_en: "Gallery",
  label_th: "แกลเลอรี",
  title_en: "Highlights",
  title_th: "ไฮไลต์",
  description_en: "Upload wedding photos here before publishing them.",
  description_th: "อัปโหลดรูปงานแต่งไว้ที่นี่ก่อนเผยแพร่",
};

const contentSectionKeyMap = {
  navigation: "navigation",
  hero: "hero",
  event_info: "eventInfo",
  eventInfo: "eventInfo",
  schedule: "schedule",
  location: "location",
  dress_code: "dressCode",
  dressCode: "dressCode",
  rsvp: "rsvp",
  gallery: "gallery",
  faq: "faq",
  contact: "contact",
  footer: "footer",
} satisfies Record<string, keyof WeddingContent>;

function cloneFallbackContent(): WeddingContent {
  return structuredClone(fallbackCmsSnapshot.content) as WeddingContent;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getWeddingContentKey(key: string): keyof WeddingContent | undefined {
  if (key in contentSectionKeyMap) {
    return contentSectionKeyMap[key as keyof typeof contentSectionKeyMap];
  }

  return key in fallbackCmsSnapshot.content ? (key as keyof WeddingContent) : undefined;
}

function mergeSectionContent(content: WeddingContent, section: ContentSectionRow) {
  const key = getWeddingContentKey(section.section_key);
  if (!key || !isObjectRecord(section.content)) {
    return;
  }

  content[key] = {
    ...(content[key] as object),
    ...section.content,
  } as never;
}

function mapGalleryImage(image: GalleryImageRow): GalleryImage {
  return {
    id: image.id,
    albumId: image.album_id,
    storagePath: image.storage_path,
    publicUrl: image.public_url,
    caption: { en: image.caption_en, th: image.caption_th },
    alt: { en: image.alt_en, th: image.alt_th },
    sortOrder: image.sort_order,
    isCover: image.is_cover,
    status: image.status,
  };
}

function mapGalleryAlbum(album: GalleryAlbumRow, images: GalleryImage[]): GalleryAlbum {
  return {
    id: album.id,
    slug: album.slug,
    status: album.status,
    sortOrder: album.sort_order,
    ...(album.cover_image_id ? { coverImageId: album.cover_image_id } : {}),
    label: { en: album.label_en, th: album.label_th },
    title: { en: album.title_en, th: album.title_th },
    description: { en: album.description_en, th: album.description_th },
    images,
  };
}

export function loadCmsSnapshotFromRows({ version, sections, albums, images }: CmsRows): CmsSnapshot {
  if (!version && sections.length === 0 && albums.length === 0 && images.length === 0) {
    return fallbackCmsSnapshot;
  }

  const content = cloneFallbackContent();
  sections.forEach((section) => mergeSectionContent(content, section));

  const imagesByAlbum = new Map<string, GalleryImage[]>();
  images.map(mapGalleryImage).forEach((image) => {
    const albumImages = imagesByAlbum.get(image.albumId) ?? [];
    albumImages.push(image);
    imagesByAlbum.set(image.albumId, albumImages);
  });

  const mappedAlbums = albums
    .map((album) =>
      mapGalleryAlbum(
        album,
        (imagesByAlbum.get(album.id) ?? []).toSorted((first, second) => first.sortOrder - second.sortOrder),
      ),
    )
    .toSorted((first, second) => first.sortOrder - second.sortOrder);

  return {
    id: version?.id ?? fallbackCmsSnapshot.id,
    status: version?.status ?? fallbackCmsSnapshot.status,
    updatedAt: version?.updated_at ?? fallbackCmsSnapshot.updatedAt,
    ...(version?.published_at ? { publishedAt: version.published_at } : { publishedAt: fallbackCmsSnapshot.publishedAt }),
    content,
    albums: mappedAlbums.length > 0 ? mappedAlbums : fallbackCmsSnapshot.albums,
  };
}

export async function getPublishedCmsSnapshot(): Promise<CmsSnapshot> {
  if (!getSupabaseConfig().isConfigured) {
    return fallbackCmsSnapshot;
  }

  const supabase = await createSupabaseServerClient();
  const [versionResult, albumsResult, imagesResult] = await Promise.all([
    supabase
      .from("content_versions")
      .select("id, status, updated_at, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("gallery_albums").select("*").eq("status", "published").order("sort_order"),
    supabase.from("gallery_images").select("*").eq("status", "published").order("sort_order"),
  ]);

  if (versionResult.error || albumsResult.error || imagesResult.error) {
    return fallbackCmsSnapshot;
  }

  const version = versionResult.data;
  const albums = albumsResult.data;
  const images = imagesResult.data;

  const sectionsResult = version?.id
    ? await supabase.from("content_sections").select("section_key, language, content").eq("version_id", version.id)
    : { data: [], error: null };

  if (sectionsResult.error) {
    return fallbackCmsSnapshot;
  }

  return loadCmsSnapshotFromRows({
    version: version as ContentVersionRow | null,
    sections: (sectionsResult.data ?? []) as ContentSectionRow[],
    albums: (albums ?? []) as GalleryAlbumRow[],
    images: (images ?? []) as GalleryImageRow[],
  });
}

export async function getPublicWeddingContent(): Promise<WeddingContent> {
  const snapshot = await getPublishedCmsSnapshot();

  return snapshot.content;
}

export async function getPublicGalleryAlbums(): Promise<GalleryAlbum[]> {
  const snapshot = await getPublishedCmsSnapshot();

  return snapshot.albums;
}

export async function getAdminGalleryAlbums(): Promise<GalleryAlbum[]> {
  if (!getSupabaseConfig().isConfigured) {
    return fallbackCmsSnapshot.albums;
  }

  const supabase = await createSupabaseServerClient();
  const albumsResult = await supabase.from("gallery_albums").select("*").order("sort_order");

  if (albumsResult.error) {
    return fallbackCmsSnapshot.albums;
  }

  let albums = (albumsResult.data ?? []) as GalleryAlbumRow[];

  if (albums.length === 0) {
    const createAlbumResult = await supabase
      .from("gallery_albums")
      .insert(defaultAdminGalleryAlbum)
      .select("*")
      .single();

    if (createAlbumResult.error || !createAlbumResult.data) {
      return fallbackCmsSnapshot.albums;
    }

    albums = [createAlbumResult.data as GalleryAlbumRow];
  }

  const imagesResult = await supabase.from("gallery_images").select("*").order("sort_order");

  if (imagesResult.error) {
    return fallbackCmsSnapshot.albums;
  }

  return loadCmsSnapshotFromRows({
    sections: [],
    albums,
    images: (imagesResult.data ?? []) as GalleryImageRow[],
  }).albums;
}
