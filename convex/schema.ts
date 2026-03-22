import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  feedback: defineTable({
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
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  userChallenges: defineTable({
    title: v.string(),
    slug: v.optional(v.string()),
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
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_slug", ["slug"]),

  userBlogs: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    summary: v.string(),
    tags: v.array(v.string()),
    authorName: v.string(),
    coverImageUrl: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    readTime: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_slug", ["slug"]),
});
