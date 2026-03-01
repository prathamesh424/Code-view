'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { cn } from '@/lib/utils';

type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'current' | 'frontier';
type PathAlgorithm = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

const ROWS = 20;
const COLS = 35;

function createGrid(): CellType[][] {
  const grid: CellType[][] = Array.from({ length: ROWS }, () => Array(COLS).fill('empty'));
  grid[2][2] = 'start';
  grid[ROWS - 3][COLS - 3] = 'end';
  return grid;
}

function getNeighbors(row: number, col: number): [number, number][] {
  const neighbors: [number, number][] = [];
  if (row > 0) neighbors.push([row - 1, col]);
  if (row < ROWS - 1) neighbors.push([row + 1, col]);
  if (col > 0) neighbors.push([row, col - 1]);
  if (col < COLS - 1) neighbors.push([row, col + 1]);
  return neighbors;
}

function heuristic(r1: number, c1: number, r2: number, c2: number): number {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

export function PathfindingVisualizer() {
  const [grid, setGrid] = useState<CellType[][]>(() => createGrid());
  const [algorithm, setAlgorithm] = useState<PathAlgorithm>('astar');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(70);
  const [tool, setTool] = useState<'wall' | 'erase' | 'start' | 'end'>('wall');
  const [visited, setVisited] = useState(0);
  const [pathLen, setPathLen] = useState(0);
  const [message, setMessage] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const cancelRef = useRef(false);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  const sleep = useCallback(() => {
    const ms = Math.max(1, 100 - speedRef.current);
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  const findCell = useCallback((type: CellType): [number, number] | null => {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (grid[r][c] === type) return [r, c];
    return null;
  }, [grid]);

  const handleCellClick = (row: number, col: number) => {
    if (isRunning) return;
    setGrid(prev => {
      const copy = prev.map(r => [...r]);
      if (tool === 'wall' && copy[row][col] === 'empty') {
        copy[row][col] = 'wall';
      } else if (tool === 'erase' && (copy[row][col] === 'wall')) {
        copy[row][col] = 'empty';
      } else if (tool === 'start') {
        // Remove old start
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            if (copy[r][c] === 'start') copy[r][c] = 'empty';
        copy[row][col] = 'start';
      } else if (tool === 'end') {
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            if (copy[r][c] === 'end') copy[r][c] = 'empty';
        copy[row][col] = 'end';
      }
      return copy;
    });
  };

  const handleCellDrag = (row: number, col: number) => {
    if (!isDrawing || isRunning) return;
    if (tool === 'wall' && grid[row][col] === 'empty') {
      setGrid(prev => {
        const copy = prev.map(r => [...r]);
        copy[row][col] = 'wall';
        return copy;
      });
    } else if (tool === 'erase' && grid[row][col] === 'wall') {
      setGrid(prev => {
        const copy = prev.map(r => [...r]);
        copy[row][col] = 'empty';
        return copy;
      });
    }
  };

  const clearPath = useCallback(() => {
    setGrid(prev => prev.map(row => row.map(cell =>
      cell === 'visited' || cell === 'path' || cell === 'current' || cell === 'frontier' ? 'empty' : cell
    )));
    setVisited(0);
    setPathLen(0);
    setMessage('');
  }, []);

  const generateMaze = () => {
    if (isRunning) return;
    const newGrid = createGrid();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newGrid[r][c] === 'empty' && Math.random() < 0.3) {
          newGrid[r][c] = 'wall';
        }
      }
    }
    setGrid(newGrid);
    setVisited(0);
    setPathLen(0);
    setMessage('');
  };

  const reconstructPath = async (cameFrom: Map<string, string>, endKey: string) => {
    const path: string[] = [];
    let current = endKey;
    while (cameFrom.has(current)) {
      path.push(current);
      current = cameFrom.get(current)!;
    }
    path.reverse();

    for (const key of path) {
      if (cancelRef.current) break;
      const [r, c] = key.split(',').map(Number);
      setGrid(prev => {
        const copy = prev.map(row => [...row]);
        if (copy[r][c] !== 'start' && copy[r][c] !== 'end') copy[r][c] = 'path';
        return copy;
      });
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    setPathLen(path.length);
  };

  const runBFS = async () => {
    const start = findCell('start');
    const end = findCell('end');
    if (!start || !end) { setMessage('Place start and end points'); return; }

    cancelRef.current = false;
    setIsRunning(true);
    clearPath();

    const queue: [number, number][] = [start];
    const visited = new Set<string>();
    const cameFrom = new Map<string, string>();
    const startKey = `${start[0]},${start[1]}`;
    const endKey = `${end[0]},${end[1]}`;
    visited.add(startKey);
    let visitedCount = 0;

    while (queue.length > 0 && !cancelRef.current) {
      const [r, c] = queue.shift()!;
      const key = `${r},${c}`;

      if (key === endKey) {
        await reconstructPath(cameFrom, endKey);
        setMessage(`Path found! Length: ${cameFrom.size > 0 ? 'traced' : 0}`);
        setIsRunning(false);
        return;
      }

      setGrid(prev => {
        const copy = prev.map(row => [...row]);
        if (copy[r][c] !== 'start') copy[r][c] = 'visited';
        return copy;
      });
      visitedCount++;
      setVisited(visitedCount);
      await sleep();

      for (const [nr, nc] of getNeighbors(r, c)) {
        const nKey = `${nr},${nc}`;
        if (!visited.has(nKey) && grid[nr][nc] !== 'wall') {
          visited.add(nKey);
          cameFrom.set(nKey, key);
          queue.push([nr, nc]);
          setGrid(prev => {
            const copy = prev.map(row => [...row]);
            if (copy[nr][nc] !== 'end') copy[nr][nc] = 'frontier';
            return copy;
          });
        }
      }
    }

    setMessage(cancelRef.current ? 'Cancelled' : 'No path found!');
    setIsRunning(false);
  };

  const runDFS = async () => {
    const start = findCell('start');
    const end = findCell('end');
    if (!start || !end) { setMessage('Place start and end points'); return; }

    cancelRef.current = false;
    setIsRunning(true);
    clearPath();

    const stack: [number, number][] = [start];
    const visitedSet = new Set<string>();
    const cameFrom = new Map<string, string>();
    const endKey = `${end[0]},${end[1]}`;
    let visitedCount = 0;

    while (stack.length > 0 && !cancelRef.current) {
      const [r, c] = stack.pop()!;
      const key = `${r},${c}`;

      if (visitedSet.has(key)) continue;
      visitedSet.add(key);

      if (key === endKey) {
        await reconstructPath(cameFrom, endKey);
        setMessage('Path found!');
        setIsRunning(false);
        return;
      }

      setGrid(prev => {
        const copy = prev.map(row => [...row]);
        if (copy[r][c] !== 'start') copy[r][c] = 'visited';
        return copy;
      });
      visitedCount++;
      setVisited(visitedCount);
      await sleep();

      for (const [nr, nc] of getNeighbors(r, c)) {
        const nKey = `${nr},${nc}`;
        if (!visitedSet.has(nKey) && grid[nr][nc] !== 'wall') {
          if (!cameFrom.has(nKey)) cameFrom.set(nKey, key);
          stack.push([nr, nc]);
        }
      }
    }

    setMessage(cancelRef.current ? 'Cancelled' : 'No path found!');
    setIsRunning(false);
  };

  const runDijkstra = async () => {
    const start = findCell('start');
    const end = findCell('end');
    if (!start || !end) { setMessage('Place start and end points'); return; }

    cancelRef.current = false;
    setIsRunning(true);
    clearPath();

    const dist = new Map<string, number>();
    const cameFrom = new Map<string, string>();
    const visitedSet = new Set<string>();
    const startKey = `${start[0]},${start[1]}`;
    const endKey = `${end[0]},${end[1]}`;
    dist.set(startKey, 0);
    let visitedCount = 0;

    // Simple priority queue using array
    const pq: { key: string; dist: number }[] = [{ key: startKey, dist: 0 }];

    while (pq.length > 0 && !cancelRef.current) {
      pq.sort((a, b) => a.dist - b.dist);
      const { key } = pq.shift()!;
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);

      const [r, c] = key.split(',').map(Number);

      if (key === endKey) {
        await reconstructPath(cameFrom, endKey);
        setMessage(`Path found! Distance: ${dist.get(endKey)}`);
        setIsRunning(false);
        return;
      }

      setGrid(prev => {
        const copy = prev.map(row => [...row]);
        if (copy[r][c] !== 'start') copy[r][c] = 'visited';
        return copy;
      });
      visitedCount++;
      setVisited(visitedCount);
      await sleep();

      for (const [nr, nc] of getNeighbors(r, c)) {
        const nKey = `${nr},${nc}`;
        if (!visitedSet.has(nKey) && grid[nr][nc] !== 'wall') {
          const newDist = (dist.get(key) || 0) + 1;
          if (newDist < (dist.get(nKey) ?? Infinity)) {
            dist.set(nKey, newDist);
            cameFrom.set(nKey, key);
            pq.push({ key: nKey, dist: newDist });
            setGrid(prev => {
              const copy = prev.map(row => [...row]);
              if (copy[nr][nc] !== 'end') copy[nr][nc] = 'frontier';
              return copy;
            });
          }
        }
      }
    }

    setMessage(cancelRef.current ? 'Cancelled' : 'No path found!');
    setIsRunning(false);
  };

  const runAStar = async () => {
    const start = findCell('start');
    const end = findCell('end');
    if (!start || !end) { setMessage('Place start and end points'); return; }

    cancelRef.current = false;
    setIsRunning(true);
    clearPath();

    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const cameFrom = new Map<string, string>();
    const visitedSet = new Set<string>();
    const startKey = `${start[0]},${start[1]}`;
    const endKey = `${end[0]},${end[1]}`;
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(start[0], start[1], end[0], end[1]));
    let visitedCount = 0;

    const openSet: { key: string; f: number }[] = [{ key: startKey, f: fScore.get(startKey)! }];

    while (openSet.length > 0 && !cancelRef.current) {
      openSet.sort((a, b) => a.f - b.f);
      const { key } = openSet.shift()!;
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);

      const [r, c] = key.split(',').map(Number);

      if (key === endKey) {
        await reconstructPath(cameFrom, endKey);
        setMessage(`Path found! A* optimal.`);
        setIsRunning(false);
        return;
      }

      setGrid(prev => {
        const copy = prev.map(row => [...row]);
        if (copy[r][c] !== 'start') copy[r][c] = 'visited';
        return copy;
      });
      visitedCount++;
      setVisited(visitedCount);
      await sleep();

      for (const [nr, nc] of getNeighbors(r, c)) {
        const nKey = `${nr},${nc}`;
        if (!visitedSet.has(nKey) && grid[nr][nc] !== 'wall') {
          const tentativeG = (gScore.get(key) || 0) + 1;
          if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
            gScore.set(nKey, tentativeG);
            const f = tentativeG + heuristic(nr, nc, end[0], end[1]);
            fScore.set(nKey, f);
            cameFrom.set(nKey, key);
            openSet.push({ key: nKey, f });
            setGrid(prev => {
              const copy = prev.map(row => [...row]);
              if (copy[nr][nc] !== 'end') copy[nr][nc] = 'frontier';
              return copy;
            });
          }
        }
      }
    }

    setMessage(cancelRef.current ? 'Cancelled' : 'No path found!');
    setIsRunning(false);
  };

  const run = () => {
    const algos: Record<PathAlgorithm, () => Promise<void>> = {
      bfs: runBFS,
      dfs: runDFS,
      dijkstra: runDijkstra,
      astar: runAStar,
    };
    algos[algorithm]();
  };

  const stop = () => {
    cancelRef.current = true;
    setIsRunning(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setIsRunning(false);
    setGrid(createGrid());
    setVisited(0);
    setPathLen(0);
    setMessage('');
  };

  const cellColors: Record<CellType, string> = {
    empty: 'bg-surface-secondary hover:bg-surface-tertiary',
    wall: 'bg-foreground/80',
    start: 'bg-green-500',
    end: 'bg-red-500',
    visited: 'bg-blue-500/30',
    path: 'bg-yellow-400',
    current: 'bg-orange-500',
    frontier: 'bg-purple-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as PathAlgorithm)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
            <option value="dijkstra">Dijkstra</option>
            <option value="astar">A* Search</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-muted">Tool:</label>
          {(['wall', 'erase', 'start', 'end'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTool(t)}
              disabled={isRunning}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50',
                tool === t
                  ? 'bg-accent/10 text-accent border-accent'
                  : 'bg-surface-secondary text-muted border-border hover:text-foreground'
              )}
            >
              {t === 'wall' ? '🧱 Wall' : t === 'erase' ? '🧹 Erase' : t === 'start' ? '🟢 Start' : '🔴 End'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <FastForward className="w-3.5 h-3.5 text-muted" />
          <input
            type="range"
            min={1}
            max={99}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-20 accent-accent"
          />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={isRunning ? stop : run}
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              isRunning
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
            )}
          >
            {isRunning ? <><Pause className="w-3.5 h-3.5 inline mr-1" />Stop</> : <><Play className="w-3.5 h-3.5 inline mr-1" />Find Path</>}
          </button>
          <button onClick={() => { clearPath(); }} disabled={isRunning} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50">
            Clear Path
          </button>
          <button onClick={generateMaze} disabled={isRunning} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50">
            Random Maze
          </button>
          <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors">
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted">Visited:</span>
          <span className="font-mono font-bold text-blue-400">{visited}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted">Path Length:</span>
          <span className="font-mono font-bold text-yellow-400">{pathLen}</span>
        </div>
        {message && <span className="font-mono text-accent">{message}</span>}
      </div>

      {/* Grid */}
      <div className="bg-surface rounded-xl border border-border p-3 overflow-x-auto">
        <div
          className="inline-grid gap-[1px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          onMouseLeave={() => setIsDrawing(false)}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={cn(
                  'w-[18px] h-[18px] rounded-[2px] transition-colors duration-75 cursor-pointer',
                  cellColors[cell]
                )}
                onMouseDown={() => { setIsDrawing(true); handleCellClick(r, c); }}
                onMouseEnter={() => handleCellDrag(r, c)}
                onMouseUp={() => setIsDrawing(false)}
              />
            ))
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-foreground mb-1">BFS</h4>
            <div className="text-muted font-mono">Guaranteed shortest path. O(V+E)</div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-1">DFS</h4>
            <div className="text-muted font-mono">Not shortest. O(V+E). Deep exploration.</div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-1">Dijkstra</h4>
            <div className="text-muted font-mono">Shortest (weighted). O((V+E)logV)</div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-1">A*</h4>
            <div className="text-muted font-mono">Optimal + heuristic. Fastest in practice.</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Empty', color: 'bg-surface-secondary' },
          { label: 'Wall', color: 'bg-foreground/80' },
          { label: 'Start', color: 'bg-green-500' },
          { label: 'End', color: 'bg-red-500' },
          { label: 'Visited', color: 'bg-blue-500/30' },
          { label: 'Frontier', color: 'bg-purple-500/30' },
          { label: 'Path', color: 'bg-yellow-400' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded-sm', l.color)} />
            <span className="text-muted">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
