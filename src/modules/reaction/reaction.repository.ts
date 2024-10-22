import { InjectModel } from "@nestjs/sequelize/dist/common/sequelize.decorators";
import { Reaction } from "./model/reaction.model";
import { Injectable } from "@nestjs/common";
import { ReactionCreationAttrs } from "./model/reaction.model";





interface RepositoryI {
    allReactionsOfBlog(blogId: number): Promise<Reaction[]>
    userReactions(userId: number): Promise<Reaction[]>
    likeBlog(reaction: ReactionCreationAttrs): Promise<boolean>
    unlikeBlog(reaction: ReactionCreationAttrs): Promise<boolean>
    getReaction(reaction: ReactionCreationAttrs): Promise<Reaction>
}



@Injectable()
export class ReactionRepository implements RepositoryI {
    private readonly reactionModel: typeof Reaction

    constructor(@InjectModel(Reaction) reactionModel: typeof Reaction) {
        this.reactionModel = reactionModel;
    }


    public async allReactionsOfBlog(blogId: number): Promise<Reaction[]> {
        try {
            const targetBlogReactions = await this.reactionModel.findAll({where: {blogId}});
            return targetBlogReactions || null;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async userReactions(userId: number): Promise<Reaction[]> {
        try {
            const targetUserReactions = await this.reactionModel.findAll({where: {userId}});
            return targetUserReactions || null;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async getReaction(reaction: ReactionCreationAttrs) {
        try {
            const existReaction: Reaction = await this.reactionModel.findOne({
                "where": {
                    blogId: reaction.blogId,
                    userId: reaction.userId
                }
            });
            return existReaction;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async likeBlog(reaction: ReactionCreationAttrs): Promise<boolean> {
        try {
            await this.reactionModel.create(reaction)
            return true;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }


    public async unlikeBlog(reaction: ReactionCreationAttrs): Promise<boolean> {
        try {
            const existReaction: Reaction = await this.getReaction(reaction);   
            if (existReaction) {
                await existReaction.destroy();
                return true;
            } 
            return false;
        }
        catch(error) {
            console.error(error);
            return null;
        }
    }
}