import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @UseGuards(AuthGuard)
  @Post(":id/join")
  async joinMatch(@Param('id') id: string, @Req() request) {
    let match = await this.matchesService.findOne(+id);
    let selfUserId: number = request.user.sub;
    let user = await this.usersService.findOne(selfUserId);

    if(!match){
      throw new HttpException('Match not found', HttpStatus.BAD_REQUEST); 
    }
    
    if(!user){
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST); 
    }
    
    if(!user.groups.find((group) => {return group.id === match.group.id})){
      throw new HttpException('User does not belong to match group.', HttpStatus.BAD_REQUEST); 
    }
    
    let matchPlayerEntry = match.playerList.findIndex((player) => {return player.userId === user.id});
    if(matchPlayerEntry === -1){
      match.playerList.push({
        userId: user.id,
        joinDatetime: new Date(),
        confirmDatetime: null,
        confirmEmoji: null
      })
    }
    
    let savedMatch = this.matchesService.saveMatch(match);

    let message = ""
    if(savedMatch) message = "Joined the match list!";
    else message = "Error";
    return {
      message: message,
      match: match
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request: Request, @Query("group") filterGroup: number, @Query("status") filterStatus: string) {
    return this.matchesService.findAll({
      groupId: filterGroup,
      status: filterStatus
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(+id, updateMatchDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(+id);
  }
}
