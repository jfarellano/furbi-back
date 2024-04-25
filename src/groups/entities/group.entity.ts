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

interface Team {
    name: string;
    color: string;
}

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { array: true, nullable: false,  default: []})
    teams: Team[]

    @ManyToMany(() => User)
    @JoinTable()
    players: User[]

    @OneToMany(() => Match, (match) => match.group)
    matches: Match[]
}
