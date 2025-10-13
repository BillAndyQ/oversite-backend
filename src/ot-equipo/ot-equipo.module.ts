import { Module } from '@nestjs/common';
import { OtEquipoService } from './ot-equipo.service';
import { OtEquipoController } from './ot-equipo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtEquipo } from './entities/ot-equipo.entity';
import { Photos } from './entities/photos.entity';
import { SequenceModule } from 'src/sequence/sequence.module';
import { Unidad } from 'src/unidad/entities/unidad.entity';
import { MinioService } from 'src/minio/minio.service';

@Module({
  controllers: [OtEquipoController],
  providers: [OtEquipoService, MinioService],
  imports: [TypeOrmModule.forFeature([OtEquipo, Photos, Unidad]), SequenceModule],
})
export class OtEquipoModule {}
