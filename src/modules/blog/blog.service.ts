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
import { ReactionService } from "../reaction/reaction.service";




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








@Injectable()
export class BlogLifecycleService extends BlogService {
    private readonly transactionProvider: SequlizeTransactionProvider;


    constructor(
        blogRepository: BlogRepository,
        genreService: GenreService,
        cacheProvider: BlogCacheProvider,
        sequlizeTransactionProvider: SequlizeTransactionProvider
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
        const allBlogsCacheKey: string = cacheKeys.blogs.allBlogs();
        this.blogCacheProvider.setValue(cacheKey, newBlog);
        this.blogCacheProvider.deleteValue(allBlogsCacheKey); // cached all blogs has expired data after creation new blog
        return newBlog || null
    };



    public async deleteBlog(blogId: number) {
        let deletionResult: boolean = await this.blogRepository.deleteBlog(blogId);
        if (!deletionResult) {
            throw new BadRequestException(errorResponse.blog.blog_not_been_deleted)
        }

        const cacheKey: string = cacheKeys.blogs.blogById(blogId);
        const allBlogsCacheKey: string = cacheKeys.blogs.allBlogs();
        this.blogCacheProvider.deleteValue(cacheKey);
        this.blogCacheProvider.deleteValue(allBlogsCacheKey); // cached all blogs has expired data after deletion the blog
        return Boolean(deletionResult);
    };



    public async deleteAllBlogsOfUser(userId: number) {
        const userBlogs: Blog[] = await this.allBlogsOfUser(userId);
        const deletedRecords = userBlogs.map(async (blog: Blog) => await this.deleteBlog(blog.id));
        return deletedRecords.length == userBlogs.length;
    }

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



    public async blogsByGenre(genreTitle: BlogGenreTypes, options: {offset: number, limit: number}) {
        const isGenreValid: BlogGenreTypes = BlogGenreTypes[genreTitle];
        if (!isGenreValid) {
            throw new NotFoundException("invalid genre type");
        }

        const blogsIds: number[] = await this.genreService.findBlogIdsByGenre(genreTitle, options);
        let promiseBlogs: Promise<Blog>[] = blogsIds.map((blogId: number) => {
            return this.getBlogById(blogId);
        })
        const blogs: Blog[] = await Promise.all(promiseBlogs);
        return blogs;
    }


    public async findRelatedBlogs(genre: BlogGenreTypes, options: {offset: number, limit: number}) {
        const isGenreValid: BlogGenreTypes = BlogGenreTypes[genre];
        if (!isGenreValid) {
            throw new NotFoundException("invalid genre type");
        }
        const relatedBlogIds = await this.genreService.findRelatedByGenreBlogs(genre, options);
        const promiseBlogs: Promise<Blog>[] = relatedBlogIds.map(async (id: number) => await this.getBlogById(id));
        return Promise.all(promiseBlogs);
    }


    public async removeGenreFromBlog(blogId: number, genreTitle: BlogGenreTypes) {
        const isBlogExist: Blog = await this.getBlogById(blogId);
        if (!isBlogExist) {
            throw new NotFoundException("blog not found");
        }
        return this.genreService.removeGenreFromBlog(blogId, genreTitle);
    }

}