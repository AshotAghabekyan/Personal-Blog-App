import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { Body, Param, Req, Get, Post, HttpCode } from "@nestjs/common/decorators/http/";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { BlogService } from "./blog.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { CreateBlogDto, ResponseBlogDto } from "./model/blog.dto";
import { Request } from "express";
import { ParseIntPipe } from "@nestjs/common";
import { Blog } from "./model/blog.model";



@Controller("/blogs")
export class BlogController {
    private readonly blogService: BlogService;

    constructor(blogService: BlogService) {
        this.blogService = blogService;
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    @Post('/')
    public async createBlog(@Body() blogDto: CreateBlogDto, @Req() req: Request) {
        const publisherId: number = req['user'].sub;
        const createdBlog: Blog = await this.blogService.createBlog(blogDto, publisherId);
        return new ResponseBlogDto(createdBlog);
    };


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/:blogId")
    public async getBlogById(@Param("blogId", ParseIntPipe) blogId: number) {
        const blog: Blog = await this.blogService.getBlogById(blogId);
        return new ResponseBlogDto(blog);
    };


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/publisher/:userId")
    public async allBlogsOfUser(@Param("userId", ParseIntPipe) publisherId: number) {
        const allBlogsOfUser: Blog[] = await this.blogService.allBlogsOfUser(publisherId);
        return allBlogsOfUser.map((blog: Blog) => new ResponseBlogDto(blog));
    };  


    @HttpCode(HttpStatus.OK)
    @Get("/")
    public async allBlogs() {
        const allBlogs: Blog[] = await this.blogService.allBlogs();
        return allBlogs.map((blog: Blog) => new ResponseBlogDto(blog));
    };


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    public deleteBlog(blogId: number) {};


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    public editBlog() {};
}