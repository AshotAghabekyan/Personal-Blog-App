import { IsString, IsEmail, IsStrongPassword } from "class-validator";
import { Blog } from "src/modules/blog/model/blog.model";
import { Reaction } from "src/modules/reaction/model/reaction.model";
import { User } from "./user.model";
import { ResponseBlogDto } from "src/modules/blog/model/blog.dto";



export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsStrongPassword({"minLength": 8, "minNumbers": 1, minUppercase: 1, "minLowercase": 1})
    password: string;
}




export class ResponseUserDto {
    id: number;
    username: string;
    email: string;
    blogs?: ResponseBlogDto[];
    reactons?: Reaction[];

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.blogs = user.blogs?.map((blog: Blog) => new ResponseBlogDto(blog));
    } 
}