import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { Body, Param, Req, Get, Post, HttpCode } from "@nestjs/common/decorators/http/";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { BlogService } from "./blog.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { CreateBlogDto } from "./model/blog.dto";
import { Request } from "express";
import { ParseIntPipe } from "@nestjs/common";



@Controller("/blogs")
export class BlogController {
    private readonly blogService: BlogService;

    constructor(blogService: BlogService) {
        this.blogService = blogService;
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    @Post('/')
    public createBlog(@Body() blogDto: CreateBlogDto, @Req() req: Request) {
        const publisherId: number = req['user'].sub;
        return this.blogService.createBlog(blogDto, publisherId);
    };


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/:blogId")
    public getBlogById(@Param("blogId", ParseIntPipe) blogId: number) {
        return this.blogService.getBlogById(blogId);
    };


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get("/publisher/:userId")
    public allBlogsOfUser(@Param("userId", ParseIntPipe) publisherId: number) {
        return this.blogService.allBlogsOfUser(publisherId);
    };  


    @HttpCode(HttpStatus.OK)
    @Get("/")
    public allBlogs() {
        return this.blogService.allBlogs();
    };


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    public deleteBlog(blogId: number) {};


    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    public editBlog() {};
}