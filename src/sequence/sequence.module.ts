import { Module } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { Sequence } from './entities/sequence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sequence])],
  providers: [SequenceService],
  exports: [SequenceService]
})
export class SequenceModule {}
