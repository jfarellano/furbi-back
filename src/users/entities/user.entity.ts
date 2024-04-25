import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Position {
  GK = "Goalkeeper",
  CB = "Center Back",
  LB = "Left Back",
  RB = "Right Back",
  CDM = "Center Defensive Midfielder",
  CM = "Center Midfielder",
  RM = "Right Midfielder",
  LM = "Left Midfielder",
  CAM = "Center Attacking Midfielder",
  CF = "Center Forward",
  ST = "Striker",
  LW = "Left Wing",
  RW = "Right Wing",
}

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
