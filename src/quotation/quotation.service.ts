import { Injectable } from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { OtEquipo } from 'src/ot-equipo/entities/ot-equipo.entity';
import { WoPersonnel } from 'src/wo-personnel/entities/wo-personnel.entity';
import { SequenceService } from 'src/sequence/sequence.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from 'src/enums/quotation';
import { Not, IsNull } from 'typeorm';
import { Unidad } from 'src/unidad/entities/unidad.entity';
import { CreateQuotationUnidadDto } from './dto/create-quotation-unidad.dto';
@Injectable()
export class QuotationService {

  constructor(
    @InjectRepository(OtEquipo)
    private readonly otEquipoRepository: Repository<OtEquipo>,
    @InjectRepository(WoPersonnel)
    private readonly woPersonnelRepository: Repository<WoPersonnel>,
    private readonly sequenceService: SequenceService,
    @InjectRepository(Unidad)
    private readonly unidadRepository: Repository<Unidad>,
  ) {}

  async createQuotationEquipo(createQuotationDto: CreateQuotationDto) {
    
    const quotation = this.otEquipoRepository.create(createQuotationDto);
    const n_quotation = await this.sequenceService.generateNQuotation();
    quotation.n_quotation = n_quotation;
    quotation.status = Status.COTIZACION;
    return await this.otEquipoRepository.save(quotation);
  }

  async createQuotationPersona(createQuotationDto: CreateQuotationDto) {
    
    return 'This action adds a new quotation';
  }

  async findAllEquipo() {
    const quotations = await this.otEquipoRepository.find({where: {n_quotation: Not(IsNull())}});
    if (!quotations) {
      throw new Error('Quotations not found');
    }
    return quotations;
  }

  async findAllPersona() {
    const quotations = await this.woPersonnelRepository.find();
    if (!quotations) {
      throw new Error('Quotations not found');
    }
    return quotations;
  }

  async findOneEquipo(n_quotation: string) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return quotation;
  }

  async updateEquipo(n_quotation: string, updateQuotationDto: UpdateQuotationDto) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return this.otEquipoRepository.update({n_quotation : n_quotation}, updateQuotationDto);
  }

  async removeEquipo(n_quotation: string) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return this.otEquipoRepository.delete({n_quotation : n_quotation});
  }

  async findUnits(n_quotation: string) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation}, relations: ['unidades']});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return quotation.unidades;
  }

  async createUnits(n_quotation: string, unidad: CreateQuotationUnidadDto) {
    // Buscar la cotización por código
    const quotation = await this.otEquipoRepository.findOne({
      where: { n_quotation },
    });

    console.log(quotation);
    if (!quotation) {
      console.log('Quotation not found');
      throw new Error('Quotation not found');
    }

    // Crear la unidad con la relación a la cotización
    const unit = this.unidadRepository.create({
      ...unidad,
      ot_equipo : quotation,
    });
    const savedUnit = await this.unidadRepository.save(unit);
    const {ot_equipo, ...rest} = savedUnit;
    return rest;
  }

  async removeUnits(n_quotation: string, id: number) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation, unidades: {id: id}} , relations: ['unidades']});
    if (!quotation) {
      throw new Error('Quotation not found');
    }
    return this.unidadRepository.delete({id : id});
  }

  async updateUnit(n_quotation: string, id: number, unidad: CreateQuotationUnidadDto) {
    const quotation = await this.otEquipoRepository.findOne({where: {n_quotation, unidades: {id: id}} , relations: ['unidades']});
    if (!quotation) {
      throw new Error('Quotation not found');
    }

    const unidVerif = await this.unidadRepository.findOne({where: {id: id}});
    if (!unidVerif) {
      throw new Error('Unit not found');
    }
   
    return this.unidadRepository.update({id : id}, unidad);
  }
  
}
