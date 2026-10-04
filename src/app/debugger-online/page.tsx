import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Play, Bug, StepForward, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Online Debugger — Debug Code in Your Browser for Free",
  description:
    "Debug JavaScript, Python, C++, and Java code online for free. Set breakpoints, step through code, inspect variables, and watch the call stack — no install required.",
  keywords: [
    "online debugger",
    "code debugger online",
    "javascript debugger",
    "python debugger online",
    "debug code online",
    "free online debugger",
    "step through code",
    "breakpoint debugger",
  ],
  alternates: { canonical: "https://www.codevisualizer.app/debugger-online" },
  openGraph: {
    title: "Online Debugger — Debug Code in Your Browser for Free",
    description:
      "Debug JavaScript, Python, C++, and Java code online for free. Set breakpoints, step through code, inspect variables.",
    url: "https://www.codevisualizer.app/debugger-online",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Debugger — Debug Code in Your Browser for Free",
    description: "Set breakpoints, step through code, inspect variables — all in your browser.",
  },
};

export default function DebuggerOnlinePage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.codevisualizer.app" },
      { "@type": "ListItem", position: 2, name: "Online Debugger", item: "https://www.codevisualizer.app/debugger-online" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an online code debugger?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An online code debugger is a browser-based tool that lets you debug code without installing any software. You can set breakpoints, step through code line by line, inspect variables and their values, and watch the call stack — all directly in your web browser.",
        },
      },
      {
        "@type": "Question",
        name: "What programming languages can I debug online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Code Visualizer's online debugger supports JavaScript, Python, C++, and Java. You can switch between languages with one click and the debugger adapts automatically to each language's execution model.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to install anything to use the online debugger?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The online debugger runs entirely in your browser. There is no IDE to install, no plugins to configure, and no account to create. Just paste your code and start debugging immediately.",
        },
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Online Debugger — Debug Code in Your Browser for Free",
    description: "Debug JavaScript, Python, C++, and Java code online for free. Set breakpoints, step through code, inspect variables, and watch the call stack.",
    url: "https://www.codevisualizer.app/debugger-online",
    isPartOf: { "@type": "WebSite", url: "https://www.codevisualizer.app" },
    about: { "@type": "Thing", name: "Online Code Debugging" },
    educationalLevel: "Beginner to Advanced",
    learningResourceType: "Interactive debugging tool",
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd, webPageJsonLd]) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-sm font-medium mb-6">
            <Bug className="w-3 h-3" />
            Debugger
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Online Code{" "}
            <span className="gradient-text">Debugger</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            A powerful, free online debugger for JavaScript, Python, C++, and
            Java. Set breakpoints, step through code line by line, inspect
            variables, and watch the call stack — all in your browser.
          </p>
          <div className="mt-8">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start Debugging
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Debugger Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Play,
                title: "Breakpoints",
                description:
                  "Click any line to set a breakpoint. Execution pauses exactly where you need it, letting you inspect the full program state.",
              },
              {
                icon: StepForward,
                title: "Step Over / Step Into",
                description:
                  "Step through your code one line at a time. Step over function calls or step into them to trace the full execution path.",
              },
              {
                icon: Eye,
                title: "Variable Inspector",
                description:
                  "See all variables in scope, their current values, and types. Watch them change as you step through the code.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Why Use an Online Debugger?
          </h2>
          <p className="text-muted leading-relaxed mb-4">
            Setting up a local development environment just to debug a small
            snippet is overkill. Code Visualizer&apos;s online debugger lets you
            paste any code and start debugging immediately — no IDE, no
            plugins, no configuration.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            It&apos;s perfect for technical interviews, studying algorithms,
            debugging code from Stack Overflow, or helping a friend
            understand why their code doesn&apos;t work.
          </p>
          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">
            Supported Languages
          </h3>
          <p className="text-muted leading-relaxed">
            Debug JavaScript, Python, C++, and Java — all from the same
            interface. Switch languages with one click and the debugger
            adapts automatically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Related Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/javascript-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                JavaScript Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                Go beyond debugging — visualize the event loop, closures, and async execution.
              </p>
            </Link>
            <Link
              href="/python-visualizer"
              className="p-4 rounded-xl border border-border bg-surface hover:border-accent/30 transition-colors group"
            >
              <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                Python Visualizer →
              </span>
              <p className="text-sm text-muted mt-1">
                Trace Python execution with memory layout and reference counting.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
