import { Injectable } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { Enterprise } from './entities/enterprise.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(Enterprise) private readonly enterpriseRepository: Repository<Enterprise>
  ) {}
  
  create(createEnterpriseDto: CreateEnterpriseDto) {
    const enterprise = this.enterpriseRepository.create(createEnterpriseDto);
    return this.enterpriseRepository.save(enterprise);
  }

  findAll() {
    return this.enterpriseRepository
    .createQueryBuilder('empresa')
    .select([
      'ruc as ruc',
      'razon_social AS enterprise',
      'email as email',
      'telefono as telefono',
      'direccion as direccion',
    ])
    .getRawMany();
  }

  findOne(ruc: string) {
    return this.enterpriseRepository.findOne({where: {ruc}});
  }

  update(ruc: string, updateEnterpriseDto: UpdateEnterpriseDto) {
    return this.enterpriseRepository.update({ruc : ruc}, updateEnterpriseDto);
  }

  remove(ruc: string) {
    return this.enterpriseRepository.delete({ruc : ruc});
  }
}
