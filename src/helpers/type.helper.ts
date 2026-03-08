import type { JsonValue } from "../types/JsonValue";

export function getType(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}