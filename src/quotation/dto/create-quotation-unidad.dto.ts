import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateQuotationUnidadDto {
    @IsString()
    @IsOptional()
    unit_type: string;
    @IsString()
    @IsOptional()
    service_type: string;

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
