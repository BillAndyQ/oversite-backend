import { Test, TestingModule } from '@nestjs/testing';
import { OtEquipoController } from './ot-equipo.controller';
import { OtEquipoService } from './ot-equipo.service';

describe('OtEquipoController', () => {
  let controller: OtEquipoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtEquipoController],
      providers: [OtEquipoService],
    }).compile();

    controller = module.get<OtEquipoController>(OtEquipoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
