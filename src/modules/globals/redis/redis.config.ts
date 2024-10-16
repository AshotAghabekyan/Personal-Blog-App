import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';


@Injectable()
export class RedisConfigService {
    constructor(private readonly configService: ConfigService) {
        this.configService = configService
    }

    public getRedisConfig(dbIndex: number) {
        return {
            store: redisStore,
            socket: {
                host: this.configService.get<string>('redis_host', 'localhost'),
                port: this.configService.get<number>('redis_port', 6379),
              },
            database: dbIndex,  
        };
    }
}
