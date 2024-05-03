import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(AuthGuard)
  @Patch(':groupId/join-group')
  async joinGroup(@Param('groupId') groupId: number, @Req() request) {
    const selfUserId = request.user.sub;
    let user = await this.usersService.findOne(selfUserId);
    let group = await this.groupsService.findOne(groupId);

    if(!user){
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if(!group){
      throw new HttpException('Group not found', HttpStatus.BAD_REQUEST);
    }
    
    if(!group.players){
      group.players = [];
    }

    if(group.players.find((element) => { return user.id === element.id})){
      // If the player is already in the group return error 400
      throw new HttpException('Already joined this group', HttpStatus.BAD_REQUEST);
    } else {
      group.players.push(user);
    }

    let savedGroup = await this.groupsService.saveGroup(group);
    
    let message = ""
    if(savedGroup) message = "User added to group";
    else message = "Error";
    return {
      message: message
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':groupId/add-player/:userId')
  async addUserToGroup(@Param('groupId') groupId: number, @Param('userId') userId: number, @Req() request) {
    const selfUserId = request.user.sub;
    let isSuperUser = this.usersService.validateSuperuser(selfUserId);
    if (!isSuperUser){
      // Return error 403 if the user is not a superuser
      throw new HttpException('User Not Authorized', HttpStatus.FORBIDDEN);
    } 

    let user = await this.usersService.findOne(userId);
    let group = await this.groupsService.findOne(groupId);

    if(!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if(!group){
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    
    if(!group.players){
      group.players = [];
    }

    if(group.players.find((element) => { return user.id === element.id})){
      // If the player is already in the group return error 400
      throw new HttpException('User already belongs to group', HttpStatus.BAD_REQUEST);
    } else {
      group.players.push(user);
    }

    let savedGroup = await this.groupsService.saveGroup(group);
    
    let message = ""
    if(savedGroup) message = "Player added to group";
    else message = "Error";
    return {
      message: message
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':groupId/exit-group')
  async exitGroup(@Param('groupId') groupId: number, @Req() request) {
    const selfUserId = request.user.sub;
    let user = await this.usersService.findOne(selfUserId);
    let group = await this.groupsService.findOne(groupId);

    if(!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if(!group){
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    
    if(!group.players){
      group.players = [];
    }

    if(group.players.find((element) => { return user.id === element.id})){
      // If the player belongs to the group, remove it
      console.log(group.players);
      group.players = group.players.filter(player => {
        return player.id != user.id;
      });
      console.log(group.players);
    } else {
      throw new HttpException('Player does not belong to group', HttpStatus.BAD_REQUEST);
    }

    let savedGroup = await this.groupsService.saveGroup(group);
    
    let message = ""
    if(savedGroup) message = "Player removed from group";
    else message = "Error";
    return {
      message: message
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':groupId/remove-player/:userId')
  async deleteFromGroup(@Param('groupId') groupId: number, @Param('userId') userId: number, @Req() request) {
    const selfUserId = request.user.sub;
    let isSuperUser = this.usersService.validateSuperuser(selfUserId);
    if (!isSuperUser){
      // Return error 403 if the user is not a superuser
      throw new HttpException('User Not Authorized', HttpStatus.FORBIDDEN);
    } 

    let user = await this.usersService.findOne(userId);
    let group = await this.groupsService.findOne(groupId);

    if(!user){
      throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
    }
    if(!group){
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }
    
    if(!group.players){
      group.players = [];
    }

    if(group.players.find((element) => { return user.id === element.id})){
      // If the player belongs to the group, remove it
      console.log(group.players);
      group.players = group.players.filter(player => {
        return player.id != user.id;
      });
      console.log(group.players);
    } else {
      throw new HttpException('Player does not belong to group', HttpStatus.BAD_REQUEST);
    }

    let savedGroup = await this.groupsService.saveGroup(group);
    
    let message = ""
    if(savedGroup) message = "Player removed from group";
    else message = "Error";
    return {
      message: message
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    let group = this.groupsService.findOne(+id);
    if(!group){
      this.groupsService.remove(+id);
      return {
        message: "Group deleted",
        groupId: id
      }
    } else {
      throw new HttpException('Group does not exist', HttpStatus.BAD_REQUEST);
    }
  }
}
