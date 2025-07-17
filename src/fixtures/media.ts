import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { Media } from "../features/library/entity";
import { createMedia, CreateMediaPayload } from "../features/library/operations";
import { db } from "../lib/db";

const MEDIA_FIXTURES: CreateMediaPayload[] = [
  // Studio Session #1
  {
    relativePath: "studio_001.jpg",
    type: "image" as const,
    name: "studio_001.jpg",
    size: 2456789,
    duration: null,
    fileCreationDate: new Date("2024-01-10T10:00:00Z"),
    fileModificationDate: new Date("2024-01-10T10:00:00Z"),
  },
  {
    relativePath: "studio_002.jpg",
    type: "image" as const,
    name: "studio_002.jpg",
    size: 2789654,
    duration: null,
    fileCreationDate: new Date("2024-01-10T10:15:00Z"),
    fileModificationDate: new Date("2024-01-10T10:15:00Z"),
  },
  // Outdoor Summer
  {
    relativePath: "outdoor_001.jpg",
    type: "image" as const,
    name: "outdoor_001.jpg",
    size: 3456789,
    duration: null,
    fileCreationDate: new Date("2024-01-12T16:00:00Z"),
    fileModificationDate: new Date("2024-01-12T16:00:00Z"),
  },
  {
    relativePath: "outdoor_002.jpg",
    type: "image" as const,
    name: "outdoor_002.jpg",
    size: 3234567,
    duration: null,
    fileCreationDate: new Date("2024-01-12T16:30:00Z"),
    fileModificationDate: new Date("2024-01-12T16:30:00Z"),
  },
  // Lingerie Collection
  {
    relativePath: "lingerie_001.jpg",
    type: "image" as const,
    name: "lingerie_001.jpg",
    size: 2987654,
    duration: null,
    fileCreationDate: new Date("2024-01-15T20:00:00Z"),
    fileModificationDate: new Date("2024-01-15T20:00:00Z"),
  },
  {
    relativePath: "lingerie_002.jpg",
    type: "image" as const,
    name: "lingerie_002.jpg",
    size: 2765432,
    duration: null,
    fileCreationDate: new Date("2024-01-15T20:30:00Z"),
    fileModificationDate: new Date("2024-01-15T20:30:00Z"),
  },
  // Workout Motivation
  {
    relativePath: "workout_001.jpg",
    type: "image" as const,
    name: "workout_001.jpg",
    size: 2345678,
    duration: null,
    fileCreationDate: new Date("2024-01-18T07:00:00Z"),
    fileModificationDate: new Date("2024-01-18T07:00:00Z"),
  },
  {
    relativePath: "workout_002.mp4",
    type: "video" as const,
    name: "workout_002.mp4",
    size: 15678901,
    duration: 30,
    fileCreationDate: new Date("2024-01-18T07:30:00Z"),
    fileModificationDate: new Date("2024-01-18T07:30:00Z"),
  },
  // Cosplay
  {
    relativePath: "cosplay_001.jpg",
    type: "image" as const,
    name: "cosplay_001.jpg",
    size: 3789012,
    duration: null,
    fileCreationDate: new Date("2024-01-20T14:00:00Z"),
    fileModificationDate: new Date("2024-01-20T14:00:00Z"),
  },
  {
    relativePath: "cosplay_002.jpg",
    type: "image" as const,
    name: "cosplay_002.jpg",
    size: 3567890,
    duration: null,
    fileCreationDate: new Date("2024-01-20T14:30:00Z"),
    fileModificationDate: new Date("2024-01-20T14:30:00Z"),
  },
];

const createDummyMediaFiles = () => {
  const fixturesDir = join(process.cwd(), "src", "fixtures", "media");

  if (!existsSync(fixturesDir)) {
    mkdirSync(fixturesDir, { recursive: true });
  }

  MEDIA_FIXTURES.forEach((media) => {
    const filename = media.relativePath.split("/").pop() || media.name;
    const filePath = join(fixturesDir, filename);
    if (!existsSync(filePath)) {
      if (media.type === "image") {
        // Create a minimal JPEG header for images
        const dummyJpeg = Buffer.from([
          0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00,
          0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06,
          0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b,
          0x0c, 0x19, 0x12, 0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
          0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31,
          0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff,
          0xc0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01,
          0x03, 0x11, 0x01, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01,
          0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05,
          0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
          0x00, 0xff, 0xd9,
        ]);
        writeFileSync(filePath, dummyJpeg);
      } else if (media.type === "video") {
        // Create a minimal MP4 header for videos
        const dummyMp4 = Buffer.from([
          0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00, 0x02,
          0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32, 0x61, 0x76, 0x63, 0x31, 0x6d, 0x70,
          0x34, 0x31, 0x00, 0x00, 0x00, 0x08, 0x66, 0x72, 0x65, 0x65,
        ]);
        writeFileSync(filePath, dummyMp4);
      }
    }
  });
};

export const loadMediaFixtures = async () => {
  const dataSource = await db();
  const mediaRepository = dataSource.getRepository(Media);

  // Create dummy media files
  createDummyMediaFiles();

  // Load Media entities
  const existingMedia = await mediaRepository.find();

  const mediaPromises = MEDIA_FIXTURES.map(async (mediaData) => {
    if (existingMedia.find((m) => m.relativePath === mediaData.relativePath)) {
      return null;
    }

    const savedMedia = await createMedia(mediaData);

    return savedMedia;
  });

  await Promise.all(mediaPromises);
};
