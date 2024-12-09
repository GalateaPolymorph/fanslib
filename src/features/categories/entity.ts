import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  slug!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar")
  color!: string;
}
