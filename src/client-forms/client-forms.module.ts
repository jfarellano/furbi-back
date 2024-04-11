import { Module } from '@nestjs/common';
import { ClientFormsService } from './client-forms.service';
import { ClientFormsController } from './client-forms.controller';
import { ClientForm } from './entities/client-form.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientForm]), ClientsModule],
  controllers: [ClientFormsController],
  providers: [ClientFormsService],
})
export class ClientFormsModule {}
