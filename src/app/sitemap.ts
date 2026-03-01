import type { MetadataRoute } from "next";

const SITE_URL = "https://www.codevisualizer.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: "/", changeFrequency: "weekly" as const, priority: 1.0 },
    { url: "/playground", changeFrequency: "weekly" as const, priority: 0.9 },
    { url: "/algorithms", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/data-structures", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/tools", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/challenges", changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const visualizerPages = [
    { url: "/javascript-visualizer", changeFrequency: "monthly" as const, priority: 0.9 },
    { url: "/python-visualizer", changeFrequency: "monthly" as const, priority: 0.9 },
    { url: "/cpp-visualizer", changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "/java-visualizer", changeFrequency: "monthly" as const, priority: 0.8 },
    { url: "/event-loop-visualizer", changeFrequency: "monthly" as const, priority: 0.85 },
    { url: "/debugger-online", changeFrequency: "monthly" as const, priority: 0.85 },
  ];

  const blogPages = [
    { url: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: "/blog/javascript-event-loop-explained", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/blog/python-memory-management", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/blog/stack-vs-heap", changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const allPages = [...staticPages, ...visualizerPages, ...blogPages];

  return allPages.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
