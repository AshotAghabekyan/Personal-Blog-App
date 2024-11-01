import { BlogGenreTypes } from "./genre.types";


export class BlogGenreDto {
    blogId: number;
    genres: BlogGenreTypes[];

    constructor(blogId: number, genres: BlogGenreTypes[]) {
        this.blogId = blogId;
        this.genres = genres;
    }
}
