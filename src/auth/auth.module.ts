import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";


@Module({
    imports: [
        UserModule,
        ConfigModule,
        JwtModule.register({
            secret: "SECRET KEY",
            global: true,
            signOptions: {"expiresIn": '24h'}
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {};