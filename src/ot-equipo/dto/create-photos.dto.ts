import { IsString } from "class-validator";


export class CreatePhotos{
    @IsString()
    src : string
}