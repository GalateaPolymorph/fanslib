import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Channel } from "../channels/entity";

@Entity()
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { unique: true })
  name: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @OneToMany(() => HashtagChannelStats, (stats) => stats.hashtag)
  channelStats: HashtagChannelStats[];
}

@Entity()
@Unique(["hashtag", "channel"])
export class HashtagChannelStats {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hashtag, (hashtag) => hashtag.channelStats)
  @JoinColumn({ name: "hashtagId" })
  hashtag: Hashtag;

  @Column("int")
  hashtagId: number;

  @ManyToOne(() => Channel)
  @JoinColumn({ name: "channelId" })
  channel: Channel;

  @Column("varchar")
  channelId: string;

  @Column("int", { default: 0 })
  views: number;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;
}
