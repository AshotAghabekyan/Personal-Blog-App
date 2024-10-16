import { Global, Module } from "@nestjs/common";
import { RedisConfigService } from "./redis.config";
import { RedisCacheProvider } from "./redis.provider";
import { CacheModule } from "@nestjs/cache-manager";


@Global()
@Module({
    "imports": [CacheModule.register()],
    "providers": [RedisConfigService, RedisCacheProvider],
    "exports": [RedisConfigService, RedisCacheProvider],
})
export class RedisConfigModule {}