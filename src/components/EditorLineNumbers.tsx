interface EditorLineNumbersProps {
  lineNumbers: number[];
  lineNumbersRef: React.RefObject<HTMLDivElement | null>;
}

export default function EditorLineNumbers({ lineNumbers, lineNumbersRef}: EditorLineNumbersProps) {
  return (
    <div className="line-numbers" ref={lineNumbersRef} aria-hidden="true">
      {lineNumbers.map((lineNumber) => (
        <div className="line-number" key={lineNumber}>
          {lineNumber}
        </div>
      ))}
    </div>
  );
}