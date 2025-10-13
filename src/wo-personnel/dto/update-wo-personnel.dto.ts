import { PartialType } from '@nestjs/swagger';
import { CreateWoPersonnelDto } from './create-wo-personnel.dto';
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateWoPersonnelDto extends PartialType(CreateWoPersonnelDto) {

    @IsString()
    @IsOptional()
    enterprise : string;

    @IsString()
    @IsOptional()
    ruc : string;

    @IsString()
    @IsOptional()
    inspector : string;  

    @IsString()
    @IsOptional()
    mode : string;

    @IsString()
    @IsOptional()
    course : string;

    @IsString()
    @IsOptional()
    names : string;

    @IsString()
    @IsOptional()
    last_names : string;

    @IsString()
    @IsOptional()
    dni : string;

    @IsString()
    @IsOptional()
    date : string;

    @IsString()
    @IsOptional()
    approved : string;

    @IsString()
    @IsOptional()
    certifier : string;

    @IsString()
    @IsOptional()
    project : string;

    @IsString()
    @IsOptional()
    instructor : string;

    @IsString()
    @IsOptional()
    n_times : string;

    @IsString()
    @IsOptional()
    comments : string;

    @IsString()
    @IsOptional()
    status : string;

    @IsString()
    @IsOptional()
    src_certificate : string;

    @IsString()
    @IsOptional()
    src_field_report : string;
}
