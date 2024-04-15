import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { InjectAws } from 'aws-sdk-v3-nest';
import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectAws(S3Client)
    private readonly s3: S3Client
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

  async getFolder(id: number) {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET,
      Prefix: `${id}/`
    })
    let isTruncated = true;

    let contents = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await this.s3.send(command);
      if(!Contents) return []
      contents = [...contents, ...Contents.map(content => ({...content, Key: content.Key.replace(`${id}/`, '')}))];
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }

    return contents
  }

  async downloadFromFolder(fileName: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
    });

    const file = await this.s3.send(command)
    

    return file
  }
}
