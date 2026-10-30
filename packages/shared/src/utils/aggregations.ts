/** Counts items by the category returned by `getCategory`. */
export function countByCategory<Item, Category>(
  items: readonly Item[],
  getCategory: (item: Item) => Category,
): Map<Category, number> {
  const counts = new Map<Category, number>();

  for (const item of items) {
    const category = getCategory(item);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return counts;
}

/** Returns the sum of selected numeric values; an empty collection totals 0. */
export function sumBy<Item>(
  items: readonly Item[],
  getValue: (item: Item) => number,
): number {
  return items.reduce(
    (total: number, item: Item): number => total + getValue(item),
    0,
  );
}

/** Returns the arithmetic mean, or undefined when the collection is empty. */
export function averageBy<Item>(
  items: readonly Item[],
  getValue: (item: Item) => number,
): number | undefined {
  if (items.length === 0) return undefined;
  return sumBy(items, getValue) / items.length;
}

/** Returns the greatest selected value, or undefined when the collection is empty. */
export function maxBy<Item>(
  items: readonly Item[],
  getValue: (item: Item) => number,
): number | undefined {
  if (items.length === 0) return undefined;

  let maximum = getValue(items[0]);
  for (let index = 1; index < items.length; index += 1) {
    const value = getValue(items[index]);
    if (value > maximum) maximum = value;
  }

  return maximum;
}

/** Returns the smallest selected value, or undefined when the collection is empty. */
export function minBy<Item>(
  items: readonly Item[],
  getValue: (item: Item) => number,
): number | undefined {
  if (items.length === 0) return undefined;

  let minimum = getValue(items[0]);
  for (let index = 1; index < items.length; index += 1) {
    const value = getValue(items[index]);
    if (value < minimum) minimum = value;
  }

  return minimum;
}
