import { Injectable } from '@nestjs/common';
import { CreateOtEquipoDto } from './dto/create-ot-equipo.dto';
import { UpdateOtEquipoDto } from './dto/update-ot-equipo.dto';
import { OtEquipo } from './entities/ot-equipo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SequenceService } from 'src/sequence/sequence.service';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class OtEquipoService {

  constructor(
    @InjectRepository(OtEquipo) private readonly otEquipoRepository: Repository<OtEquipo>,
    private readonly sequenceService: SequenceService,
  ) {}  

  async create(createOtEquipoDto: CreateOtEquipoDto) {
    const n_order  = await this.sequenceService.generateOrder();

    const otEquipo = this.otEquipoRepository.create({
      ...createOtEquipoDto,
      n_order,
    });
    return this.otEquipoRepository.save(otEquipo);
  }

  findAll() {
    return this.otEquipoRepository.find({where: {n_order: Not(IsNull())}});
  }

  findOne(n_order: string) {
    return this.otEquipoRepository.findOne({where: {n_order}});
  }

  update(n_order: string, updateOtEquipoDto: UpdateOtEquipoDto) {
    return this.otEquipoRepository.update( {n_order : n_order}, updateOtEquipoDto);
  }

  remove(n_order: string) {
    return this.otEquipoRepository.delete({n_order : n_order});
  }

}
