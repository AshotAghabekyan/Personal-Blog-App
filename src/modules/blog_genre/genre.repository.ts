import { Injectable } from "@nestjs/common";
import { Blog } from "../blog/model/blog.model";
import { BlogGenre } from "./models/blogGenre.model";
import { InjectModel } from "@nestjs/sequelize";
import { BlogGenreTypes } from "./models/genre.types";
import { BlogGenreDto } from "./models/blogGenre.dto";



interface RepositoryI {
    findBlogsByGenre(genreId: string): Promise<BlogGenre[]>;
    createBlogGenre(dto: BlogGenreDto): Promise<boolean>;
    deleteBlogRelatedRecords(blogId: number): Promise<boolean>;
    removeGenreFromBlog(blogId: number, genreTitle: BlogGenreTypes): Promise<boolean>
}



@Injectable()
export class GenreRepository implements RepositoryI {
    private readonly blogGenreModel: typeof BlogGenre;

    constructor(@InjectModel(BlogGenre) blogGenreModel: typeof BlogGenre) {
        this.blogGenreModel = blogGenreModel;
    }

    public async createBlogGenre(dto: BlogGenreDto): Promise<boolean> {
        try {
            let promiseBlogGenre: Promise<BlogGenre>[] = [];
            for (let genre of dto.genres) {
                const promise: Promise<BlogGenre> = this.blogGenreModel.create({blogId: dto.blogId, genre})
                promiseBlogGenre.push(promise);
            }
    
            await Promise.all(promiseBlogGenre);
            return true;
        }
        catch(error) {
            console.error(error);
            return false;
        }
    }


    public async deleteBlogRelatedRecords(blogId: number): Promise<boolean> {
        try {
            const isDeleted: number = await this.blogGenreModel.destroy({"where": {blogId}});
            return Boolean(isDeleted);
        }
        catch(error) {
            console.error(error);
        }
    }


    public async removeGenreFromBlog(blogId: number, genreTitle: BlogGenreTypes): Promise<boolean> {
        try {
            const isRemoved: number = await this.blogGenreModel.destroy({
                where: {blogId, genre: genreTitle}
            });
            return Boolean(isRemoved);
        }
        catch(error) {
            console.error(error);
        }
    }


    public async findBlogsByGenre(genreTitle: BlogGenreTypes): Promise<BlogGenre[]> {
        try {
            const records: BlogGenre[] = await this.blogGenreModel.findAll({
                "where": {
                    genre: genreTitle,
                }
            });
    
            return records || null;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }

}