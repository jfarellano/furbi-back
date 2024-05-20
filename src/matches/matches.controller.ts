import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { MatchStatus } from './entities/match.entity';
import { UpdateMatchListDto } from './dto/update-match-list.dto';
import { FinishMatchDto } from './dto/finish-match.dto';

@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly usersService: UsersService
  ) { }

  /**
   * Create a Match
   * Endpoint: /matches
   * Method: POST
   */
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createMatchDto: CreateMatchDto, @Req() request) {
    let selfUserId: number = request.user.sub;
    let user = await this.usersService.findOne(selfUserId);

    // The user creating the match is the admin
    createMatchDto["admins"] = [
      { userId: user.id } 
    ]

    // Create the match
    return this.matchesService.create(createMatchDto);
  }

  /**
   * Allow the logged-in user to join a match list.
   * Endpoint: /matches/:match-id/join
   * Method: POST
   */
  @UseGuards(AuthGuard)
  @Post(":id/join")
  async joinMatch(@Param('id') id: string, @Req() request) {
    let match = await this.matchesService.findOne(+id);

    const matchStatus = match.status;
    let selfUserId: number = request.user.sub;
    let user = await this.usersService.findOne(selfUserId);

    // Validations
    const currentTime = new Date();
    const matchRegisterTime = match.listStartDatetime;
    const matchConfirmTime = match.listConfirmDatetime;
    if ( !(currentTime >= matchRegisterTime && currentTime <= matchConfirmTime) )
      throw new HttpException({ "message": "Match not accepting registers" }, HttpStatus.BAD_REQUEST);

    if(match.status == MatchStatus.CANCELLED)
      throw new HttpException({ "message": "Cannot join a cancelled match" }, HttpStatus.BAD_REQUEST);

    if (!match) throw new HttpException('Match not found', HttpStatus.BAD_REQUEST);
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    if (!user.groups.find((group) => { return group.id === match.group.id }))
      throw new HttpException('User does not belong to match group.', HttpStatus.BAD_REQUEST);

    let matchPlayerEntry = match.playerList.findIndex((player) => { return player.userId === user.id });
    if (matchPlayerEntry === -1) {
      match.playerList.push({
        userId: user.id,
        joinDatetime: new Date(),
        confirmDatetime: null,
        confirmEmoji: null,
        teamId: null
      })
    } else {
      throw new HttpException('Already on the list.', HttpStatus.BAD_REQUEST);
    }

    let savedMatch = this.matchesService.saveMatch(match);
    let message = ""
    if (savedMatch) message = "Joined the match list!";
    else message = "Error";
    return {
      message: message,
      match: match
    }
  }

  /**
   * Allows a logged-in user to confirm the register to a match.
   * Endpoint: /matches/:match-id/confirm
   * Method: POST
   */
  @UseGuards(AuthGuard)
  @Post(":id/confirm")
  async confirmMatch(@Param('id') id: string, @Body() body, @Req() request) {
    let match = await this.matchesService.findOne(+id);
    let selfUserId: number = request.user.sub;

    let user = await this.usersService.findOne(selfUserId);

    // Validations
    if (!match) throw new HttpException('Match not found', HttpStatus.BAD_REQUEST);
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    if (!user.groups.find((group) => { return group.id === match.group.id })) 
      throw new HttpException('User does not belong to match group.', HttpStatus.BAD_REQUEST);
    
    const currentTime = new Date();
    const matchRegisterTime = match.listStartDatetime;
    const matchConfirmTime = match.listConfirmDatetime;
    if ( !(currentTime >= matchRegisterTime && currentTime <= matchConfirmTime) )
      throw new HttpException({ "message": "Match not accepting confirmation" }, HttpStatus.BAD_REQUEST);

    if(match.status == MatchStatus.CANCELLED)
      throw new HttpException({ "message": "Cannot confirm a cancelled match" }, HttpStatus.BAD_REQUEST);

    let matchPlayerEntry = match.playerList.findIndex((player) => { return player.userId === user.id });
    if (matchPlayerEntry === -1) throw new HttpException('Player has not joined this match.', HttpStatus.BAD_REQUEST);

    match.playerList[matchPlayerEntry]['confirmDatetime'] = new Date();
    match.playerList[matchPlayerEntry]['confirmEmoji'] = body.confirmEmoji;

    // Confirm the match if there are more than 2xTeamSize players confirmed.
    const confirmedPlayers = match.playerList.filter((el) => {return el.confirmDatetime != null}).length
    
    if(confirmedPlayers >= 2*match.teamSize){
      match.status = MatchStatus.CONFIRMED;
    }

    let savedMatch = this.matchesService.saveMatch(match);
    let message = ""
    if (savedMatch) message = "Confirmed the match!";
    else message = "Error";
    return {
      message: message,
      match: match
    }
  }

  /**
   * Allows a user to exit a match list.
   * Endpoint: /matches/:match-id/exit
   * Method: POST
   */
  @UseGuards(AuthGuard)
  @Post(":id/exit")
  async exitMatch(@Param('id') id: string, @Req() request) {
    let match = await this.matchesService.findOne(+id);
    let selfUserId: number = request.user.sub;

    let user = await this.usersService.findOne(selfUserId);

    // Validations
    if (!match) throw new HttpException('Match not found', HttpStatus.BAD_REQUEST);
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    if (!user.groups.find((group) => { return group.id === match.group.id }))
      throw new HttpException('User does not belong to match group.', HttpStatus.BAD_REQUEST);

    let matchPlayerEntry = match.playerList.findIndex((player) => { return player.userId === user.id });
    if (matchPlayerEntry === -1) 
      throw new HttpException('Player has not joined this match.', HttpStatus.BAD_REQUEST);

    if(match.status == MatchStatus.CANCELLED)
      throw new HttpException({ "message": "Cannot exit a cancelled match" }, HttpStatus.BAD_REQUEST);

    match.playerList.splice(matchPlayerEntry, 1);
    
    // Back to a upcoming status if a player exits and the confirmed players are less than 2xTeamSize 
    const confirmedPlayers = match.playerList.filter((el) => {return el.confirmDatetime != null}).length;
    if(match.status == MatchStatus.CONFIRMED && confirmedPlayers < 2*match.teamSize){
      match.status = MatchStatus.UPCOMING;
    }

    let savedMatch = this.matchesService.saveMatch(match);
    let message = ""
    if (savedMatch) message = "Removed from the match!";
    else message = "Error";
    return {
      message: message,
      match: match
    }
  }

  /**
   * List of matches. Allows querying by group and status through the query params.
   * Endpoint: /matches
   * Method: GET
   */
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() request: Request, @Query("group") filterGroup: number, @Query("status") filterStatus: string) {
    let filters = {
      groupId: null,
      status: null
    }
    if (filterGroup) filters["groupId"] = filterGroup;
    if (filterStatus) filters["status"] = filterStatus

    return this.matchesService.findAll(filters);
  }

  /**
   * Fetch a single match by its ID
   * Endpoint: /matches/:match-id
   * Method: GET
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  /**
   * Update a single match by its ID. Allows changing all parameters
   * Endpoint: /matches/:match-id
   * Method: PATCH
   */
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto, @Req() request) {
    const selfUserId: number = request.user.sub;
    const user = await this.usersService.findOne(selfUserId);
    let match = await this.matchesService.findOne(+id);

    //Remove the property of the player list, as it is not editable
    if("playerList" in updateMatchDto){
      delete updateMatchDto["playerList"];
    }

    // Status cannot be modified from the update endpoint
    if("status" in updateMatchDto){
      delete updateMatchDto["status"];
    }

    if(!match) 
      throw new HttpException('Match does not exist.', HttpStatus.BAD_REQUEST); 

    if(this.matchesService.validateMatchAdmin(user, match))
      throw new HttpException('This user cannot modify match details.', HttpStatus.BAD_REQUEST); 

    return this.matchesService.update(+id, updateMatchDto);
  }

  /**
   * Remove a match from the database.
   * Endpoint: /matches/:match-id
   * Method: DELETE
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchesService.remove(+id);
  }

  // One endpoint for each status change
  //    As every status change has different validations, it is better this way...
  /**
   * Cancel a match
   * Endpoint: /matches/:match-id/cancel
   * Method: PATCH
   */
  @UseGuards(AuthGuard)
  @Patch(':id/cancel')
  async startRegistration(@Param('id') id: string, @Req() request) {
    let match = await this.matchesService.findOne(+id);
    const selfUserId: number = request.user.sub;
    const user = await this.usersService.findOne(selfUserId);
    if(!this.matchesService.validateMatchAdmin(user, match))  
      throw new HttpException('User is not a match admin.', HttpStatus.BAD_REQUEST);

    if(match.status == MatchStatus.FINISHED || match.status == MatchStatus.ONGOING)
      throw new HttpException('Cannot cancel an started or finished match.', HttpStatus.BAD_REQUEST);

    match.status = MatchStatus.CANCELLED;
    match.playerList = [];
    match.admins = [];
    match.playerOfTheMatchVoting = []
    return this.matchesService.saveMatch(match);
  }

  /**
   * Start a match. Must be a match admin. Sets the score as 0-0 and changes status to ongoing.
   * Endpoint: /matches/:match-id/start
   * Method: PATCH
   */
  @UseGuards(AuthGuard)
  @Patch(':id/start')
  async startMatch(@Param('id') id: string, @Body() startBody: any, @Req() request) {
    let match = await this.matchesService.findOne(+id);
    const selfUserId: number = request.user.sub;
    const user = await this.usersService.findOne(selfUserId);
    const override = startBody.override != undefined ? startBody.override : false;

    if(!this.matchesService.validateMatchAdmin(user, match))  
      throw new HttpException('User is not a match admin.', HttpStatus.BAD_REQUEST);

    const confirmedPlayers = match.playerList.filter(el => {
      return el.confirmDatetime != null;
    })
    if(confirmedPlayers.length < match.teamSize * 2 && !override )
      // If override is sent as true, start the match independent of player number.
      throw new HttpException('Not enough players.', HttpStatus.BAD_REQUEST);

    // update the match player list element by element
    match.result = {
      team_1: {
        teamId: match.teams.team1ID,
        goals: 0
      }, 
      team_2: {
        teamId: match.teams.team2ID,
        goals: 0
      } 
    };
    match.status = MatchStatus.ONGOING;
    return this.matchesService.saveMatch(match);
  }

  /**
   * Finish a match. Receives the match result and builds the player-of-the-match list.
   * Endpoint: /matches/:match-id/finish
   * Method: PATCH
   */
  @UseGuards(AuthGuard)
  @Patch(':id/finish')
  async finishMatch(@Param('id') id: string, @Body() finishMatchDto: FinishMatchDto, @Req() request) {
    let match = await this.matchesService.findOne(+id);
    const selfUserId: number = request.user.sub;
    const user = await this.usersService.findOne(selfUserId);
    if(!this.matchesService.validateMatchAdmin(user, match))  
      throw new HttpException('User is not a match admin.', HttpStatus.BAD_REQUEST);

    // Check that the teams in the result object are the ones of the match
    const resultT1 = finishMatchDto.result.team_1.teamId;
    const resultT2 = finishMatchDto.result.team_2.teamId;
    const matchT1 = match.teams.team1ID;
    const matchT2 = match.teams.team2ID;
    if( !(resultT1 == matchT1 && resultT2 == matchT2) ){
      throw new HttpException('Teams in result are not the same as the match teams or are in the wrong order.', HttpStatus.BAD_REQUEST);
    }

    // update the match player list element by element
    match.result = finishMatchDto.result;
    match.status = MatchStatus.FINISHED;

    const playingPlayers = match.playerList;
    let mvpVotes = [];

    // Build the player of the match voting list
    for(let player of playingPlayers){
      mvpVotes.push({ userId: player.userId, voters: [] })
    }
    match.playerOfTheMatchVoting = mvpVotes;
    return this.matchesService.saveMatch(match);
  }

  /**
   * Update the list of players to assign teams
   * Endpoint: /matches/:match-id
   * Method: PATCH
   */
  @UseGuards(AuthGuard)
  @Patch(':id/assign-teams')
  async statusRegister(@Param('id') id: string, @Body() updateMatchListDto: UpdateMatchListDto, @Req() request) {
    let match = await this.matchesService.findOne(+id);
    const selfUserId: number = request.user.sub;
    const user = await this.usersService.findOne(selfUserId);

    if(!this.matchesService.validateMatchAdmin(user, match)) 
      throw new HttpException('User is not a match admin.', HttpStatus.BAD_REQUEST);

    // update the match player list element by element
    const newPlayerList = updateMatchListDto.playerList;
    let updatePlayerList = []
    for (let player of newPlayerList){
      let updatePlayer = match.playerList.find(el => el.userId === player.userId);
      updatePlayer.teamId = player.teamId;
      updatePlayerList.push(updatePlayer);
    }
    match.playerList = updatePlayerList;
    return this.matchesService.saveMatch(match);
  }


}
