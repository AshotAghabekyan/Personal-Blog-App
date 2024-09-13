import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/modules/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
    imports: [
        UserModule,
        ConfigModule,
        JwtModule.registerAsync({
            "imports": [ConfigModule],
            "inject": [ConfigService],
            useFactory: (configService: ConfigService) => {
                console.log("secret in module ", configService.get("jwt_secret"));
                return {
                    secret: configService.get<string>('jwt_secret')!,
                    global: true,
                    signOptions: {"expiresIn": '7d'},
                    verifyOptions: {'ignoreExpiration': false}
                }
            }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {};