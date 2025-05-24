import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../posts/entity";

@Entity()
export class FanslyAnalyticsDatapoint {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("int")
  timestamp!: number;

  @Column("int")
  views!: number;

  @Column("int")
  interactionTime!: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: "postId" })
  post!: Post;
  @Column("varchar")
  postId!: string;
}

@Entity()
export class FanslyAnalyticsAggregate {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("int")
  totalViews!: number;

  @Column("float")
  averageEngagementSeconds!: number;

  @Column("float", { default: 0 })
  averageEngagementPercent!: number;

  @OneToOne(() => Post)
  @JoinColumn({ name: "postId" })
  post!: Post;
  @Column("varchar")
  postId!: string;
}

@Entity()
export class AnalyticsFetchHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  timeframeIdentifier!: string; // e.g., "rolling-30d", "fixed-2024-11"

  @Column("varchar")
  postId!: string;

  @Column("datetime")
  fetchedAt!: Date;

  @Column("datetime", { nullable: true })
  expiresAt?: Date; // Only set for rolling timeframes

  @Column("varchar")
  timeframeType!: "rolling" | "fixed";

  @ManyToOne(() => Post)
  @JoinColumn({ name: "postId" })
  post!: Post;
}
