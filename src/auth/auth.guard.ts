import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


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
            throw new UnauthorizedException('authentication token required!');
        }

        const [authType, token] = authHeader.split(" ");
        if (authType.toLowerCase() != 'bearer' || !token) {
            throw new UnauthorizedException('invalid credentials!');
        }

        try {
            const secret = this.configService.get<string>('jwt_secret'); 
            const payload = await this.jwtService.verifyAsync(token, {secret});
            request['user'] = payload;
            return true;
        }
        catch(error) {
            console.log('error', error);
            console.log(error);
            throw new UnauthorizedException(error);
        }
    }
}