import { Shoot } from "../features/shoots/entity";
import { db } from "../lib/db";

const SHOOT_FIXTURES: Omit<Shoot, "createdAt" | "updatedAt" | "media">[] = [
  {
    id: "studio-session-001",
    name: "Studio Session #1",
    shootDate: new Date("2024-01-10"),
  },
  {
    id: "outdoor-summer-2024",
    name: "Outdoor Summer 2024",
    shootDate: new Date("2024-01-12"),
  },
  {
    id: "lingerie-collection-01",
    name: "Lingerie Collection #1",
    shootDate: new Date("2024-01-15"),
  },
  {
    id: "workout-motivation",
    name: "Workout Motivation",
    shootDate: new Date("2024-01-18"),
  },
  {
    id: "cosplay-anime-01",
    name: "Anime Cosplay Session",
    shootDate: new Date("2024-01-20"),
  },
  {
    id: "bath-time-relax",
    name: "Bath Time Relaxation",
    shootDate: new Date("2024-01-22"),
  },
  {
    id: "vintage-inspired",
    name: "Vintage Inspired",
    shootDate: new Date("2024-01-25"),
  },
  {
    id: "artistic-nude-01",
    name: "Artistic Nude Study",
    shootDate: new Date("2024-01-28"),
  },
];

export const loadShootFixtures = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Shoot);
  const existingShoots = await repository.find();

  const shootPromises = SHOOT_FIXTURES.map(async (shoot) => {
    if (existingShoots.find((s) => s.id === shoot.id)) {
      return null;
    }
    return repository.save(shoot);
  });

  await Promise.all(shootPromises);
};
