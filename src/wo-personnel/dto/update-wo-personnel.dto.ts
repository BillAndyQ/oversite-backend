import { PartialType } from '@nestjs/swagger';
import { CreateWoPersonnelDto } from './create-wo-personnel.dto';

export class UpdateWoPersonnelDto extends PartialType(CreateWoPersonnelDto) {}
