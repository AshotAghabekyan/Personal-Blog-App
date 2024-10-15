import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Body, Delete, Get, Param, Post, Req, HttpCode } from "@nestjs/common/decorators/http";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { ParseIntPipe } from "@nestjs/common/pipes/parse-int.pipe"
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { Request } from "express";

import { UserService } from "./user.service";
import { CreateUserDto, ResponseUserDto } from "./model/user.dto";
import { AuthGuard } from "../auth/auth.guard";
import { User } from "./model/user.model";


@Controller('/users')
export class UserController {
    private readonly userService: UserService

    constructor(userServce: UserService) {
        this.userService = userServce;
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/") 
    public async allUsers() {
        const allUsers: User[] = await this.userService.allUsers();
        return allUsers.map((user: User) => new ResponseUserDto(user));
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/:id")
    public async findUserById(@Param('id', ParseIntPipe) id: number) {
        const user: User = await this.userService.findUserById(id);
        return new ResponseUserDto(user);
    } 


    @Post("/") 
    @HttpCode(HttpStatus.CREATED)
    public async createUser(@Body() userDto: CreateUserDto) {
        const createdUser: User = await this.userService.createUser(userDto);
        return new ResponseUserDto(createdUser);
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("/")
    public deleteUser( @Req() req: Request) {
        return this.userService.deleteUser(req['user']);
    }
}