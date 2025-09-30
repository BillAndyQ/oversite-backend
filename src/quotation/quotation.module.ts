import { Module } from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtEquipo } from 'src/ot-equipo/entities/ot-equipo.entity';
import { WoPersonnel } from 'src/wo-personnel/entities/wo-personnel.entity';
import { SequenceService } from 'src/sequence/sequence.service';
import { Sequence } from 'src/sequence/entities/sequence-ot.entity';
import { SequenceCot } from 'src/sequence/entities/sequence-cot.entity';
import { Unidad } from 'src/unidad/entities/unidad.entity';

@Module({
  controllers: [QuotationController],
  providers: [QuotationService, SequenceService],
  imports: [TypeOrmModule.forFeature([OtEquipo, WoPersonnel, Sequence, SequenceCot, Unidad])]
})
export class QuotationModule {}
