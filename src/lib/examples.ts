import type { Language } from '@/types';

export type ExampleCategory = 'algorithms' | 'data-structures' | 'programming-concepts';

export interface ExampleItem {
  id: string;
  title: string;
  category: ExampleCategory;
  language: Language;
  description: string;
  explanation: string;
  code: string;
}

export const EXAMPLE_LIBRARY: Record<ExampleCategory, ExampleItem[]> = {
  algorithms: [
    {
      id: 'bubble-sort',
      title: 'Bubble Sort',
      category: 'algorithms',
      language: 'javascript',
      description: 'Compare adjacent elements and repeatedly bubble the largest element to the end.',
      explanation: 'Great for visualizing nested loops and swap-heavy sorting behavior.',
      code: `function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}

const input = [8, 3, 1, 6, 2, 7];
console.log('Sorted:', bubbleSort(input));`,
    },
    {
      id: 'quick-sort',
      title: 'Quick Sort',
      category: 'algorithms',
      language: 'javascript',
      description: 'Divide-and-conquer sorting using a pivot and recursive partitioning.',
      explanation: 'Useful for recursion + partition visualization in one run.',
      code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

const input = [9, 4, 2, 8, 1, 6, 3];
console.log('Sorted:', quickSort(input));`,
    },
    {
      id: 'binary-search',
      title: 'Binary Search',
      category: 'algorithms',
      language: 'javascript',
      description: 'Search in a sorted array by halving the search space each step.',
      explanation: 'Perfect for understanding loop invariants and midpoint updates.',
      code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

const values = [2, 4, 7, 11, 15, 19, 22, 31];
console.log('Index:', binarySearch(values, 19));`,
    },
  ],
  'data-structures': [
    {
      id: 'stack',
      title: 'Stack',
      category: 'data-structures',
      language: 'javascript',
      description: 'LIFO structure with push and pop operations.',
      explanation: 'Visualize call-like behavior and last-in-first-out flow.',
      code: `class Stack {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
  }
  pop() {
    return this.items.pop();
  }
}

const stack = new Stack();
stack.push('first');
stack.push('second');
stack.push('third');
console.log(stack.pop());
console.log(stack.pop());`,
    },
    {
      id: 'queue',
      title: 'Queue',
      category: 'data-structures',
      language: 'javascript',
      description: 'FIFO structure with enqueue and dequeue operations.',
      explanation: 'Ideal for comparing with stack behavior during execution.',
      code: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(value) {
    this.items.push(value);
  }
  dequeue() {
    return this.items.shift();
  }
}

const queue = new Queue();
queue.enqueue('A');
queue.enqueue('B');
queue.enqueue('C');
console.log(queue.dequeue());
console.log(queue.dequeue());`,
    },
    {
      id: 'linked-list',
      title: 'Linked List',
      category: 'data-structures',
      language: 'javascript',
      description: 'Nodes connected by pointers, traversed sequentially.',
      explanation: 'Helpful for memory and pointer-like reasoning.',
      code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);

let current = head;
while (current) {
  console.log(current.value);
  current = current.next;
}`,
    },
    {
      id: 'binary-tree',
      title: 'Binary Tree',
      category: 'data-structures',
      language: 'javascript',
      description: 'Hierarchical structure with left and right child nodes.',
      explanation: 'Excellent for recursion and traversal order intuition.',
      code: `class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

const root = new TreeNode(
  10,
  new TreeNode(5, new TreeNode(2), new TreeNode(7)),
  new TreeNode(14, null, new TreeNode(20))
);

function inOrder(node) {
  if (!node) return;
  inOrder(node.left);
  console.log(node.value);
  inOrder(node.right);
}

inOrder(root);`,
    },
  ],
  'programming-concepts': [
    {
      id: 'recursion',
      title: 'Recursion',
      category: 'programming-concepts',
      language: 'javascript',
      description: 'A function calling itself with smaller inputs.',
      explanation: 'Watch call stack growth and unwind behavior clearly.',
      code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log('factorial(5) =', factorial(5));`,
    },
    {
      id: 'event-loop',
      title: 'Event Loop',
      category: 'programming-concepts',
      language: 'javascript',
      description: 'Microtasks and macrotasks scheduling in JavaScript runtime.',
      explanation: 'Essential for async debugging and interview prep.',
      code: `console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise microtask');
  })
  .then(() => {
    console.log('Chained microtask');
  });

console.log('End');`,
    },
    {
      id: 'memory-allocation',
      title: 'Memory Allocation',
      category: 'programming-concepts',
      language: 'javascript',
      description: 'Visualize stack frames vs heap objects during function calls.',
      explanation: 'Useful for understanding references and garbage collection.',
      code: `function createUser(name) {
  const user = {
    name,
    profile: {
      visits: 0,
      preferences: ['dark-mode']
    }
  };
  return user;
}

const alice = createUser('Alice');
alice.profile.visits += 1;
console.log(alice);
`,
    },
  ],
};

export const POPULAR_EXAMPLES = [
  'bubble-sort',
  'binary-search',
  'event-loop',
  'recursion',
] as const;

export const EXAMPLE_LIST: ExampleItem[] = Object.values(EXAMPLE_LIBRARY).flat();

export function getExampleById(id: string): ExampleItem | undefined {
  return EXAMPLE_LIST.find((example) => example.id === id);
}

export function buildPlaygroundUrl(example: ExampleItem): string {
  const params = new URLSearchParams({
    lang: example.language,
    code: example.code,
    example: example.id,
  });
  return `/playground?${params.toString()}`;
}
