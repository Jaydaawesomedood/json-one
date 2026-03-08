import { useMemo, useRef } from "react";
import useLineNumbers from "../hooks/UseLineNumbers";
import type { JsonValue } from "../types/JsonValue";
import EditorLineNumbers from "./EditorLineNumbers";
import JsonNode from "./JsonNode";
import "../styles/JsonTreeViewer.css";

interface JsonTreeViewerProps {
  data: JsonValue;
  error: string;
}

export default function JsonTreeViewer({ data, error }: JsonTreeViewerProps) {
  const treeAreaRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textForLineCount = useMemo(() => {
    if (error) return error;
    return JSON.stringify(data, null, 2) ?? "";
  }, [data, error]);

  const { lineNumbers, syncScroll } = useLineNumbers(textForLineCount, treeAreaRef, lineNumbersRef);

  return (
    <div className="viewer-wrapper">
      <div className="editor-shell">
        <EditorLineNumbers lineNumbers={lineNumbers} lineNumbersRef={lineNumbersRef} />
        <div className="tree-area" ref={treeAreaRef} onScroll={syncScroll}>
          {error ? (
            <div className="parse-error">{error}</div>
          ) : (
            <JsonNode value={data} depth={0} isLastValue={true} defaultExpanded={true} />
          )}
        </div>
      </div>
    </div>
  );
}
