import type { Language } from "@/types/engine";

export const SITE_URL = "https://www.codevisualizer.app";

export type PlaygroundLang = "javascript" | "python" | "java" | "cpp" | "c";

export interface PlaygroundSEOConfig {
  /** URL slug used in /playground/[lang] */
  slug: PlaygroundLang;
  /** Engine language key */
  engineLanguage: Language;
  /** Human-readable display name */
  displayName: string;
  /** Page title tag */
  title: string;
  /** Meta description */
  description: string;
  /** Meta keywords */
  keywords: string[];
  /** Visually-hidden H1 text */
  h1: string;
  /** Canonical path (without domain) */
  canonical: string;
  /** Badge color class */
  badgeColor: string;
  /** SEO content section */
  seoContent: {
    heading: string;
    paragraphs: string[];
  };
  /** FAQ entries for structured data */
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  /** Related links */
  relatedLinks: Array<{
    href: string;
    title: string;
    description: string;
  }>;
  /** Other language playground links for cross-linking */
  otherLanguages: Array<{
    slug: PlaygroundLang;
    label: string;
  }>;
}

export const PLAYGROUND_LANGUAGES: Record<PlaygroundLang, PlaygroundSEOConfig> = {
  javascript: {
    slug: "javascript",
    engineLanguage: "javascript",
    displayName: "JavaScript",
    title: "JavaScript Playground Online — Run & Debug JS Code in Browser",
    description:
      "Free online JavaScript playground. Write, run, and debug JS code with real-time event loop visualization. See call stack, callback queue, closures, and async execution step by step.",
    keywords: [
      "javascript playground",
      "javascript playground online",
      "js playground",
      "js playground online",
      "javascript compiler online",
      "javascript debugger online",
      "js debugger",
      "run javascript online",
      "js code runner",
      "online javascript IDE",
      "javascript editor online",
      "javascript code runner",
      "test javascript online",
      "javascript sandbox",
    ],
    h1: "JavaScript Code Playground — Run & Debug JS Online",
    canonical: "/playground/javascript",
    badgeColor: "bg-warning/10 border-warning/20 text-warning",
    seoContent: {
      heading: "About the JavaScript Playground",
      paragraphs: [
        "Code Visualizer\u2019s JavaScript playground lets you write, execute, and visualize JavaScript code in real-time. Paste any JS snippet \u2014 from simple loops to complex async/await chains \u2014 and watch as the event loop spins, the call stack grows and shrinks, closures capture variables, and promises move through the microtask queue.",
        "Set breakpoints on any line, step through function calls one at a time, and inspect the full program state at every point. Whether you\u2019re debugging a tricky callback order, learning how closures work, preparing for a frontend interview, or teaching a CS course, this interactive JavaScript debugger makes complex execution flows intuitive.",
      ],
    },
    faqs: [
      {
        question: "What is an online JavaScript playground?",
        answer:
          "An online JavaScript playground is a browser-based tool that lets you write, run, and debug JavaScript code without installing anything. Code Visualizer\u2019s JS playground goes further by visualizing the event loop, call stack, closures, and async execution in real-time, making it perfect for learning and debugging.",
      },
      {
        question: "Can I debug async/await and Promises in this playground?",
        answer:
          "Yes. The JavaScript playground visualizes the microtask queue, macrotask queue, and Web API layer. You can see exactly when Promises resolve, how async functions pause and resume, and the order in which callbacks execute through the event loop.",
      },
      {
        question: "Is this JavaScript playground free to use?",
        answer:
          "Yes, Code Visualizer\u2019s JavaScript playground is completely free. You can write, run, visualize, and share JavaScript code without creating an account or installing any software.",
      },
    ],
    relatedLinks: [
      { href: "/blog/interactive-javascript-playground-event-loop-guide", title: "Guide: Interactive JS Playground Guide \u2192", description: "Learn how to debug async code, microtasks, and the event loop." },
      { href: "/javascript-visualizer", title: "JavaScript Visualizer \u2192", description: "Deep-dive into event loop, V8 internals, and closure visualization." },
      { href: "/event-loop-visualizer", title: "Event Loop Visualizer \u2192", description: "Focused view of setTimeout, Promises, and async/await execution." },
    ],
    otherLanguages: [
      { slug: "python", label: "Python" },
      { slug: "java", label: "Java" },
      { slug: "cpp", label: "C++" },
      { slug: "c", label: "C" },
    ],
  },

  python: {
    slug: "python",
    engineLanguage: "python",
    displayName: "Python",
    title: "Python Playground Online — Run & Debug Python Code in Browser",
    description:
      "Free online Python playground. Write, execute, and visualize Python code with real-time memory visualization. See variables, call stack, reference counting, and scope chain step by step.",
    keywords: [
      "python playground",
      "python playground online",
      "python compiler online",
      "python debugger online",
      "run python online",
      "python code runner",
      "online python IDE",
      "python editor online",
      "python tutor alternative",
      "python sandbox",
      "test python online",
      "python online editor free",
      "python executor online",
      "python visualizer online",
    ],
    h1: "Python Code Playground — Run & Debug Python Online",
    canonical: "/playground/python",
    badgeColor: "bg-info/10 border-info/20 text-info",
    seoContent: {
      heading: "About the Python Playground",
      paragraphs: [
        "Code Visualizer\u2019s Python playground is the best Python Tutor alternative. Write any Python code and watch it execute line by line, with real-time visualization of variables, memory allocations, reference counts, and the call stack. See how lists, dicts, and objects are stored in memory and traced through scope.",
        "Perfect for learning Python fundamentals, debugging tricky behaviors like mutable default arguments or shallow vs deep copies, preparing for coding interviews, or teaching programming courses. Set breakpoints, step through function calls, and inspect every frame of execution.",
      ],
    },
    faqs: [
      {
        question: "What is an online Python playground?",
        answer:
          "An online Python playground is a browser-based code editor that lets you write, run, and debug Python code without installing Python locally. Code Visualizer\u2019s Python playground adds real-time visualization of memory, variables, reference counting, and the call stack \u2014 making it a powerful Python Tutor alternative.",
      },
      {
        question: "Is this better than Python Tutor?",
        answer:
          "Code Visualizer offers several advantages over Python Tutor: it shows memory layout, reference counting, garbage collection cycles, and GIL states with a modern interface. It also supports JavaScript, C++, and Java in addition to Python, and includes algorithm visualizers and an SQL playground.",
      },
      {
        question: "Can I use this Python playground for free?",
        answer:
          "Yes, the Python playground is completely free to use. No sign-up required. Write, run, visualize, and share Python code directly in your browser.",
      },
    ],
    relatedLinks: [
      { href: "/blog/best-online-python-playground-debuggers", title: "Guide: Best Online Python Playgrounds \u2192", description: "Compare top browser-based Python debuggers and visualizers." },
      { href: "/python-visualizer", title: "Python Visualizer \u2192", description: "Deep-dive into Python memory, GIL, and reference counting visualization." },
      { href: "/blog/python-memory-management", title: "Blog: Python Memory Management \u2192", description: "How CPython manages memory, reference counting, and the GC." },
    ],
    otherLanguages: [
      { slug: "javascript", label: "JavaScript" },
      { slug: "java", label: "Java" },
      { slug: "cpp", label: "C++" },
      { slug: "c", label: "C" },
    ],
  },

  java: {
    slug: "java",
    engineLanguage: "java",
    displayName: "Java",
    title: "Java Playground Online — Run & Debug Java Code in Browser",
    description:
      "Free online Java playground. Write, run, and debug Java code with real-time JVM visualization. See call stack, heap objects, garbage collection generations, and OOP concepts step by step.",
    keywords: [
      "java playground",
      "java playground online",
      "java compiler online",
      "java debugger online",
      "run java online",
      "java code runner",
      "online java IDE",
      "java editor online",
      "java sandbox",
      "test java online",
      "java online editor free",
      "java executor online",
      "java code executor",
      "compile java online",
    ],
    h1: "Java Code Playground — Run & Debug Java Online",
    canonical: "/playground/java",
    badgeColor: "bg-error/10 border-error/20 text-error",
    seoContent: {
      heading: "About the Java Playground",
      paragraphs: [
        "Code Visualizer\u2019s Java playground lets you write, compile, and run Java code directly in your browser. Watch as the JVM processes your code: objects are created on the heap, methods push onto the call stack, and the garbage collector identifies unreachable objects across Young, Old, and Permanent generations.",
        "Ideal for learning OOP concepts like inheritance, polymorphism, and interfaces visually. Set breakpoints, step through method calls, inspect object state, and understand how Java\u2019s automatic memory management works under the hood. Perfect for Java courses, coding interviews, and everyday development.",
      ],
    },
    faqs: [
      {
        question: "What is an online Java playground?",
        answer:
          "An online Java playground is a browser-based tool that lets you write, compile, and run Java code without installing the JDK locally. Code Visualizer\u2019s Java playground adds real-time JVM visualization showing heap objects, garbage collection, call stack, and OOP concepts like inheritance and polymorphism.",
      },
      {
        question: "Can I visualize Java garbage collection in this playground?",
        answer:
          "Yes. The Java playground shows how objects move through the JVM\u2019s heap generations (Young Gen, Old Gen, Permanent Gen), when GC cycles trigger, and which objects are marked as unreachable. It\u2019s the best way to understand Java\u2019s automatic memory management.",
      },
      {
        question: "Is this Java playground free?",
        answer:
          "Yes, Code Visualizer\u2019s Java playground is completely free. Write, compile, run, and visualize Java code without creating an account.",
      },
    ],
    relatedLinks: [
      { href: "/blog/best-online-java-playground-beginners", title: "Guide: Best Online Java Playground \u2192", description: "Why an interactive visual playground is best for learning Java." },
      { href: "/java-visualizer", title: "Java Visualizer \u2192", description: "Deep-dive into JVM internals, GC generations, and OOP visualization." },
      { href: "/blog/stack-vs-heap", title: "Blog: Stack vs Heap \u2192", description: "Understand Java\u2019s stack and heap memory model." },
    ],
    otherLanguages: [
      { slug: "javascript", label: "JavaScript" },
      { slug: "python", label: "Python" },
      { slug: "cpp", label: "C++" },
      { slug: "c", label: "C" },
    ],
  },

  cpp: {
    slug: "cpp",
    engineLanguage: "cpp",
    displayName: "C++",
    title: "C++ Playground Online — Run & Debug C++ Code in Browser",
    description:
      "Free online C++ playground. Write, compile, and debug C++ code with real-time memory visualization. See pointers, stack/heap allocation, RAII, and smart pointers step by step.",
    keywords: [
      "c++ playground",
      "c++ playground online",
      "cpp playground",
      "cpp playground online",
      "c++ compiler online",
      "c++ debugger online",
      "run c++ online",
      "cpp code runner",
      "online c++ IDE",
      "c++ editor online",
      "c++ sandbox",
      "compile c++ online",
      "c++ online editor free",
      "cpp compiler online free",
    ],
    h1: "C++ Code Playground — Run & Debug C++ Online",
    canonical: "/playground/cpp",
    badgeColor: "bg-accent/10 border-accent/20 text-accent",
    seoContent: {
      heading: "About the C++ Playground",
      paragraphs: [
        "Code Visualizer\u2019s C++ playground lets you write, compile, and run C++ code directly in your browser. Watch as pointers resolve to memory addresses, stack frames push and pop, heap allocations appear and disappear, and RAII patterns manage resource lifetimes automatically.",
        "Perfect for understanding manual memory management, debugging pointer arithmetic, learning smart pointers (unique_ptr, shared_ptr), and preparing for systems programming interviews. Set breakpoints, step through function calls, and see exactly where every object lives in memory.",
      ],
    },
    faqs: [
      {
        question: "What is an online C++ playground?",
        answer:
          "An online C++ playground is a browser-based tool that lets you write, compile, and run C++ code without installing a compiler locally. Code Visualizer\u2019s C++ playground adds real-time memory visualization showing pointers, stack/heap allocation, RAII lifetimes, and smart pointer behavior.",
      },
      {
        question: "Can I visualize pointers and memory in this C++ playground?",
        answer:
          "Yes. The C++ playground shows pointer resolution to memory addresses, stack frame allocation for local variables, heap allocation for dynamic objects, dangling pointer detection, and how smart pointers (unique_ptr, shared_ptr) manage lifetimes through RAII.",
      },
      {
        question: "Is this C++ playground free?",
        answer:
          "Yes, Code Visualizer\u2019s C++ playground is completely free. Write, compile, run, and visualize C++ code without creating an account or installing anything.",
      },
    ],
    relatedLinks: [
      { href: "/blog/best-cpp-playground-online-compiler", title: "Guide: Best C++ Playgrounds & Compilers \u2192", description: "Discover the best tools to visualize pointers and RAII." },
      { href: "/cpp-visualizer", title: "C++ Visualizer \u2192", description: "Deep-dive into pointers, memory addresses, and RAII visualization." },
      { href: "/blog/stack-vs-heap", title: "Blog: Stack vs Heap \u2192", description: "Master the difference between stack and heap memory allocation." },
    ],
    otherLanguages: [
      { slug: "javascript", label: "JavaScript" },
      { slug: "python", label: "Python" },
      { slug: "java", label: "Java" },
      { slug: "c", label: "C" },
    ],
  },

  c: {
    slug: "c",
    engineLanguage: "c",
    displayName: "C",
    title: "C Playground Online — Run & Debug C Code in Browser",
    description:
      "Free online C playground. Write, compile, and debug C code with real-time memory and pointer visualization. See stack frames, heap allocation, malloc/free, and pointer arithmetic step by step.",
    keywords: [
      "c playground",
      "c playground online",
      "c compiler online",
      "c debugger online",
      "c pointer visualizer",
      "c memory visualizer",
      "run c online",
      "online c compiler",
      "c code runner",
      "c editor online",
      "c sandbox",
      "compile c online",
      "online c IDE",
      "c memory debugger",
      "c visualizer online",
    ],
    h1: "C Code Playground — Run & Debug C Online",
    canonical: "/playground/c",
    badgeColor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    seoContent: {
      heading: "About the C Playground",
      paragraphs: [
        "Code Visualizer\u2019s C playground lets you write, compile, and execute C code directly in your browser. Watch as pointers resolve to stack and heap memory addresses, variables update across execution frames, and malloc and free allocations are visually mapped in real-time.",
        "Master foundational concepts like pointer arithmetic, pass-by-reference, array indexing, structs, dynamic memory management, and stack vs heap allocation. Set breakpoints, inspect raw memory addresses, and eliminate segmentation faults and memory leaks visually. An essential tool for CS students, systems programmers, and embedded software learners.",
      ],
    },
    faqs: [
      {
        question: "What is an online C playground?",
        answer:
          "An online C playground is a browser-based environment for compiling, running, and debugging C code without local gcc or clang toolchains. Code Visualizer\u2019s C playground provides interactive memory and pointer visualization to help you understand low-level execution.",
      },
      {
        question: "Can I visualize C pointers and memory addresses?",
        answer:
          "Yes. The playground visualizes pointers referencing stack variables, dynamic heap blocks allocated via malloc, and pointer arithmetic step by step, showing exact relationships between pointers and memory.",
      },
      {
        question: "Is this C playground free to use?",
        answer:
          "Yes, Code Visualizer\u2019s C playground is completely free with no registration required. Write, compile, and visualize C code right in your browser.",
      },
    ],
    relatedLinks: [
      { href: "/blog/visualize-c-pointers-memory-online-playground", title: "Guide: Learn C Pointers Visually \u2192", description: "Master pointer arithmetic and malloc with interactive memory visualization." },
      { href: "/blog/stack-vs-heap", title: "Blog: Stack vs Heap \u2192", description: "Understand how memory allocation differs between the stack and the heap." },
      { href: "/cpp-visualizer", title: "C++ Visualizer \u2192", description: "Explore modern C++ features, RAII, and object lifetimes." },
    ],
    otherLanguages: [
      { slug: "javascript", label: "JavaScript" },
      { slug: "python", label: "Python" },
      { slug: "java", label: "Java" },
      { slug: "cpp", label: "C++" },
    ],
  },
};

/** All valid language slugs */
export const VALID_PLAYGROUND_LANGS = Object.keys(PLAYGROUND_LANGUAGES) as PlaygroundLang[];

/** Get config for a language slug, or null if invalid */
export function getPlaygroundSEO(lang: string): PlaygroundSEOConfig | null {
  return PLAYGROUND_LANGUAGES[lang as PlaygroundLang] ?? null;
}
