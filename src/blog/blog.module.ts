import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Blog } from "./blog.model";
import { JwtModule } from "@nestjs/jwt/dist/jwt.module";

@Module({
    "imports": [SequelizeModule.forFeature([Blog]), JwtModule],
    "controllers": [BlogController],
    "providers": [BlogService],
})
export class BlogModule {}