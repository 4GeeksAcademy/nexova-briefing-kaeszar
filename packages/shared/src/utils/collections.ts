/** A filter criterion matches a value exactly or evaluates it with a predicate. */
export type FieldCriterion<Value, Item> =
  | Value
  | ((value: Value, item: Item) => boolean);

/**
 * Criteria for filtering object collections. All supplied properties are ANDed.
 * A criterion can be an exact value or a predicate for that property.
 */
export type FilterCriteria<Item> = {
  [Key in keyof Item]?: FieldCriterion<Item[Key], Item>;
};

/**
 * Returns a new array containing items that match every supplied criterion.
 * The input array is not modified. Empty criteria return a shallow copy.
 */
export function filterByCriteria<Item>(
  items: readonly Item[],
  criteria: FilterCriteria<Item>,
): Item[] {
  const criterionKeys = Object.keys(criteria) as Array<keyof Item>;

  return items.filter((item: Item): boolean =>
    criterionKeys.every((key: keyof Item): boolean => {
      const criterion = criteria[key] as FieldCriterion<Item[typeof key], Item>;
      const value = item[key];

      if (typeof criterion === "function") {
        return criterion(value, item);
      }

      return Object.is(value, criterion);
    }),
  );
}
