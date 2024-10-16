import { IsString } from "class-validator";
import { Reaction } from "src/modules/reaction/model/reaction.model";
import { User } from "src/modules/user/model/user.model";
import { Blog } from "./blog.model";
import { ResponseUserDto } from "src/modules/user/model/user.dto";


export enum BlogContentType {
    news,
    history,
    medical,
    politic,
    technology,
    engineering,
    science,
    literature,
    music,
    art,
    IT,
    games,
    sport,
    other,
}



export class CreateBlogDto {
    @IsString()
    title: string;

    @IsString()
    mainContent: string;

    contentType: BlogContentType[]
}


export class ResponseBlogDto {
    id: number
    title: string;
    mainContent: string;
    // contentType: BlogContentType[]
    publisherId: number;
    likeCount: number;
    publisher?: ResponseUserDto
    reactions?: Reaction[]

    constructor(blog: Blog) {
        this.id = blog.id;
        this.publisherId = blog.publisherId;
        this.title = blog.blogTitle;
        this.mainContent = blog.mainContent;
        // this.contentType = blog.contentType
        this.likeCount = blog.reactions?.length
        if (blog.user) {
            this.publisher = new ResponseUserDto(blog.user);
        }
    }


}