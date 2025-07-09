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
}
