import { TagDefinition, TagDimension } from "../features/tags/entity";
import { db } from "../lib/db";

const TAG_DIMENSIONS: Omit<TagDimension, "createdAt" | "updatedAt" | "tags">[] = [
  {
    name: "Outfit",
    dataType: "categorical" as const,
    description: "Clothing and outfit categories",
    id: 1,
    sortOrder: 1,
    stickerDisplay: "none",
    isExclusive: true,
  },
  {
    name: "Location",
    dataType: "categorical" as const,
    description: "Location where content was created",
    id: 2,
    sortOrder: 2,
    stickerDisplay: "none",
    isExclusive: true,
  },
  {
    name: "Theme",
    dataType: "categorical" as const,
    description: "Thematic style of content",
    id: 3,
    sortOrder: 3,
    stickerDisplay: "none",
    isExclusive: true,
  },
  {
    name: "Body Part",
    dataType: "categorical" as const,
    description: "Body parts featured in content",
    id: 4,
    sortOrder: 4,
    stickerDisplay: "none",
    isExclusive: true,
  },
  {
    name: "Style",
    dataType: "categorical" as const,
    description: "Photography or artistic style",
    id: 5,
    sortOrder: 5,
    stickerDisplay: "none",
    isExclusive: true,
  },
  {
    name: "Mood",
    dataType: "categorical" as const,
    description: "Emotional tone of content",
    id: 6,
    sortOrder: 6,
    stickerDisplay: "none",
    isExclusive: true,
  },
  {
    name: "Activity",
    dataType: "categorical" as const,
    description: "Activities depicted in content",
    id: 7,
    sortOrder: 7,
    stickerDisplay: "none",
    isExclusive: true,
  },
  {
    name: "Color",
    dataType: "categorical" as const,
    description: "Dominant colors in content",
    id: 8,
    sortOrder: 8,
    stickerDisplay: "color",
    isExclusive: true,
  },
];

const TAG_DEFINITIONS: Omit<
  TagDefinition,
  "createdAt" | "updatedAt" | "dimension" | "mediaTags" | "children" | "parent"
>[] = [
  // Outfit tags
  { id: 1, value: "lingerie", displayName: "Lingerie", dimensionId: 1, sortOrder: 1 },
  { id: 2, value: "bikini", displayName: "Bikini", dimensionId: 1, sortOrder: 2 },
  { id: 3, value: "dress", displayName: "Dress", dimensionId: 1, sortOrder: 3 },
  { id: 3, value: "casual", displayName: "Casual", dimensionId: 1, sortOrder: 3 },
  { id: 4, value: "formal", displayName: "Formal", dimensionId: 1, sortOrder: 4 },
  { id: 5, value: "cosplay", displayName: "Cosplay", dimensionId: 1, sortOrder: 5 },
  { id: 6, value: "uniform", displayName: "Uniform", dimensionId: 1, sortOrder: 6 },
  { id: 7, value: "sportswear", displayName: "Sportswear", dimensionId: 1, sortOrder: 7 },

  // Location tags
  { id: 8, value: "bedroom", displayName: "Bedroom", dimensionId: 2, sortOrder: 1 },
  { id: 9, value: "bathroom", displayName: "Bathroom", dimensionId: 2, sortOrder: 2 },
  { id: 10, value: "kitchen", displayName: "Kitchen", dimensionId: 2, sortOrder: 3 },
  { id: 11, value: "livingroom", displayName: "Living Room", dimensionId: 2, sortOrder: 4 },
  { id: 12, value: "outdoor", displayName: "Outdoor", dimensionId: 2, sortOrder: 5 },
  { id: 13, value: "studio", displayName: "Studio", dimensionId: 2, sortOrder: 6 },
  { id: 14, value: "hotel", displayName: "Hotel", dimensionId: 2, sortOrder: 7 },
  { id: 15, value: "car", displayName: "Car", dimensionId: 2, sortOrder: 8 },

  // Theme tags
  { id: 16, value: "romantic", displayName: "Romantic", dimensionId: 3, sortOrder: 1 },
  { id: 17, value: "playful", displayName: "Playful", dimensionId: 3, sortOrder: 2 },
  { id: 18, value: "artistic", displayName: "Artistic", dimensionId: 3, sortOrder: 3 },
  { id: 19, value: "elegant", displayName: "Elegant", dimensionId: 3, sortOrder: 4 },
  { id: 20, value: "edgy", displayName: "Edgy", dimensionId: 3, sortOrder: 5 },
  { id: 21, value: "vintage", displayName: "Vintage", dimensionId: 3, sortOrder: 6 },
  { id: 22, value: "modern", displayName: "Modern", dimensionId: 3, sortOrder: 7 },
  { id: 23, value: "fantasy", displayName: "Fantasy", dimensionId: 3, sortOrder: 8 },

  // Body part tags
  { id: 22, value: "face", displayName: "Face", dimensionId: 4, sortOrder: 1 },
  { id: 23, value: "hands", displayName: "Hands", dimensionId: 4, sortOrder: 2 },
  { id: 24, value: "legs", displayName: "Legs", dimensionId: 4, sortOrder: 3 },
  { id: 25, value: "full-body", displayName: "Full Body", dimensionId: 4, sortOrder: 4 },
  { id: 26, value: "portrait", displayName: "Portrait", dimensionId: 4, sortOrder: 5 },

  // Style tags
  { id: 27, value: "natural", displayName: "Natural", dimensionId: 5, sortOrder: 1 },
  { id: 28, value: "glamour", displayName: "Glamour", dimensionId: 5, sortOrder: 2 },
  { id: 29, value: "candid", displayName: "Candid", dimensionId: 5, sortOrder: 3 },
  { id: 30, value: "posed", displayName: "Posed", dimensionId: 5, sortOrder: 4 },
  { id: 31, value: "artistic", displayName: "Artistic", dimensionId: 5, sortOrder: 5 },

  // Mood tags
  { id: 32, value: "happy", displayName: "Happy", dimensionId: 6, sortOrder: 1 },
  { id: 33, value: "sultry", displayName: "Sultry", dimensionId: 6, sortOrder: 2 },
  { id: 34, value: "relaxed", displayName: "Relaxed", dimensionId: 6, sortOrder: 3 },
  { id: 35, value: "mysterious", displayName: "Mysterious", dimensionId: 6, sortOrder: 4 },
  { id: 36, value: "confident", displayName: "Confident", dimensionId: 6, sortOrder: 5 },

  // Activity tags
  { id: 37, value: "dancing", displayName: "Dancing", dimensionId: 7, sortOrder: 1 },
  { id: 38, value: "reading", displayName: "Reading", dimensionId: 7, sortOrder: 2 },
  { id: 39, value: "cooking", displayName: "Cooking", dimensionId: 7, sortOrder: 3 },
  { id: 40, value: "workout", displayName: "Workout", dimensionId: 7, sortOrder: 4 },
  { id: 41, value: "gaming", displayName: "Gaming", dimensionId: 7, sortOrder: 5 },

  // Color tags
  { id: 42, value: "red", displayName: "Red", dimensionId: 8, sortOrder: 1 },
  { id: 43, value: "blue", displayName: "Blue", dimensionId: 8, sortOrder: 2 },
  { id: 44, value: "black", displayName: "Black", dimensionId: 8, sortOrder: 3 },
  { id: 45, value: "white", displayName: "White", dimensionId: 8, sortOrder: 4 },
  { id: 46, value: "pink", displayName: "Pink", dimensionId: 8, sortOrder: 5 },
  { id: 47, value: "purple", displayName: "Purple", dimensionId: 8, sortOrder: 6 },
];

export const loadTagFixtures = async () => {
  const dataSource = await db();

  // Load TagDimensions
  const dimensionRepository = dataSource.getRepository(TagDimension);
  const existingDimensions = await dimensionRepository.find();

  const dimensionPromises = TAG_DIMENSIONS.map(async (dimension) => {
    if (existingDimensions.find((d) => d.id === dimension.id)) {
      return null;
    }
    return dimensionRepository.save(dimension);
  });

  await Promise.all(dimensionPromises);

  // Get all dimensions for linking
  const allDimensions = await dimensionRepository.find();
  const dimensionMap = new Map(allDimensions.map((d) => [d.id, d]));

  // Load TagDefinitions
  const definitionRepository = dataSource.getRepository(TagDefinition);
  const existingDefinitions = await definitionRepository.find();

  const definitionPromises = TAG_DEFINITIONS.map(async (definition) => {
    if (existingDefinitions.find((d) => d.id === definition.id)) {
      return null;
    }

    const dimension = dimensionMap.get(definition.dimensionId);
    if (!dimension) {
      console.warn(`Dimension ${definition.dimensionId} not found for tag ${definition.value}`);
      return null;
    }

    return definitionRepository.save({
      ...definition,
    });
  });

  await Promise.all(definitionPromises);
};
