import { IsDecimal, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateQuotationDto {
    @IsString()
    @IsOptional()
    enterprise : string;

    @IsString()
    @IsOptional()
    ruc : string;

    @IsString()
    @IsOptional()
    date_service: string;
    
    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    inspector : string ;
    
    @IsString()
    @IsOptional()
    certifier : string;

    @IsString()
    @IsOptional()
    unit_type : string
    
    @IsString()
    @IsOptional()
    service_type : string;
    
    @IsString()
    @IsOptional()
    plate : string;

    @IsString()
    @IsOptional()
    src_certificate : string

    @IsString()
    @IsOptional()
    src_final_report : string

    @IsString()
    @IsOptional()
    src_field_report : string

    @IsString()
    @IsOptional()
    service_description : string;
    
    @IsString()
    @IsOptional()
    observations : string

    @IsString()
    @IsOptional()
    comments : string

    @IsString()
    @IsOptional()
    status : string

    @IsNumber()
    @IsOptional()
    subtotal_soles : number

    @IsNumber()
    @IsOptional()
    subtotal_dollars : number

    @IsNumber()
    @IsOptional()
    total_soles : number

    @IsNumber()
    @IsOptional()
    total_dollars : number

    @IsNumber()
    @IsOptional()
    total_igv_soles : number

    @IsNumber()
    @IsOptional()
    total_igv_dollars : number

    @IsString()
    @IsOptional()
    type_currency : string

    @IsNumber(
        { maxDecimalPlaces: 4 }, 
        { message: 'exchange_rate must be a valid number' }
      )
      @IsOptional()
      exchange_rate: number;
}
