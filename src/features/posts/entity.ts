import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../categories/entity";
import { Channel } from "../channels/entity";
import { Subreddit } from "../channels/subreddit";
import { Media } from "../library/entity";
import { Tier } from "../tiers/entity";

export type PostStatus = "draft" | "scheduled" | "posted";

@Entity()
export class PostMedia {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int")
  order: number;

  @Column("boolean", { default: false })
  isFreePreview: boolean;

  @ManyToOne(() => Post, (post) => post.postMedia, { onDelete: "CASCADE" })
  @JoinColumn()
  post: Post;

  @ManyToOne(() => Media, (media) => media.postMedia, { onDelete: "CASCADE" })
  @JoinColumn()
  media: Media;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  createdAt!: string;

  @Column("varchar")
  updatedAt!: string;

  @Column("varchar", { nullable: true })
  scheduleId?: string;

  @Column("varchar", { nullable: true })
  caption?: string;

  @Column("varchar")
  date!: string;

  @Column("varchar", { nullable: true })
  url?: string;

  @Column({
    type: "varchar",
    enum: ["draft", "scheduled", "posted"],
  })
  status!: PostStatus;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: "channelId" })
  channel!: Channel;
  @Column("varchar")
  channelId!: string;

  @ManyToOne(() => Subreddit)
  @JoinColumn({ name: "subredditId" })
  subreddit?: Subreddit;
  @Column("varchar", { nullable: true })
  subredditId?: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categoryId", referencedColumnName: "id" })
  category?: Category;
  @Column("varchar", { nullable: true })
  categoryId?: string;

  @Column("int", { nullable: true })
  tierId?: number;

  @ManyToOne(() => Tier)
  @JoinColumn({ name: "tierId" })
  tier?: Tier;

  @OneToMany(() => PostMedia, (mediaOrder) => mediaOrder.post)
  postMedia!: PostMedia[];
}

export type PostWithoutRelations = Omit<
  Post,
  "channel" | "category" | "media" | "tier" | "subreddit"
>;
