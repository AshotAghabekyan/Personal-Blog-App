
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { Post, Body, HttpCode } from "@nestjs/common/decorators/http";
import {HttpStatus} from "@nestjs/common/enums/http-status.enum"
import { LoginDto } from "./model/auth.dto";
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