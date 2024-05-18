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
        teamId: string,
        goals: number
    }, 
    team_2: {
        teamId: string,
        goals: number
    } 
};

export type MatchLocation = {
    latitude: number,
    longitude: number
}

export enum MatchStatus {
    UPCOMING = "upcoming", // default
    REGISTER = "register", // allow registrations between listStartDatetime and listConfirmDatetime
    CONFIRMED = "confirmed", // between listConfirmDatetime and matchDatetime
    ONGOING = "ongoing", // after matchDatetime
    FINISHED = "finished", // when result is provided
    CANCELLED = "cancelled" // when cancelled
}

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: 11})
    teamSize: number;

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
    teams: {
        team1ID: string,
        team2ID: string,
    };

    // Users that can modify details of the match. The user that creates the match is an admin
    @Column('json', { nullable: false,  default: []})
    admins: {
        userId: number
    }[];

    @Column('json', { nullable: false,  default: []})
    playerList: {
        userId: number, 
        joinDatetime: Date, 
        confirmDatetime: Date, 
        confirmEmoji: string,
        teamName: string
    }[];
}
