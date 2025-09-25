import { Test, TestingModule } from '@nestjs/testing';
import { WoPersonnelController } from './wo-personnel.controller';
import { WoPersonnelService } from './wo-personnel.service';

describe('WoPersonnelController', () => {
  let controller: WoPersonnelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WoPersonnelController],
      providers: [WoPersonnelService],
    }).compile();

    controller = module.get<WoPersonnelController>(WoPersonnelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
