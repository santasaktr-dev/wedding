import { describe, expect, it } from "vitest";

import { buildGalleryStoragePath, slugifyFileName } from "../storage";

describe("slugifyFileName", () => {
  it("normalizes names and preserves a lowercase extension", () => {
    expect(slugifyFileName("Jajah & Smart 01.JPG")).toBe("jajah-smart-01.jpg");
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
});
