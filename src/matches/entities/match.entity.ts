import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinTable
} from 'typeorm';
import { Group } from 'src/groups/entities/group.entity';

export type MatchResult = { 
    team_1: {
        teamName: string,
        goals: number
    }, 
    team_2: {
        teamName: string,
        goals: number
    } 
};

export type MatchLocation = {
    latitude: number,
    longitude: number
}

export enum MatchStatus {
    UPCOMING = "upcoming",
    ONGOING = "ongoing",
    FINISHED = "finished",
    CANCELLED = "cancelled"
}

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamp with time zone", nullable: true })
    listStartDatetime: Date;

    @Column({ type: "timestamp with time zone", nullable: true })
    listConfirmDatetime: Date;

    @Column({ type: "timestamp with time zone", nullable: false })
    matchDatetime: Date;

    @Column({ nullable: true })
    matchPlace: string;

    @Column('json', {nullable: true, default: null})
    result: MatchResult;

    @Column('json', {nullable: true, default: null})
    matchLocation: MatchLocation

    @Column({
        type: "enum",
        enum: MatchStatus,
        default: MatchStatus.UPCOMING
    })
    status: MatchStatus

    @ManyToOne(() => Group, (group) => group.matches)
    @JoinTable()
    group: Group;

    @Column('json', { nullable: false,  default: []})
    playerOfTheMatchVoting: {userId: number, voters: {userId: number}[]}[];

    @Column('json', { nullable: false,  default: []})
    playerList: {userId: number, joinDatetime: Date, confirmDatetime: Date, confirmEmoji: string}[];
}
