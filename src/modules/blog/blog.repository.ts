import { InjectModel } from "@nestjs/sequelize/dist/common/sequelize.decorators";
import { Blog, BlogCreationAttributes } from "./model/blog.model";
import { User } from "../user/model/user.model";
import { Reaction } from "../reaction/model/reaction.model";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { BlogGenre } from "../blog_genre/models/blogGenre.model";




interface RepositoryI {
    createBlog(blog: BlogCreationAttributes): Promise<Blog>;
    getBlogById(blogId: number): Promise<Blog>;
    allBlogsOfUser(userId: number): Promise<Blog[]>;
    allBlogs(): Promise<Blog[]>;
    deleteBlog(blogId: number): Promise<boolean>;
};



@Injectable()
export class BlogRepository implements RepositoryI {
    private readonly blogModel: typeof Blog;

    constructor(@InjectModel(Blog) blogModel: typeof Blog) {
        this.blogModel = blogModel;
    };

    public async createBlog(blog: BlogCreationAttributes): Promise<Blog> {
        try {
            const newBlog: Blog = await this.blogModel.create(blog);
            return newBlog || null;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }
    

    public async getBlogById(blogId: number) {
        try {
            const targetBlog: Blog = await this.blogModel.findByPk(blogId, {include: [User, Reaction, {model: BlogGenre, as: "genres"}]});
            return targetBlog || null; 
        }
        catch(error) {
            console.error(error);
            return null;
        }
    };


    public async allBlogsOfUser(userId: number) {
        try {
            const blogsOfUser: Blog[] = await this.blogModel.findAll({where: {"publisherId": userId}, include: [Reaction, BlogGenre]});
            if (blogsOfUser.length == 0) {
                return null;
            }
            
            return blogsOfUser;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    };


    public async allBlogs() {
        try {
            const allBlogs: Blog[] = await this.blogModel.findAll({include: [User, Reaction, BlogGenre]});
            if (allBlogs.length == 0) {
                return null;
            }
            
            return allBlogs;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    };


    public async deleteBlog(blogId: number) {
        try {
            const deletionResult: number = await this.blogModel.destroy({
                "where": {"id": blogId},
                // "cascade": true,
            });
            return Boolean(deletionResult);
        }
        catch(error) {
            console.error(error);
            return false;
        }
    };
    
}