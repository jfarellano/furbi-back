import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientFormsService } from './client-forms.service';
import { CreateClientFormDto } from './dto/create-client-form.dto';
import { UpdateClientFormDto } from './dto/update-client-form.dto';

@Controller('client-forms')
export class ClientFormsController {
  constructor(private readonly clientFormsService: ClientFormsService) {}

  @Get(":id")
  getByClientOrCreate(@Param('id') id:number) {
    return this.clientFormsService.findOneOrCreate(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientFormDto: UpdateClientFormDto) {
    return this.clientFormsService.update(+id, updateClientFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientFormsService.remove(+id);
  }
}
