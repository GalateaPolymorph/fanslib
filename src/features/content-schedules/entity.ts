import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Channel } from "../channels/entity";

@Entity()
export class ContentSchedule {
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar")
  channelId!: string;

  @Column({
    type: "varchar",
    enum: ["daily", "weekly", "monthly"],
  })
  type!: "daily" | "weekly" | "monthly";

  @Column("int", { nullable: true })
  postsPerTimeframe?: number;

  @Column("simple-array", { nullable: true })
  preferredDays?: string[];

  @Column("simple-array", { nullable: true })
  preferredTimes?: string[];

  @Column("varchar")
  updatedAt!: string;

  @Column("varchar")
  createdAt!: string;

  @Column("text", { nullable: true })
  tagRequirements?: string;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: "channelId" })
  channel!: Channel;
}

export type ContentScheduleWithoutRelations = Omit<ContentSchedule, "channel">;

// Key represents the tag category (e.g., "genre", "mood", "topic")
// Value represents an array of allowed tag IDs (either string or number) for that category
export type TagRequirements = Record<string, (string | number)[]>;

export const parseTagRequirements = (tagRequirements?: string): TagRequirements | null => {
  if (!tagRequirements) return null;
  try {
    return JSON.parse(tagRequirements);
  } catch {
    return null;
  }
};

export const stringifyTagRequirements = (requirements: TagRequirements): string => {
  return JSON.stringify(requirements);
};
