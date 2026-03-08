import type { JsonValue } from "../types/JsonValue";

export function getPreview(value: JsonValue): string {
  // If value is array, return something like [ 3 items ]
  if (Array.isArray(value)) return ` ${value.length} item${value.length !== 1 ? "s" : ""} `;

  // If value is array, return something like { id, name, title, ... }
  if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value);
    return ` ${keys.slice(0, 3).join(", ")}${keys.length > 3 ? ", …" : ""} `;
  }

  return "";
}