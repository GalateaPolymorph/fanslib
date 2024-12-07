import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class ChannelType {
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar", { nullable: true })
  color?: string;
}

@Entity()
export class Channel {
  @PrimaryColumn("varchar")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("varchar", { nullable: true })
  description?: string;

  @Column("varchar")
  typeId!: string;

  @ManyToOne(() => ChannelType)
  @JoinColumn({ name: "typeId" })
  type!: ChannelType;
}

export type ChannelWithoutRelations = Omit<Channel, "type">;
