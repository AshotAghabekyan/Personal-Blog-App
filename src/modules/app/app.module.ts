import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import {ConfigModule} from "@nestjs/config/dist/config.module"
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BlogModule } from 'src/modules/blog/blog.module';
import { ReactionModule } from '../reaction/reaction.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import {ConfigService} from "@nestjs/config/dist/config.service"

import { User } from 'src/modules/user/model/user.model';
import { Blog } from 'src/modules/blog/model/blog.model';
import { Reaction } from '../reaction/model/reaction.model';
import configuration from 'src/config/configuration';


@Module({
  
  imports: [
    ConfigModule.forRoot({"isGlobal": true, load: [configuration]}),
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
    UserModule,
    AuthModule,
    BlogModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
