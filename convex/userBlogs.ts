import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    summary: v.string(),
    tags: v.array(v.string()),
    authorName: v.string(),
    coverImageUrl: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const slug = args.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Estimate read time: ~200 words per minute
    const wordCount = args.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${minutes} min read`;

    await ctx.db.insert("userBlogs", {
      ...args,
      slug,
      readTime,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("userBlogs")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userBlogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db
      .query("userBlogs")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
    return blogs.map((b) => ({
      slug: b.slug,
      createdAt: b.createdAt,
    }));
  },
});
