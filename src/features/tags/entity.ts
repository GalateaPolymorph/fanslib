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
import { Media } from "../library/entity";

@Entity()
export class TagDimension {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true })
  name: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("varchar")
  dataType: "categorical" | "numerical" | "boolean";

  @Column("text", { nullable: true })
  validationSchema?: string; // JSON string

  @Column("int", { default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TagDefinition, (tag) => tag.dimension)
  tags: TagDefinition[];
}

@Entity()
export class TagDefinition {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TagDimension, (dimension) => dimension.tags)
  @JoinColumn({ name: "dimension_id" })
  dimension: TagDimension;

  @Column("int")
  dimensionId: number;

  @Column("text") // Store as JSON for flexibility
  value: string;

  @Column("varchar")
  displayName: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("text", { nullable: true })
  metadata?: string; // JSON string

  @Column("int", { nullable: true })
  parentTagId?: number;

  @ManyToOne(() => TagDefinition, { nullable: true })
  @JoinColumn({ name: "parent_tag_id" })
  parent?: TagDefinition;

  @OneToMany(() => TagDefinition, (tag) => tag.parent)
  children: TagDefinition[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MediaTag, (mediaTag) => mediaTag.tag)
  mediaTags: MediaTag[];
}

@Entity()
export class MediaTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  mediaId: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: "media_id" })
  media: Media;

  @Column("int")
  tagDefinitionId: number;

  @ManyToOne(() => TagDefinition, (tag) => tag.mediaTags)
  @JoinColumn({ name: "tag_definition_id" })
  tag: TagDefinition;

  @Column("real", { nullable: true })
  confidence?: number;

  @Column("varchar")
  source: "manual" | "automated" | "imported";

  @CreateDateColumn()
  assignedAt: Date;
}
