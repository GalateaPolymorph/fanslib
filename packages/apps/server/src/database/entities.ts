import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type RedditQueueJobStatus = "queued" | "processing" | "posted" | "failed";
export type RedditQueueLogEventType =
  | "queued"
  | "processing"
  | "posted"
  | "failed"
  | "retry"
  | "progress"
  | "milestone";

@Entity("reddit_queue_jobs")
export class RedditQueueJob {
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar")
  subreddit!: string;

  @Column("text")
  caption!: string;

  @Column("varchar", { nullable: true })
  url?: string;

  @Column("varchar", { nullable: true })
  flair?: string;

  @Column("varchar", { nullable: true })
  mediaId?: string; // Reference to media in Electron database

  @Column("varchar")
  scheduledTime!: string; // ISO timestamp

  @Column("varchar", { default: "queued" })
  status!: RedditQueueJobStatus;

  @Column("varchar", { nullable: true })
  postUrl?: string; // Reddit URL after successful posting

  @Column("text", { nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("reddit_queue_logs")
export class RedditQueueLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  jobId!: string;

  @ManyToOne(() => RedditQueueJob, { onDelete: "CASCADE" })
  @JoinColumn({ name: "jobId" })
  job!: RedditQueueJob;

  @Column("varchar")
  eventType!: RedditQueueLogEventType;

  @Column("text")
  message!: string;

  @Column("varchar")
  timestamp!: string;
}

@Entity("reddit_sessions")
export class RedditSession {
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar", { nullable: true })
  userId?: string; // For multi-user support in the future

  @Column("text")
  sessionData!: string; // JSON blob containing cookies, localStorage, etc.

  @Column("varchar", { nullable: true })
  username?: string; // Reddit username for display

  @Column("varchar")
  expiresAt!: string; // ISO timestamp when session expires

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
