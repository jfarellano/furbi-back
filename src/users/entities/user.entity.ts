import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({default: ""})
  nickname: string;

  @Column('text', { array: true, nullable: false,  default: []})
  positions: string[];

  // @Column()
  // nationality: string;

  @Column()
  phone: string;

  @Column({ select: false })
  password: string;
}
