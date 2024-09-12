
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Post, Get, Body, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { LoginDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("/auth")
export class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }


    @HttpCode(HttpStatus.OK)
    @Post("/login")
    public login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

}