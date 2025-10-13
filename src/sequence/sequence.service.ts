import { Injectable } from '@nestjs/common';
import { Sequence } from './entities/sequence-ot.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SequenceCot } from './entities/sequence-cot.entity';
import { OtEquipo } from 'src/ot-equipo/entities/ot-equipo.entity';
import { Unidad } from 'src/unidad/entities/unidad.entity';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Sequence)
    private readonly sequenceRepository: Repository<Sequence>,
    private readonly dataSource: DataSource,
    @InjectRepository(OtEquipo) private readonly otEquipoRepository: Repository<OtEquipo>,
    @InjectRepository(Unidad) private readonly unidadRepository: Repository<Unidad>,
  ) {}

  async generateNQuotation(){
    const now = new Date();
    const mes = now.getMonth() + 1;
    const anio = now.getFullYear();

    return await this.dataSource.transaction(async (manager) => {
      // 1. Buscar secuencia existente
      let sequence = await manager.findOne(SequenceCot, {
        where: { mes, anio },
        lock: { mode: 'pessimistic_write' },
      });

      // 2. Crear si no existe
      if (!sequence) {
        sequence = manager.create(SequenceCot, { mes, anio, lastNumber: 0 });
        await manager.save(sequence);
      }

      // 3. Incrementar correlativo
      sequence.lastNumber += 1;
      await manager.save(sequence);

      const correlativo = String(sequence.lastNumber).padStart(6, '0');
      const n_quotation = `COT-${String(mes).padStart(2, '0')}-${anio}-${correlativo}`;

      return n_quotation;
    });
  }

  async generateOrder(){
    const now = new Date();
    const mes = now.getMonth() + 1;
    const anio = now.getFullYear();
    

    return await this.dataSource.transaction(async (manager) => {
      // 1. Buscar secuencia existente
      let sequence = await manager.findOne(Sequence, {
        where: { mes, anio },
        lock: { mode: 'pessimistic_write' },
      });

      // 2. Crear si no existe
      if (!sequence) {
        sequence = manager.create(Sequence, { mes, anio, lastNumber: 0 });
        await manager.save(sequence);
      }

      // 3. Incrementar correlativo
      sequence.lastNumber += 1;
      await manager.save(sequence);

      const correlativo = String(sequence.lastNumber).padStart(6, '0');
      const n_order = `OM-${String(mes).padStart(2, '0')}-${anio}-${correlativo}`;

      return n_order;
    });
  }
  async generateCode(n_order: string): Promise<string> {
    // Buscar OT Equipo
    const equipo = await this.otEquipoRepository.findOne({ where: { n_order } });
    if (!equipo) {
      throw new Error('No se puede generar el código porque no se encontró el OT Equipo');
    }
  
    // Obtener todas las unidades de este OT
    const unidades = await this.unidadRepository.find({
      where: { ot_equipo: equipo },
    });
  
    // Filtrar unidades con código que empiece con el n_order
    const unidadesConCodigo = unidades
      .filter(u => u.code && u.code.startsWith(n_order))
      .map(u => u.code!);
  
    let nextNumber = 1;
  
    if (unidadesConCodigo.length > 0) {
      // Extraer las secuencias de 2 dígitos y obtener el máximo
      const secuencias = unidadesConCodigo.map(codigo => {
        const match = codigo.match(/-(\d{2})$/);
        return match ? parseInt(match[1], 10) : 0;
      });
  
      const maxSecuencia = Math.max(...secuencias);
      nextNumber = maxSecuencia + 1;
    }
  
    const sequence = String(nextNumber).padStart(2, '0'); // siempre 2 dígitos
    const newCode = `${n_order}-${sequence}`;
    return newCode;
  }
  
  
  
}
