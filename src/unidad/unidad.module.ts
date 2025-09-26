import { Module } from '@nestjs/common';
import { UnidadService } from './unidad.service';
import { UnidadController } from './unidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unidad } from './entities/unidad.entity';
import { OtEquipo } from 'src/ot-equipo/entities/ot-equipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unidad, OtEquipo])],
  controllers: [UnidadController],
  providers: [UnidadService],
  exports: [UnidadService],
})
export class UnidadModule {}
