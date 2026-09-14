'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Search, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
  state: 'default' | 'active' | 'found' | 'comparing' | 'inserting' | 'removing';
}

function createNode(value: number, state: TreeNode['state'] = 'default'): TreeNode {
  return { value, left: null, right: null, id: `tn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, state };
}

function insertBST(root: TreeNode | null, value: number): TreeNode {
  if (!root) return createNode(value, 'inserting');
  const newRoot = { ...root };
  if (value < root.value) {
    newRoot.left = insertBST(root.left, value);
  } else if (value > root.value) {
    newRoot.right = insertBST(root.right, value);
  }
  return newRoot;
}

function findMin(node: TreeNode): TreeNode {
  let current = node;
  while (current.left) current = current.left;
  return current;
}

function deleteBST(root: TreeNode | null, value: number): TreeNode | null {
  if (!root) return null;
  if (value < root.value) {
    return { ...root, left: deleteBST(root.left, value) };
  } else if (value > root.value) {
    return { ...root, right: deleteBST(root.right, value) };
  } else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    const min = findMin(root.right);
    return { ...root, value: min.value, right: deleteBST(root.right, min.value) };
  }
}

function resetAllStates(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return { ...node, state: 'default', left: resetAllStates(node.left), right: resetAllStates(node.right) };
}

function getTreeDepth(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

function countNodes(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

// Build initial tree
function buildInitialTree(): TreeNode {
  let root: TreeNode | null = null;
  for (const v of [30, 15, 45, 8, 22, 38, 55]) {
    root = insertBST(root, v);
  }
  return resetAllStates(root) as TreeNode;
}

// Render helper: flatten tree to positioned nodes for SVG rendering
interface PositionedNode {
  node: TreeNode;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

function flattenTree(
  node: TreeNode | null,
  x: number,
  y: number,
  spread: number,
  parentX?: number,
  parentY?: number,
): PositionedNode[] {
  if (!node) return [];
  const current: PositionedNode = { node, x, y, parentX, parentY };
  return [
    current,
    ...flattenTree(node.left, x - spread, y + 70, spread * 0.55, x, y),
    ...flattenTree(node.right, x + spread, y + 70, spread * 0.55, x, y),
  ];
}

export function TreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(() => buildInitialTree());
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState('');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightPath, setHighlightPath] = useState<string[]>([]);

  const insert = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Enter a valid number'); return; }
    setRoot(prev => {
      const newTree = insertBST(prev, val);
      setTimeout(() => setRoot(r => resetAllStates(r)), 800);
      return newTree;
    });
    setInputValue('');
    setMessage(`Inserted ${val} into BST`);
  };

  const remove = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) { setMessage('Enter a number to delete'); return; }
    setRoot(prev => deleteBST(prev, val));
    setInputValue('');
    setMessage(`Deleted ${val} from BST`);
  };

  const search = async () => {
    const val = parseInt(searchValue);
    if (isNaN(val)) { setMessage('Enter a number to search'); return; }
    setIsAnimating(true);
    setRoot(prev => resetAllStates(prev));

    let current = root;
    const path: string[] = [];
    let found = false;

    const setNodeState = (nodeId: string, state: TreeNode['state']) => {
      const updateState = (node: TreeNode | null): TreeNode | null => {
        if (!node) return null;
        if (node.id === nodeId) return { ...node, state };
        return { ...node, left: updateState(node.left), right: updateState(node.right) };
      };
      setRoot(prev => updateState(prev));
    };

    while (current) {
      path.push(current.id);
      setHighlightPath([...path]);
      setNodeState(current.id, 'comparing');
      await new Promise(resolve => setTimeout(resolve, 600));

      if (val === current.value) {
        setNodeState(current.id, 'found');
        found = true;
        break;
      } else if (val < current.value) {
        setNodeState(current.id, 'active');
        current = current.left;
      } else {
        setNodeState(current.id, 'active');
        current = current.right;
      }
    }

    setMessage(found ? `Found ${val} in BST (visited ${path.length} nodes)` : `${val} not found in BST`);
    setIsAnimating(false);
    setTimeout(() => {
      setRoot(prev => resetAllStates(prev));
      setHighlightPath([]);
    }, 2000);
  };

  const doTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    const result: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      if (type === 'preorder') result.push(node.value);
      traverse(node.left);
      if (type === 'inorder') result.push(node.value);
      traverse(node.right);
      if (type === 'postorder') result.push(node.value);
    };
    traverse(root);
    setTraversalResult(result);
    setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal: [${result.join(', ')}]`);
  };

  const reset = () => {
    setIsAnimating(false);
    setHighlightPath([]);
    setRoot(buildInitialTree());
    setTraversalResult([]);
    setMessage('Tree reset');
  };

  const depth = getTreeDepth(root);
  const nodeCount = countNodes(root);
  const positions = flattenTree(root, 300, 30, 130);

  // Compute SVG bounds dynamically from node positions to prevent overflow
  const minX = positions.length > 0 ? Math.min(...positions.map(p => p.x)) - 30 : 0;
  const maxX = positions.length > 0 ? Math.max(...positions.map(p => p.x)) + 30 : 600;
  const maxY = positions.length > 0 ? Math.max(...positions.map(p => p.y)) + 40 : 200;
  const svgWidth = Math.max(maxX - minX, 200);
  const svgHeight = Math.max(maxY, 200);

  const stateColors: Record<string, { fill: string; stroke: string; text: string }> = {
    default: { fill: 'fill-accent/20', stroke: 'stroke-accent/50', text: 'fill-foreground' },
    active: { fill: 'fill-blue-500/20', stroke: 'stroke-blue-500', text: 'fill-blue-400' },
    found: { fill: 'fill-green-500/30', stroke: 'stroke-green-500', text: 'fill-green-400' },
    comparing: { fill: 'fill-yellow-500/20', stroke: 'stroke-yellow-500', text: 'fill-yellow-400' },
    inserting: { fill: 'fill-purple-500/20', stroke: 'stroke-purple-500', text: 'fill-purple-400' },
    removing: { fill: 'fill-red-500/20', stroke: 'stroke-red-500', text: 'fill-red-400' },
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
            onKeyDown={e => e.key === 'Enter' && insert()}
          />
          <button onClick={insert} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 transition-colors disabled:opacity-50">
            <Plus className="w-3.5 h-3.5 inline mr-1" />Insert
          </button>
          <button onClick={remove} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5 inline mr-1" />Delete
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="w-20 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={isAnimating}
          />
          <button onClick={search} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-colors disabled:opacity-50">
            <Search className="w-3.5 h-3.5 inline mr-1" />Search
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => doTraversal('inorder')} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50">
            Inorder
          </button>
          <button onClick={() => doTraversal('preorder')} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50">
            Preorder
          </button>
          <button onClick={() => doTraversal('postorder')} disabled={isAnimating} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors disabled:opacity-50">
            Postorder
          </button>
        </div>
        <button onClick={reset} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-secondary text-muted hover:text-foreground border border-border transition-colors ml-auto">
          <RotateCcw className="w-3.5 h-3.5 inline mr-1" />Reset
        </button>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent font-mono bg-accent/5 px-3 py-2 rounded-lg border border-accent/20"
        >
          {message}
        </motion.div>
      )}

      {/* Tree Visualization */}
      <div className="bg-surface rounded-xl border border-border p-4 overflow-x-auto">
        {root ? (
          <svg viewBox={`${minX} 0 ${svgWidth} ${svgHeight}`} className="mx-auto w-full" style={{ maxHeight: svgHeight }} preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {positions.map((pos) =>
              pos.parentX !== undefined && pos.parentY !== undefined ? (
                <line
                  key={`edge-${pos.node.id}`}
                  x1={pos.parentX}
                  y1={pos.parentY + 20}
                  x2={pos.x}
                  y2={pos.y}
                  className={cn(
                    'stroke-2 transition-all duration-300',
                    highlightPath.includes(pos.node.id) ? 'stroke-accent' : 'stroke-border'
                  )}
                />
              ) : null
            )}
            {/* Nodes */}
            {positions.map((pos) => {
              const colors = stateColors[pos.node.state] || stateColors.default;
              return (
                <g key={pos.node.id}>
                  <circle
                    cx={pos.x}
                    cy={pos.y + 10}
                    r={20}
                    className={cn(
                      'stroke-2 transition-all duration-300',
                      colors.fill,
                      colors.stroke
                    )}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 15}
                    textAnchor="middle"
                    className={cn('text-xs font-mono font-bold', colors.text)}
                  >
                    {pos.node.value}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="text-muted text-sm italic text-center py-12">Tree is empty</div>
        )}
      </div>

      {/* Traversal Result */}
      {traversalResult.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {traversalResult.map((val, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-2.5 py-1 rounded-md bg-accent/10 text-accent font-mono text-sm border border-accent/20"
            >
              {val}
            </motion.span>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Nodes</div>
          <div className="font-mono font-bold text-foreground">{nodeCount}</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Depth</div>
          <div className="font-mono font-bold text-foreground">{depth}</div>
        </div>
        <div className="bg-surface rounded-lg border border-border p-3 text-center">
          <div className="text-muted mb-1">Search</div>
          <div className="font-mono font-bold text-green-400">O(log n)</div>
        </div>
      </div>
    </div>
  );
}
