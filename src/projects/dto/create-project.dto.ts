import { IsOptional, IsString } from "class-validator";


export class CreateProjectDto {
    @IsString()
    @IsOptional()
    project : string
}
