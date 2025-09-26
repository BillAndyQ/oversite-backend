import { Injectable } from '@nestjs/common';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Unidad } from './entities/unidad.entity';
import { Repository } from 'typeorm';
import { OtEquipo } from 'src/ot-equipo/entities/ot-equipo.entity';

@Injectable()
export class UnidadService {
  constructor(
    @InjectRepository(Unidad)
    private unidadRepository: Repository<Unidad>,
    @InjectRepository(OtEquipo)
    private otEquipoRepository: Repository<OtEquipo>,
  ) {}

  async create(createUnidadDto: CreateUnidadDto) {
    const { n_order } = createUnidadDto;

    const ot_equipo = await this.otEquipoRepository.findOne({ where: { n_order } });

    if (!ot_equipo) {
      throw new Error('OT Equipo no encontrada');
    }

    const code = await this.generateCode(n_order);

    const unidad = this.unidadRepository.create({
      ...createUnidadDto,
      ot_equipo: ot_equipo,
      code,
    });
    
    const new_unidad = await this.unidadRepository.save(unidad);
    return new_unidad;
  }

  findAll(n_order: string) {

    if(!n_order){
      return this.unidadRepository.find();
    }
    
    return this.unidadRepository.find({ where: { ot_equipo: { n_order } } });
  }

  async generateCode(n_order: string) {
    // Obtener todas las unidades de esta OT ordenadas por fecha descendente
    const unidades = await this.unidadRepository.find({
      where: { ot_equipo: { n_order } },
      order: { createdAt: "DESC" },
    });
  
    if (!unidades || unidades.length === 0) {
      return `${n_order}-1`;
    }
  
    // Obtener el número del último código
    const lastCode = unidades[0].code; // ejemplo: "OT-2025-00010-3"
    const parts = lastCode.split("-");
    const lastNumber = parseInt(parts[parts.length - 1], 10);
  
    const nextNumber = lastNumber + 1;
  
    return `${n_order}-${nextNumber}`;
  }
  

  findOne(code: string) {
    return this.unidadRepository.findOne({ where: { code } });
  }

  update(code: string, updateUnidadDto: UpdateUnidadDto) {
    return this.unidadRepository.update({code : code}, updateUnidadDto);
  }

  remove(code: string) {
    return this.unidadRepository.delete({code : code});
  }
}
