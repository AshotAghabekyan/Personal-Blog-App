import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { GenreRepository } from "./genre.repository";
import { BlogGenre } from "./models/blogGenre.model";
import { BlogGenreDto } from "./models/blogGenre.dto";
import { BlogGenreTypes } from "./models/genre.types";




@Injectable()
export class GenreService {
    private readonly genreRepository: GenreRepository;

    constructor(genreRepository: GenreRepository) {
        this.genreRepository = genreRepository;
    }


    public findRelatedByGenreBlogs(genreTitle: BlogGenreTypes) {
        
    }


    public async findBlogIdsByGenre(genreTitle: BlogGenreTypes): Promise<number[]> {
        try {
            const blogsByGenre: BlogGenre[] = await this.genreRepository.findBlogsByGenre(genreTitle);
            if (!blogsByGenre) {
                return null;
            }
            
            return blogsByGenre.map(blogGenreEntity => blogGenreEntity.blogId);
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public deleteBlogRelatedRecords(blogId: number) {
        try {
            return this.genreRepository.deleteBlogRelatedRecords(blogId);
        }
        catch(error) {
            console.error(error);
        }
    }

    
    public removeGenreFromBlog(blogId: number, genreTitle: BlogGenreTypes) {
        try {
            return this.genreRepository.removeGenreFromBlog(blogId, genreTitle);
        }
        catch(error) {
            console.error(error);
        }
    }


    public async createGenre(blogId: number, genres: BlogGenreTypes[]) {
        try {
            const dto: BlogGenreDto = new BlogGenreDto(blogId, genres);
            const isCreated: boolean = await this.genreRepository.createBlogGenre(dto);
            if (!isCreated) {
                return null;
            }
            return isCreated;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }
}
