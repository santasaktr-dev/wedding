import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { GalleryLightbox } from "../GalleryLightbox";

const images = Array.from({ length: 30 }, (_, index) => ({
  id: String(index),
  thumbnailSrc: `thumbnail-${index}.webp`,
  src: `full-${index}.webp`,
  alt: `Photo ${index}`,
  caption: "",
}));

it("renders the first 24 thumbnails and reveals the next batch", () => {
  render(<GalleryLightbox images={images} />);

  expect(screen.getAllByRole("button", { name: /open image/i })).toHaveLength(24);
  fireEvent.click(screen.getByRole("button", { name: /load more photos/i }));
  expect(screen.getAllByRole("button", { name: /open image/i })).toHaveLength(30);
});
