import { Test, TestingModule } from '@nestjs/testing';
import { OtEquipoService } from './ot-equipo.service';

describe('OtEquipoService', () => {
  let service: OtEquipoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtEquipoService],
    }).compile();

    service = module.get<OtEquipoService>(OtEquipoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
