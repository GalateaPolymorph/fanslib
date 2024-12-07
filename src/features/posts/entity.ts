import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Category } from "../categories/entity";
import { Channel } from "../channels/entity";
import { Media } from "../library/entity";

export type PostStatus = "planned" | "scheduled" | "posted";

@Entity()
export class PostMedia {
  @PrimaryColumn("varchar")
  postId!: string;

  @PrimaryColumn("varchar")
  path!: string;

  @Column("int")
  order!: number;

  @ManyToOne(() => Media)
  @JoinColumn({ name: "path", referencedColumnName: "path" })
  media!: Media;

  @ManyToOne(() => Post, (post) => post.media)
  @JoinColumn({ name: "postId" })
  post!: Post;
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
  categorySlug?: string;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: "channelId" })
  channel!: Channel;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categorySlug", referencedColumnName: "slug" })
  category?: Category;

  @OneToMany(() => PostMedia, (mediaOrder) => mediaOrder.post)
  media!: PostMedia[];
}

export type PostWithoutRelations = Omit<Post, "channel" | "category" | "media">;
