import { IsEmail, IsString } from "class-validator";

export class CreateAuthDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsEmail()
    email: string;
    
    @IsString()
    role: string;
}
