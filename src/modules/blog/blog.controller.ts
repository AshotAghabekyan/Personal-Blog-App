import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { Body, Param, Req, Get, Post, HttpCode, Delete } from "@nestjs/common/decorators/http/";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { BlogGenreService, BlogLifecycleService, BlogService } from "./blog.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { CreateBlogDto, ResponseBlogDto } from "./model/blog.dto";
import { Request } from "express";
import { ParseIntPipe } from "@nestjs/common";
import { Blog } from "./model/blog.model";
import { BlogGenreTypes } from "../blog_genre/models/genre.types";



@Controller("/blogs")
export class BlogController {
    private readonly blogService: BlogService;
    private readonly blogLifecycleService: BlogLifecycleService

    constructor(blogService: BlogService, blogLifecycleService: BlogLifecycleService) {
        this.blogService = blogService;
        this.blogLifecycleService = blogLifecycleService;
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    @Post('/')
    public async createBlog(@Body() blogDto: CreateBlogDto, @Req() req: Request) {
        const publisherId: number = req['user'].sub;
        const createdBlog: Blog = await this.blogLifecycleService.createBlog(blogDto, publisherId);
        return new ResponseBlogDto(createdBlog);
    };


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete("/:blogId")
    public deleteBlog(@Param("blogId", ParseIntPipe) blogId: number) {
        return this.blogLifecycleService.deleteBlog(blogId);
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
    @HttpCode(HttpStatus.CREATED)
    public editBlog() {};
}





@Controller("/blogs/genre")
export class BlogGenreController {
    private readonly blogGenreService: BlogGenreService;
    constructor(blogGenreService: BlogGenreService) {
        this.blogGenreService = blogGenreService;
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/:genre")
    public async getBlogsByGenre(@Param("genre") genre: BlogGenreTypes) {
        const blogs: Blog[] = await this.blogGenreService.allBlogsByGenre(genre);
        return blogs.map((blog: Blog) => new ResponseBlogDto(blog));
    }


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/recomendation")
    public getRecomendatedBlogs() {

    }
}


