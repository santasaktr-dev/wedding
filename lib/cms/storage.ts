type GalleryStoragePathInput = {
  albumSlug: string;
  fileName: string;
  now?: number;
};

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
  const trimmedName = fileName.trim();
  const extensionMatch = trimmedName.match(/\.([^.]+)$/);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "jpg";
  const baseName = extensionMatch ? trimmedName.slice(0, -extensionMatch[0].length) : trimmedName;
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
