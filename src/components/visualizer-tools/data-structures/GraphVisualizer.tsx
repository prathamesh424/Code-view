'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  state: 'default' | 'visiting' | 'visited' | 'current' | 'queued';
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  state: 'default' | 'active' | 'visited';
}

const INITIAL_NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 250, y: 40, state: 'default' },
  { id: 'B', label: 'B', x: 120, y: 130, state: 'default' },
  { id: 'C', label: 'C', x: 380, y: 130, state: 'default' },
  { id: 'D', label: 'D', x: 60, y: 240, state: 'default' },
  { id: 'E', label: 'E', x: 200, y: 260, state: 'default' },
  { id: 'F', label: 'F', x: 320, y: 260, state: 'default' },
  { id: 'G', label: 'G', x: 440, y: 240, state: 'default' },
];

const INITIAL_EDGES: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4, state: 'default' },
  { from: 'A', to: 'C', weight: 3, state: 'default' },
  { from: 'B', to: 'D', weight: 2, state: 'default' },
  { from: 'B', to: 'E', weight: 5, state: 'default' },
  { from: 'C', to: 'F', weight: 6, state: 'default' },
  { from: 'C', to: 'G', weight: 2, state: 'default' },
  { from: 'D', to: 'E', weight: 1, state: 'default' },
  { from: 'E', to: 'F', weight: 3, state: 'default' },
];

export function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_EDGES);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [visitOrder, setVisitOrder] = useState<string[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<'bfs' | 'dfs' | 'dijkstra'>('bfs');
  const [startNode, setStartNode] = useState('A');
  const [dragging, setDragging] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cancelRef = useRef(false);

  const resetStates = useCallback(() => {
    setNodes(prev => prev.map(n => ({ ...n, state: 'default' as const })));
    setEdges(prev => prev.map(e => ({ ...e, state: 'default' as const })));
    setVisitOrder([]);
  }, []);

  const getAdjList = useCallback((): Map<string, { node: string; weight: number }[]> => {
    const adj = new Map<string, { node: string; weight: number }[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      adj.get(e.from)?.push({ node: e.to, weight: e.weight });
      adj.get(e.to)?.push({ node: e.from, weight: e.weight });
    });
    return adj;
  }, [nodes, edges]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const setNodeState = (id: string, state: GraphNode['state']) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, state } : n));
  };

  const setEdgeState = (from: string, to: string, state: GraphEdge['state']) => {
    setEdges(prev => prev.map(e =>
      (e.from === from && e.to === to) || (e.from === to && e.to === from)
        ? { ...e, state }
        : e
    ));
  };

  const runBFS = async () => {
    setIsAnimating(true);
    resetStates();
    cancelRef.current = false;
    const adj = getAdjList();
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    const order: string[] = [];

    visited.add(startNode);
    setNodeState(startNode, 'queued');

    while (queue.length > 0 && !cancelRef.current) {
      const current = queue.shift()!;
      setNodeState(current, 'current');
      order.push(current);
      setVisitOrder([...order]);
      await sleep(600);

      for (const neighbor of adj.get(current) || []) {
        if (cancelRef.current) break;
        if (!visited.has(neighbor.node)) {
          visited.add(neighbor.node);
          queue.push(neighbor.node);
          setNodeState(neighbor.node, 'queued');
          setEdgeState(current, neighbor.node, 'active');
          await sleep(300);
        }
      }

      setNodeState(current, 'visited');
      // Mark edges to visited nodes
      for (const neighbor of adj.get(current) || []) {
        if (visited.has(neighbor.node)) {
          setEdgeState(current, neighbor.node, 'visited');
        }
      }
    }

    setMessage(`BFS Order: ${order.join(' → ')}`);
    setIsAnimating(false);
  };

  const runDFS = async () => {
    setIsAnimating(true);
    resetStates();
    cancelRef.current = false;
    const adj = getAdjList();
    const visited = new Set<string>();
    const order: string[] = [];

    const dfs = async (nodeId: string) => {
      if (cancelRef.current || visited.has(nodeId)) return;
      visited.add(nodeId);
      setNodeState(nodeId, 'current');
      order.push(nodeId);
      setVisitOrder([...order]);
      await sleep(600);

      for (const neighbor of adj.get(nodeId) || []) {
        if (cancelRef.current) break;
        if (!visited.has(neighbor.node)) {
          setEdgeState(nodeId, neighbor.node, 'active');
          await sleep(200);
          await dfs(neighbor.node);
        }
      }

      setNodeState(nodeId, 'visited');
    };

    await dfs(startNode);
    setMessage(`DFS Order: ${order.join(' → ')}`);
    setIsAnimating(false);
  };

  const runDijkstra = async () => {
    setIsAnimating(true);
    resetStates();
    cancelRef.current = false;
    const adj = getAdjList();
    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const visited = new Set<string>();
    const order: string[] = [];

    nodes.forEach(n => {
      dist.set(n.id, n.id === startNode ? 0 : Infinity);
      prev.set(n.id, null);
    });

    setNodeState(startNode, 'current');
    await sleep(400);

    while (!cancelRef.current) {
      // Find unvisited node with min distance
      let minDist = Infinity;
      let minNode: string | null = null;
      dist.forEach((d, id) => {
        if (!visited.has(id) && d < minDist) {
          minDist = d;
          minNode = id;
        }
      });

      if (minNode === null) break;

      visited.add(minNode);
      setNodeState(minNode, 'current');
      order.push(minNode);
      setVisitOrder([...order]);
      await sleep(500);

      for (const neighbor of adj.get(minNode) || []) {
        if (cancelRef.current) break;
        if (!visited.has(neighbor.node)) {
          const newDist = (dist.get(minNode) || 0) + neighbor.weight;
          if (newDist < (dist.get(neighbor.node) || Infinity)) {
            dist.set(neighbor.node, newDist);
            prev.set(neighbor.node, minNode);
            setEdgeState(minNode, neighbor.node, 'active');
            setNodeState(neighbor.node, 'queued');
            await sleep(300);
          }
        }
      }

      setNodeState(minNode, 'visited');
    }

    const distances = Array.from(dist.entries())
      .map(([id, d]) => `${id}:${d === Infinity ? '∞' : d}`)
      .join(', ');
    setMessage(`Dijkstra from ${startNode} — distances: {${distances}}`);
    setIsAnimating(false);
  };

  const runAlgo = () => {
    if (selectedAlgo === 'bfs') runBFS();
    else if (selectedAlgo === 'dfs') runDFS();
    else runDijkstra();
  };

  const stop = () => {
    cancelRef.current = true;
    setIsAnimating(false);
  };

  const reset = () => {
    cancelRef.current = true;
    setIsAnimating(false);
    setNodes(INITIAL_NODES.map(n => ({ ...n })));
    setEdges(INITIAL_EDGES.map(e => ({ ...e })));
    setVisitOrder([]);
    setMessage('');
  };

  // Drag handling
  const handleMouseDown = (nodeId: string) => {
    if (isAnimating) return;
    setDragging(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging || !svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    setNodes(prev => prev.map(n =>
      n.id === dragging ? { ...n, x: svgP.x, y: svgP.y } : n
    ));
  };

  const handleMouseUp = () => setDragging(null);

  const nodeColors: Record<string, string> = {
    default: 'fill-surface-secondary stroke-border',
    visiting: 'fill-blue-500/20 stroke-blue-500',
    visited: 'fill-green-500/20 stroke-green-500',
    current: 'fill-yellow-500/30 stroke-yellow-500',
    queued: 'fill-purple-500/20 stroke-purple-500',
  };

  const nodeTextColors: Record<string, string> = {
    default: 'fill-foreground',
    visiting: 'fill-blue-400',
    visited: 'fill-green-400',
    current: 'fill-yellow-400',
    queued: 'fill-purple-400',
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Algorithm:</label>
          <select
            value={selectedAlgo}
            onChange={(e) => setSelectedAlgo(e.target.value as 'bfs' | 'dfs' | 'dijkstra')}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
            <option value="dijkstra">Dijkstra</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted">Start:</label>
          <select
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
            disabled={isAnimating}
            className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={isAnimating ? stop : runAlgo}
          className={cn(
            'px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors',
            isAnimating
              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
              : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
          )}
        >
          {isAnimating ? (
            <><Pause className="w-3.5 h-3.5 inline mr-1" />Stop</>
          ) : (
            <><Play className="w-3.5 h-3.5 inline mr-1" />Run</>
          )}
        </button>
        <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20"
        >
          {message}
        </motion.div>
      )}

      {/* Graph Visualization */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <svg
          ref={svgRef}
          width={500}
          height={320}
          className="mx-auto cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Edges */}
          {edges.map((edge) => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  className={cn(
                    'stroke-2 transition-all duration-300',
                    edge.state === 'active' ? 'stroke-yellow-500' :
                    edge.state === 'visited' ? 'stroke-green-500/60' :
                    'stroke-border'
                  )}
                />
                <rect
                  x={midX - 10}
                  y={midY - 8}
                  width={20}
                  height={16}
                  rx={4}
                  className="fill-surface stroke-border stroke-1"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-muted"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              onMouseDown={() => handleMouseDown(node.id)}
              className="cursor-grab active:cursor-grabbing"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={22}
                className={cn(
                  'stroke-2 transition-all duration-300',
                  nodeColors[node.state]
                )}
              />
              {node.state === 'current' && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={26}
                  className="stroke-yellow-500/50 stroke-2 fill-none animate-pulse"
                />
              )}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className={cn(
                  'text-sm font-bold font-mono pointer-events-none',
                  nodeTextColors[node.state]
                )}
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
        <p className="text-center text-[10px] text-muted mt-2">Drag nodes to reposition</p>
      </div>

      {/* Visit Order */}
      {visitOrder.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4">
          <h4 className="text-xs font-bold text-muted mb-2">Visit Order</h4>
          <div className="flex items-center gap-1 flex-wrap">
            {visitOrder.map((id, i) => (
              <motion.div
                key={`${id}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center"
              >
                <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 font-mono text-sm border border-green-500/20">
                  {id}
                </span>
                {i < visitOrder.length - 1 && (
                  <span className="text-muted mx-1">→</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: 'Unvisited', color: 'bg-surface-secondary border-border' },
          { label: 'In Queue/Stack', color: 'bg-purple-500/20 border-purple-500' },
          { label: 'Current', color: 'bg-yellow-500/20 border-yellow-500' },
          { label: 'Visited', color: 'bg-green-500/20 border-green-500' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 rounded-full border', l.color)} />
            <span className="text-muted">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
