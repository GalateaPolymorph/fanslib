import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Media } from "../library/entity";

@Entity()
export class Tier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true })
  name: string;

  @Column("int")
  level: number;

  @OneToMany(() => Media, (media) => media.tier)
  media: Media[];
}
