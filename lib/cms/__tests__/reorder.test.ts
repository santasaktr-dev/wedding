import { describe, expect, it } from "vitest";

import { moveItem, moveItemById, normalizeSortOrder } from "../reorder";

describe("moveItem", () => {
  it("moves an item to a later index without mutating the input", () => {
    const items = ["a", "b", "c", "d"];

    const result = moveItem(items, 1, 3);

    expect(result).toEqual(["a", "c", "d", "b"]);
    expect(items).toEqual(["a", "b", "c", "d"]);
  });
});

describe("moveItemById", () => {
  it("moves an item before the target id without mutating the input", () => {
    const items = [
      { id: "first", sortOrder: 0 },
      { id: "second", sortOrder: 1 },
      { id: "third", sortOrder: 2 },
    ];

    const result = moveItemById(items, "third", "first");

    expect(result.map((item) => item.id)).toEqual(["third", "first", "second"]);
    expect(items.map((item) => item.id)).toEqual(["first", "second", "third"]);
  });

  it("returns the original order when ids are missing", () => {
    const items = [
      { id: "first", sortOrder: 0 },
      { id: "second", sortOrder: 1 },
    ];

    expect(moveItemById(items, "missing", "first")).toEqual(items);
    expect(moveItemById(items, "first", "missing")).toEqual(items);
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
