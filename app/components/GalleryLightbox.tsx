"use client";

import { useEffect, useState } from "react";

type GalleryImage = { id: string; src: string; alt: string; caption: string };

export function GalleryLightbox({ images, testId }: { images: GalleryImage[]; testId?: string }) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((value) => (value === null ? 0 : (value + 1) % images.length));
      if (event.key === "ArrowLeft") setSelected((value) => (value === null ? 0 : (value - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [images.length, selected]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3" data-testid={testId}>
        {images.map((image, index) => (
          <button
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded border border-[#0A1F44]/10 bg-white text-left shadow-[0_18px_50px_rgba(10,31,68,0.1)]"
            key={image.id}
            onClick={() => setSelected(index)}
            type="button"
          >
            <img alt={image.alt} className="h-auto w-full transition duration-500 group-hover:scale-[1.015]" loading={index < 4 ? "eager" : "lazy"} src={image.src} />
            {image.caption ? <span className="luxury-heading block border-t border-[#0A1F44]/10 bg-[#FBF8F0] px-4 py-3 text-left text-xs font-semibold text-[#7C5C3B]">{image.caption}</span> : null}
          </button>
        ))}
      </div>
      {selected !== null ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0A1F44]/90 p-4" onClick={() => setSelected(null)} role="dialog" aria-modal="true">
          <button aria-label="Close image" className="absolute right-4 top-4 rounded px-3 py-2 text-2xl text-white" onClick={() => setSelected(null)} type="button">×</button>
          <button aria-label="Previous image" className="absolute left-3 rounded px-3 py-3 text-3xl text-white" onClick={(event) => { event.stopPropagation(); setSelected((selected - 1 + images.length) % images.length); }} type="button">‹</button>
          <figure className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img alt={images[selected].alt} className="max-h-[82vh] w-auto max-w-full object-contain" src={images[selected].src} />
            {images[selected].caption ? <figcaption className="mt-3 text-center text-sm text-[#D6C8A5]">{images[selected].caption}</figcaption> : null}
          </figure>
          <button aria-label="Next image" className="absolute right-3 rounded px-3 py-3 text-3xl text-white" onClick={(event) => { event.stopPropagation(); setSelected((selected + 1) % images.length); }} type="button">›</button>
        </div>
      ) : null}
    </>
  );
}
