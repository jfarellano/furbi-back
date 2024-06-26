import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto):  Promise<User | null> {
    return this.usersRepository.save({
      ...createUserDto,
      password: this.hash(createUserDto.password)
    });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne(
      {
        where: { id: id },
        relations: ['groups']
      }
    );
  }

  findOneByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne(
      {
        where: { phone: phone },
        relations: ['groups']
      }
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto):  Promise<User | null> {  
    if(updateUserDto.password) updateUserDto.password = this.hash(updateUserDto.password)  
    await this.usersRepository.update(id, updateUserDto)
    let newUserData = await this.findOne(id);
    if(newUserData === null) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return newUserData;
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async saveUser(user: User){
    return await this.usersRepository.save(user);
  }

  positions() {
    return {
      GK:  "Goalkeeper",
      CB:  "Center Back",
      LB:  "Left Back",
      RB:  "Right Back",
      CD:  "Center Defensive Midfielder",
      CM:  "Center Midfielder",
      RM:  "Right Midfielder",
      LM:  "Left Midfielder",
      CA:  "Center Attacking Midfielder",
      CF:  "Center Forward",
      ST:  "Striker",
      LW:  "Left Wing",
      RW:  "Right Wing"
    }
  }

  async validatePassword(phone: string, password: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where({ phone })
      .addSelect('user.password')
      .getOne();

    const passwordMatchs = bcrypt.compareSync(password, user.password);
    if (passwordMatchs) {
      return await this.findOneByPhone(phone);
    }
    return null;
  }

  async validateSuperuser(userId: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where({ id: userId })
      .addSelect('user.superuser')
      .getOne();

    return user.superuser;
  }

  hash(value: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(value, salt);
  }

  async getPositions() {
    return {
      GK:  "Goalkeeper",
      CB:  "Center Back",
      LB:  "Left Back",
      RB:  "Right Back",
      CD:  "Center Defensive Midfielder",
      CM:  "Center Midfielder",
      RM:  "Right Midfielder",
      LM:  "Left Midfielder",
      CA:  "Center Attacking Midfielder",
      CF:  "Center Forward",
      ST:  "Striker",
      LW:  "Left Wing",
      RW:  "Right Wing"
    }
  }
}
