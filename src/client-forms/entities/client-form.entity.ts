import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Actions, Buyer, Kpi, Opposition, OtherPublics, Solve, Technics, TouchPoint, User } from './extra-entities';
import { Client } from 'src/clients/entities/client.entity';


@Entity()
export class ClientForm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true}) // (1) Empresa / Ong
  organizationType: string

  // String array
  @Column("simple-array", {nullable: true}) // (1) B2C,B2B
  clientTypes: string[]

  // String array
  @Column("simple-array", {nullable: true}) // (2.1)
  offer: string[]

  // String array
  @Column("simple-array", {nullable: true}) // (2.1)
  organizarionAreas: string[]

  // String array
  @Column("simple-array", {nullable: true}) // (3.1, 4.1)
  offering: string[]

  // String array
  @Column("simple-array", {nullable: true}) // 3.2
  target: string[]

  @Column({nullable: true}) // 3.3
  clients: string

  // String array
  @Column("json", {nullable: true}) // 3.5
  buyer: Buyer[]

  // String array
  @Column("json", {nullable: true}) // 3.4
  users: User[]

  // Double string array
  @Column('json', {nullable: true}) // 5.4, 5.5
  solve: Solve[]

  @Column({nullable: true}) // 6
  markets: string

  @Column({nullable: true}) // 7
  marketSize: string

  // Tripple string array
  @Column('json', {nullable: true}) // 9
  otherPublics: OtherPublics[]

  @Column({nullable: true}) // 10
  buyingPatterns: string

  @Column({nullable: true}) // 12
  clientTimeExpectancy: string

  @Column({nullable: true}) // 13
  retentionCapacity: string

  @Column({nullable: true}) // 14
  ticketAverage: string

  @Column({nullable: true}) // 15
  priceComparison: string

  // Fourt string array
  @Column('json', {nullable: true}) // 16, 17, 18
  publicActions: Actions[]

  // Tripple string array
  @Column('json', {nullable: true}) // 19
  kpi: Kpi[]

  // Double string array
  @Column('json', {nullable: true}) // 21
  marketingTechnics: Technics[]

  // String array
  @Column("simple-array", {nullable: true}) // 42
  monitoredKpis: string[]

  // String array
  @Column("simple-array", {nullable: true}) // 44, 45
  roiStrategies: string[]

  // Double string array
  @Column('json', {nullable: true}) // 22, 23
  touchPoints: TouchPoint

  // Double string array
  @Column("json", {nullable: true}) // 27
  opposition: Opposition

  @Column({nullable: true}) // 30
  oppositionMarketing: string

  @Column({nullable: true}) // 38
  growthObjective: string

  @Column({nullable: true}) // 48
  uniqueness: string

  @Column({nullable: true}) // 49
  recognizedCharacteristic: string

  @Column({nullable: true}) // 50
  vision: string

  @OneToOne(() => Client)
  @JoinColumn()
  client: Client
}
