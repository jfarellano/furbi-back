import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MatchesService } from 'src/matches/matches.service';
import { Match } from 'src/matches/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User, Match])],
  controllers: [GroupsController],
  providers: [GroupsService, UsersService, MatchesService],
  exports: [GroupsService]
})
export class GroupsModule {}
