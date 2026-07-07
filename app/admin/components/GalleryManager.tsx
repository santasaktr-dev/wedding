"use client";

import { useMemo, useState } from "react";

import { moveItem, normalizeSortOrder } from "../../../lib/cms/reorder";
import type { GalleryAlbum } from "../../../lib/cms/types";
import { getLocalizedText } from "../../../lib/cms/validation";
import { ImageGrid } from "./ImageGrid";
import { StatusBanner } from "./StatusBanner";

type GalleryManagerProps = {
  initialAlbums: GalleryAlbum[];
};

export function GalleryManager({ initialAlbums }: GalleryManagerProps) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [selectedAlbumId, setSelectedAlbumId] = useState(initialAlbums[0]?.id ?? "");
  const selectedAlbum = useMemo(
    () => albums.find((album) => album.id === selectedAlbumId) ?? albums[0],
    [albums, selectedAlbumId],
  );

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (!selectedAlbum) {
      return;
    }

    const reordered = normalizeSortOrder(moveItem(selectedAlbum.images, fromIndex, toIndex));
    setAlbums((current) =>
      current.map((album) => (album.id === selectedAlbum.id ? { ...album, images: reordered } : album)),
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border border-[#d6c8a5] bg-[#fffdf7] p-4">
        <div className="mb-4">
          <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">Gallery</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0a1f44]">Albums</h2>
        </div>

        <nav aria-label="Gallery albums" className="grid gap-2">
          {albums.map((album) => {
            const isActive = selectedAlbum?.id === album.id;

            return (
              <button
                className={`border px-3 py-3 text-left transition ${
                  isActive
                    ? "border-[#0a1f44] bg-[#0a1f44] text-white"
                    : "border-[#d6c8a5] bg-white text-[#0a1f44] hover:border-[#0a1f44]"
                }`}
                key={album.id}
                onClick={() => setSelectedAlbumId(album.id)}
                type="button"
              >
                <span className="block text-sm font-semibold">{getLocalizedText(album.title, "en")}</span>
                <span className={`mt-1 block text-xs ${isActive ? "text-white/75" : "text-[#3e4d3a]"}`}>
                  {album.images.length} photos
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="border border-[#d6c8a5] bg-[#fffdf7] p-5 shadow-[0_18px_50px_rgba(10,31,68,0.08)] sm:p-7">
        {selectedAlbum ? (
          <>
            <div className="mb-5 flex flex-col gap-3 border-b border-[#d6c8a5] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">
                  {getLocalizedText(selectedAlbum.label, "en")}
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-[#0a1f44]">
                  {getLocalizedText(selectedAlbum.title, "en")}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#3e4d3a]">
                  {getLocalizedText(selectedAlbum.description, "en")}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#0a1f44]">{selectedAlbum.images.length} photos</p>
            </div>

            <div className="mb-5">
              <StatusBanner tone="info">
                Upload and publish actions are connected in the next task. Reordering here is local preview behavior.
              </StatusBanner>
            </div>

            <ImageGrid images={selectedAlbum.images} onMove={moveImage} />
          </>
        ) : (
          <StatusBanner tone="info">No albums yet.</StatusBanner>
        )}
      </section>
    </div>
  );
}
