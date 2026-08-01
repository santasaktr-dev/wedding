export const MAX_GALLERY_IMAGE_EDGE = 2560;
export const GALLERY_IMAGE_WEBP_QUALITY = 0.85;

export function getPreparedImageDimensions(width: number, height: number) {
  const scale = Math.min(1, MAX_GALLERY_IMAGE_EDGE / Math.max(width, height));

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

export async function prepareGalleryImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const dimensions = getPreparedImageDimensions(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("Your browser could not prepare this image.");
  }

  context.drawImage(bitmap, 0, 0, dimensions.width, dimensions.height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error("Unable to prepare this image."))),
      "image/webp",
      GALLERY_IMAGE_WEBP_QUALITY,
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}
