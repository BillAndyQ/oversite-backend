import { PartialType } from '@nestjs/swagger';
import { CreateQuotationDto } from './create-quotation.dto';
import { IsString } from 'class-validator';

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {

    @IsString()
    enterprise : string;

    @IsString()
    ruc : string;

    @IsString()
    date_service: string;
    
    @IsString()
    address: string;

    @IsString()
    inspector : string ;
    
    @IsString()
    certifier : string;

    @IsString()
    unit_type : string
    
    @IsString()
    service_type : string;
    
    @IsString()
    plate : string;

    @IsString()
    src_certificate : string

    @IsString()
    src_final_report : string

    @IsString()
    src_field_report : string

    @IsString()
    service_description : string;
    
    @IsString()
    observations : string

    @IsString()
    comments : string

    @IsString()
    status : string

}
