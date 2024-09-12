import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./auth.dto";
import { User } from "src/user/user.model";
import { NotFoundException } from "@nestjs/common";
import { HashGenerator } from "src/utils/crypto/crypto";
import { JwtService } from "@nestjs/jwt";


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
            throw new NotFoundException('invalid email or password');
        }

        const isValidPassword: boolean = await this.hashGenerator.compareHashedData(dto.password, existUser.password);
        if (!isValidPassword) {
            throw new NotFoundException("invalid email or password");
        }

        const token = await this.jwtService.signAsync({sub: existUser.id, email: dto.email});
        return {"token": token};
    }

}
