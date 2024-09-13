import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";

import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { Blog } from "./model/blog.model";


@Module({
    "imports": [SequelizeModule.forFeature([Blog]), JwtModule],
    "controllers": [BlogController],
    "providers": [BlogService],
})
export class BlogModule {}