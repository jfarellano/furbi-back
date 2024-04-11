import { Test, TestingModule } from '@nestjs/testing';
import { ClientFormsController } from './client-forms.controller';
import { ClientFormsService } from './client-forms.service';

describe('ClientFormsController', () => {
  let controller: ClientFormsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientFormsController],
      providers: [ClientFormsService],
    }).compile();

    controller = module.get<ClientFormsController>(ClientFormsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
