import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { MediaFilters } from "../library/api-type";

@Entity()
export class FilterPreset {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("text")
  filtersJson: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;
}

export const filtersFromFilterPreset = (preset: FilterPreset): MediaFilters => {
  return JSON.parse(preset.filtersJson);
};
