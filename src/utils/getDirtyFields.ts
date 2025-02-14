import { pickBy, isEqual } from "lodash";

export function getDirtyFields(original: any, updated: any) {
  return pickBy(updated, (value, key) => !isEqual(value, original[key]));
}
