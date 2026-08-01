"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createGalleryAlbum, deleteGalleryAlbum, deleteGalleryAlbumImages, deleteGalleryImage, saveGalleryAlbumOrder, saveGalleryImageOrder, updateGalleryAlbumTitles, uploadGalleryImages } from "../../../lib/cms/actions";
import { moveItem, moveItemById, normalizeSortOrder } from "../../../lib/cms/reorder";
import type { GalleryAlbum, GalleryImage } from "../../../lib/cms/types";
import { getLocalizedText } from "../../../lib/cms/validation";
import { ImageGrid } from "./ImageGrid";
import { StatusBanner } from "./StatusBanner";
import { prepareGalleryImage } from "../lib/prepare-gallery-image";
import { runWithConcurrency } from "../lib/upload-queue";

type GalleryManagerProps = {
  initialAlbums: GalleryAlbum[];
};

export function GalleryManager({ initialAlbums }: GalleryManagerProps) {
  const visibleInitialAlbums = initialAlbums.filter((album) => album.slug !== "highlights" || album.images.length > 0);
  const [albums, setAlbums] = useState(visibleInitialAlbums);
  const [selectedAlbumId, setSelectedAlbumId] = useState(visibleInitialAlbums[0]?.id ?? "");
  const [uploadState, setUploadState] = useState<{ ok: boolean; message?: string } | null>(null);
  const [deleteState, setDeleteState] = useState<{ ok: boolean; message?: string } | null>(null);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [albumTitleEn, setAlbumTitleEn] = useState("");
  const [albumTitleTh, setAlbumTitleTh] = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<GalleryImage[] | null>(null);
  const [isSortSaving, setIsSortSaving] = useState(false);
  const [isAlbumSorting, setIsAlbumSorting] = useState(false);
  const [pendingAlbums, setPendingAlbums] = useState<GalleryAlbum[] | null>(null);
  const [isAlbumSortSaving, setIsAlbumSortSaving] = useState(false);
  const [isEditingAlbum, setIsEditingAlbum] = useState(false);
  const [editTitleEn, setEditTitleEn] = useState("");
  const [editTitleTh, setEditTitleTh] = useState("");
  const [isUploadPending, startUploadTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const router = useRouter();
  const selectedAlbum = useMemo(
    () => albums.find((album) => album.id === selectedAlbumId) ?? albums[0],
    [albums, selectedAlbumId],
  );
  const displayedAlbums = isAlbumSorting ? pendingAlbums ?? albums : albums;

  const moveAlbum = (fromIndex: number, toIndex: number) => setPendingAlbums(moveItem(displayedAlbums, fromIndex, toIndex).map((album, index) => ({ ...album, sortOrder: index })));
  const saveAlbumSorting = async () => {
    if (!pendingAlbums) return;
    setIsAlbumSortSaving(true);
    const result = await saveGalleryAlbumOrder(pendingAlbums.map((album) => album.id));
    setIsAlbumSortSaving(false);
    if (!result.ok) {
      setDeleteState({ ok: false, message: result.message ?? "Unable to save album order." });
      return;
    }
    setAlbums(pendingAlbums);
    setPendingAlbums(null);
    setIsAlbumSorting(false);
    setDeleteState({ ok: true, message: "Album order saved." });
    router.refresh();
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (!selectedAlbum) {
      return;
    }

    const sourceImages = isSorting ? pendingOrder ?? selectedAlbum.images : selectedAlbum.images;
    const reordered = normalizeSortOrder(moveItem(sourceImages, fromIndex, toIndex));
    if (isSorting) {
      setPendingOrder(reordered);
      return;
    }
    setAlbums((current) =>
      current.map((album) => (album.id === selectedAlbum.id ? { ...album, images: reordered } : album)),
    );
    void saveGalleryImageOrder(
      selectedAlbum.id,
      reordered.map((image) => image.id),
    );
  };

  const reorderImage = (activeId: string, overId: string) => {
    if (!selectedAlbum) {
      return;
    }

    const sourceImages = isSorting ? pendingOrder ?? selectedAlbum.images : selectedAlbum.images;
    const reordered = normalizeSortOrder(moveItemById(sourceImages, activeId, overId));

    if (reordered.map((image) => image.id).join(",") === sourceImages.map((image) => image.id).join(",")) {
      return;
    }

    if (isSorting) {
      setPendingOrder(reordered);
      return;
    }

    setAlbums((current) =>
      current.map((album) => (album.id === selectedAlbum.id ? { ...album, images: reordered } : album)),
    );
    void saveGalleryImageOrder(
      selectedAlbum.id,
      reordered.map((image) => image.id),
    );
  };

  const startSorting = () => {
    if (!selectedAlbum || selectedAlbum.images.length < 2) return;
    setPendingOrder(selectedAlbum.images);
    setIsSorting(true);
  };

  const cancelSorting = () => {
    setPendingOrder(null);
    setIsSorting(false);
  };

  const saveSorting = async () => {
    if (!selectedAlbum || !pendingOrder) return;
    setIsSortSaving(true);
    const result = await saveGalleryImageOrder(selectedAlbum.id, pendingOrder.map((image) => image.id));
    setIsSortSaving(false);
    if (!result.ok) {
      setDeleteState({ ok: false, message: result.message ?? "Unable to save photo order." });
      return;
    }
    setAlbums((current) => current.map((album) => (album.id === selectedAlbum.id ? { ...album, images: pendingOrder } : album)));
    setPendingOrder(null);
    setIsSorting(false);
    setDeleteState({ ok: true, message: "Photo order saved." });
    router.refresh();
  };

  const uploadImages = (files: FileList | null) => {
    if (!selectedAlbum || !files || files.length === 0) {
      return;
    }

    startUploadTransition(async () => {
      setUploadState({ ok: true, message: "Preparing photos..." });
      const prepared = await Promise.all(Array.from(files).map(prepareGalleryImage));
      const results = await runWithConcurrency(
        prepared.map((file) => async () => {
          const formData = new FormData();
          formData.set("albumId", selectedAlbum.id);
          formData.set("albumSlug", selectedAlbum.slug);
          formData.append("images", file);
          return uploadGalleryImages(formData);
        }),
        3,
      );
      const failed = results.find((result) => !result.ok);
      const uploadedCount = results.reduce((total, result) => total + (result.uploadedCount ?? 0), 0);

      if (failed) {
        setUploadState({ ok: false, message: `${uploadedCount} uploaded. ${failed.message ?? "Some photos could not be uploaded."}` });
        router.refresh();
        return;
      }

      setUploadState({
        ok: true,
        message: uploadedCount === 1 ? "Uploaded 1 photo." : `Uploaded ${uploadedCount} photos.`,
      });
      router.refresh();
    });
  };

  const createAlbum = () => {
    const titleEn = albumTitleEn.trim();
    const titleTh = albumTitleTh.trim();
    if (!titleEn || !titleTh) return;

    setIsCreatingAlbum(true);
    void createGalleryAlbum({
      slug: titleEn,
      labelEn: "Gallery",
      labelTh: "แกลเลอรี",
      titleEn,
      titleTh,
      descriptionEn: "",
      descriptionTh: "",
    }).then((result) => {
      setIsCreatingAlbum(false);
      if (!result.ok || !result.album) {
        setUploadState({ ok: false, message: result.message ?? "Unable to create album." });
        return;
      }
      setAlbums((current) => [...current, result.album!]);
      setSelectedAlbumId(result.album.id);
      setAlbumTitleEn("");
      setAlbumTitleTh("");
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

  const deleteAllImages = () => {
    if (!selectedAlbum || selectedAlbum.images.length === 0) {
      return;
    }

    if (!window.confirm(`Delete all ${selectedAlbum.images.length} photos in this album? This cannot be undone.`)) {
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteGalleryAlbumImages(selectedAlbum.id);
      if (!result.ok) {
        setDeleteState(result);
        return;
      }

      setAlbums((current) =>
        current.map((album) => (album.id === selectedAlbum.id ? { ...album, images: [] } : album)),
      );
      setDeleteState({ ok: true, message: `${result.deletedCount ?? 0} photos deleted.` });
      router.refresh();
    });
  };

  const deleteAlbum = () => {
    if (!selectedAlbum || !window.confirm(`Delete album “${getLocalizedText(selectedAlbum.title, "en")}” and all ${selectedAlbum.images.length} photos? This cannot be undone.`)) return;
    startDeleteTransition(async () => {
      const result = await deleteGalleryAlbum(selectedAlbum.id);
      if (!result.ok) {
        setDeleteState(result);
        return;
      }
      const remainingAlbums = albums.filter((album) => album.id !== selectedAlbum.id);
      setAlbums(remainingAlbums);
      setSelectedAlbumId(remainingAlbums[0]?.id ?? "");
      setDeleteState({ ok: true, message: "Album deleted." });
      router.refresh();
    });
  };

  const saveAlbumTitles = async () => {
    if (!selectedAlbum) return;
    const result = await updateGalleryAlbumTitles(selectedAlbum.id, editTitleEn, editTitleTh);
    if (!result.ok) {
      setDeleteState({ ok: false, message: result.message ?? "Unable to save album name." });
      return;
    }
    setAlbums((current) => current.map((album) => album.id === selectedAlbum.id ? { ...album, title: { en: editTitleEn.trim(), th: editTitleTh.trim() } } : album));
    setIsEditingAlbum(false);
    setDeleteState({ ok: true, message: "Album name saved." });
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border border-[#d6c8a5] bg-[#fffdf7] p-4">
        <div className="mb-4">
          <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">Gallery</p>
          <h2 className="mt-1 text-xl font-semibold text-[#0a1f44]">Albums</h2>
        </div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-[#3e4d3a]">{isAlbumSorting ? "Choose the public album order" : ""}</p>
          {isAlbumSorting ? <div className="flex gap-2"><button className="text-xs font-semibold text-[#0a1f44]" disabled={isAlbumSortSaving} onClick={() => { setPendingAlbums(null); setIsAlbumSorting(false); }} type="button">Cancel</button><button className="bg-[#0a1f44] px-2 py-1 text-xs font-semibold text-white disabled:opacity-50" disabled={isAlbumSortSaving} onClick={() => void saveAlbumSorting()} type="button">{isAlbumSortSaving ? "Saving..." : "Save"}</button></div> : <button className="border border-[#0a1f44] px-2 py-1 text-xs font-semibold text-[#0a1f44] disabled:opacity-50" disabled={albums.length < 2} onClick={() => { setPendingAlbums(albums); setIsAlbumSorting(true); }} type="button">Arrange albums</button>}
        </div>

        <nav aria-label="Gallery albums" className="grid gap-2">
          {displayedAlbums.map((album, index) => {
            const isActive = selectedAlbum?.id === album.id;

            return (
              <div className={`border px-3 py-3 text-left transition ${
                  isActive
                    ? "border-[#0a1f44] bg-[#0a1f44] text-white"
                    : "border-[#d6c8a5] bg-white text-[#0a1f44] hover:border-[#0a1f44]"
                }`} key={album.id}>
                <button className="w-full text-left" onClick={() => { cancelSorting(); setSelectedAlbumId(album.id); }} type="button"><span className="block text-sm font-semibold">{getLocalizedText(album.title, "en")}</span><span className={`mt-1 block text-xs ${isActive ? "text-white/75" : "text-[#3e4d3a]"}`}>{album.images.length} photos</span></button>
                {isAlbumSorting ? <div className="mt-2 flex gap-2"><button aria-label={`Move ${getLocalizedText(album.title, "en")} up`} className="border border-current px-2 py-1 text-xs disabled:opacity-40" disabled={index === 0} onClick={() => moveAlbum(index, index - 1)} type="button">↑</button><button aria-label={`Move ${getLocalizedText(album.title, "en")} down`} className="border border-current px-2 py-1 text-xs disabled:opacity-40" disabled={index === displayedAlbums.length - 1} onClick={() => moveAlbum(index, index + 1)} type="button">↓</button></div> : null}
              </div>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-[#d6c8a5] pt-4">
          <label className="block text-xs font-semibold text-[#0a1f44]" htmlFor="new-album-title-en">Album name (English)</label>
          <input
            className="mt-2 w-full border border-[#d6c8a5] px-3 py-2 text-sm text-[#0a1f44]"
            id="new-album-title-en"
            onChange={(event) => setAlbumTitleEn(event.currentTarget.value)}
            placeholder="Khao Yai"
            value={albumTitleEn}
          />
          <label className="mt-3 block text-xs font-semibold text-[#0a1f44]" htmlFor="new-album-title-th">ชื่ออัลบั้ม (ไทย)</label>
          <input
            className="mt-2 w-full border border-[#d6c8a5] px-3 py-2 text-sm text-[#0a1f44]"
            id="new-album-title-th"
            onChange={(event) => setAlbumTitleTh(event.currentTarget.value)}
            placeholder="เขาใหญ่"
            value={albumTitleTh}
          />
          <button
            className="mt-2 w-full border border-[#0a1f44] px-3 py-2 text-xs font-semibold text-[#0a1f44] disabled:opacity-50"
            disabled={isCreatingAlbum || !albumTitleEn.trim() || !albumTitleTh.trim()}
            onClick={createAlbum}
            type="button"
          >
            {isCreatingAlbum ? "Creating..." : "Create album"}
          </button>
        </div>
      </aside>

      <section className="border border-[#d6c8a5] bg-[#fffdf7] p-5 shadow-[0_18px_50px_rgba(10,31,68,0.08)] sm:p-7">
        {selectedAlbum ? (
          <>
            <header className="mb-6 border-b border-[#d6c8a5] pb-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="luxury-heading text-xs font-semibold text-[#7c5c3b]">
                    {getLocalizedText(selectedAlbum.label, "en")}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0a1f44] sm:text-4xl">
                    {getLocalizedText(selectedAlbum.title, "en")}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#3e4d3a]">
                    {getLocalizedText(selectedAlbum.description, "en")}
                  </p>
                </div>
                <p className="w-fit border border-[#d6c8a5] bg-white px-3 py-2 text-sm font-semibold text-[#0a1f44]">
                  {selectedAlbum.images.length} photos
                </p>
              </div>

              <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
                {isSorting ? (
                  <>
                    <button className="min-h-11 w-full border border-[#d6c8a5] px-4 py-2 text-sm font-semibold text-[#0a1f44] disabled:opacity-50 sm:w-auto" disabled={isSortSaving} onClick={cancelSorting} type="button">Cancel sorting</button>
                    <button className="min-h-11 w-full border border-[#0a1f44] bg-[#0a1f44] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto" disabled={isSortSaving} onClick={() => void saveSorting()} type="button">{isSortSaving ? "Saving..." : "Save order"}</button>
                  </>
                ) : (
                  <>
                    <button className="min-h-11 w-full border border-[#0a1f44] px-4 py-2 text-sm font-semibold text-[#0a1f44] sm:w-auto" onClick={() => { setEditTitleEn(selectedAlbum.title.en); setEditTitleTh(selectedAlbum.title.th); setIsEditingAlbum(true); }} type="button">Edit album</button>
                    <button className="min-h-11 w-full border border-[#0a1f44] px-4 py-2 text-sm font-semibold text-[#0a1f44] disabled:opacity-50 sm:w-auto" disabled={selectedAlbum.images.length < 2} onClick={startSorting} type="button">Arrange photos</button>
                  </>
                )}
              </div>
            </header>

            {isEditingAlbum ? (
              <section aria-label="Edit album details" className="mb-6 border border-[#d6c8a5] bg-white p-4 sm:p-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#0a1f44]">Edit album details</h2>
                  <p className="mt-1 text-sm leading-6 text-[#3e4d3a]">Set the name shown in each language.</p>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-[#0a1f44]">Edit album name (English)<input className="mt-2 block min-h-11 w-full border border-[#d6c8a5] px-3 py-2 text-sm" onChange={(event) => setEditTitleEn(event.currentTarget.value)} value={editTitleEn} /></label>
                  <label className="text-sm font-semibold text-[#0a1f44]">แก้ไขชื่ออัลบั้ม (ไทย)<input className="mt-2 block min-h-11 w-full border border-[#d6c8a5] px-3 py-2 text-sm" onChange={(event) => setEditTitleTh(event.currentTarget.value)} value={editTitleTh} /></label>
                </div>
                <div className="mt-4 grid gap-2 sm:flex sm:justify-end">
                  <button className="min-h-11 w-full border border-[#d6c8a5] px-4 py-2 text-sm font-semibold text-[#0a1f44] sm:w-auto" onClick={() => setIsEditingAlbum(false)} type="button">Cancel</button>
                  <button className="min-h-11 w-full bg-[#0a1f44] px-4 py-2 text-sm font-semibold text-white sm:w-auto" onClick={() => void saveAlbumTitles()} type="button">Save album name</button>
                </div>
              </section>
            ) : null}

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

            {!isSorting ? (
              <section aria-label="Danger zone" className="mb-6 border border-[#8d2f2f]/30 bg-[#fff8f7] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#8d2f2f]">Danger zone</h2>
                    <p className="mt-1 max-w-xl text-sm leading-6 text-[#68413f]">These actions cannot be undone. Delete photos only when you no longer need them.</p>
                  </div>
                  <div className="grid w-full gap-2 sm:w-auto sm:flex">
                    <button
                      className="min-h-11 w-full border border-[#8d2f2f] px-4 py-2 text-sm font-semibold text-[#8d2f2f] disabled:opacity-50 sm:w-auto"
                      disabled={isDeletePending || selectedAlbum.images.length === 0}
                      onClick={deleteAllImages}
                      type="button"
                    >
                      Delete all photos
                    </button>
                    <button
                      className="min-h-11 w-full border border-[#8d2f2f] bg-[#8d2f2f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto"
                      disabled={isDeletePending}
                      onClick={deleteAlbum}
                      type="button"
                    >
                      Delete album
                    </button>
                  </div>
                </div>
              </section>
            ) : null}

            {isSorting ? <div className="mb-5"><StatusBanner tone="info">Drag a photo card to its new position, then save the order once you are finished.</StatusBanner></div> : null}

            <ImageGrid
              images={isSorting ? pendingOrder ?? selectedAlbum.images : selectedAlbum.images}
              isDeleting={isDeletePending}
              onDelete={deleteImage}
              onMove={moveImage}
              onReorder={reorderImage}
              sortMode={isSorting}
            />
          </>
        ) : (
          <StatusBanner tone="info">No albums yet.</StatusBanner>
        )}
      </section>
    </div>
  );
}
