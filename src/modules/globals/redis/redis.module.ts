import { Global, Module } from "@nestjs/common";
import { RedisConfigService } from "./redis.config";


@Global()
@Module({
    "imports": [],
    "providers": [RedisConfigService],
    "exports": [RedisConfigService],
})
export class RedisConfigModule {}