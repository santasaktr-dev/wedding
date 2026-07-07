import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import GalleryPage from "../page";

vi.mock("../../../lib/cms/server", () => ({
  getPublicGalleryAlbums: vi.fn(async () => [
    {
      id: "album-1",
      slug: "highlights",
      status: "published",
      sortOrder: 0,
      label: { en: "Gallery", th: "แกลเลอรี" },
      title: { en: "Highlights", th: "ไฮไลต์" },
      description: { en: "Published photos", th: "รูปที่เผยแพร่" },
      images: [
        {
          id: "image-1",
          albumId: "album-1",
          storagePath: "highlights/portrait.jpg",
          publicUrl: "/images/wedding-hero.png",
          caption: { en: "Portrait", th: "ภาพแนวตั้ง" },
          alt: { en: "Portrait photo", th: "ภาพแนวตั้ง" },
          sortOrder: 0,
          isCover: false,
          status: "published",
        },
        {
          id: "image-2",
          albumId: "album-1",
          storagePath: "highlights/landscape.jpg",
          publicUrl: "/images/wedding-hero.png",
          caption: { en: "Landscape", th: "ภาพแนวนอน" },
          alt: { en: "Landscape photo", th: "ภาพแนวนอน" },
          sortOrder: 1,
          isCover: false,
          status: "published",
        },
      ],
    },
  ]),
}));

describe("GalleryPage", () => {
  it("renders public gallery photos in a natural-ratio masonry layout", async () => {
    render(await GalleryPage());

    expect(screen.getByTestId("gallery-masonry-highlights")).toHaveClass("columns-1");
    expect(screen.getByRole("img", { name: "Portrait photo" })).toHaveClass("h-auto", "w-full");
    expect(screen.getByRole("img", { name: "Portrait photo" })).not.toHaveClass("object-cover");
  });
});
