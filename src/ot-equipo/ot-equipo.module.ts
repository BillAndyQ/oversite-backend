import { Module } from '@nestjs/common';
import { OtEquipoService } from './ot-equipo.service';
import { OtEquipoController } from './ot-equipo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtEquipo } from './entities/ot-equipo.entity';
import { Photos } from './entities/photos.entity';
import { SequenceModule } from 'src/sequence/sequence.module';

@Module({
  controllers: [OtEquipoController],
  providers: [OtEquipoService],
  imports: [TypeOrmModule.forFeature([OtEquipo, Photos]), SequenceModule],
})
export class OtEquipoModule {}
