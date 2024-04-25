import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  create(createGroupDto: CreateGroupDto) {
    return this.groupsRepository.save(createGroupDto);
  }

  findAll() {
    return this.groupsRepository.find();
  }

  findOne(id: number) {
    return this.groupsRepository.findOneBy({id: id});
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    let group = await this.findOne(id);
    group.teams = updateGroupDto.teams;
    
    console.log(group);
    await this.groupsRepository.update(id, group)
    return this.findOne(id) 
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
