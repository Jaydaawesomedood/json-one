import { useMemo } from "react";

export default function useLineNumbers(
  text: string,
  scrollSourceRef: React.RefObject<HTMLElement | null>,
  lineNumbersRef: React.RefObject<HTMLDivElement | null>
) {
  // Return number of lines, if no input is provided there will be at least 1 line
  const lineCount = useMemo(() => {
    if (text.length === 0) return 1;
    return text.split("\n").length;
  }, [text]);

  // Map number of lines to respective row number to be displayed
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount]
  );

  // Sync scrolling between text editor & line number column
  const syncScroll = () => {
    if (!scrollSourceRef.current || !lineNumbersRef.current) return;
    lineNumbersRef.current.scrollTop = scrollSourceRef.current.scrollTop;
  };

  return { lineNumbers, syncScroll };
}
