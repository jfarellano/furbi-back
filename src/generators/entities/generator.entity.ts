import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Generator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number

  @Column()
  type: string

  @Column()
  index: number

  @Column('json')
  state: any[]
}
