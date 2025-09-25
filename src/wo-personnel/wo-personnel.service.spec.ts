import { Test, TestingModule } from '@nestjs/testing';
import { WoPersonnelService } from './wo-personnel.service';

describe('WoPersonnelService', () => {
  let service: WoPersonnelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WoPersonnelService],
    }).compile();

    service = module.get<WoPersonnelService>(WoPersonnelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
