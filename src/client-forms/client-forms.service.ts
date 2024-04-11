import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientFormDto } from './dto/create-client-form.dto';
import { UpdateClientFormDto } from './dto/update-client-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientForm } from './entities/client-form.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class ClientFormsService {
  constructor(
    @InjectRepository(ClientForm)
    private clientFormsRepository: Repository<ClientForm>,
    private readonly clientsService: ClientsService
  ) {}

  create(createClientDto: CreateClientFormDto) {
    return this.clientFormsRepository.save(createClientDto)
  }

  findAll() {
    return this.clientFormsRepository.find();
  }

  async findOneOrCreate(id: number) {
    const client = await this.clientsService.findOne(id)
    if(!client) throw new NotFoundException()

    const form = await this.clientFormsRepository.findOneBy({ client });

    if(form) return form
    return this.clientFormsRepository.save({client})
  }

  async update(id: number, updateClientDto: UpdateClientFormDto) {
    return await this.clientFormsRepository.update(id, updateClientDto)
    
  }

  async remove(id: number) {
    return await this.clientFormsRepository.delete(id);
  }
}
