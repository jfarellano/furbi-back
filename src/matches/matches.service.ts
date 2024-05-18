import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, MatchStatus } from './entities/match.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}
  
  create(createMatchDto: CreateMatchDto) {
    return this.matchesRepository.save(createMatchDto);
  }

  async findAll(options: {groupId?: number, status?: string}) {
    let whereClause = {}
    if(options.groupId) whereClause["group"] = options.groupId;    
    if(options.status && (Object.values(MatchStatus) as string[]).includes(options.status)) whereClause["status"] = options.status;
    
    return await this.matchesRepository
      .createQueryBuilder('match')
      .where(whereClause)
      .getMany();
  }

  findOne(id: number) {
    return this.matchesRepository.findOne({
      where: {id: id},
      relations: ["group"]
    });
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return this.matchesRepository.update(id, updateMatchDto);
  }

  async saveMatch(match: Match){
    return await this.matchesRepository.save(match);
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }

  validateMatchAdmin(user: User, match: Match){
    let foundUser = match.admins.find((el) => {
      return el.userId === user.id;
    });
    return foundUser != undefined;
  }
}
