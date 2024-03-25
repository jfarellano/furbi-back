import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  create(createClientDto: CreateClientDto) {
    return this.clientsRepository.save(createClientDto)
  }

  findAll() {
    return this.clientsRepository.find();
  }

  findOne(id: number) {
    return this.clientsRepository.findOneBy({ id });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.clientsRepository.update(id, updateClientDto)
    return this.findOne(id) 
  }

  async remove(id: number) {
    return await this.clientsRepository.delete(id);
  }
}
