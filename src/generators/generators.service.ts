import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda';
import { Injectable } from '@nestjs/common';
import { InjectAws } from 'aws-sdk-v3-nest';
import { ClientFormsService } from 'src/client-forms/client-forms.service';
import { Generator } from './entities/generator.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as exceljs from 'exceljs'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Stream } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class GeneratorsService {

  constructor(
    @InjectRepository(Generator)
    private generatorRepository: Repository<Generator>,
    private readonly clientsFormService: ClientFormsService,
    private readonly clientsService: ClientsService,
    @InjectAws(LambdaClient)
    private readonly lambda: LambdaClient,
    @InjectAws(S3Client)
    private readonly s3: S3Client
  ) {}

  async generateAvm(id: number) {
    const form = await this.clientsFormService.findOneOrCreate(id)
    const client = await this.clientsService.findOne(id)
    const qaa1 = this.clientsFormService.getQaa1(id)
    const qaa2 = this.clientsFormService.getQaa2(id)
    const execution = await this.generatorRepository.findOneBy({clientId: id, type: 'AVC'})
    
    if(execution) {
      throw new Error('This form is already beign generated')
    }

    const newExecution = await this.generatorRepository.save({
      clientId: form.id,
      index: 0,
      state: [],
      type: 'AVC'
    })

    const command = new InvokeCommand({
      FunctionName: process.env.AVC_FUNCTION,
      InvocationType: 'Event',
      Payload: JSON.stringify({
        Grupo: form.otherPublics.map(otherPublic => otherPublic.client)[0],
        Grupos: form.otherPublics.map(otherPublic => otherPublic.client),
        qaa1,
        qaa2,
        clientId: newExecution.clientId,
        clientName: client.name
      }),
      LogType: LogType.Tail
    })

    this.lambda.send(command);
    
    return {
      execurionId: newExecution.id
    };
  }

  async reportAvm(id: number, result: any[]) {
    const execution = await this.generatorRepository.findOneBy({clientId: id})
    const form = await this.clientsFormService.findOneOrCreate(id)
    const client = await this.clientsService.findOne(id)
    const qaa1 = this.clientsFormService.getQaa1(id)
    const qaa2 = this.clientsFormService.getQaa2(id)

    if(form.otherPublics.map(otherPublic => otherPublic.client)[execution.index + 1]) {
      const command = new InvokeCommand({
        FunctionName: process.env.AVC_FUNCTION,
        InvocationType: 'Event',
        Payload: JSON.stringify({
          Grupo: form.otherPublics.map(otherPublic => otherPublic.client)[execution.index + 1],
          Grupos: form.otherPublics.map(otherPublic => otherPublic.client),
          qaa1,
          qaa2,
          clientId: execution.clientId,
          clientName: client.name
        }),
        LogType: LogType.Tail
      })
      this.lambda.send(command)
      this.generatorRepository.update(execution.id, {
        ...execution,
        index: execution.index + 1,
        state: [...execution.state, ...result]
      })
    } else {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("AVC");
      worksheet.columns = [
        { header: "Grupo", key: "Grupo", width: 10 }, 
        { header: "Público identificado", key: "Público identificado", width: 10 },
        { header: "Justificación", key: "Justificación", width: 10 },
        { header: "Características", key: "Características", width: 10 },
        { header: "Oferta", key: "Oferta", width: 10 },
        { header: "Promesa", key: "Promesa", width: 10 },
        { header: "Objetivos", key: "Objetivos", width: 10 },
        { header: "KPIs", key: "KPIs", width: 10 },
      ];

      [...execution.state, ...result].forEach((record) => {
        worksheet.addRow(record); // Add data in worksheet
      });

      const stream = new Stream.PassThrough();

      await workbook.xlsx.write(stream)


      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: process.env.AWS_BUCKET,
          Key: `${execution.clientId}/AVC.xlsx`,
          Body: stream,
        },
      });
      
      await upload.done()

      await this.generatorRepository.delete(execution.id)
    }

    return {
      ok: true
    };
    
  }
}
