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

export function moveItemById<T extends { id: string }>(items: readonly T[], activeId: string, overId: string): T[] {
  const fromIndex = items.findIndex((item) => item.id === activeId);
  const toIndex = items.findIndex((item) => item.id === overId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return [...items];
  }

  return moveItem(items, fromIndex, toIndex);
}

export function normalizeSortOrder<T extends SortableItem>(items: readonly T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    sortOrder: index,
  }));
}
