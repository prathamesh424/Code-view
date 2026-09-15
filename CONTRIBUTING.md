# Contributing to Code-View 🚀

Thank you for your interest in contributing to **Code-View**! We are thrilled to have you join our open-source community. Code-View is built to empower learners, developers, and educators worldwide to visualize and master complex code, algorithms, and data structures.

Whether you're fixing a minor UI glitch, adding a complex algorithm visualization, optimizing animations, or writing documentation, every contribution counts!

---

## 📋 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [How Can You Contribute?](#-how-can-you-contribute)
- [Getting Started with Development](#-getting-started-with-development)
- [Project Architecture](#-project-architecture)
- [How to Add a New Visualizer](#-how-to-add-a-new-visualizer)
  - [Adding an Algorithm Visualizer](#adding-an-algorithm-visualizer)
  - [Adding a Data Structure Visualizer](#adding-a-data-structure-visualizer)
- [Coding Guidelines & Standards](#-coding-guidelines--standards)
- [Git Workflow & Pull Requests](#-git-workflow--pull-requests)
- [Commit Convention](#-commit-convention)

---

## 🌟 Code of Conduct

We are committed to providing an inclusive, respectful, and welcoming environment for everyone. Please be considerate, kind, and constructive in all communications (issues, PR reviews, discussions).

---

## 💡 How Can You Contribute?

You don't need to be an expert in DSA or Next.js to contribute! Here are some great areas where you can help:

1. **Add New Algorithm Visualizers**:
   - Graph algorithms (Bellman-Ford, Kruskal's, Prim's, Topological Sort)
   - Dynamic Programming (0/1 Knapsack, Longest Common Subsequence, Edit Distance)
   - Computational geometry (Convex Hull)
2. **Add New Data Structure Visualizers**:
   - Trie (Prefix Tree)
   - AVL Tree / Red-Black Tree (Self-balancing BST)
   - Segment Tree / Fenwick Tree (Binary Indexed Tree)
   - Disjoint Set Union (Union-Find)
3. **Enhance the SQL Playground**:
   - Add new interactive SQL schemas and challenge problems
   - Visualize query execution plans (`EXPLAIN QUERY PLAN`)
   - Add ER diagram visualizations for relational schemas
4. **UI & UX Polish**:
   - Dark/Light mode theme improvements
   - Mobile touch gestures and responsive layouts
   - Accessibility (a11y) improvements (ARIA roles, keyboard shortcuts)
5. **Documentation & Tests**:
   - Improve code comments, write tutorials, or fix typos
   - Add automated component and visual regression tests

Looking for a place to start? Check issues labeled with [`good first issue`](https://github.com/prathamesh424/Code-view/labels/good%20first%20issue) or [`help wanted`](https://github.com/prathamesh424/Code-view/labels/help%20wanted)!

---

## 💻 Getting Started with Development

### Prerequisites
- **Node.js**: v18.18 or higher (v20+ recommended)
- **npm**, **pnpm**, or **yarn**
- **Git** installed on your system

### 1. Fork & Clone the Repository
```bash
# Fork the repository on GitHub, then clone your fork:
git clone https://github.com/<your-username>/Code-view.git
cd Code-view
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(If you're only working on client-side visualizers and UI, you don't need a live Convex instance immediately).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see your changes live.

---

## 🏛️ Project Architecture

```
code-view/
├── public/
│   ├── sql-wasm.wasm           # SQLite WASM binary for the SQL playground
│   └── ...                     # Static assets, icons, logos
├── src/
│   ├── app/                    # Next.js 15 App Router pages & routes
│   │   ├── algorithms/         # /algorithms route
│   │   ├── data-structures/    # /data-structures route
│   │   ├── sql-playground/     # /sql-playground route
│   │   ├── playground/         # General code execution playground
│   │   ├── event-loop-visualizer/ # JavaScript Event Loop visualizer
│   │   ├── debugger-online/    # Online stepping debugger
│   │   ├── python-visualizer/  # Python execution visualizer
│   │   ├── javascript-visualizer/ # JS execution visualizer
│   │   ├── cpp-visualizer/     # C++ visualizer
│   │   └── java-visualizer/    # Java visualizer
│   ├── components/
│   │   ├── visualizer-tools/   # Core visualizer engines & UIs
│   │   │   ├── algorithms/     # Sorting, Pathfinding, DP, Two Pointers, etc.
│   │   │   ├── data-structures/# Array, LinkedList, BST, Heap, Graph, HashMap
│   │   │   └── sql/            # SqlPlayground & SQLite WebAssembly runner
│   │   ├── landing/            # Landing page hero, showcase, demo components
│   │   └── layout/             # Header, Footer, Navigation, Theme switchers
│   └── lib/                    # Utility functions, helpers, types
```

---

## 🛠️ How to Add a New Visualizer

### Adding an Algorithm Visualizer

1. **Create the Visualizer Component**:
   Create a new file in `src/components/visualizer-tools/algorithms/`, e.g., `src/components/visualizer-tools/algorithms/TrieVisualizer.tsx`.
   - Use `framer-motion` for smooth layout transitions (`layout`, `motion.div`).
   - Include controls: **Play / Pause**, **Step Forward / Backward**, **Speed Slider**, and **Reset**.
   - Show algorithm stats (Comparisons, Swaps, Steps) and a code/pseudocode tracker.
2. **Register the Algorithm**:
   In `src/app/algorithms/page.tsx`, import your visualizer and add it to the category/algorithm switcher dropdown.
3. **Add Sample Data**:
   Provide default arrays/inputs so contributors and users can try it immediately with 1 click.

### Adding a Data Structure Visualizer

1. Create a component in `src/components/visualizer-tools/data-structures/`, e.g., `RedBlackTreeVisualizer.tsx`.
2. Follow standard operations: Insert, Delete, Search, Clear, and Random Generate.
3. Register the component in `src/app/data-structures/page.tsx`.

---

## 🎨 Coding Guidelines & Standards

- **TypeScript**: All code should be strongly typed with minimal or no `any`.
- **Styling**: Use **Tailwind CSS v4** utility classes. Use the color tokens configured in `src/app/globals.css` (e.g. `bg-surface`, `text-foreground`, `border-border`, `accent`).
- **Animations**: Leverage `framer-motion` for animated nodes, pointers, and layout transitions.
- **State Management**: Prefer local React state / refs for step counters, or Zustand when global synchronization is needed.
- **Cleanups**: Always clean up timers (`setInterval`, `requestAnimationFrame`), event listeners, and WASM instances on component unmount (`useEffect` cleanup).

---

## 🔄 Git Workflow & Pull Requests

1. **Keep your fork up-to-date**:
   ```bash
   git remote add upstream https://github.com/prathamesh424/Code-view.git
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```
2. **Create a descriptive feature branch**:
   ```bash
   git checkout -b feat/add-kruskal-algorithm
   # or
   git checkout -b fix/sql-wasm-mobile-overflow
   ```
3. **Test your changes locally**:
   ```bash
   npm run lint
   npm run build
   ```
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat(algorithms): add Kruskal's algorithm visualization"
   git push origin feat/add-kruskal-algorithm
   ```
5. **Open a Pull Request**:
   - Go to [https://github.com/prathamesh424/Code-view/pulls](https://github.com/prathamesh424/Code-view/pulls)
   - Fill out our PR template with a description and screenshots/GIFs of the visualizer in action!

---

## 💬 Commit Convention

We adhere to [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new visualizer, feature, or tool
- `fix:` A bug fix or UI correction
- `docs:` Changes to documentation or README
- `style:` Formatting, spacing, CSS adjustments
- `refactor:` Code improvements without feature or bug changes
- `perf:` Performance improvements (memory, WASM loading, frame rate)
- `chore:` Dependency updates, tooling, configuration

---

## 💖 Recognition & Hall of Fame

Every contributor will be featured in our README and repository releases. Thank you for making learning algorithms and code execution visual and accessible to all developers! 🎉
