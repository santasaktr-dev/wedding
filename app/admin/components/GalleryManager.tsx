"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteGalleryImage, saveGalleryImageOrder, uploadGalleryImages } from "../../../lib/cms/actions";
import { moveItem, normalizeSortOrder } from "../../../lib/cms/reorder";
import type { GalleryAlbum, GalleryImage } from "../../../lib/cms/types";
import { getLocalizedText } from "../../../lib/cms/validation";
import { ImageGrid } from "./ImageGrid";
import { StatusBanner } from "./StatusBanner";

type GalleryManagerProps = {
  initialAlbums: GalleryAlbum[];
};

export function GalleryManager({ initialAlbums }: GalleryManagerProps) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [selectedAlbumId, setSelectedAlbumId] = useState(initialAlbums[0]?.id ?? "");
  const [uploadState, setUploadState] = useState<{ ok: boolean; message?: string } | null>(null);
  const [deleteState, setDeleteState] = useState<{ ok: boolean; message?: string } | null>(null);
  const [isUploadPending, startUploadTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const router = useRouter();
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
    void saveGalleryImageOrder(
      selectedAlbum.id,
      reordered.map((image) => image.id),
    );
  };

  const uploadImages = (files: FileList | null) => {
    if (!selectedAlbum || !files || files.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.set("albumId", selectedAlbum.id);
    formData.set("albumSlug", selectedAlbum.slug);
    Array.from(files).forEach((file) => formData.append("images", file));

    startUploadTransition(async () => {
      const result = await uploadGalleryImages(formData);

      if (!result.ok) {
        setUploadState(result);
        return;
      }

      const uploadedCount = result.uploadedCount ?? files.length;
      setUploadState({
        ok: true,
        message: uploadedCount === 1 ? "Uploaded 1 photo." : `Uploaded ${uploadedCount} photos.`,
      });
      router.refresh();
    });
  };

  const deleteImage = (image: GalleryImage) => {
    const caption = getLocalizedText(image.caption, "en") || getLocalizedText(image.alt, "en") || "this image";

    if (!window.confirm(`Delete ${caption}?`)) {
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteGalleryImage(image.id);

      if (!result.ok) {
        setDeleteState(result);
        return;
      }

      setAlbums((current) =>
        current.map((album) =>
          album.id === image.albumId
            ? { ...album, images: album.images.filter((albumImage) => albumImage.id !== image.id) }
            : album,
        ),
      );
      setDeleteState({ ok: true, message: "Deleted selected photo." });
      router.refresh();
    });
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
                Uploaded images are saved as draft. Use Settings to publish when the album is ready.
              </StatusBanner>
            </div>

            {uploadState?.message ? (
              <div className="mb-5">
                <StatusBanner tone={uploadState.ok ? "success" : "error"}>{uploadState.message}</StatusBanner>
              </div>
            ) : null}

            {deleteState?.message ? (
              <div className="mb-5">
                <StatusBanner tone={deleteState.ok ? "success" : "error"}>{deleteState.message}</StatusBanner>
              </div>
            ) : null}

            <div className="mb-5 border border-dashed border-[#d6c8a5] bg-white p-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#0a1f44]">Upload photos</span>
                <input
                  accept="image/*"
                  className="block w-full text-sm text-[#3e4d3a] file:mr-4 file:border-0 file:bg-[#0a1f44] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#fbf8f0]"
                  disabled={isUploadPending}
                  multiple
                  name="images"
                  onChange={(event) => {
                    uploadImages(event.currentTarget.files);
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
                <span className="mt-2 block text-xs leading-5 text-[#3e4d3a]">
                  {isUploadPending
                    ? "Uploading selected photos..."
                    : "Select one or more photos to upload automatically. Each photo can be up to 30MB, with about 100MB per upload."}
                </span>
              </label>
            </div>

            <ImageGrid
              images={selectedAlbum.images}
              isDeleting={isDeletePending}
              onDelete={deleteImage}
              onMove={moveImage}
            />
          </>
        ) : (
          <StatusBanner tone="info">No albums yet.</StatusBanner>
        )}
      </section>
    </div>
  );
}
