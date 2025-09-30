import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateQuotationUnidadDto {
    @IsString()
    unit_type: string;
    @IsString()
    service_type: string;

    @IsNumber()
    unit_soles: number;
    @IsNumber()
    unit_dollars: number;
    @IsNumber()
    unit_igv_soles: number;
    @IsNumber()
    unit_igv_dollars: number;
    @IsNumber()
    unit_subtotal_soles: number;
    @IsNumber()
    unit_subtotal_dollars: number;
}
