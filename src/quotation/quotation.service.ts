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
@Injectable()
export class QuotationService {

  constructor(
    @InjectRepository(OtEquipo)
    private readonly otEquipoRepository: Repository<OtEquipo>,
    @InjectRepository(WoPersonnel)
    private readonly woPersonnelRepository: Repository<WoPersonnel>,
    private readonly sequenceService: SequenceService,
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
}
