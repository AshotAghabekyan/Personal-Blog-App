import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";



export class AuthGuard implements CanActivate {
    private readonly jwtService: JwtService;

    constructor(jwtService: JwtService) {
        this.jwtService = jwtService;
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

        const payload = await this.jwtService.verifyAsync(token, {
            'secret':'SECRET KEY'
        });
        request['user'] = {...payload};
        return true;

    }
}