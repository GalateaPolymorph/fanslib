import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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

  @Column("varchar", { default: VERIFICATION_STATUS.UNKNOWN })
  verificationStatus!: VerificationStatus;
}
