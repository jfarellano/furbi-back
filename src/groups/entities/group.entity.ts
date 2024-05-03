import { Match } from 'src/matches/entities/match.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    OneToMany,
    JoinTable
} from 'typeorm';

export type Team = {
    name: string;
    color: string;
}

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('json', { nullable: false,  default: [] })
    teams: Team[]

    @ManyToMany(() => User, (user) => user.groups, {cascade: false})
    @JoinTable()
    players: User[]

    @OneToMany(() => Match, (match) => match.group)
    matches: Match[]
}
