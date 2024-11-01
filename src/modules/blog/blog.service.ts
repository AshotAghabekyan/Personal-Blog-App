import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { BadRequestException, NotFoundException } from "@nestjs/common/exceptions/";

import { BlogCreationAttributes } from "./model/blog.model";
import { CreateBlogDto } from "./model/blog.dto";
import { Blog } from "./model/blog.model";
import errorResponse from "src/config/errorResponse";
import cacheKeys from "../../config/cacheKeys"
import { BlogRepository } from "./blog.repository";
import { BlogCacheProvider } from "./blog.cacheProvider";
import { SequlizeTransactionProvider } from "../globals/sequlizeTransaction/transaction.provider";
import { GenreService } from "../blog_genre/genre.service";
import { BlogGenreTypes } from "../blog_genre/models/genre.types";





@Injectable()
export class BlogService {
    protected readonly blogRepository: BlogRepository;
    protected readonly blogCacheProvider: BlogCacheProvider;
    protected readonly genreService: GenreService;

    constructor(
        blogRepository: BlogRepository,
        genreService: GenreService,
        cacheProvider: BlogCacheProvider,
    ) {
        this.blogRepository = blogRepository;
        this.blogCacheProvider = cacheProvider;
        this.genreService = genreService;
    }




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


    public async editBlog() {};
}






export class BlogLifecycleService extends BlogService {
    private readonly transactionProvider: SequlizeTransactionProvider;

    constructor(
        blogRepository: BlogRepository,
        genreService: GenreService,
        cacheProvider: BlogCacheProvider,
        sequlizeTransactionProvider: SequlizeTransactionProvider,
    ) 
    {
        super(blogRepository, genreService, cacheProvider);
        this.transactionProvider = sequlizeTransactionProvider;
    }


    public async createBlog(blogDto: CreateBlogDto, publisherId: number): Promise<Blog> {
        const blog: BlogCreationAttributes = {
            publisherId,
            blogTitle: blogDto.title,
            mainContent: blogDto.mainContent,
            genres: blogDto.genre,
        };
        
        let newBlog: Blog = null;
        await this.transactionProvider.runTransaction(async () => {
            newBlog = await this.blogRepository.createBlog(blog);
            if (!newBlog) {
                throw new BadRequestException(errorResponse.blog.blog_not_published);
            }
            await this.genreService.createGenre(newBlog.id, blog.genres);
        })

        const cacheKey: string = cacheKeys.blogs.blogById(newBlog.id);
        this.blogCacheProvider.setValue(cacheKey, newBlog);
        return newBlog || null
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

}







@Injectable()
export class BlogGenreService extends BlogService {
    constructor(
        blogRepository: BlogRepository,
        genreService: GenreService,
        cacheProvider: BlogCacheProvider,
    ) 
    {
        super(blogRepository, genreService, cacheProvider);
    }



    public async allBlogsByGenre(genreTitle: BlogGenreTypes) {
        const isGenreValid: BlogGenreTypes = BlogGenreTypes[genreTitle];
        if (!isGenreValid) {
            throw new NotFoundException("invalid genre type");
        }

        const blogsIds: number[] = await this.genreService.findBlogIdsByGenre(genreTitle);
        let promiseBlogs: Promise<Blog>[] = blogsIds.map(async (blogId: number) => {
            return this.blogRepository.getBlogById(blogId);
        })
        return Promise.all(promiseBlogs);
    }


    public async findRelatedBlogs(genre: BlogGenreTypes) {
        const isGenreValid: BlogGenreTypes = BlogGenreTypes[genre];
        if (!isGenreValid) {
            throw new NotFoundException("invalid genre type");
        }
        return this.genreService;
    }


    public async removeGenreFromBlog(blogId: number, genreTitle: BlogGenreTypes) {
        const isBlogExist: Blog = await this.getBlogById(blogId);
        if (!isBlogExist) {
            throw new NotFoundException("blog not found");
        }
        return this.genreService.removeGenreFromBlog(blogId, genreTitle);
    }


    public async deleteBlogRelatedGenres(blogId: number) {
        const isBlogExist: Blog = await this.getBlogById(blogId);
        if (!isBlogExist) {
            throw new NotFoundException("blog not found");
        }
        return this.genreService.deleteBlogRelatedRecords(blogId);
    }
}