import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper internal mutation to seed data
export const seedOldData = mutation({
  handler: async (ctx) => {
    const CHALLENGES = [
      {
        title: 'Two Sum',
        difficulty: 'easy' as const,
        category: 'Arrays',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input has exactly one solution.',
        testCases: [
          { input: '[2,7,11,15]\n9', expected: '[0,1]', description: 'Basic case' },
          { input: '[3,2,4]\n6', expected: '[1,2]', description: 'Middle elements' },
          { input: '[3,3]\n6', expected: '[0,1]', description: 'Same elements' },
        ],
        starterCode: `function twoSum(nums, target) {\n  // Your code here\n  \n}`,
        authorName: 'System',
      },
      {
        title: 'Reverse String',
        difficulty: 'easy' as const,
        category: 'Strings',
        description: 'Write a function that reverses a string. The input string is given as an array of characters `s`. Do it in-place with O(1) extra memory.',
        testCases: [
          { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]', description: 'Basic string' },
          { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]', description: 'Palindrome-like' },
          { input: '["a"]', expected: '["a"]', description: 'Single char' },
        ],
        starterCode: `function reverseString(s) {\n  // Modify s in-place\n  \n}`,
        authorName: 'System',
      },
      {
        title: 'Maximum Subarray',
        difficulty: 'medium' as const,
        category: 'Dynamic Programming',
        description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
        testCases: [
          { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6', description: 'Mixed array' },
          { input: '[1]', expected: '1', description: 'Single element' },
          { input: '[-1,-2,-3]', expected: '-1', description: 'All negative' },
          { input: '[5,4,-1,7,8]', expected: '23', description: 'Mostly positive' },
        ],
        starterCode: `function maxSubArray(nums) {\n  // Your code here\n  \n}`,
        authorName: 'System',
      },
      {
        title: 'Valid Parentheses',
        difficulty: 'easy' as const,
        category: 'Stack',
        description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if open brackets are closed by the same type and in the correct order.',
        testCases: [
          { input: '"()"', expected: 'true', description: 'Simple pair' },
          { input: '"()[]{}"', expected: 'true', description: 'Multiple types' },
          { input: '"(]"', expected: 'false', description: 'Mismatch' },
          { input: '"([{}])"', expected: 'true', description: 'Nested' },
          { input: '""', expected: 'true', description: 'Empty string' },
        ],
        starterCode: `function isValid(s) {\n  // Your code here\n  \n}`,
        authorName: 'System',
      },
      {
        title: 'Climbing Stairs',
        difficulty: 'easy' as const,
        category: 'Dynamic Programming',
        description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        testCases: [
          { input: '2', expected: '2', description: '2 steps' },
          { input: '3', expected: '3', description: '3 steps' },
          { input: '5', expected: '8', description: '5 steps' },
          { input: '1', expected: '1', description: '1 step' },
        ],
        starterCode: `function climbStairs(n) {\n  // Your code here\n  \n}`,
        authorName: 'System',
      },
      {
        title: 'Container With Most Water',
        difficulty: 'medium' as const,
        category: 'Two Pointers',
        description: 'Given n non-negative integers `height` where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container that holds the most water.',
        testCases: [
          { input: '[1,8,6,2,5,4,8,3,7]', expected: '49', description: 'Standard case' },
          { input: '[1,1]', expected: '1', description: 'Two elements' },
          { input: '[4,3,2,1,4]', expected: '16', description: 'Equal heights' },
        ],
        starterCode: `function maxArea(height) {\n  // Your code here\n  \n}`,
        authorName: 'System',
      },
    ];

    for (const c of CHALLENGES) {
      const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await ctx.db.insert("userChallenges", {
        ...c,
        slug,
        createdAt: Date.now(),
      });
    }

    const BLOG_POSTS = [
      {
        title: "JavaScript Event Loop Explained — A Complete Visual Guide",
        slug: "javascript-event-loop-explained",
        summary: "Understand how the JavaScript event loop works with interactive visualizations. Learn about the call stack, microtask queue, macrotask queue, and why Promise.then runs before setTimeout.",
        tags: ["JavaScript", "Event Loop", "Async"],
        authorName: "System",
        seoKeywords: ["javascript event loop", "event loop explained", "microtask queue", "macrotask queue", "setTimeout vs promise"],
        content: `The JavaScript event loop is one of the most important concepts every JS developer must understand. It's the mechanism that allows JavaScript — a single-threaded language — to handle asynchronous operations like network requests, timers, and user interactions without blocking the main thread.

## What Is the Event Loop?
The event loop is a continuous process that checks whether the call stack is empty. When it is, it looks at the task queues (microtask and macrotask) and pushes the next callback onto the stack for execution.

This is what makes \`setTimeout\`, \`Promise.then\`, and \`async/await\` work — they schedule callbacks onto these queues instead of blocking the main thread.

## The Call Stack
JavaScript has a single call stack, which means it can only execute one piece of code at a time. When a function is called, it's pushed onto the stack. When it returns, it's popped off. If the stack is too deep (infinite recursion), you get the famous "Maximum call stack size exceeded" error.

## Microtasks vs Macrotasks
Not all async callbacks are created equal. JavaScript has two task queues:
- **Microtask queue**: \`Promise.then\`, \`queueMicrotask\`, \`MutationObserver\`
- **Macrotask queue**: \`setTimeout\`, \`setInterval\`, \`setImmediate\`, I/O

The crucial rule: **all microtasks are processed before the next macrotask**. This is why \`Promise.then\` always executes before \`setTimeout\`, even if the timer is set to 0ms.

## Classic Interview Question
\`\`\`javascript
console.log("Start");
setTimeout(() => console.log("Timeout"), 0);
Promise.resolve().then(() => console.log("Promise"));
console.log("End");
\`\`\`
Output: \`Start → End → Promise → Timeout\`. The Promise callback (microtask) runs before the setTimeout callback (macrotask), even though both were scheduled before the call stack was empty.

### Try It Yourself
Paste this code into Code Visualizer's playground and watch the event loop process each task in real-time.

## Async/Await and the Event Loop
\`async/await\` is syntactic sugar over Promises. When you \`await\` a value, the code after the await is scheduled as a microtask. The function pauses and the event loop continues processing other tasks.

## Conclusion
The event loop is JavaScript's superpower and its biggest source of confusion. By visualizing each step — call stack, microtask queue, macrotask queue — you can build an intuitive mental model that makes async code predictable.`,
      },
      {
        title: "Python Memory Management — Reference Counting, GC & the GIL",
        slug: "python-memory-management",
        summary: "Deep dive into how CPython manages memory. Learn about reference counting, cyclic garbage collection, memory pools, and how the GIL affects multi-threaded Python programs.",
        tags: ["Python", "Memory", "GC"],
        authorName: "System",
        seoKeywords: ["python memory management", "garbage collection python", "reference counting", "GIL"],
        content: `Python makes memory management so easy that most developers never have to think about it. But under the hood, CPython (the standard Python implementation) uses a complex system to allocate, track, and free memory.

## Reference Counting: The First Line of Defense
Unlike JavaScript or Java, which rely purely on tracing garbage collectors, CPython's primary memory management tool is **reference counting**.

Every object in Python has a reference count — an integer tracking how many variables, lists, or other objects point to it.
- When you create an object (\`a = [1, 2, 3]\`), its ref count is 1.
- When you assign it to another variable (\`b = a\`), its ref count becomes 2.
- When a variable goes out of scope or is reassigned, the ref count drops.

When the reference count hits **zero**, CPython immediately reclaims the memory. This is highly deterministic and efficient.

## The Problem: Reference Cycles
Reference counting has one fatal flaw: **reference cycles**.

\`\`\`python
a = {}
b = {}
a['b'] = b
b['a'] = a

del a
del b
\`\`\`
Even though \`a\` and \`b\` are no longer accessible from the program, they point to each other. Their reference counts will never reach zero. This is a memory leak.

## The Cyclic Garbage Collector
To fix this, CPython has a secondary system: a tracing garbage collector that runs periodically to find and destroy reference cycles. It analyzes objects that can contain other objects (like lists, dicts, instances) and determines if they are part of an isolated cycle.

## Memory Pools and Pymalloc
Requesting memory from the OS is slow. To speed things up, Python uses a system called **pymalloc** for small objects (under 512 bytes). It requests large blocks of memory (arenas) from the OS and divides them into smaller pools. When you create a small integer or string, Python quickly grabs a slot from a pool instead of asking the OS.

## The Global Interpreter Lock (GIL)
Why does Python have the GIL? Because of memory management! Reference counting is not thread-safe. If two threads incremented an object's reference count at the exact same moment, the count could be corrupted, leading to crashes or memory leaks.

The GIL is a massive lock that prevents multiple native threads from executing Python bytecodes at once. It's the simplest way to make reference counting safe, but it means multi-threaded Python programs can't utilize multiple CPU cores for CPU-bound tasks.

## Conclusion
Python's memory management is optimized for rapid development and typical use cases. Understanding reference counting, the cyclic GC, and the GIL helps you write more efficient code — and explains why your multi-threaded math script isn't running any faster!`,
      },
      {
        title: "Stack vs Heap Memory — What Every Developer Should Know",
        slug: "stack-vs-heap",
        summary: "Understand the difference between stack and heap memory allocation. Learn when each is used in C, C++, Java, Python, and JavaScript, and how it affects performance.",
        tags: ["Memory", "Stack", "Heap", "Fundamentals"],
        authorName: "System",
        seoKeywords: ["stack vs heap", "memory allocation", "stack memory", "heap memory"],
        content: `Whether you're writing low-level C++ or high-level JavaScript, your program uses memory. The two primary regions of memory available to your application are the **Stack** and the **Heap**.

Understanding the difference between them is crucial for writing efficient code and avoiding bugs like stack overflows and memory leaks.

## The Stack: Fast, Organized, and Limited
The stack is a region of memory that operates in a **LIFO (Last-In, First-Out)** manner. It is used for static memory allocation and execution thread management.

Whenever a function is called, a new "stack frame" is pushed onto the top of the stack. This frame contains the function's local variables, arguments, and the return address. When the function finishes, its frame is popped off the stack, completely freeing the memory.

### Characteristics of the Stack:
- **Incredibly Fast**: Allocating and deallocating memory is just moving a pointer.
- **Automatic**: Memory is managed automatically by the CPU and compiler.
- **Limited Size**: The OS allocates a fixed size for the stack (often just a few megabytes). Recursive functions that go too deep will cause a **Stack Overflow**.
- **Scope-Bound**: Variables exist only as long as the function is running.

## The Heap: Massive, Dynamic, and Messy
The heap is a large pool of memory used for **dynamic allocation**. Unlike the strict organization of the stack, the heap is unstructured. You ask the OS for a chunk of memory, and it finds a free block and returns a pointer to it.

### Characteristics of the Heap:
- **Slower**: Finding a contiguous block of free memory and updating tracking tables takes time.
- **Manual or GC Managed**: In C/C++, you must manually \`malloc()/free()\` or \`new/delete\`. In Java/JS/Python, a Garbage Collector cleans up for you.
- **Massive Size**: The heap can grow to the size of your available RAM + swap space.
- **Global Access**: Data on the heap can be accessed from anywhere, as long as you have the pointer.

## How Languages Use Them
### Lower-Level (C / C++):
You have total control.
- \`int a = 10;\` (Stack)
- \`int* b = new int(10);\` (Heap)
You must remember to \`delete b;\` or you'll get a memory leak.

### Higher-Level (Java, C#):
- **Primitives** (int, float, boolean) are placed on the Stack (if they are local variables).
- **Objects** (instances of classes) are *always* allocated on the Heap. The variables holding them on the stack are just pointers to the heap objects.

### Interpreted (JavaScript, Python):
Technically, the engine (V8, CPython) makes the decisions. Generally:
- Immutable primitives (numbers, booleans) go on the Stack.
- Complex types (Objects, Arrays, Closures) go on the Heap.

## Summary
- **Use the Stack** for small, short-lived variables that you know the size of at compile-time.
- **Use the Heap** for large data structures, objects that need to outlive the function that created them, or data whose size is dynamic.`,
      }
    ];

    for (const b of BLOG_POSTS) {
      await ctx.db.insert("userBlogs", {
        title: b.title,
        slug: b.slug,
        summary: b.summary,
        content: b.content,
        tags: b.tags,
        authorName: b.authorName,
        seoKeywords: b.seoKeywords,
        readTime: `${Math.max(1, Math.ceil(b.content.split(/\s+/).length / 200))} min read`,
        createdAt: Date.now(),
      });
    }

    return "Successfully seeded old challenges & blogs into Convex!";
  },
});
