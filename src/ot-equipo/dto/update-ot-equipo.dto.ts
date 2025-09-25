import { PartialType } from '@nestjs/swagger';
import { CreateOtEquipoDto } from './create-ot-equipo.dto';

export class UpdateOtEquipoDto extends PartialType(CreateOtEquipoDto) {}
