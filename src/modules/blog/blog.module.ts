import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";

import { BlogController, BlogGenreController } from "./blog.controller";
import { BlogGenreService, BlogLifecycleService, BlogService } from "./blog.service";
import { BlogRepository } from "./blog.repository";
import { Blog } from "./model/blog.model";
import { BlogCacheProvider } from "./blog.cacheProvider";
import { CacheModule } from "@nestjs/cache-manager/dist/cache.module";
import { GenreModule } from "../blog_genre/genre.module";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { RedisConfigService } from "../globals/redis/redis.config";
import { GenreRepository } from "../blog_genre/genre.repository";
import { BlogGenre } from "../blog_genre/models/blogGenre.model";


@Module({
    "imports": [
        GenreModule,
        SequelizeModule.forFeature([Blog, BlogGenre]),
        JwtModule,
        CacheModule.registerAsync({
            inject: [ConfigService, RedisConfigService],
            useFactory: async (configService: ConfigService, redisConfigService: RedisConfigService) => {
                const dbIndex = configService.get('users_cache_db');
                return redisConfigService.getRedisConfig(dbIndex);
            }
        }),
    ],
    "controllers": [BlogController, BlogGenreController],
    "providers": [
        BlogService,
        BlogLifecycleService,
        BlogGenreService,
        BlogRepository,
        GenreRepository,
        BlogCacheProvider,
    ],
})
export class BlogModule {}