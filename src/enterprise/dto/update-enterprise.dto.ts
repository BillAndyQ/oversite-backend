import { PartialType } from '@nestjs/swagger';
import { CreateEnterpriseDto } from './create-enterprise.dto';
import { IsEmail, IsString } from 'class-validator';

export class UpdateEnterpriseDto extends PartialType(CreateEnterpriseDto) {
    @IsString()
    razon_social: string;
    @IsString()
    ruc: string;
    @IsString()
    direccion: string;
    @IsString()
    telefono: string;
    @IsEmail()
    email: string;
}
