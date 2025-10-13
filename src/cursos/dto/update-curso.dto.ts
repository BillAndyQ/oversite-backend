import { PartialType } from '@nestjs/swagger';
import { CreateCursoDto } from './create-curso.dto';
import { IsString } from 'class-validator';

export class UpdateCursoDto extends PartialType(CreateCursoDto) {

    @IsString()
    course: string;
}
