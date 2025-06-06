import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Channel } from "../channels/entity";
import { MediaFilters } from "../library/api-type";

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
  mediaFilters?: string;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: "channelId" })
  channel!: Channel;
}

export type ContentScheduleWithoutRelations = Omit<ContentSchedule, "channel">;

export const parseMediaFilters = (mediaFilters?: string): MediaFilters | null => {
  if (!mediaFilters) return null;
  try {
    return JSON.parse(mediaFilters);
  } catch {
    return null;
  }
};

export const stringifyMediaFilters = (filters: MediaFilters): string => {
  return JSON.stringify(filters);
};
