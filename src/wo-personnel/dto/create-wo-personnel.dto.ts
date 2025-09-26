
import { IsBoolean, IsString } from "class-validator";

export class CreateWoPersonnelDto {

    @IsString()
    enterprise : string;

    @IsString()
    ruc : string;

    @IsString()
    inspector : string;  

    @IsString()
    mode : string;

    @IsString()
    course : string;

    @IsString()
    names : string;

    @IsString()
    last_names : string;

    @IsString()
    dni : string;

    @IsString()
    date : string;

    @IsString()
    approved : string;

    @IsString()
    certifier : string;

    @IsString()
    project : string;

    @IsString()
    instructor : string;

    @IsString()
    n_times : string;

    @IsString()
    comments : string;

    @IsBoolean()
    status : boolean;

    @IsString()
    src_certificate : string;
}
