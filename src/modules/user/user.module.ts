import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { CacheModule } from "@nestjs/cache-manager";
import { SequelizeModule } from "@nestjs/sequelize/dist/sequelize.module";
import { JwtModule } from "@nestjs/jwt";

import { UserLifecycleService, UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./model/user.model";
import { RedisConfigService } from "src/modules/globals/redis/redis.config";
import { ConfigService } from "@nestjs/config";
import { UserRepository } from "./user.repository";
import { UserCacheProvider } from "./user.cacheProvider";


@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        JwtModule, 
        CacheModule.registerAsync({
            inject: [ConfigService, RedisConfigService],
            useFactory: async (configService: ConfigService, redisConfigService: RedisConfigService) => {
                const dbIndex = configService.get('users_cache_db');
                return redisConfigService.getRedisConfig(dbIndex);
            }
        }),
    ],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService, UserLifecycleService, UserRepository, UserCacheProvider]
})

export class UserModule {};