'use client';

import { useRef, useCallback } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEditorStore } from '@/stores/editor-store';
import { MONACO_LANGUAGE_MAP } from '@/lib/constants';

export function CodeEditor() {
  const { code, setCode, language, breakpoints, toggleBreakpoint, currentLine } =
    useEditorStore();
  const { resolvedTheme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decorationsRef = useRef<any[]>([]);

  const updateDecorations = useCallback(() => {
    if (!editorRef.current || !monacoRef.current) return;
    const monaco = monacoRef.current;
    const editor = editorRef.current;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decorations: any[] = [];

    // Breakpoint decorations
    breakpoints.forEach((bp) => {
      if (bp.enabled) {
        decorations.push({
          range: new monaco.Range(bp.line, 1, bp.line, 1),
          options: {
            isWholeLine: true,
            linesDecorationsClassName: 'breakpoint-decoration',
            className: 'breakpoint-line',
          },
        });
      }
    });

    // Current line highlight
    if (currentLine !== null) {
      decorations.push({
        range: new monaco.Range(currentLine, 1, currentLine, 1),
        options: {
          isWholeLine: true,
          className: 'current-line-highlight',
          linesDecorationsClassName: 'current-line-arrow',
        },
      });
    }

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      decorations
    );
  }, [breakpoints, currentLine]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add breakpoint on gutter click
    editor.onMouseDown((e) => {
      // Type 2 = gutter, Type 3 = line numbers, Type 4 = gutter + margin
      if (e.target.type === 2 || e.target.type === 3 || e.target.type === 4) {
        const line = e.target.position?.lineNumber;
        if (line) {
          toggleBreakpoint(line);
        }
      }
    });

    // Custom CSS for decorations
    const style = document.createElement('style');
    style.textContent = `
      .breakpoint-decoration {
        background: var(--breakpoint) !important;
        width: 8px !important;
        height: 8px !important;
        border-radius: 50% !important;
        margin-left: 4px !important;
        margin-top: 6px !important;
      }
      .breakpoint-line {
        background: rgba(239, 68, 68, 0.08) !important;
      }
      .current-line-highlight {
        background: var(--line-active) !important;
      }
      .current-line-arrow::before {
        content: '▶';
        color: var(--accent);
        font-size: 10px;
        margin-left: 2px;
      }
    `;
    document.head.appendChild(style);

    updateDecorations();
  };

  // Update decorations when breakpoints or current line change
  const prevDeps = useRef({ breakpoints, currentLine });
  if (
    prevDeps.current.breakpoints !== breakpoints ||
    prevDeps.current.currentLine !== currentLine
  ) {
    prevDeps.current = { breakpoints, currentLine };
    updateDecorations();
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={MONACO_LANGUAGE_MAP[language]}
        value={code}
        onChange={(value) => setCode(value ?? '')}
        onMount={handleEditorMount}
        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          fontSize: 14,
          fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
          fontLigatures: true,
          minimap: { enabled: false },
          lineNumbers: 'on',
          glyphMargin: true,
          folding: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 8, bottom: 8 },
          renderLineHighlight: 'all',
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true },
        }}
      />
    </div>
  );
}
