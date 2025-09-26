import { Module } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { Sequence } from './entities/sequence-ot.entity';
import { SequenceCot } from './entities/sequence-cot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sequence, SequenceCot])],
  providers: [SequenceService],
  exports: [SequenceService]
})
export class SequenceModule {}
