import { describe, expect, it } from "vitest";

import { buildGalleryStoragePath, slugifyFileName } from "../storage";

describe("slugifyFileName", () => {
  it("normalizes names and preserves a lowercase extension", () => {
    expect(slugifyFileName("Jajah & Smart 01.JPG")).toBe("jajah-smart-01.jpg");
  });

  it("defaults extensionless file names to jpg", () => {
    expect(slugifyFileName("Jajah & Smart 01")).toBe("jajah-smart-01.jpg");
  });

  it("defaults empty or unsafe base names to image", () => {
    expect(slugifyFileName("   .PNG")).toBe("image.png");
    expect(slugifyFileName("&&&")).toBe("image.jpg");
  });

  it("truncates long base names to 80 characters", () => {
    expect(slugifyFileName(`${"a".repeat(100)}.png`)).toBe(`${"a".repeat(80)}.png`);
  });
});

describe("buildGalleryStoragePath", () => {
  it("builds a gallery path from album slug, timestamp, and safe file name", () => {
    expect(
      buildGalleryStoragePath({
        albumSlug: "highlights",
        fileName: "Jajah & Smart 01.JPG",
        now: 1783365937000,
      }),
    ).toBe("highlights/1783365937000-jajah-smart-01.jpg");
  });

  it("normalizes unsafe album slugs", () => {
    expect(
      buildGalleryStoragePath({
        albumSlug: " Wedding Highlights! ",
        fileName: "Jajah & Smart 01.JPG",
        now: 1783365937000,
      }),
    ).toBe("wedding-highlights/1783365937000-jajah-smart-01.jpg");
  });

  it("falls back when album slug and filename base are empty or unsafe", () => {
    expect(
      buildGalleryStoragePath({
        albumSlug: "&&&",
        fileName: "&&&",
        now: 1783365937000,
      }),
    ).toBe("album/1783365937000-image.jpg");
  });
});
