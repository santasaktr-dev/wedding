import { describe, expect, it } from "vitest";

import { moveItem, normalizeSortOrder } from "../reorder";

describe("moveItem", () => {
  it("moves an item to a later index without mutating the input", () => {
    const items = ["a", "b", "c", "d"];

    const result = moveItem(items, 1, 3);

    expect(result).toEqual(["a", "c", "d", "b"]);
    expect(items).toEqual(["a", "b", "c", "d"]);
  });
});

describe("normalizeSortOrder", () => {
  it("preserves array order and rewrites sortOrder from zero", () => {
    const items = [
      { id: "b", sortOrder: 8 },
      { id: "a", sortOrder: 4 },
    ];

    const result = normalizeSortOrder(items);

    expect(result).toEqual([
      { id: "b", sortOrder: 0 },
      { id: "a", sortOrder: 1 },
    ]);
    expect(items).toEqual([
      { id: "b", sortOrder: 8 },
      { id: "a", sortOrder: 4 },
    ]);
  });
});
