import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
    category: v.string(),
    description: v.string(),
    starterCode: v.string(),
    testCases: v.array(
      v.object({
        input: v.string(),
        expected: v.string(),
        description: v.string(),
      })
    ),
    examples: v.optional(
      v.array(
        v.object({
          input: v.string(),
          output: v.string(),
          explanation: v.optional(v.string()),
        })
      )
    ),
    hints: v.optional(v.array(v.string())),
    solution: v.optional(v.string()),
    authorName: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate a basic slug, append a random string to avoid duplicates for common titles
    const baseSlug = args.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${randomSuffix}`;

    await ctx.db.insert("userChallenges", {
      ...args,
      slug,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("userChallenges")
      .withIndex("by_createdAt")
      .order("desc")
      .take(100);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userChallenges")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const challenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
    return challenges
      .filter((c) => c.slug !== undefined)
      .map((c) => ({
        slug: c.slug as string,
        createdAt: c.createdAt,
      }));
  },
});
