import { useRef } from "react";
import "../styles/RawTextEditor.css";
import useLineNumbers from "../hooks/UseLineNumbers";
import EditorLineNumbers from "./EditorLineNumbers";

interface RawTextEditorProps {
  text: string,
  onRawTextChange: (input: string) => void;
}

export default function RawTextEditor({ text, onRawTextChange }: RawTextEditorProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const { lineNumbers, syncScroll } = useLineNumbers(text, textAreaRef, lineNumbersRef);

  return (
    <div className="input-area">
      <div className="editor-shell">
        <EditorLineNumbers lineNumbers={lineNumbers} lineNumbersRef={lineNumbersRef} />
        <textarea
          ref={textAreaRef}
          placeholder='Enter your JSON here...'
          value={text}
          onChange={(e) => onRawTextChange(e.target.value)}
          onScroll={syncScroll}
          className="json-input"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
