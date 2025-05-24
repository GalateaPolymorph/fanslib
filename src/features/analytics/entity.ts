import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../posts/entity";

@Entity()
export class FanslyAnalyticsDatapoint {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("int")
  timestamp!: number;

  @Column("int")
  views!: number;

  @Column("int")
  interactionTime!: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: "postId" })
  post!: Post;
  @Column("varchar")
  postId!: string;
}

@Entity()
export class FanslyAnalyticsAggregate {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("int")
  totalViews!: number;

  @Column("float")
  averageEngagementSeconds!: number;

  @Column("float", { default: 0 })
  averageEngagementPercent!: number;

  @OneToOne(() => Post)
  @JoinColumn({ name: "postId" })
  post!: Post;
  @Column("varchar")
  postId!: string;
}
