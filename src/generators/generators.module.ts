import { Module } from '@nestjs/common';
import { GeneratorsService } from './generators.service';
import { GeneratorsController } from './generators.controller';
import { ClientFormsModule } from 'src/client-forms/client-forms.module';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generator } from './entities/generator.entity';
import { S3Client } from '@aws-sdk/client-s3';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    ClientFormsModule,
    ClientsModule,
    AwsSdkModule.register({
      client: new LambdaClient({
        region: process.env.AWS_REGION
      })
    }),
    AwsSdkModule.register({
      client: new S3Client({
        region: process.env.AWS_REGION
      })
    }),
    TypeOrmModule.forFeature([Generator])
  ],
  controllers: [GeneratorsController],
  providers: [GeneratorsService],
})
export class GeneratorsModule {}
