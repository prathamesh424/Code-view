import { NextRequest, NextResponse } from 'next/server';

const WANDBOX_API = 'https://wandbox.org/api/compile.json';

const COMPILER_CONFIG: Record<string, { compiler: string; preprocess?: (code: string) => string }> = {
  c: { compiler: 'gcc-head-c' },
  cpp: { compiler: 'gcc-head' },
  java: {
    compiler: 'openjdk-jdk-22+36',
    // Wandbox requires non-public class since filename isn't Main.java
    preprocess: (code: string) => code.replace(/public\s+class\s+/g, 'class '),
  },
  python: { compiler: 'cpython-3.14.0' },
};

export async function POST(request: NextRequest) {
  try {
    const { language, code } = await request.json();

    const config = COMPILER_CONFIG[language];
    if (!config) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const processedCode = config.preprocess ? config.preprocess(code) : code;

    const response = await fetch(WANDBOX_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: config.compiler,
        code: processedCode,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Wandbox API error: ${text}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Normalize Wandbox response to match what api-engine expects
    const stdout = data.program_output ?? '';
    const compileError = data.compiler_error ?? '';
    const runtimeError = data.program_error ?? '';
    const stderr = compileError || runtimeError;

    return NextResponse.json({
      run: {
        stdout,
        stderr,
        code: data.status === '0' ? 0 : 1,
        output: stdout + stderr,
      },
      compile: compileError
        ? { stdout: '', stderr: compileError, code: 1 }
        : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
