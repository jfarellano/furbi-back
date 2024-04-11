import { Test, TestingModule } from '@nestjs/testing';
import { ClientFormsService } from './client-forms.service';

describe('ClientFormsService', () => {
  let service: ClientFormsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientFormsService],
    }).compile();

    service = module.get<ClientFormsService>(ClientFormsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
