'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

type PuzzleType = 'nqueens' | 'sudoku';

interface QueenBoard {
  size: number;
  queens: number[]; // queens[row] = col
  state: ('empty' | 'queen' | 'conflict' | 'checking' | 'safe')[][];
}

interface SudokuBoard {
  cells: { value: number; state: 'given' | 'placed' | 'checking' | 'backtrack' | 'empty' }[][];
}

const SAMPLE_SUDOKU = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export function BacktrackingVisualizer() {
  const [puzzle, setPuzzle] = useState<PuzzleType>('nqueens');
  const [boardSize, setBoardSize] = useState(8);
  const [queenBoard, setQueenBoard] = useState<QueenBoard | null>(null);
  const [sudokuBoard, setSudokuBoard] = useState<SudokuBoard | null>(null);
  const [message, setMessage] = useState('Select a puzzle and click Solve');
  const [isAnimating, setIsAnimating] = useState(false);
  const [steps, setSteps] = useState(0);
  const [backtracks, setBacktracks] = useState(0);
  const cancelRef = useRef(false);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const createQueenBoard = (size: number): QueenBoard => ({
    size,
    queens: [],
    state: Array.from({ length: size }, () => Array(size).fill('empty')),
  });

  const isSafeQueen = (queens: number[], row: number, col: number): boolean => {
    for (let r = 0; r < row; r++) {
      const c = queens[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  };

  const solveNQueens = async () => {
    const board = createQueenBoard(boardSize);
    setQueenBoard({ ...board });
    let stepCount = 0, btCount = 0;

    const solve = async (row: number): Promise<boolean> => {
      if (cancelRef.current) return false;
      if (row === boardSize) return true;

      for (let col = 0; col < boardSize; col++) {
        if (cancelRef.current) return false;
        stepCount++;
        setSteps(stepCount);

        // Mark checking
        board.state[row][col] = 'checking';
        setQueenBoard({ ...board, state: board.state.map(r => [...r]) });
        setMessage(`Trying queen at (${row}, ${col})`);
        await sleep(Math.max(30, 200 - boardSize * 15));

        if (isSafeQueen(board.queens, row, col)) {
          board.queens[row] = col;
          board.state[row][col] = 'queen';

          // Mark safe
          for (let c = 0; c < boardSize; c++) {
            if (c !== col) board.state[row][c] = 'safe';
          }
          setQueenBoard({ ...board, queens: [...board.queens], state: board.state.map(r => [...r]) });
          await sleep(Math.max(30, 150 - boardSize * 10));

          if (await solve(row + 1)) return true;

          // Backtrack
          btCount++;
          setBacktracks(btCount);
          board.queens.length = row;
          for (let c = 0; c < boardSize; c++) {
            board.state[row][c] = 'empty';
          }
          board.state[row][col] = 'conflict';
          setQueenBoard({ ...board, queens: [...board.queens], state: board.state.map(r => [...r]) });
          setMessage(`Backtracking from (${row}, ${col})`);
          await sleep(Math.max(20, 100 - boardSize * 8));
          board.state[row][col] = 'empty';
        } else {
          board.state[row][col] = 'conflict';
          setQueenBoard({ ...board, state: board.state.map(r => [...r]) });
          await sleep(Math.max(20, 80 - boardSize * 5));
          board.state[row][col] = 'empty';
        }
      }
      return false;
    };

    if (await solve(0)) {
      // Mark all queens
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          board.state[r][c] = board.queens[r] === c ? 'queen' : 'empty';
        }
      }
      setQueenBoard({ ...board, state: board.state.map(r => [...r]) });
      setMessage(`Solution found! ${stepCount} steps, ${btCount} backtracks`);
    } else {
      setMessage('No solution exists');
    }
  };

  const solveSudoku = async () => {
    const cells = SAMPLE_SUDOKU.map(row =>
      row.map(v => ({
        value: v,
        state: (v !== 0 ? 'given' : 'empty') as 'given' | 'placed' | 'checking' | 'backtrack' | 'empty',
      }))
    );
    setSudokuBoard({ cells: cells.map(r => r.map(c => ({ ...c }))) });
    let stepCount = 0, btCount = 0;

    const isValidSudoku = (grid: typeof cells, row: number, col: number, num: number): boolean => {
      for (let i = 0; i < 9; i++) {
        if (grid[row][i].value === num) return false;
        if (grid[i][col].value === num) return false;
      }
      const br = Math.floor(row / 3) * 3, bc = Math.floor(col / 3) * 3;
      for (let i = br; i < br + 3; i++) {
        for (let j = bc; j < bc + 3; j++) {
          if (grid[i][j].value === num) return false;
        }
      }
      return true;
    };

    const findEmpty = (grid: typeof cells): [number, number] | null => {
      for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
          if (grid[i][j].value === 0) return [i, j];
      return null;
    };

    const solve = async (): Promise<boolean> => {
      if (cancelRef.current) return false;
      const pos = findEmpty(cells);
      if (!pos) return true;
      const [row, col] = pos;

      for (let num = 1; num <= 9; num++) {
        if (cancelRef.current) return false;
        stepCount++;
        setSteps(stepCount);

        cells[row][col] = { value: num, state: 'checking' };
        setSudokuBoard({ cells: cells.map(r => r.map(c => ({ ...c }))) });
        setMessage(`Trying ${num} at (${row}, ${col})`);
        await sleep(30);

        if (isValidSudoku(cells, row, col, num)) {
          cells[row][col] = { value: num, state: 'placed' };
          setSudokuBoard({ cells: cells.map(r => r.map(c => ({ ...c }))) });
          await sleep(20);

          if (await solve()) return true;

          btCount++;
          setBacktracks(btCount);
          cells[row][col] = { value: num, state: 'backtrack' };
          setSudokuBoard({ cells: cells.map(r => r.map(c => ({ ...c }))) });
          await sleep(20);
          cells[row][col] = { value: 0, state: 'empty' };
        }
      }

      cells[row][col] = { value: 0, state: 'empty' };
      setSudokuBoard({ cells: cells.map(r => r.map(c => ({ ...c }))) });
      return false;
    };

    if (await solve()) {
      cells.forEach(row => row.forEach(cell => {
        if (cell.state !== 'given') cell.state = 'placed';
      }));
      setSudokuBoard({ cells: cells.map(r => r.map(c => ({ ...c }))) });
      setMessage(`Solved! ${stepCount} steps, ${btCount} backtracks`);
    } else {
      setMessage('No solution exists');
    }
  };

  const animate = async () => {
    cancelRef.current = false;
    setIsAnimating(true);
    setSteps(0);
    setBacktracks(0);
    if (puzzle === 'nqueens') await solveNQueens();
    else await solveSudoku();
    setIsAnimating(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setIsAnimating(false);
    setQueenBoard(null);
    setSudokuBoard(null);
    setSteps(0);
    setBacktracks(0);
    setMessage('Select a puzzle and click Solve');
  };

  const queenCellColor = (state: string) => {
    switch (state) {
      case 'queen': return 'bg-accent/20 border-accent';
      case 'conflict': return 'bg-red-500/20 border-red-500';
      case 'checking': return 'bg-yellow-500/20 border-yellow-500';
      case 'safe': return 'bg-green-500/10 border-green-500/30';
      default: return 'bg-surface-secondary border-border';
    }
  };

  const sudokuCellColor = (state: string) => {
    switch (state) {
      case 'given': return 'bg-surface-secondary border-border text-foreground font-bold';
      case 'placed': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'checking': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'backtrack': return 'bg-red-500/20 border-red-500 text-red-400';
      default: return 'bg-surface border-border/50 text-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={() => setPuzzle('nqueens')} disabled={isAnimating}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
            puzzle === 'nqueens' ? 'bg-accent/10 text-accent border-accent/30' : 'bg-surface-secondary text-muted border-border hover:text-foreground')}>
          <Crown className="w-3.5 h-3.5 inline mr-1" />N-Queens
        </button>
        <button onClick={() => setPuzzle('sudoku')} disabled={isAnimating}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
            puzzle === 'sudoku' ? 'bg-accent/10 text-accent border-accent/30' : 'bg-surface-secondary text-muted border-border hover:text-foreground')}>
          Sudoku
        </button>
        {puzzle === 'nqueens' && (
          <select value={boardSize} onChange={e => setBoardSize(parseInt(e.target.value))} disabled={isAnimating}
            className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs text-foreground focus:outline-none">
            {[4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n}×{n}</option>)}
          </select>
        )}
        <button onClick={animate} disabled={isAnimating}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
          <Play className="w-3.5 h-3.5 inline mr-1" />Solve
        </button>
        <button onClick={reset}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
      </div>

      {message && (
        <motion.div key={message} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20">{message}</motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-4 flex items-center justify-center">
          {puzzle === 'nqueens' && queenBoard ? (
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
              {queenBoard.state.map((row, ri) =>
                row.map((cell, ci) => (
                  <div key={`${ri}-${ci}`}
                    className={cn('w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center text-sm transition-all duration-200',
                      queenCellColor(cell),
                      (ri + ci) % 2 === 0 ? 'opacity-100' : 'opacity-80'
                    )}>
                    {cell === 'queen' && <Crown className="w-4 h-4 text-accent" />}
                  </div>
                ))
              )}
            </div>
          ) : puzzle === 'sudoku' && sudokuBoard ? (
            <div className="inline-grid grid-cols-9 gap-px border-2 border-border rounded-lg overflow-hidden">
              {sudokuBoard.cells.map((row, ri) =>
                row.map((cell, ci) => (
                  <div key={`${ri}-${ci}`}
                    className={cn(
                      'w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs font-mono transition-all duration-100',
                      sudokuCellColor(cell.state),
                      ci % 3 === 2 && ci < 8 ? 'border-r-2 border-r-border' : 'border-r border-r-border/30',
                      ri % 3 === 2 && ri < 8 ? 'border-b-2 border-b-border' : 'border-b border-b-border/30',
                    )}>
                    {cell.value !== 0 ? cell.value : ''}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-muted text-sm italic text-center py-16">Click Solve to start</div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-4 text-xs">
            <h3 className="font-bold text-muted mb-2">Stats</h3>
            <div className="space-y-1 font-mono text-muted">
              <div>Puzzle: <span className="text-accent">{puzzle === 'nqueens' ? `${boardSize}-Queens` : 'Sudoku'}</span></div>
              <div>Steps: <span className="text-foreground">{steps}</span></div>
              <div>Backtracks: <span className="text-red-400">{backtracks}</span></div>
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-3">
            <h3 className="text-xs font-bold text-muted mb-2">Legend</h3>
            <div className="space-y-1.5 text-[11px]">
              {(puzzle === 'nqueens'
                ? [['Queen', 'bg-accent/20 border-accent'], ['Checking', 'bg-yellow-500/20 border-yellow-500'], ['Conflict', 'bg-red-500/20 border-red-500'], ['Safe', 'bg-green-500/10 border-green-500/30']]
                : [['Given', 'bg-surface-secondary border-border'], ['Placed', 'bg-green-500/10 border-green-500/30'], ['Checking', 'bg-yellow-500/20 border-yellow-500'], ['Backtrack', 'bg-red-500/20 border-red-500']]
              ).map(([label, cls]) => (
                <div key={label as string} className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded border', cls)} />
                  <span className="text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-xs text-muted">
            <h3 className="font-bold mb-2">How it works</h3>
            <p className="leading-relaxed">
              {puzzle === 'nqueens'
                ? `Place ${boardSize} queens on a ${boardSize}×${boardSize} board so no two queens threaten each other. Uses recursive backtracking — tries each column, backtracks on conflicts.`
                : 'Fill the 9×9 grid with digits 1-9 so each row, column, and 3×3 box contains all digits. Uses recursive backtracking with constraint checking.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
