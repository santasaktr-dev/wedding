"use client";

import Image from "next/image";

import type { GalleryImage } from "../../../lib/cms/types";
import { getLocalizedText } from "../../../lib/cms/validation";

type ImageGridProps = {
  images: GalleryImage[];
  isDeleting?: boolean;
  onDelete: (image: GalleryImage) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

export function ImageGrid({ images, isDeleting = false, onDelete, onMove }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="border border-dashed border-[#d6c8a5] bg-[#fbf8f0] p-6 text-sm text-[#3e4d3a]">
        No images in this album yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => {
        const caption = getLocalizedText(image.caption, "en");
        const alt = getLocalizedText(image.alt, "en") || caption;

        return (
          <article className="border border-[#d6c8a5] bg-white p-3" key={image.id}>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#0a1f44]/10">
              <Image alt={alt} className="object-contain" fill sizes="(min-width: 1024px) 25vw, 50vw" src={image.publicUrl} />
            </div>
            <div className="mt-3">
              <p className="text-sm font-semibold text-[#0a1f44]">{caption}</p>
              <p className="mt-1 text-xs text-[#3e4d3a]">Sort order {image.sortOrder + 1}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="border border-[#d6c8a5] px-2 py-2 text-xs font-semibold text-[#0a1f44] transition hover:border-[#0a1f44] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={index === 0}
                onClick={() => onMove(index, index - 1)}
                type="button"
              >
                Move up
              </button>
              <button
                className="border border-[#d6c8a5] px-2 py-2 text-xs font-semibold text-[#0a1f44] transition hover:border-[#0a1f44] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={index === images.length - 1}
                onClick={() => onMove(index, index + 1)}
                type="button"
              >
                Move down
              </button>
              <button
                aria-label={`Delete ${caption || alt || "image"}`}
                className="col-span-2 border border-[#8d2f2f] px-2 py-2 text-xs font-semibold text-[#8d2f2f] transition hover:bg-[#8d2f2f] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                disabled={isDeleting}
                onClick={() => onDelete(image)}
                type="button"
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
