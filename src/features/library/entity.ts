import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { Category } from "../categories/entity";

export type MediaType = "image" | "video";

@Entity()
export class Media {
  @PrimaryColumn("varchar")
  path!: string;

  @Column("varchar")
  type!: MediaType;

  @Column("varchar")
  name!: string;

  @Column("int")
  size!: number;

  @Column("varchar") // ISO String
  createdAt!: string;

  @Column("varchar") // ISO String
  modifiedAt!: string;

  @Column("boolean")
  isNew!: boolean;

  @Column("simple-array")
  categoryIds!: string[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: "media_categories",
    joinColumn: { name: "media_path", referencedColumnName: "path" },
    inverseJoinColumn: { name: "category_slug", referencedColumnName: "slug" },
  })
  categories!: Category[];
}

export type MediaWithoutRelations = Omit<Media, "categories">;
