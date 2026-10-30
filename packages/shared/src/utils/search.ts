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

/**
 * Finds the first item matching `target` in an array sorted according to `compare`.
 * The comparator must return a negative number when item is before target, zero
 * when they match, and a positive number when item is after target.
 * Returns the matching index, or -1 when target is not present.
 */
export function binarySearch<Item, Target>(
  items: readonly Item[],
  target: Target,
  compare: (item: Item, target: Target) => number,
): number {
  let low = 0;
  let high = items.length;

  // Find the lower bound so duplicates consistently resolve to the first match.
  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);

    if (compare(items[middle], target) < 0) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  return low < items.length && compare(items[low], target) === 0 ? low : -1;
}
