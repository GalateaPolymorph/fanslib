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
import { Media } from "../library/entity";

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

  @Column("varchar")
  caption!: string;

  @Column("varchar")
  date!: string;

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

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categoryId", referencedColumnName: "id" })
  category?: Category;
  @Column("varchar", { nullable: true })
  categoryId?: string;

  @OneToMany(() => PostMedia, (mediaOrder) => mediaOrder.post)
  postMedia!: PostMedia[];
}

export type PostWithoutRelations = Omit<Post, "channel" | "category" | "media">;
