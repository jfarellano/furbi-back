import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, StreamableFile } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/folder/:id')
  folder(@Param('id') id: string) {
    return this.clientsService.getFolder(+id);
  }

  @UseGuards(AuthGuard)
  @Post('/file')
  async file(@Body() body: {name:string}, @Res({ passthrough: true }) res) {
    const file = await this.clientsService.downloadFromFolder(body.name)
    const bitArray = await file.Body.transformToByteArray()

    res.set({
      'Content-Type': file.ContentType,
      'Content-Disposition': `attachment; filename="${body.name.split('/').pop()}"`,
    });

    return new StreamableFile(bitArray)
  }
}
