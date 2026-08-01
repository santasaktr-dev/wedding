import { expect, it } from "vitest";

import { getPreparedImageDimensions } from "../prepare-gallery-image";

it("limits the longest image edge to 2560px while preserving aspect ratio", () => {
  expect(getPreparedImageDimensions(6000, 4000)).toEqual({ width: 2560, height: 1707 });
});

it("does not enlarge images that are already smaller than the limit", () => {
  expect(getPreparedImageDimensions(1200, 800)).toEqual({ width: 1200, height: 800 });
});
