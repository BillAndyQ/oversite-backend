import { Module } from '@nestjs/common';
import { WoPersonnelService } from './wo-personnel.service';
import { WoPersonnelController } from './wo-personnel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WoPersonnel } from './entities/wo-personnel.entity';
import { SequenceModule } from 'src/sequence/sequence.module';

@Module({
  controllers: [WoPersonnelController],
  providers: [WoPersonnelService],
  imports: [TypeOrmModule.forFeature([WoPersonnel]), SequenceModule],
})
export class WoPersonnelModule {}
