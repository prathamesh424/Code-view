import type { MetadataRoute } from "next";

export const revalidate = 86400; // updates sitemap at build, and revalidates every 24 hours

const SITE_URL = "https://www.codevisualizer.app";

async function fetchUserBlogSlugs(): Promise<Array<{ slug: string; createdAt: number }>> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return [];
  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "userBlogs:listForSitemap",
        args: {},
        format: "json",
      }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.value ?? [];
  } catch {
    return [];
  }
}

async function fetchUserChallengeSlugs(): Promise<Array<{ slug: string; createdAt: number }>> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return [];
  try {
    const res = await fetch(`${convexUrl}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "userChallenges:listForSitemap",
        args: {},
        format: "json",
      }),
      next: { revalidate: 86400 }, // generated at build time
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.value ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages = [
    { url: "/", changeFrequency: "weekly" as const, priority: 1.0, lastModified: now },
    { url: "/playground", changeFrequency: "weekly" as const, priority: 0.9, lastModified: now },
    { url: "/algorithms", changeFrequency: "monthly" as const, priority: 0.8, lastModified: now },
    { url: "/data-structures", changeFrequency: "monthly" as const, priority: 0.8, lastModified: now },
    { url: "/examples", changeFrequency: "weekly" as const, priority: 0.85, lastModified: now },
    { url: "/tools", changeFrequency: "monthly" as const, priority: 0.7, lastModified: now },
    { url: "/challenges", changeFrequency: "monthly" as const, priority: 0.7, lastModified: now },
    { url: "/blog", changeFrequency: "weekly" as const, priority: 0.8, lastModified: now },
    { url: "/sql-playground", changeFrequency: "monthly" as const, priority: 0.9, lastModified: now },
  ];

  const visualizerPages = [
    { url: "/javascript-visualizer", changeFrequency: "monthly" as const, priority: 0.9, lastModified: now },
    { url: "/python-visualizer", changeFrequency: "monthly" as const, priority: 0.9, lastModified: now },
    { url: "/cpp-visualizer", changeFrequency: "monthly" as const, priority: 0.85, lastModified: now },
    { url: "/java-visualizer", changeFrequency: "monthly" as const, priority: 0.85, lastModified: now },
    { url: "/event-loop-visualizer", changeFrequency: "monthly" as const, priority: 0.9, lastModified: now },
    { url: "/debugger-online", changeFrequency: "monthly" as const, priority: 0.85, lastModified: now },
  ];

  // Dynamically fetch user-submitted blog slugs
  const userBlogs = await fetchUserBlogSlugs();
  const userBlogPages = userBlogs.map((b) => ({
    url: `/blog/${b.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    lastModified: new Date(b.createdAt).toISOString(),
  }));

  // Dynamically fetch user-submitted challenge slugs
  const userChallenges = await fetchUserChallengeSlugs();
  const userChallengePages = userChallenges.map((c) => ({
    url: `/challenges/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    lastModified: new Date(c.createdAt).toISOString(),
  }));

  const allPages = [...staticPages, ...visualizerPages, ...userBlogPages, ...userChallengePages];

  return allPages.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
