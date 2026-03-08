import { useEffect, useMemo, useRef, useState } from "react";
import type { JsonValue } from "../types/JsonValue";
import type { JsonTreeNode } from "../types/JsonTreeNode";
import EditorLineNumbers from "./EditorLineNumbers";
import JsonNode from "./JsonNode";
import "../styles/JsonTreeViewer.css";

interface JsonTreeViewerProps {
  data: JsonValue;
  error: string;
}

function buildJsonTreeNode(
  value: JsonValue,
  depth: number,
  isLastValue: boolean,
  startLine: number,
  path: string,
  keyName?: string
): JsonTreeNode {
  const isExpandable = value !== null && typeof value === "object";

  if (!isExpandable) {
    return {
      path,
      keyName,
      value,
      depth,
      isLastValue,
      startLine,
      endLine: startLine,
      children: [],
    };
  }

  const rawEntries = Array.isArray(value)
    ? value.map((entry, index) => [String(index), entry] as const)
    : Object.entries(value as { [k: string]: JsonValue });

  const children: JsonTreeNode[] = [];
  let nextLine = startLine + 1;

  rawEntries.forEach(([childKey, childValue], index) => {
    const escapedKey = childKey.replaceAll("~", "~0").replaceAll("/", "~1");
    const childPath = `${path}/${escapedKey}`;
    const childNode = buildJsonTreeNode(
      childValue,
      depth + 1,
      index === rawEntries.length - 1,
      nextLine,
      childPath,
      Array.isArray(value) ? undefined : childKey
    );

    children.push(childNode);
    nextLine = childNode.endLine + 1;
  });

  return {
    path,
    keyName,
    value,
    depth,
    isLastValue,
    startLine,
    endLine: nextLine,
    children,
  };
}

function collectDefaultCollapsedPaths(node: JsonTreeNode, collapsed: Set<string>) {
  if (node.children.length > 0 && node.depth >= 2) {
    collapsed.add(node.path);
  }

  node.children.forEach((child) => collectDefaultCollapsedPaths(child, collapsed));
}

function collectVisibleLineNumbers(node: JsonTreeNode, collapsedPaths: Set<string>, lines: number[]) {
  lines.push(node.startLine);

  if (node.children.length === 0) return;
  if (collapsedPaths.has(node.path)) return;

  node.children.forEach((child) => collectVisibleLineNumbers(child, collapsedPaths, lines));
  lines.push(node.endLine);
}

export default function JsonTreeViewer({ data, error }: JsonTreeViewerProps) {
  const treeAreaRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const treeModel = useMemo(() => {
    if (error) return null;
    return buildJsonTreeNode(data, 0, true, 1, "root");
  }, [data, error]);

  const defaultCollapsedPaths = useMemo(() => {
    if (!treeModel) return new Set<string>();
    const collapsed = new Set<string>();
    collectDefaultCollapsedPaths(treeModel, collapsed);
    return collapsed;
  }, [treeModel]);

  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set<string>());

  useEffect(() => {
    setCollapsedPaths(defaultCollapsedPaths);
  }, [defaultCollapsedPaths]);

  const lineNumbers = useMemo(() => {
    if (error) {
      const errorLineCount = error.length === 0 ? 1 : error.split("\n").length;
      return Array.from({ length: errorLineCount }, (_, index) => index + 1);
    }

    if (!treeModel) return [1];

    const visibleLines: number[] = [];
    collectVisibleLineNumbers(treeModel, collapsedPaths, visibleLines);

    return visibleLines.length > 0 ? visibleLines : [1];
  }, [collapsedPaths, error, treeModel]);

  const handleToggleNode = (path: string) => {
    setCollapsedPaths((current) => {
      const next = new Set(current);

      if (next.has(path)) next.delete(path);
      else next.add(path);

      return next;
    });
  };

  const syncScroll = () => {
    if (!treeAreaRef.current || !lineNumbersRef.current) return;
    lineNumbersRef.current.scrollTop = treeAreaRef.current.scrollTop;
  };

  return (
    <div className="viewer-wrapper">
      <div className="editor-shell">
        <EditorLineNumbers lineNumbers={lineNumbers} lineNumbersRef={lineNumbersRef} />
        <div className="tree-area" ref={treeAreaRef} onScroll={syncScroll}>
          {error ? (
            <div className="parse-error">{error}</div>
          ) : (
            treeModel && (
              <JsonNode
                node={treeModel}
                collapsedPaths={collapsedPaths}
                onToggleNode={handleToggleNode}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
