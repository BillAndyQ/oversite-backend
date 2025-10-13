import { IsBoolean, IsOptional, IsString } from "class-validator";


export class CreateOtEquipoDto {

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
}
