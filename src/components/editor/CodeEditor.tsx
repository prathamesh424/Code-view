'use client';

import { useRef, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEditorStore } from '@/stores/editor-store';
import { MONACO_LANGUAGE_MAP } from '@/lib/constants';
import { useMediaQuery } from '@/lib/useMediaQuery';

// Dynamic import of Monaco editor — reduces initial JS bundle by ~800KB
const Editor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.default), {
  ssr: false,
  loading: () => <MonacoSkeleton />,
});

function MonacoSkeleton() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-surface animate-pulse">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted">Loading editor...</p>
      </div>
    </div>
  );
}

export function CodeEditor() {
  const { code, setCode, language, breakpoints, toggleBreakpoint, currentLine } =
    useEditorStore();
  const { resolvedTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 767px)');
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
      <Suspense fallback={<MonacoSkeleton />}>
        <Editor
          height="100%"
          language={MONACO_LANGUAGE_MAP[language]}
          value={code}
          onChange={(value) => setCode(value ?? '')}
          onMount={handleEditorMount}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'vs'}
          options={{
            fontSize: isMobile ? 12 : 14,
            fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            lineNumbers: isMobile ? 'off' : 'on',
            glyphMargin: !isMobile,
            folding: !isMobile,
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
      </Suspense>
    </div>
  );
}

