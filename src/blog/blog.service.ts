import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { CreateBlogDto } from "./blog.dto";
import { BlogCreationAttributes } from "./blog.model";
import { Blog } from "./blog.model";
import { InjectModel } from "@nestjs/sequelize";
import { BadRequestException } from "@nestjs/common";
import { User } from "src/user/user.model";



@Injectable()
export class BlogService {
    private readonly blogModel: typeof Blog;

    constructor(@InjectModel(Blog) blogModel: typeof Blog) {
        this.blogModel = blogModel;
    }

    public async createBlog(blogDto: CreateBlogDto, publisherId: number): Promise<Blog> {
        try {
            const blog: BlogCreationAttributes = {
                publisherId,
                blogTitle: blogDto.title,
                mainContent: blogDto.mainContent
            };
            const newBlog: Blog = await this.blogModel.create(blog);
            if (!newBlog) {
                throw new Error("some error, your blog not published");
            }
            return newBlog;
        }
        catch(error) {
            throw new BadRequestException(error.message);
        }

    };

    public async getBlogById(blogId: number) {
        const targetBlog: Blog = await this.blogModel.findByPk(blogId);
        return targetBlog;
    };

    public async allBlogsOfUser(userId: number) {
        const blogsOfUser: Blog[] = await this.blogModel.findAll({where: {"publisherId": userId}});
        return blogsOfUser || null;
    };

    public async allBlogs() {
        const allBlogs: Blog[] = await this.blogModel.findAll({include: [User]});
        return allBlogs;
    };

    public async deleteBlog(blogId: number) {
        const deletionResult: number = await this.blogModel.destroy({"where": {"id": blogId}});
        return Boolean(deletionResult);
    };

    public async editBlog() {};
}