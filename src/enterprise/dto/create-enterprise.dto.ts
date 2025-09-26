import { IsEmail, IsString } from "class-validator";

export class CreateEnterpriseDto {
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
