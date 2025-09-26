import { PartialType } from '@nestjs/swagger';
import { CreateUnidadDto } from './create-unidad.dto';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateUnidadDto extends PartialType(CreateUnidadDto) {

    @IsString()
    inspector: string;
    @IsString()
    certifier: string;
    @IsString()
    unit_type: string;
    @IsString()
    service_type: string;
    @IsString()
    plate: string;
    @IsString()
    src_certificate: string;
    @IsString()
    src_final_report: string;
    @IsString()
    src_field_report: string;
    @IsString()
    service_description: string;
    @IsString()
    observations: string;
    @IsString()
    comments: string;
    @IsBoolean()
    status: boolean;
}
