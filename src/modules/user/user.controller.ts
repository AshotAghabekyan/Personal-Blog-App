import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Body, Delete, Get, Param, Post, Req, HttpCode } from "@nestjs/common/decorators/http";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { ParseIntPipe } from "@nestjs/common/pipes/parse-int.pipe"
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { Request } from "express";

import { UserService } from "./user.service";
import { CreateUserDto } from "./model/user.dto";
import { AuthGuard } from "../auth/auth.guard";


@Controller('/users')
export class UserController {
    private readonly userService: UserService

    constructor(userServce: UserService) {
        this.userService = userServce;
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/") 
    public allUsers() {
        return this.userService.allUsers();
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/:id")
    public findUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findUserById(id);
    } 


    @Post("/") 
    @HttpCode(HttpStatus.CREATED)
    public createUser(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("/")
    public deleteUser( @Req() req: Request) {
        return this.userService.deleteUser(req['user']);
    }
}