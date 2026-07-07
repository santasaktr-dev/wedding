type GalleryStoragePathInput = {
  albumSlug: string;
  fileName: string;
  now?: number;
};

const allowedImageExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

function slugifyValue(value: string, fallback: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
}

export function slugifyFileName(fileName: string): string {
  const lower = fileName.trim().toLowerCase();
  const extensionMatch = lower.match(/\.([a-z0-9]+)$/);
  const candidateExtension = extensionMatch?.[1];
  const extension =
    candidateExtension && allowedImageExtensions.has(candidateExtension) ? candidateExtension : "jpg";
  const baseName = extensionMatch ? lower.slice(0, -extensionMatch[0].length) : lower;
  const slug = slugifyValue(baseName, "image").slice(0, 80);

  return `${slug}.${extension}`;
}

export function buildGalleryStoragePath({
  albumSlug,
  fileName,
  now = Date.now(),
}: GalleryStoragePathInput): string {
  return `${slugifyValue(albumSlug, "album")}/${now}-${slugifyFileName(fileName)}`;
}
