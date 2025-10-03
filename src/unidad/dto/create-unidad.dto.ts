import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUnidadDto {

    @IsString()
    @IsOptional()
    n_order: string;
    @IsString()
    @IsOptional()
    inspector: string;
    @IsString()
    @IsOptional()
    certifier: string;
    @IsString()
    @IsOptional()
    unit_type: string;
    @IsString()
    @IsOptional()
    service_type: string;
    @IsString()
    @IsOptional()
    plate: string;
    @IsString()
    @IsOptional()
    src_certificate: string;
    @IsString()
    @IsOptional()
    src_final_report: string;
    @IsString()
    @IsOptional()
    src_field_report: string;
    @IsString()
    @IsOptional()
    service_description: string;
    @IsString()
    @IsOptional()
    observations: string;
    @IsString()
    @IsOptional()
    comments: string;
    @IsBoolean()
    @IsOptional()
    status: boolean;

    @IsNumber()
    @IsOptional()
    unit_soles: number;
    @IsNumber()
    @IsOptional()
    unit_dollars: number;
    @IsNumber()
    @IsOptional()
    unit_igv_soles: number;
    @IsNumber()
    @IsOptional()
    unit_igv_dollars: number;
    @IsNumber()
    @IsOptional()
    unit_subtotal_soles: number;
    @IsNumber()
    @IsOptional()
    unit_subtotal_dollars: number;
}
