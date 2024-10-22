import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";

import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { BlogRepository } from "./blog.repository";
import { Blog } from "./model/blog.model";
import { BlogCacheProvider } from "./blog.cacheProvider";
import { CacheModule } from "@nestjs/cache-manager/dist/cache.module";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { RedisConfigService } from "../globals/redis/redis.config";


@Module({
    "imports": [
        SequelizeModule.forFeature([Blog]),
        JwtModule,
        CacheModule.registerAsync({
            inject: [ConfigService, RedisConfigService],
            useFactory: async (configService: ConfigService, redisConfigService: RedisConfigService) => {
                const dbIndex = configService.get('users_cache_db');
                return redisConfigService.getRedisConfig(dbIndex);
            }
        }),
    ],
    "controllers": [BlogController],
    "providers": [BlogService, BlogRepository, BlogCacheProvider],
})
export class BlogModule {}