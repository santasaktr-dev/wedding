import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import type { GalleryAlbum } from "../../../lib/cms/types";
import { GalleryManager } from "../components/GalleryManager";

const actionMocks = vi.hoisted(() => ({
  deleteGalleryImage: vi.fn(async () => ({ ok: true })),
  saveGalleryImageOrder: vi.fn(async () => ({ ok: true })),
  uploadGalleryImages: vi.fn(async () => ({ ok: true, uploadedCount: 2 })),
}));

vi.mock("../../../lib/cms/actions", () => ({
  deleteGalleryImage: actionMocks.deleteGalleryImage,
  saveGalleryImageOrder: actionMocks.saveGalleryImageOrder,
  uploadGalleryImages: actionMocks.uploadGalleryImages,
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
    actionMocks.saveGalleryImageOrder.mockClear();
    actionMocks.uploadGalleryImages.mockClear();
  });

  it("renders albums and selects an album", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    fireEvent.click(screen.getByRole("button", { name: /highlights/i }));

    expect(screen.getByText(/classic portrait/i)).toBeInTheDocument();
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

  it("renders drag handles for reordering images", () => {
    render(<GalleryManager initialAlbums={fallbackCmsSnapshot.albums} />);

    expect(screen.getByRole("button", { name: /drag classic portrait to reorder/i })).toBeInTheDocument();
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

    await waitFor(() => expect(actionMocks.uploadGalleryImages).toHaveBeenCalledTimes(1));

    const formData = actionMocks.uploadGalleryImages.mock.calls[0][0] as FormData;
    expect(formData.get("albumId")).toBe(fallbackCmsSnapshot.albums[0].id);
    expect(formData.get("albumSlug")).toBe(fallbackCmsSnapshot.albums[0].slug);
    expect(formData.getAll("images").map((file) => (file as File).name)).toEqual(["first.jpg", "second.jpg"]);
  });
});
