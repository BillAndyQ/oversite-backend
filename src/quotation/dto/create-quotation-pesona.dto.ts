
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateQuotationPersonaDto {

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
    src_certificate : string;

    @IsString()
    @IsOptional()
    type_currency : string;

    @IsNumber()
    @IsOptional()
    exchange_rate : number;
}
