import { Injectable } from '@nestjs/common';
import { CreateWoPersonnelDto } from './dto/create-wo-personnel.dto';
import { UpdateWoPersonnelDto } from './dto/update-wo-personnel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WoPersonnel } from './entities/wo-personnel.entity';
import { Repository } from 'typeorm';
import { SequenceService } from 'src/sequence/sequence.service';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class WoPersonnelService {

  
  constructor(
    @InjectRepository(WoPersonnel) private readonly woPersonnelRepository: Repository<WoPersonnel>,
    private readonly sequenceService: SequenceService,
  ) {}

  async create(createWoPersonnelDto: CreateWoPersonnelDto) {
    const n_order  = await this.sequenceService.generateOrder();

    const woPersonnel = this.woPersonnelRepository.create({
      ...createWoPersonnelDto,
      n_order,
    });
    return this.woPersonnelRepository.save(woPersonnel);
  }

  async findAll() {
    const personnel = await this.woPersonnelRepository.find({where: {n_order: Not(IsNull())}});
    if (!personnel) {
      throw new Error('Personnel not found');
    }
    return personnel;
  }

  findOne(n_order: string) {
    return this.woPersonnelRepository.findOne({where: {n_order}});
  }

  update(n_order: string, updateWoPersonnelDto: UpdateWoPersonnelDto) {
    return this.woPersonnelRepository.update({n_order : n_order}, updateWoPersonnelDto);
  }

  remove(n_order: string) {
    return this.woPersonnelRepository.delete({n_order : n_order});
  }
}
