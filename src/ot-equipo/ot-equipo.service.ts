import { Injectable } from '@nestjs/common';
import { CreateOtEquipoDto } from './dto/create-ot-equipo.dto';
import { UpdateOtEquipoDto } from './dto/update-ot-equipo.dto';
import { OtEquipo } from './entities/ot-equipo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SequenceService } from 'src/sequence/sequence.service';
import { Not, IsNull } from 'typeorm';
import { Unidad } from 'src/unidad/entities/unidad.entity';
import { CreateUnidadDto } from 'src/unidad/dto/create-unidad.dto';
import { UpdateUnidadDto } from 'src/unidad/dto/update-unidad.dto';

@Injectable()
export class OtEquipoService {

  constructor(
    @InjectRepository(OtEquipo) private readonly otEquipoRepository: Repository<OtEquipo>,
    @InjectRepository(Unidad) private readonly unidadRepository: Repository<Unidad>,
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

  async findAllUnidad(n_order: string) {
    const ot_equipo = await this.otEquipoRepository.find({where: {n_order}});

    if (!ot_equipo) {
      throw new Error('No se encontro el OT Equipo');
    }

    const unidades = this.unidadRepository.find({where: {ot_equipo}});

    return unidades;
  }

  async createUnidad(n_order: string, createUnidadDto: CreateUnidadDto) {
    const ot_equipo = await this.otEquipoRepository.findOne({where: {n_order}});

    if (!ot_equipo) {
      throw new Error('No se encontro el OT Equipo');
    }

    const unidad = this.unidadRepository.create({
      ...createUnidadDto,
      ot_equipo,
    });
    return this.unidadRepository.save(unidad);
  }

  async removeUnidad(n_order: string, id: number) {

    const ot_equipo = await this.otEquipoRepository.findOne({where: {n_order}});

    if (!ot_equipo) {
      throw new Error('No se encontro el OT Equipo');
    }

    const unidad = this.unidadRepository.findOne({where: {id : id, ot_equipo : ot_equipo}});

    if (!unidad) {
      throw new Error('No se encontro la Unidad');
    }

    return this.unidadRepository.delete({id : id, ot_equipo : ot_equipo});
  }

  async updateUnidad(n_order: string, id: number, updateUnidadDto: UpdateUnidadDto) {
    const ot_equipo = await this.otEquipoRepository.findOne({where: {n_order}});

    if (!ot_equipo) {
      throw new Error('No se encontro el OT Equipo');
    }

    const unidad = this.unidadRepository.findOne({where: {id : id, ot_equipo : ot_equipo}});

    if (!unidad) {
      throw new Error('No se encontro la Unidad');
    }

    return this.unidadRepository.update({id : id, ot_equipo : ot_equipo}, updateUnidadDto);
  }

}
