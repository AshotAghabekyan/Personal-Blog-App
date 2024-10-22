import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { NotFoundException } from "@nestjs/common/exceptions/not-found.exception";

import { JwtService } from "@nestjs/jwt/dist/jwt.service";
import { UserService } from "src/modules/user/user.service";

import { LoginDto } from "./model/auth.dto";
import { User } from "src/modules/user/model/user.model";

import { HashGenerator } from "src/utils/crypto/crypto";
import errorResponse from "src/config/errorResponse";



@Injectable()
export class AuthService {
    private readonly userService: UserService;
    private readonly hashGenerator: HashGenerator = new HashGenerator();
    private readonly jwtService: JwtService;

    constructor(userService: UserService, jwtService: JwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }


    public async login(dto: LoginDto): Promise<{token: string}> {
        const existUser: User = await this.userService.findUserByEmail(dto.email);
        
        if (!existUser) {
            throw new NotFoundException(errorResponse.auth.invalid_login);
        }

        const isValidPassword: boolean = await this.hashGenerator.compareHashedData(dto.password, existUser.password);
        if (!isValidPassword) {
            throw new NotFoundException(errorResponse.auth.invalid_login);
        }

        const token = await this.jwtService.signAsync({sub: existUser.id, email: dto.email});
        return {"token": token};
    }

}
