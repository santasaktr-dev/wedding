import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import type { GalleryAlbum } from "../../../lib/cms/types";
import { GalleryManager } from "../components/GalleryManager";

const actionMocks = vi.hoisted(() => ({
  createGalleryAlbum: vi.fn(async () => ({ ok: true, album: { ...fallbackCmsSnapshot.albums[0], id: "new-album", slug: "new-album", images: [] } })),
  deleteGalleryImage: vi.fn(async () => ({ ok: true })),
  deleteGalleryAlbum: vi.fn(async () => ({ ok: true })),
  updateGalleryAlbumTitles: vi.fn(async () => ({ ok: true })),
  saveGalleryImageOrder: vi.fn(async () => ({ ok: true })),
  saveGalleryAlbumOrder: vi.fn(async () => ({ ok: true })),
  uploadGalleryImages: vi.fn(async () => ({ ok: true, uploadedCount: 2 })),
}));

const imagePreparationMocks = vi.hoisted(() => ({
  prepareGalleryImage: vi.fn(async (file: File) => file),
}));

vi.mock("../../../lib/cms/actions", () => ({
  createGalleryAlbum: actionMocks.createGalleryAlbum,
  deleteGalleryImage: actionMocks.deleteGalleryImage,
  deleteGalleryAlbum: actionMocks.deleteGalleryAlbum,
  updateGalleryAlbumTitles: actionMocks.updateGalleryAlbumTitles,
  saveGalleryImageOrder: actionMocks.saveGalleryImageOrder,
  saveGalleryAlbumOrder: actionMocks.saveGalleryAlbumOrder,
  uploadGalleryImages: actionMocks.uploadGalleryImages,
}));

vi.mock("../lib/prepare-gallery-image", () => ({
  prepareGalleryImage: imagePreparationMocks.prepareGalleryImage,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe("GalleryManager", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    actionMocks.deleteGalleryImage.mockClear();
    actionMocks.deleteGalleryAlbum.mockClear();
    actionMocks.updateGalleryAlbumTitles.mockClear();
    actionMocks.createGalleryAlbum.mockClear();
    actionMocks.saveGalleryImageOrder.mockClear();
    actionMocks.saveGalleryAlbumOrder.mockClear();
    actionMocks.uploadGalleryImages.mockClear();
  });

  it("renders albums and selects an album", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    fireEvent.click(screen.getByRole("button", { name: /highlights/i }));

    expect(screen.getByText(/classic portrait/i)).toBeInTheDocument();
  });

  it("creates an album with independent Thai and English titles", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    fireEvent.change(screen.getByLabelText("Album name (English)"), { target: { value: "Khao Yai" } });
    fireEvent.change(screen.getByLabelText("ชื่ออัลบั้ม (ไทย)"), { target: { value: "เขาใหญ่" } });
    fireEvent.click(screen.getByRole("button", { name: /create album/i }));

    expect(actionMocks.createGalleryAlbum).toHaveBeenCalledWith(expect.objectContaining({
      titleEn: "Khao Yai",
      titleTh: "เขาใหญ่",
      labelEn: "Gallery",
      labelTh: "แกลเลอรี",
    }));
  });

  it("reorders images inside the selected album", () => {
    const albums: GalleryAlbum[] = [
      {
        ...fallbackCmsSnapshot.albums[0],
        images: [
          fallbackCmsSnapshot.albums[0].images[0],
          {
            ...fallbackCmsSnapshot.albums[0].images[0],
            id: "second-image",
            caption: { en: "Second Image", th: "ภาพที่สอง" },
            alt: { en: "Second image", th: "ภาพที่สอง" },
            sortOrder: 1,
          },
        ],
      },
    ];

    render(<GalleryManager initialAlbums={albums} />);

    const moveUpButtons = screen.getAllByRole("button", { name: /move up/i });
    fireEvent.click(moveUpButtons[1]);

    const captions = screen.getAllByText(/classic portrait|second image/i);
    expect(captions.map((caption) => caption.textContent)).toEqual(["Second Image", "Classic Portrait"]);
  });

  it("renders delete controls for uploaded images", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    expect(screen.getByRole("button", { name: /delete classic portrait/i })).toBeInTheDocument();
  });

  it("deletes an album after confirmation", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    fireEvent.click(screen.getByRole("button", { name: /delete album/i }));

    expect(actionMocks.deleteGalleryAlbum).toHaveBeenCalledWith(fallbackCmsSnapshot.albums[0].id);
  });

  it("keeps destructive album controls in a separate danger zone", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    const dangerZone = screen.getByRole("region", { name: /danger zone/i });
    expect(dangerZone).toContainElement(screen.getByRole("button", { name: /delete all photos/i }));
    expect(dangerZone).toContainElement(screen.getByRole("button", { name: /^delete album$/i }));
  });

  it("edits Thai and English album names", async () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);
    fireEvent.click(screen.getByRole("button", { name: /edit album/i }));
    fireEvent.change(screen.getByLabelText("Edit album name (English)"), { target: { value: "Khao Yai" } });
    fireEvent.change(screen.getByLabelText("แก้ไขชื่ออัลบั้ม (ไทย)"), { target: { value: "เขาใหญ่" } });
    fireEvent.click(screen.getByRole("button", { name: /save album name/i }));

    await waitFor(() => expect(actionMocks.updateGalleryAlbumTitles).toHaveBeenCalledWith(fallbackCmsSnapshot.albums[0].id, "Khao Yai", "เขาใหญ่"));
  });

  it("renders drag handles for reordering images", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    expect(screen.getByRole("button", { name: /drag classic portrait to reorder/i })).toBeInTheDocument();
  });

  it("saves the selected album display order", () => {
    const albums = [
      { ...fallbackCmsSnapshot.albums[0], id: "first-album", title: { en: "First", th: "แรก" } },
      { ...fallbackCmsSnapshot.albums[0], id: "second-album", title: { en: "Second", th: "สอง" }, sortOrder: 1 },
    ];
    render(<GalleryManager initialAlbums={albums} />);

    fireEvent.click(screen.getByRole("button", { name: /arrange albums/i }));
    fireEvent.click(screen.getByRole("button", { name: /move second up/i }));
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(actionMocks.saveGalleryAlbumOrder).toHaveBeenCalledWith(["second-album", "first-album"]);
  });

  it("opens a dedicated sort mode and saves the chosen order", () => {
    const albums: GalleryAlbum[] = [
      {
        ...fallbackCmsSnapshot.albums[0],
        images: [
          fallbackCmsSnapshot.albums[0].images[0],
          { ...fallbackCmsSnapshot.albums[0].images[0], id: "sort-second-image", sortOrder: 1 },
        ],
      },
    ];

    render(<GalleryManager initialAlbums={albums} />);

    fireEvent.click(screen.getByRole("button", { name: /arrange photos/i }));

    const saveButton = screen.getByRole("button", { name: /save order/i });
    expect(saveButton).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel sorting/i })).toBeInTheDocument();

    fireEvent.click(saveButton);
    expect(actionMocks.saveGalleryImageOrder).toHaveBeenCalledWith(albums[0].id, albums[0].images.map((image) => image.id));
  });

  it("shows admin gallery images without cropping them", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    expect(screen.getByRole("img", { name: /prewedding portrait/i })).toHaveClass("object-contain");
  });

  it("uploads every selected photo immediately without a manual upload button", async () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    expect(screen.queryByRole("button", { name: /upload now/i })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/upload photos/i), {
      target: {
        files: [new File(["image"], "first.jpg", { type: "image/jpeg" }), new File(["image"], "second.jpg", { type: "image/jpeg" })],
      },
    });

    await waitFor(() => expect(actionMocks.uploadGalleryImages).toHaveBeenCalledTimes(2));

    const formData = actionMocks.uploadGalleryImages.mock.calls.map((call) => call[0] as FormData);
    expect(formData.every((entry) => entry.get("albumId") === fallbackCmsSnapshot.albums[0].id)).toBe(true);
    expect(formData.every((entry) => entry.get("albumSlug") === fallbackCmsSnapshot.albums[0].slug)).toBe(true);
    expect(formData.map((entry) => (entry.get("images") as File).name)).toEqual(["first.jpg", "second.jpg"]);
  });
});
