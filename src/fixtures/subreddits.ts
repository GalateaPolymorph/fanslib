import { db } from "../lib/db";
import { Subreddit } from "../features/channels/subreddit";

const SUBREDDIT_FIXTURES = [
  {
    id: "gonewild",
    name: "r/gonewild",
    description: "A place for open-minded Adult Redditors to show off their nude bodies",
    subscriberCount: 3500000,
    isActive: true,
    rules: [
      "Must be 18+",
      "No sellers or advertising",
      "Be respectful",
      "Original content only",
    ],
  },
  {
    id: "realgirls",
    name: "r/RealGirls",
    description: "Pictures of real girls, no professional models",
    subscriberCount: 2800000,
    isActive: true,
    rules: [
      "Real girls only",
      "No professional models",
      "Must be 18+",
      "No advertising",
    ],
  },
  {
    id: "selfie",
    name: "r/selfie",
    description: "A subreddit for sharing selfies",
    subscriberCount: 850000,
    isActive: true,
    rules: [
      "Selfies only",
      "Must be 18+",
      "No NSFW content",
      "Be kind",
    ],
  },
  {
    id: "fitgirls",
    name: "r/fitgirls",
    description: "Fit girls showing off their bodies",
    subscriberCount: 1200000,
    isActive: true,
    rules: [
      "Must show fitness",
      "Must be 18+",
      "No spam",
      "Original content preferred",
    ],
  },
  {
    id: "curvy",
    name: "r/curvy",
    description: "A subreddit for curvy women",
    subscriberCount: 900000,
    isActive: true,
    rules: [
      "Curvy women only",
      "Must be 18+",
      "No spam or advertising",
      "Be respectful",
    ],
  },
  {
    id: "petite",
    name: "r/PetiteGoneWild",
    description: "Petite women showing off",
    subscriberCount: 1500000,
    isActive: true,
    rules: [
      "Petite women only",
      "Must be 18+",
      "No advertising",
      "Original content only",
    ],
  },
  {
    id: "amateur",
    name: "r/Amateur",
    description: "Amateur content only",
    subscriberCount: 750000,
    isActive: true,
    rules: [
      "Amateur content only",
      "Must be 18+",
      "No professional content",
      "Be respectful",
    ],
  },
  {
    id: "cosplaygirls",
    name: "r/cosplaygirls",
    description: "Girls in cosplay",
    subscriberCount: 1100000,
    isActive: false,
    rules: [
      "Cosplay only",
      "Must be 18+",
      "Credit the character/series",
      "No spam",
    ],
  },
];

export const loadSubredditFixtures = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Subreddit);
  const existingSubreddits = await repository.find();
  
  const subredditPromises = SUBREDDIT_FIXTURES.map(async (subreddit) => {
    if (existingSubreddits.find((s) => s.id === subreddit.id)) {
      return null;
    }
    return repository.save(subreddit);
  });
  
  await Promise.all(subredditPromises);
};