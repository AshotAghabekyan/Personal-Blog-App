import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectModel } from "@nestjs/sequelize";
import { BadRequestException, NotFoundException } from "@nestjs/common/exceptions/";

import { BlogCreationAttributes } from "./model/blog.model";
import { CreateBlogDto, ResponseBlogDto } from "./model/blog.dto";
import { Blog } from "./model/blog.model";
import { User } from "src/modules/user/model/user.model";
import errorResponse from "src/config/errorResponse";
import { Reaction } from "../reaction/model/reaction.model";



@Injectable()
export class BlogService {
    private readonly blogModel: typeof Blog;

    constructor(@InjectModel(Blog) blogModel: typeof Blog) {
        this.blogModel = blogModel;
    }

    public async createBlog(blogDto: CreateBlogDto, publisherId: number): Promise<Blog> {
        const blog: BlogCreationAttributes = {
            publisherId,
            blogTitle: blogDto.title,
            mainContent: blogDto.mainContent
        };
        const newBlog: Blog = await this.blogModel.create(blog);
        if (!newBlog) {
            throw new BadRequestException(errorResponse.blog_not_published);
        }
        return newBlog || null
    };


    public async getBlogById(blogId: number) {
        const targetBlog: Blog = await this.blogModel.findByPk(blogId, {include: [User, Reaction]});
        if (!targetBlog) {
            throw new NotFoundException(errorResponse.blog_not_found)
        }
        return targetBlog || null; 
    };


    public async allBlogsOfUser(userId: number) {
        const blogsOfUser: Blog[] = await this.blogModel.findAll({where: {"publisherId": userId}, include: [Reaction]});
        if (blogsOfUser.length == 0) {
            throw new NotFoundException(errorResponse.blog_not_found)
        }
        
        return blogsOfUser || null
    };


    public async allBlogs() {
        const allBlogs: Blog[] = await this.blogModel.findAll({include: [User, Reaction]});
        if (allBlogs.length == 0) {
            throw new NotFoundException(errorResponse.blog_not_found)
        }
        
        return allBlogs || null;
    };


    public async deleteBlog(blogId: number) {
        const deletionResult: number = await this.blogModel.destroy({"where": {"id": blogId}});
        if (!deletionResult) {
            throw new BadRequestException(errorResponse.blog_not_been_deleted)
        }
        return Boolean(deletionResult);
    };

    public async editBlog() {};
}