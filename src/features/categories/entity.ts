import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryColumn("varchar")
  slug!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar")
  color!: string;
}
