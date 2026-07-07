type GalleryStoragePathInput = {
  albumSlug: string;
  fileName: string;
  now?: number;
};

export function slugifyFileName(fileName: string): string {
  const trimmedName = fileName.trim();
  const extensionMatch = trimmedName.match(/\.([^.]+)$/);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "";
  const baseName = extensionMatch ? trimmedName.slice(0, -extensionMatch[0].length) : trimmedName;
  const slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return extension ? `${slug}.${extension}` : slug;
}

export function buildGalleryStoragePath({
  albumSlug,
  fileName,
  now = Date.now(),
}: GalleryStoragePathInput): string {
  return `${albumSlug}/${now}-${slugifyFileName(fileName)}`;
}
