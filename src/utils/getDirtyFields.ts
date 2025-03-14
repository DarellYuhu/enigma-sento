import { pickBy, isEqual } from "lodash";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDirtyFields(original: any, updated: any) {
  return pickBy(updated, (value, key) => !isEqual(value, original[key]));
}
