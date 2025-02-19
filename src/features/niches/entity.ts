import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Hashtag } from "../hashtags/entity";

@Entity()
export class Niche {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true })
  name: string;

  @ManyToMany(() => Hashtag)
  @JoinTable({
    name: "niche_hashtags",
    joinColumn: { name: "niche_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "hashtag_id", referencedColumnName: "id" },
  })
  hashtags: Hashtag[];
}
