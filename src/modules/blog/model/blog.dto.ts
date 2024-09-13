import { IsString } from "class-validator/types/decorator/typechecker/IsString";


export class CreateBlogDto {
    @IsString()
    title: string;

    @IsString()
    mainContent: string;
}