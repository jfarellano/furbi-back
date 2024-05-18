import { Group } from 'src/groups/entities/group.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export type PlayerRating = {
  PAC: number,
  SHO: number,
  DEF: number,
  DRI: number,
  PAS: number,
  PHY: number
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({default: false, select: false})
  superuser: boolean;

  @Column({default: ""})
  nickname: string;

  @Column('text', { array: true, nullable: false,  default: []})
  positions: string[];

  @ManyToMany(() => Group, (group) => group.players, {cascade: false})
  groups: Group[]

  @Column()
  phone: string;

  @Column({ select: false })
  password: string;

  @Column('json', { nullable: false, default: {
    PAC: 0,
    SHO: 0,
    DEF: 0,
    DRI: 0,
    PAS: 0,
    PHY: 0
  } })
  rating: PlayerRating;
}
