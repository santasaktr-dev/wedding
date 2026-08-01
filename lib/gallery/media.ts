export const GALLERY_PAGE_SIZE = 24;

export function getGalleryThumbnailUrl(publicUrl: string) {
  if (!/^https?:\/\//i.test(publicUrl)) {
    return publicUrl;
  }

  const url = new URL(publicUrl);
  url.pathname = url.pathname.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  url.search = "width=720&quality=75&format=webp";
  return url.toString();
}
