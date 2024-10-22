import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { CanActivate } from "@nestjs/common/interfaces/features/can-activate.interface";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";
import { JwtService } from "@nestjs/jwt/dist/jwt.service";
import { Request } from "express";
import errorResponse from "src/config/errorResponse";



@Injectable()
export class AuthGuard implements CanActivate {
    private readonly jwtService: JwtService;
    private readonly configService: ConfigService;

    constructor(jwtService: JwtService, configService: ConfigService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }


    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request: Request = ctx.getRequest()
        return await this.validateRequest(request);
    }


    private async validateRequest(request: Request): Promise<boolean> {
        const authHeader: string = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException(errorResponse.auth.missed_token);
        }

        const [authType, token] = authHeader.split(" ");
        if (authType.toLowerCase() != 'bearer' || !token) {
            throw new UnauthorizedException(errorResponse.auth.invalid_credentials);
        }

        try {
            const secret = this.configService.get<string>('jwt_secret'); 
            const payload = await this.jwtService.verifyAsync(token, {secret});
            request['user'] = payload;
            return true;
        }
        catch(error) {
            console.log(error);
            throw new UnauthorizedException(error);
        }
    }
}