import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';
import { User } from '../../users/entities/user.entity'
import { Group } from 'src/groups/entities/group.entity';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamp with time zone", nullable: true })
    listStartDatetime: Date

    @Column({ type: "timestamp with time zone", nullable: true })
    listConfirmDatetime: Date

    @Column({ type: "timestamp with time zone", nullable: false })
    matchDatetime: Date

    @Column({ nullable: true })
    matchPlace: string

    @Column('simple-json', {nullable: true})
    result: { 
        team_1: {
            team_id: number,
            goals: number
        }, 
        team_2: {
            team_id: number,
            goals: number
        } 
    };

    @ManyToOne(() => Group, (group) => group.matches)
    group: Group

    @Column('simple-json', { array: true, nullable: false,  default: []})
    playerOfTheMatchVoting: {userId: number, voters: {userId: number}[]}[];
}
