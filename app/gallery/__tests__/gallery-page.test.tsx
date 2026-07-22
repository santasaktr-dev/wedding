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

  it("uses the brand link and breadcrumb as quiet gallery navigation", async () => {
    render(await GalleryPage());

    const brandLink = screen.getByRole("link", { name: "Back to website" });

    expect(screen.getByTestId("gallery-header-actions")).toHaveClass("ml-auto");
    expect(brandLink).toHaveAttribute("href", "/#gallery");
    expect(brandLink).toHaveClass("gallery-brand-link");
    expect(screen.queryByRole("link", { name: "Back to website", exact: true })).toBe(brandLink);
    expect(screen.getByTestId("gallery-breadcrumb")).toHaveTextContent(/J&S\s*\/\s*Gallery/);
  });

  it("applies the Thai font styling when the Thai gallery is selected", async () => {
    render(await GalleryPage({ searchParams: Promise.resolve({ lang: "th" }) }));

    expect(screen.getByRole("main")).toHaveClass("lang-th");
    expect(screen.getByRole("main")).toHaveAttribute("lang", "th");
    expect(screen.getByRole("main")).toHaveStyle({ fontFamily: "var(--font-kanit), ui-sans-serif, system-ui, sans-serif" });
  });
});
