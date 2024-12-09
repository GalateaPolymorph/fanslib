import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "../categories/entity";
import { Channel } from "../channels/entity";
import { Media } from "../library/entity";

export type PostStatus = "planned" | "scheduled" | "posted";

@Entity()
export class PostMedia {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int")
  order: number;

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
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar")
  scheduleId!: string;

  @Column("varchar")
  caption!: string;

  @Column("varchar")
  scheduledDate!: string;

  @Column({
    type: "varchar",
    enum: ["planned", "scheduled", "posted"],
  })
  status!: PostStatus;

  @Column("varchar")
  createdAt!: string;

  @Column("varchar")
  updatedAt!: string;

  @Column("varchar")
  channelId!: string;

  @Column("varchar", { nullable: true })
  categoryId?: string;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: "channelId" })
  channel!: Channel;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categoryId", referencedColumnName: "id" })
  category?: Category;

  @OneToMany(() => PostMedia, (mediaOrder) => mediaOrder.post)
  postMedia!: PostMedia[];
}

export type PostWithoutRelations = Omit<Post, "channel" | "category" | "media">;
