import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import {ConfigModule} from "@nestjs/config/dist/config.module";
import { CacheModule, CacheStore } from '@nestjs/cache-manager';

import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BlogModule } from 'src/modules/blog/blog.module';
import { ReactionModule } from '../reaction/reaction.module';
import { RedisConfigModule } from '../globals/redis/redis.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import {ConfigService} from "@nestjs/config/dist/config.service"

import { User } from 'src/modules/user/model/user.model';
import { Blog } from 'src/modules/blog/model/blog.model';
import { Reaction } from '../reaction/model/reaction.model';

import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet'; 
import configuration from 'src/config/configuration';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          store: redisStore,
          socket: {
            "host": configService.get('redis_host'),
            "port": configService.get('redis_port'),
            "keepAlive": 1,
          },
          isGlobal: true,          
        }
      },
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          "dialect": "postgres",
          "port": configService.get("db_port"),
          "database": configService.get('db_name'),
          "host": configService.get("db_host"),
          "password": configService.get("db_password"),
          "username": configService.get("db_user"),
          synchronize: true,
          autoLoadModels: true,
          models: [User, Blog, Reaction],
        }
      }
    }),

    ConfigModule.forRoot({"isGlobal": true, load: [configuration]}),
    UserModule,
    AuthModule,
    BlogModule,
    ReactionModule,
    RedisConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
