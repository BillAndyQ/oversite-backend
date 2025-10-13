import { Module } from '@nestjs/common';
import { WoPersonnelService } from './wo-personnel.service';
import { WoPersonnelController } from './wo-personnel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WoPersonnel } from './entities/wo-personnel.entity';
import { SequenceModule } from 'src/sequence/sequence.module';
import { MinioService } from 'src/minio/minio.service';
import { PhotosPersona } from './entities/photos-persona.entity';

@Module({
  controllers: [WoPersonnelController],
  providers: [WoPersonnelService, MinioService],
  imports: [TypeOrmModule.forFeature([WoPersonnel, PhotosPersona]), SequenceModule],
})
export class WoPersonnelModule {}
