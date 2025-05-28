import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Niche } from "../niches/entity";
import { PostMedia } from "../posts/entity";
import { Shoot } from "../shoots/entity";
import { MediaTag } from "../tags/entity";

export type MediaType = "image" | "video";

@Entity()
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true })
  path: string;

  @Column("varchar")
  type!: MediaType;

  @Column("varchar")
  name!: string;

  @Column("bigint")
  size!: number;

  @Column("float", { nullable: true })
  duration?: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;

  @Column("datetime")
  fileCreationDate!: Date;

  @Column("datetime")
  fileModificationDate!: Date;

  @OneToMany(() => PostMedia, (postMedia) => postMedia.media)
  postMedia: PostMedia[];

  @ManyToMany(() => Shoot)
  @JoinTable({
    name: "shoot_media",
    joinColumn: { name: "media_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "shoot_id", referencedColumnName: "id" },
  })
  shoots: Shoot[];

  @ManyToMany(() => Niche, { cascade: true })
  @JoinTable({
    name: "media_niches",
    joinColumn: { name: "media_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "niche_id", referencedColumnName: "id" },
  })
  niches!: Niche[];

  @OneToMany(() => MediaTag, (mediaTag) => mediaTag.media)
  mediaTags: MediaTag[];
}

export type MediaWithoutRelations = Omit<Media, "id">;
