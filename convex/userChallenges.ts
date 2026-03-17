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
    authorName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userChallenges", {
      ...args,
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
