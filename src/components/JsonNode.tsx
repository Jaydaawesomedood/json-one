import { getPreview } from "../helpers/json-viewer.helper";
import { getType } from "../helpers/type.helper";
import type { JsonTreeNode } from "../types/JsonTreeNode";

interface JsonNodeProps {
  node: JsonTreeNode;
  collapsedPaths: Set<string>;
  onToggleNode: (path: string) => void;
}

export default function JsonNode({ node, collapsedPaths, onToggleNode }: JsonNodeProps) {
  const type = getType(node.value);
  const isExpandable = node.children.length > 0;
  const isExpanded = isExpandable && !collapsedPaths.has(node.path);
  const bracket = type === "array" ? ["[", "]"] : ["{", "}"];

  const toggle = () => {
    if (!isExpandable) return;
    onToggleNode(node.path);
  };

  return (
    <div className="json-node" style={{ paddingLeft: node.depth === 0 ? 0 : 20 }}>
      <div className="json-row" onClick={toggle} style={{ cursor: isExpandable ? "pointer" : "default" }}>
        
        {/* Expand arrow */}
        <span className="arrow" style={{ opacity: isExpandable ? 1 : 0 }}>
          {isExpanded ? "v" : ">"}
        </span>

        {/* Key */}
        {node.keyName !== undefined && (
          <>
            <span className="key">&quot;{node.keyName}&quot;</span>
            <span className="colon">: </span>
          </>
        )}

        {/* Value rendering - If expanded, show bracket only, otherwise show line of preview */}
        {isExpandable ? (
          isExpanded ? (
            <span className="bracket">{bracket[0]}</span>
          ) : (
            <span className="collapsed-preview">
              <span className="bracket">{bracket[0]}</span>
              <span className="preview">{getPreview(node.value)}</span>
              <span className="bracket">{bracket[1]}</span>
              {!node.isLastValue && <span className="comma">,</span>}
            </span>
          )
        ) : (
          <>
            <span className={`value val-${type}`}>
              {type === "string" ? `"${node.value}"` : String(node.value)}
            </span>
            {!node.isLastValue && <span className="comma">,</span>}
          </>
        )}
      </div>

      {/* Children */}
      {isExpandable && isExpanded && (
        <>
          <div className="children">
            {node.children.map((child) => (
              <JsonNode
                key={child.path}
                node={child}
                collapsedPaths={collapsedPaths}
                onToggleNode={onToggleNode}
              />
            ))}
          </div>
          <div className="close-bracket" style={{ paddingLeft: "20px" }}>
            <span className="bracket">{bracket[1]}</span>
            {!node.isLastValue && <span className="comma">,</span>}
          </div>
        </>
      )}
    </div>
  );
}
