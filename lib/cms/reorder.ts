export type SortableItem = {
  sortOrder: number;
};

export function moveItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);

  if (item === undefined) {
    return nextItems;
  }

  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

export function normalizeSortOrder<T extends SortableItem>(items: readonly T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    sortOrder: index,
  }));
}
