import { Module } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { Sequence } from './entities/sequence-ot.entity';
import { SequenceCot } from './entities/sequence-cot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtEquipo } from 'src/ot-equipo/entities/ot-equipo.entity';
import { Unidad } from 'src/unidad/entities/unidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sequence, SequenceCot, OtEquipo, Unidad])],
  providers: [SequenceService],
  exports: [SequenceService]
})
export class SequenceModule {}
