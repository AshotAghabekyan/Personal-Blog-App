import { Module } from "@nestjs/common";
import { GenreRepository } from "./genre.repository";
import { GenreService } from "./genre.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { BlogGenre } from "./models/blogGenre.model";
import { BlogRepository } from "../blog/blog.repository";
import { Blog } from "../blog/model/blog.model";

@Module({
    imports: [SequelizeModule.forFeature([BlogGenre, Blog])],
    providers: [GenreRepository, GenreService, BlogRepository],
    exports: [GenreService]
})
export class GenreModule {}