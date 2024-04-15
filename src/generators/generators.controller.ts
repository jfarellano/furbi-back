import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GeneratorsService } from './generators.service';

@Controller('generators')
export class GeneratorsController {
  constructor(private readonly generatorsService: GeneratorsService) {}

  @Get('/avm/:id')
  generate(@Param('id') id: string) {
    return this.generatorsService.generateAvm(+id);
  }

  @Post('/avm/reporter/:id')
  report(@Param('id') id: string, @Body() body) {
    return this.generatorsService.reportAvm(+id, body);
  }
}
