import { Injectable } from "@nestjs/common";
import { GenreRepository } from "./genre.repository";
import { BlogGenre } from "./models/blogGenre.model";
import { BlogGenreDto } from "./models/blogGenre.dto";
import { BlogGenreTypes } from "./models/genre.types";
import { GenreRelatedGraph } from "./genre.graph";



@Injectable()
export class GenreService {
    private readonly genreRepository: GenreRepository;
    private genreRelatedGraph: GenreRelatedGraph;

    constructor(genreRepository: GenreRepository) {
        this.genreRepository = genreRepository;
        this.genreRelatedGraph = new GenreRelatedGraph();
    }


    public async findRelatedByGenreBlogs(genreTitle: BlogGenreTypes, options: {offset: number, limit: number}) {
        const relatedGenres = this.genreRelatedGraph.getRelatedVertices(genreTitle);
        const relatedBlogIds: number[] = [];
        for (let genre of relatedGenres) {
            genre = BlogGenreTypes[genre];
            if (genre == genreTitle) {
                continue;
            }

            const ids: number[] =  await this.findBlogIdsByGenre(genre, options);
            relatedBlogIds.push(...ids);
        }
        return relatedBlogIds;
    }



    private async findBlogsByGenre(genreTitle: string, options: {offset: number, limit: number}) {
        try {
            const blogsByGenre: BlogGenre[] = await this.genreRepository.findBlogsByGenre(genreTitle, options);
            if (!blogsByGenre) {
                return null;
            }
            return blogsByGenre
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async findBlogIdsByGenre(genreTitle: string, options: {offset: number, limit: number}): Promise<number[]> {
        try {
            const blogsByGenre: BlogGenre[] = await this.findBlogsByGenre(genreTitle, options);
            return blogsByGenre.map(blogGenreEntity => blogGenreEntity.blogId);
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async deleteBlogRelatedRecords(blogId: number) {
        try {
            return await this.genreRepository.deleteBlogRelatedRecords(blogId);
        }
        catch(error) {
            console.error(error);
        }
    }

    
    public async removeGenreFromBlog(blogId: number, genreTitle: BlogGenreTypes) {
        try {
            return await this.genreRepository.removeGenreFromBlog(blogId, genreTitle);
        }
        catch(error) {
            console.error(error);
        }
    }


    public async createGenre(blogId: number, genres: BlogGenreTypes[]) {
        try {
            const dto: BlogGenreDto = new BlogGenreDto(blogId, genres);
            this.createGenreRelationship(dto);
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



    private createGenreRelationship(dto: BlogGenreDto): void {
        
        for (const genre of dto.genres) {
            if (!this.genreRelatedGraph.hasVertex(genre)) {
                this.genreRelatedGraph.addVertex(genre);
            }

            for (const relatedGenre of dto.genres) {
                if (genre == relatedGenre) {
                    continue
                }

                if (!this.genreRelatedGraph.hasVertex(relatedGenre)) {
                    this.genreRelatedGraph.addVertex(relatedGenre);
                }

                this.genreRelatedGraph.addEdge(genre, relatedGenre);
            }
        }
    }
}
