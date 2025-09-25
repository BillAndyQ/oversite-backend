import { Injectable } from '@nestjs/common';
import { Sequence } from './entities/sequence.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Sequence)
    private readonly sequenceRepository: Repository<Sequence>,
    private readonly dataSource: DataSource,
  ) {}

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
}
