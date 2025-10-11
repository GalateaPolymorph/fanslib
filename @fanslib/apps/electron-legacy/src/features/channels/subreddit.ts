import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { MediaFilters } from "../library/api-type";
import { VERIFICATION_STATUS, type VerificationStatus } from "./type";

@Entity()
export class Subreddit {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("int", { nullable: true })
  maxPostFrequencyHours?: number;

  @Column("text", { nullable: true })
  notes?: string;

  @Column("int", { nullable: true })
  memberCount?: number;

  @Column("simple-json", { nullable: true })
  eligibleMediaFilter?: MediaFilters;

  @Column("varchar", { default: VERIFICATION_STATUS.UNKNOWN })
  verificationStatus!: VerificationStatus;

  @Column("varchar", { nullable: true })
  defaultFlair?: string;

  /**
   * Gets added to the beginning of the caption in auto-posting.
   */
  @Column("varchar", { nullable: true })
  captionPrefix?: string;

  /**
   * Posting times analysis data from Postpone API
   */
  @Column("simple-json", { nullable: true })
  postingTimesData?: Array<{
    day: number;
    hour: number;
    posts: number;
    score: number; // Normalized score 1-100
  }>;

  /**
   * When posting times data was last fetched
   */
  @Column("datetime", { nullable: true })
  postingTimesLastFetched?: Date;

  /**
   * Timezone used for posting times analysis
   */
  @Column("varchar", { nullable: true })
  postingTimesTimezone?: string;
}
