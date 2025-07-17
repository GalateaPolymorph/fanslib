import { db } from "../lib/db";
import { CaptionSnippet } from "../features/snippets/entity";

const SNIPPET_FIXTURES = [
  {
    id: "snippet-001",
    title: "Weekend Vibes",
    content: "Weekend vibes are the best vibes! ✨ Hope you're having an amazing time! 😊",
    tags: ["weekend", "vibes", "positive"],
    channelId: "fansly-main",
    isActive: true,
    useCount: 12,
    createdAt: new Date("2024-01-10T10:00:00Z"),
    lastUsed: new Date("2024-01-20T15:00:00Z"),
  },
  {
    id: "snippet-002",
    title: "Workout Motivation",
    content: "Starting the day strong! 💪 Who's joining me for a workout? Let's crush those goals! 🏋️‍♀️",
    tags: ["workout", "motivation", "fitness"],
    channelId: "fansly-main",
    isActive: true,
    useCount: 8,
    createdAt: new Date("2024-01-12T08:00:00Z"),
    lastUsed: new Date("2024-01-18T07:30:00Z"),
  },
  {
    id: "snippet-003",
    title: "New Content Alert",
    content: "New content just dropped! 🔥 Check it out and let me know what you think! 👀",
    tags: ["new", "content", "alert"],
    channelId: "fansly-main",
    isActive: true,
    useCount: 15,
    createdAt: new Date("2024-01-15T12:00:00Z"),
    lastUsed: new Date("2024-01-22T18:00:00Z"),
  },
  {
    id: "snippet-004",
    title: "Self Care Sunday",
    content: "Self-care Sunday is here! 🛁 Taking time to relax and recharge. What's your favorite way to unwind? 🌸",
    tags: ["selfcare", "sunday", "relax"],
    channelId: "fansly-main",
    isActive: true,
    useCount: 6,
    createdAt: new Date("2024-01-18T19:00:00Z"),
    lastUsed: new Date("2024-01-21T20:00:00Z"),
  },
  {
    id: "snippet-005",
    title: "Thank You Message",
    content: "Thank you all for the amazing support! You make this journey so much more special! 💕",
    tags: ["thanks", "support", "appreciation"],
    channelId: "fansly-main",
    isActive: true,
    useCount: 20,
    createdAt: new Date("2024-01-20T16:00:00Z"),
    lastUsed: new Date("2024-01-25T12:00:00Z"),
  },
  {
    id: "snippet-006",
    title: "Reddit Introduction",
    content: "Hey Reddit! Hope you're having a great day! Just wanted to share some positive vibes with you all! 😊",
    tags: ["reddit", "introduction", "positive"],
    channelId: "reddit-promo",
    isActive: true,
    useCount: 5,
    createdAt: new Date("2024-01-22T14:00:00Z"),
    lastUsed: new Date("2024-01-23T16:00:00Z"),
  },
  {
    id: "snippet-007",
    title: "Twitter Engagement",
    content: "What's everyone up to today? Drop a comment and let's chat! 💬 #TwitterCommunity",
    tags: ["twitter", "engagement", "community"],
    channelId: "x-promo",
    isActive: true,
    useCount: 3,
    createdAt: new Date("2024-01-25T11:00:00Z"),
    lastUsed: new Date("2024-01-26T15:00:00Z"),
  },
  {
    id: "snippet-008",
    title: "Behind the Scenes",
    content: "Behind the scenes of today's shoot! 📸 It's always fun to share the process with you all! ✨",
    tags: ["bts", "behind", "scenes"],
    channelId: null,
    isActive: true,
    useCount: 9,
    createdAt: new Date("2024-01-28T10:00:00Z"),
    lastUsed: new Date("2024-01-29T14:00:00Z"),
  },
  {
    id: "snippet-009",
    title: "Question for Followers",
    content: "Quick question for you all! What type of content would you like to see more of? Always love hearing your thoughts! 🤔",
    tags: ["question", "engagement", "feedback"],
    channelId: null,
    isActive: true,
    useCount: 7,
    createdAt: new Date("2024-01-30T13:00:00Z"),
    lastUsed: new Date("2024-01-31T17:00:00Z"),
  },
  {
    id: "snippet-010",
    title: "Inactive Test Snippet",
    content: "This snippet is inactive and shouldn't be used in regular content creation.",
    tags: ["inactive", "test"],
    channelId: "fansly-main",
    isActive: false,
    useCount: 0,
    createdAt: new Date("2024-01-01T12:00:00Z"),
    lastUsed: null,
  },
];

export const loadSnippetFixtures = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(CaptionSnippet);
  const existingSnippets = await repository.find();
  
  const snippetPromises = SNIPPET_FIXTURES.map(async (snippet) => {
    if (existingSnippets.find((s) => s.id === snippet.id)) {
      return null;
    }
    return repository.save(snippet);
  });
  
  await Promise.all(snippetPromises);
};