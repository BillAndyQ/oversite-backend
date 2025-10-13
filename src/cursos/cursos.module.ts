import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';

@Module({
  controllers: [CursosController],
  providers: [CursosService],
  imports: [TypeOrmModule.forFeature([Curso])],
})
export class CursosModule {}
