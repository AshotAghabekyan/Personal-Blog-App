import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config"
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/user.model';
import { Blog } from 'src/blog/blog.model';
import configuration from 'src/config/configuration';
import { BlogModule } from 'src/blog/blog.module';

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
          models: [User, Blog],
        }
      }
    }),
    UserModule,
    AuthModule,
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
