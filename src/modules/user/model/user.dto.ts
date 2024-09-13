import { IsString, IsEmail, IsStrongPassword } from "class-validator";



export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsStrongPassword({"minLength": 8, "minNumbers": 1, minUppercase: 1, "minLowercase": 1})
    password: string;
}

