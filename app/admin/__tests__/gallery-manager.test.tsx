import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fallbackCmsSnapshot } from "../../../lib/cms/fallback";
import type { GalleryAlbum } from "../../../lib/cms/types";
import { GalleryManager } from "../components/GalleryManager";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe("GalleryManager", () => {
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
});
