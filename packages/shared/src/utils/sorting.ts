/** Direction applied to an individual sort field. */
export type SortDirection = "asc" | "desc";

type SortableValue = string | number | bigint | boolean | Date | null | undefined;

/** Sort instruction for one sortable property on an object. */
export type SortCriterion<Item> = {
  [Key in keyof Item]-?: Item[Key] extends SortableValue
    ? { field: Key; direction?: SortDirection }
    : never;
}[keyof Item];

function compareValues(left: SortableValue, right: SortableValue): number {
  if (Object.is(left, right)) return 0;

  // Keep nullish values last regardless of sort direction.
  if (left == null) return 1;
  if (right == null) return -1;

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime();
  }

  if (typeof left === "string" && typeof right === "string") {
    return left.localeCompare(right);
  }

  if (typeof left === "number" || typeof left === "bigint" || typeof left === "boolean") {
    if (typeof right === "number" || typeof right === "bigint" || typeof right === "boolean") {
      return left < right ? -1 : left > right ? 1 : 0;
    }
  }

  return 0;
}

/**
 * Returns a sorted copy of the items using the supplied fields in priority order.
 * The input array is not modified. Null and undefined field values sort last.
 */
export function sortByCriteria<Item>(
  items: readonly Item[],
  criteria: readonly SortCriterion<Item>[],
): Item[] {
  return items.toSorted
    ? items.toSorted((left, right) => compareItems(left, right, criteria))
    : [...items].sort((left, right) => compareItems(left, right, criteria));
}

function compareItems<Item>(
  left: Item,
  right: Item,
  criteria: readonly SortCriterion<Item>[],
): number {
  for (const criterion of criteria) {
    const leftValue = left[criterion.field] as SortableValue;
    const rightValue = right[criterion.field] as SortableValue;
    const result = compareValues(leftValue, rightValue);

    if (result !== 0) {
      // Nullish values remain last even when the field is descending.
      const bothValuesPresent = leftValue != null && rightValue != null;
      return criterion.direction === "desc" && bothValuesPresent ? -result : result;
    }
  }

  return 0;
}
