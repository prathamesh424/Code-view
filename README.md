<div align="center">

# ⚡ Code-View
### Interactive Code, Algorithm & Database Visualizer

[![GitHub stars](https://img.shields.io/github/stars/prathamesh424/Code-view?style=for-the-badge&logo=github&color=6366f1)](https://github.com/prathamesh424/Code-view/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/prathamesh424/Code-view?style=for-the-badge&logo=github&color=a855f7)](https://github.com/prathamesh424/Code-view/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.1-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

<p align="center">
  <b>Demystifying code, data structures, algorithms, runtime execution, and database internals through interactive, step-by-step animations.</b>
</p>

[Explore Features](#-features) •
[Quickstart](#-getting-started) •
[Contributing](#-contributing) •
[Roadmap](#-roadmap--ideas-to-contribute) •
[Architecture](#-project-structure)

</div>

---

## 🌟 Overview

**Code-View** is an open-source, community-driven educational platform designed to make complex computer science concepts intuitive, visual, and fun. 

Instead of staring at static code or dry theory, Code-View lets learners, students, and interview candidates interact with algorithms, watch memory and pointers move in real time, step through JavaScript event loop queues, and execute SQL queries against an in-browser WebAssembly database engine.

---

## ✨ Features

### 1. 🧠 Interactive Data Structure Visualizers (`/data-structures`)
Perform operations like **Insert**, **Delete**, **Search**, **Traverse**, and watch elements animate dynamically with pointer tracking:
- **Arrays**: Visual index highlighting, element shifts, and range lookups.
- **Linked Lists**: Singly and doubly linked lists with pointer redirection animations.
- **Stacks & Queues**: LIFO/FIFO operations, overflow detection, and peek visualizations.
- **Binary Search Tree (BST)**: Insertion, deletion with node replacement, and In-order/Pre-order/Post-order traversals with dynamic SVG layouts.
- **Heaps**: Min-heap and Max-heap representations with automatic heapify-up and heapify-down step animations.
- **Hash Maps**: Key hashing, bucket indexing, and collision handling through chaining.
- **Graphs**: Interactive node placement, adjacency list/matrix views, and BFS/DFS traversals.

---

### 2. ⚡ Algorithm Visualizers (`/algorithms`)
Full playback controls (**Play**, **Pause**, **Step Forward**, **Step Backward**, **Speed Slider**) with operation metrics and pseudocode tracking:
- **Sorting**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort.
- **Searching**: Linear Search and Binary Search with left/right pointer narrowing.
- **Sliding Window**: Dynamic and fixed window resizing with current sum/condition tracking.
- **Two Pointers**: Converging and parallel pointer patterns for array problems.
- **Pathfinding**: BFS, DFS, Dijkstra, and A* on an interactive grid where users can draw walls and assign weights.
- **Recursion Tree**: Real-time call tree expansion, base case returns, and backtracking visualization.
- **Dynamic Programming**: 2D/1D table filling with dependency arrows and state transition formula tracking.
- **Greedy Algorithms**: Interval scheduling, coin change, and fractional knapsack.
- **Backtracking**: Step-by-step state space tree traversal for N-Queens and Sudoku.
- **String Matching**: Naive matching, Knuth-Morris-Pratt (KMP with LPS array), and Rabin-Karp.

---

### 3. 🗄️ In-Browser SQL Playground (`/sql-playground`)
- **100% Client-Side SQLite Engine**: Powered by **WebAssembly (`sql.js`)** — no remote server latency, completely private and offline-capable.
- **Pre-populated Schemas**: Explore rich multi-table relationships including `users`, `products`, `orders`, `departments`, and `employees`.
- **Schema Explorer**: Interactive schema drawer displaying table definitions, columns, primary keys, and types.
- **11 Curated Query Recipes**: Learn joins, subqueries, group by aggregations, window functions, and indexing with 1-click query templates.
- **Execution Diagnostics**: Instant tabular results, row counters, query time metrics in milliseconds, and detailed error messages.
- **Query History**: Automatically track and restore recently executed queries.

---

### 4. 🔍 Multi-Language Execution & Runtime Visualizers
- **Language Visualizers**: Dedicated step-by-step visual execution for **JavaScript**, **Python**, **C++**, and **Java**.
- **Event Loop Visualizer (`/event-loop-visualizer`)**: Visualize the Call Stack, Web APIs, Microtask Queue (Promises), Macrotask Queue (`setTimeout`), and render cycle step-by-step.
- **Online Stepping Debugger (`/debugger-online`)**: Step into, step over, and evaluate variables in an in-browser debugger.
- **Code Playground & Challenges (`/playground`, `/challenges`)**: Multi-language editor powered by Monaco Editor with interactive programming challenges.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15.5 (App Router)](https://nextjs.org/) | Server rendering, routing, and modern React 19 architecture |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety and robust developer experience |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern CSS utility-first styling with custom design tokens |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) | Smooth layout transitions, node animations, and controls |
| **Database WASM** | [sql.js (SQLite WebAssembly)](https://sql.js.org/) | In-browser zero-backend relational database execution |
| **Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) | In-browser code editing with syntax highlighting and auto-complete |
| **AST Parser** | [Acorn](https://github.com/acornjs/acorn) | JavaScript parsing and syntax tree traversal |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible modern icon set |
| **State & Backend** | [Zustand](https://github.com/pmndrs/zustand) & [Convex](https://convex.dev/) | Client state and reactive cloud database backend |

---

## 🚀 Getting Started

Follow these steps to run Code-View locally on your machine:

### Prerequisites
- **Node.js** 18.18 or higher (Node.js 20+ LTS recommended)
- **npm**, **pnpm**, or **yarn**
- **Git**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prathamesh424/Code-view.git
   cd Code-view
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: Client-side visualizers and the SQL playground work completely out of the box without needing an active cloud backend).*

4. **Start the local development server**:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

```text
code-view/
├── .github/                       # GitHub templates (PRs, issues)
├── public/                        # Static assets, fonts, and sql-wasm.wasm
├── src/
│   ├── app/                       # Next.js 15 App Router pages
│   │   ├── algorithms/            # Algorithm visualizers hub
│   │   ├── data-structures/       # Data structure visualizers hub
│   │   ├── sql-playground/        # In-browser SQLite playground
│   │   ├── event-loop-visualizer/ # JavaScript event loop visualizer
│   │   ├── debugger-online/       # Online debugger tool
│   │   ├── python-visualizer/     # Python visualizer
│   │   ├── javascript-visualizer/ # JavaScript visualizer
│   │   ├── cpp-visualizer/        # C++ visualizer
│   │   ├── java-visualizer/       # Java visualizer
│   │   ├── challenges/            # Coding challenges
│   │   ├── playground/            # Live multi-language code playground
│   │   └── tools/                 # Developer utility tools
│   ├── components/
│   │   ├── visualizer-tools/      # Core visualizer logic & canvases
│   │   │   ├── algorithms/        # 10 algorithm visualizers
│   │   │   ├── data-structures/   # 7 data structure visualizers
│   │   │   └── sql/               # SQL Playground component & runner
│   │   ├── landing/               # Landing page showcase & hero
│   │   └── layout/                # Navbar, Footer, and Theme providers
│   └── lib/                       # Utility functions, types, and constants
├── CONTRIBUTING.md                # In-depth contribution guide
├── LICENSE                        # MIT License
└── package.json                   # Project metadata and dependencies
```

---

## 🤝 Contributing

Contributions are the backbone of the open-source community! We warmly welcome contributions of all kinds:

- 🐛 **Bug fixes**: Report issues or fix visualizer glitches and responsiveness bugs.
- ✨ **New Visualizations**: Add new algorithms (e.g., Trie, AVL Trees, Bellman-Ford, Kruskal's).
- 🎨 **UI/UX Refinements**: Improve dark/light mode contrast, animations, or keyboard navigation.
- 📝 **Documentation**: Improve code comments, write guides, or create tutorials.

### How to get started:
1. Check out our open issues:
   - [`good first issue`](https://github.com/prathamesh424/Code-view/labels/good%20first%20issue) — Perfect for first-time contributors!
   - [`help wanted`](https://github.com/prathamesh424/Code-view/labels/help%20wanted) — Feature ideas and enhancements ready for implementation.
2. Read our complete [**CONTRIBUTING.md**](CONTRIBUTING.md) for guidelines, code architecture, and visualizer blueprints.
3. Fork the repository, create your feature branch (`git checkout -b feat/my-new-feature`), and submit a Pull Request!

---

## 🗺️ Roadmap / Ideas to Contribute

Looking for inspiration? Here are features actively planned for upcoming versions:

- [ ] **Data Structures**:
  - [ ] Trie (Prefix Tree) with auto-complete simulation
  - [ ] AVL Tree & Red-Black Tree with automatic tree rotations
  - [ ] Segment Tree & Fenwick Tree (Binary Indexed Tree)
  - [ ] Disjoint Set Union (Union-Find) with path compression
- [ ] **Algorithms**:
  - [ ] Minimum Spanning Tree (Prim's & Kruskal's with animated union-find)
  - [ ] Bellman-Ford & Floyd-Warshall shortest path
  - [ ] Topological Sort (Kahn's algorithm & DFS)
  - [ ] 0/1 Knapsack & Longest Common Subsequence (LCS) interactive tables
- [ ] **SQL Playground**:
  - [ ] Visual `EXPLAIN QUERY PLAN` execution tree
  - [ ] Relational Schema ER diagram generator
  - [ ] Custom CSV/JSON dataset import
- [ ] **General**:
  - [ ] Export visualization state as GIF or MP4
  - [ ] Voice narration / AI walkthrough explanation of algorithm steps

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for learners, educators, and developers worldwide.**

If you find Code-View helpful, please consider **starring ⭐ the repository** on GitHub!

[⬆ Back to top](#-code-view)

</div>
