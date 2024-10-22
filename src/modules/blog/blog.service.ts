import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { BadRequestException, NotFoundException } from "@nestjs/common/exceptions/";

import { BlogCreationAttributes } from "./model/blog.model";
import { CreateBlogDto } from "./model/blog.dto";
import { Blog } from "./model/blog.model";
import errorResponse from "src/config/errorResponse";
import cacheKeys from "../../config/cacheKeys"
import { BlogRepository } from "./blog.repository";
import { BlogCacheProvider } from "./blog.cacheProvider";



@Injectable()
export class BlogService {
    private readonly blogRepository: BlogRepository;
    private readonly blogCacheProvider: BlogCacheProvider;

    constructor(blogRepository: BlogRepository, cacheProvider: BlogCacheProvider) {
        this.blogRepository = blogRepository
        this.blogCacheProvider = cacheProvider;
    }

    public async createBlog(blogDto: CreateBlogDto, publisherId: number): Promise<Blog> {
        const blog: BlogCreationAttributes = {
            publisherId,
            blogTitle: blogDto.title,
            mainContent: blogDto.mainContent
        };

        const newBlog: Blog = await this.blogRepository.createBlog(blog);
        if (!newBlog) {
            throw new BadRequestException(errorResponse.blog.blog_not_published);
        }
        const cacheKey: string = cacheKeys.blogs.blogById(newBlog.id);
        this.blogCacheProvider.setValue(cacheKey, newBlog);
        return newBlog || null
    };


    public async getBlogById(blogId: number) {
        const cacheKey: string = cacheKeys.blogs.blogById(blogId);
        const cachedBlog: Blog = await this.blogCacheProvider.getValue(cacheKey);
        if (cachedBlog) {
            return cachedBlog;
        }

        const targetBlog: Blog = await this.blogRepository.getBlogById(blogId);
        if (!targetBlog) {
            throw new NotFoundException(errorResponse.blog.blog_not_found)
        }

        this.blogCacheProvider.setValue(cacheKey, targetBlog);
        return targetBlog || null; 
    };


    public async allBlogsOfUser(userId: number) {
        const cacheKey: string = cacheKeys.blogs.blogsOfUser(userId);
        const cachedBlogsOfUser: Blog[] = await this.blogCacheProvider.getAllValues(cacheKey);
        if (cachedBlogsOfUser) {
            return cachedBlogsOfUser;
        }

        const blogsOfUser: Blog[] = await this.blogRepository.allBlogsOfUser(userId);
        if (blogsOfUser.length == 0) {
            throw new NotFoundException(errorResponse.blog.blog_not_found)
        }

        this.blogCacheProvider.setValue(cacheKey, blogsOfUser);
        return blogsOfUser || null
    };


    public async allBlogs() {
        const cacheKey: string = cacheKeys.blogs.allBlogs();
        const cachedAllBlogs: Blog[] = await this.blogCacheProvider.getAllValues(cacheKey);
        if (cachedAllBlogs) {
            return cachedAllBlogs;
        }

        const allBlogs: Blog[] = await this.blogRepository.allBlogs();
        if (allBlogs.length == 0) {
            throw new NotFoundException(errorResponse.blog.blog_not_found)
        }
        
        return allBlogs || null;
    };


    public async deleteBlog(blogId: number) {
        const deletionResult: boolean = await this.blogRepository.deleteBlog(blogId);
        if (!deletionResult) {
            throw new BadRequestException(errorResponse.blog.blog_not_been_deleted)
        }

        const cacheKey: string = cacheKeys.blogs.blogById(blogId);
        this.blogCacheProvider.deleteValue(cacheKey);
        return Boolean(deletionResult);
    };

    public async editBlog() {};
}