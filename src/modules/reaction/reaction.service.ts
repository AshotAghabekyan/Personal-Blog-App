import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { Reaction } from "./model/reaction.model";
import { InjectModel } from "@nestjs/sequelize";
import { BadRequestException } from "@nestjs/common";



@Injectable()
export class ReactionService {
    private readonly reactionModel: typeof Reaction

    constructor(@InjectModel(Reaction) reactionModel: typeof Reaction) {
        this.reactionModel = reactionModel;
    }


    public async allReactionsOfBlog(blogId: number) {
        const targetBlogReactions = await this.reactionModel.findAll({where: {blogId}});
        return targetBlogReactions || null;
    }


    public async userReactions(userId: number) {
        const targetUserReactions = await this.reactionModel.findAll({where: {userId}});
        return targetUserReactions || null;
    }


    public async likeBlog(blogId: number, userId: number) {
        const isAlreadyReacted = await this.reactionModel.findOne({"where": {blogId, userId}});
        if (isAlreadyReacted) {
            throw new BadRequestException("user already reacted the blog");
        }

        await this.reactionModel.create({"blogId": blogId, "userId": userId})
        return true;
    }


    public async unlikeBlog(blogId: number, userId: number) {
        const isAlreadyReacted = await this.reactionModel.findOne({"where": {blogId, userId}});
        if (!isAlreadyReacted) {
            throw new BadRequestException("user cannot react");
        }

        await this.reactionModel.destroy({"where": {blogId, userId}});
        return true;
    }
}


