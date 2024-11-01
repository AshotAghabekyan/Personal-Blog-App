import { IsString } from "class-validator";
import { Reaction } from "src/modules/reaction/model/reaction.model";
import { Blog } from "./blog.model";
import { ResponseUserDto } from "src/modules/user/model/user.dto";
import { BlogGenreTypes } from "src/modules/blog_genre/models/genre.types";




export class CreateBlogDto {
    @IsString()
    title: string;

    @IsString()
    mainContent: string;
    
    genre: BlogGenreTypes[];
}


export class ResponseBlogDto {
    id: number
    title: string;
    mainContent: string;
    publisherId: number;
    likeCount: number;
    publisher?: ResponseUserDto;
    reactions?: Reaction[];
    genres: BlogGenreTypes[];

    constructor(blog: Blog) {
        this.id = blog.id;
        this.publisherId = blog.publisherId;
        this.title = blog.blogTitle;
        this.mainContent = blog.mainContent;
        this.likeCount = blog.reactions?.length
        if (blog.user) {
            this.publisher = new ResponseUserDto(blog.user);
        }

        // this.genres = blog.genres;
    }


}