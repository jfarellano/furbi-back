import { Group } from 'src/groups/entities/group.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

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
}
