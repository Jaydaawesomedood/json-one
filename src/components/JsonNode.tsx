import { useState } from "react";
import { getPreview } from "../helpers/json-viewer.helper";
import { getType } from "../helpers/type.helper";
import type { JsonValue } from "../types/JsonValue";

interface JsonNodeProps {
  keyName?: string;
  value: JsonValue;
  depth: number;
  isLastValue: boolean;
  defaultExpanded?: boolean;
}

export default function JsonNode({ keyName, value, depth, isLastValue, defaultExpanded = depth < 2 }: JsonNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const type = getType(value);
  const isExpandable = type === "object" || type === "array";

  const bracket = type === "array" ? ["[", "]"] : ["{", "}"];

  // If array, map it as [index, value], else if object, map it as { key, value }
  const entries = isExpandable
    ? type === "array"
      ? (value as JsonValue[]).map((v, i) => [String(i), v] as [string, JsonValue])
      : Object.entries(value as { [k: string]: JsonValue })
    : [];

  const toggle = () => isExpandable && setExpanded((e) => !e);

  return (
    <div className="json-node" style={{ paddingLeft: depth === 0 ? 0 : 20 }}>
      <div className="json-row" onClick={toggle} style={{ cursor: isExpandable ? "pointer" : "default" }}>
        {/* Expand arrow */}
        <span className="arrow" style={{ opacity: isExpandable ? 1 : 0 }}>
          {expanded ? "▾" : "▸"}
        </span>

        {/* Key */}
        {keyName !== undefined && (
          <>
            <span className="key">&quot;{keyName}&quot;</span>
            <span className="colon">: </span>
          </>
        )}

        {/* Value rendering - If expanded, show bracket only, otherwise show line of preview */}
        {isExpandable ? (
          expanded ? (
            <span className="bracket">{bracket[0]}</span>
          ) : (
            <span className="collapsed-preview">
              <span className="bracket">{bracket[0]}</span>
              <span className="preview">{getPreview(value)}</span>
              <span className="bracket">{bracket[1]}</span>
              {!isLastValue && <span className="comma">,</span>}
            </span>
          )
        ) : (
          <>
            <span className={`value val-${type}`}>
              {type === "string" ? `"${value}"` : String(value)}
            </span>
            {!isLastValue && <span className="comma">,</span>}
          </>
        )}
      </div>

      {/* Children */}
      {isExpandable && expanded && (
        <>
          <div className="children">
            {entries.map(([k, v], i) => (
              <JsonNode
                key={k}
                keyName={type === "array" ? undefined : k}
                value={v}
                depth={depth + 1}
                isLastValue={i === entries.length - 1}
                defaultExpanded={depth + 1 < 2}
              />
            ))}
          </div>
          <div className="close-bracket">
            <span className="bracket">{bracket[1]}</span>
            {!isLastValue && <span className="comma">,</span>}
          </div>
        </>
      )}
    </div>
  );
}