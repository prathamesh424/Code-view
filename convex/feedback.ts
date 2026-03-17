import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    type: v.union(
      v.literal("bug"),
      v.literal("feature"),
      v.literal("general"),
      v.literal("other")
    ),
    message: v.string(),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("feedback", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_createdAt")
      .order("desc")
      .take(50);
  },
});
