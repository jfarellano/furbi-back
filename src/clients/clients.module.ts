import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    AwsSdkModule.register({
      client: new S3Client({
        region: process.env.AWS_REGION
      })
    }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService]
})
export class ClientsModule {}
