/**
 * Returns the index of the first item matching the predicate, or -1 if none match.
 * Checks items from left to right and works regardless of their ordering.
 */
export function linearSearch<Item>(
  items: readonly Item[],
  predicate: (item: Item, index: number) => boolean,
): number {
  for (let index = 0; index < items.length; index += 1) {
    if (predicate(items[index], index)) {
      return index;
    }
  }

  return -1;
}
