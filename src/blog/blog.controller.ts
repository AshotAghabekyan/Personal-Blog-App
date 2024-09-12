import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { BlogService } from "./blog.service";
import { AuthGuard } from "src/auth/auth.guard";
import { Body, Param, Req, Get, Post } from "@nestjs/common/decorators/http/";
import { CreateBlogDto } from "./blog.dto";
import { Request } from "express";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { ParseIntPipe } from "@nestjs/common";



@Controller("/blogs")
export class BlogController {
    private readonly blogService: BlogService;

    constructor(blogService: BlogService) {
        this.blogService = blogService;
    }

    @UseGuards(AuthGuard)
    @Post('/')
    public createBlog(@Body() blogDto: CreateBlogDto, @Req() req: Request) {
        console.log("request user", req['user']);
        const publisherId: number = req['user'].sub;
        return this.blogService.createBlog(blogDto, publisherId);
    };


    @UseGuards(AuthGuard)
    @Get("/:blogId")
    public getBlogById(@Param("blogId", ParseIntPipe) blogId: number) {
        return this.blogService.getBlogById(blogId);
    };


    @UseGuards(AuthGuard)
    @Get("/publisher")
    public allBlogsOfUser(@Req() req: Request) {
        const publisherId: number = req['user'].sub;
        return this.blogService.allBlogsOfUser(publisherId);
    };  


    @Get("/")
    public allBlogs() {
        return this.blogService.allBlogs();
    };


    @UseGuards(AuthGuard)
    public deleteBlog(blogId: number) {};


    @UseGuards(AuthGuard)
    public editBlog() {};
}