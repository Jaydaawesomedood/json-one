import type { JsonValue } from "./JsonValue";

export interface JsonTreeNode {
  path: string;
  keyName?: string;
  value: JsonValue;
  depth: number;
  isLastValue: boolean;
  startLine: number;
  endLine: number;
  children: JsonTreeNode[];
}
