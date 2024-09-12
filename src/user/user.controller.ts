import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { UserService } from "./user.service";
import { Body, Delete, Get, Param, Post, Req } from "@nestjs/common/decorators/http";
import { CreateUserDto } from "./user.dto";
import { Request } from "express";
import { ParseIntPipe, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";


@Controller('/users')
export class UserController {
    private readonly userService: UserService

    constructor(userServce: UserService) {
        this.userService = userServce;
    }


    @UseGuards(AuthGuard)
    @Get("/") 
    public allUsers() {
        return this.userService.allUsers();
    }

    @UseGuards(AuthGuard)
    @Get("/:id")
    public findUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findUserById(id);
    } 


    @Post("/") 
    public createUser(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }


    @UseGuards(AuthGuard)
    @Delete("/")
    public deleteUser( @Req() req: Request) {
        return this.userService.deleteUser(req['user']);
    }
}